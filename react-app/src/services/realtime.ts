import {useEffect,useRef} from 'react';
import {supabase,getPublicRoom,getAdmin,getPlayer} from './api';
import {useGame} from './store';
import type {Session} from './types';

export function useRoomRealtime(code:string, role:'host'|'screen'|'player', session:Session|null=null){
 const refreshId=useRef(0);
 const sessionRef=useRef(session);sessionRef.current=session;
 const pub=useGame(s=>s.setPublic),setAdmin=useGame(s=>s.setAdmin),setPlayer=useGame(s=>s.setPlayer),
       setPresence=useGame(s=>s.setPresence),error=useGame(s=>s.setError),setOnline=useGame(s=>s.setOnline);
 const token=useGame(s=>s.adminToken);
 const tokenRef=useRef(token);tokenRef.current=token;
 const refresh=async()=>{
  if(!code)return;
  const id=++refreshId.current;
  try{
   const result=await getPublicRoom(code);
   if(id!==refreshId.current)return;
   pub(result.room,result.players);
   if(role==='host'&&tokenRef.current) {
     const admin=await getAdmin(code,tokenRef.current);
     if(id===refreshId.current)setAdmin(admin);
   }
   if(role==='player'&&sessionRef.current?.sessionToken) {
     const player=await getPlayer(code,sessionRef.current.sessionToken);
     if(id===refreshId.current)setPlayer(player);
   }
   if(id===refreshId.current)setOnline(true);
  }catch(e){
   if(id===refreshId.current){setOnline(false);error(e instanceof Error?e.message:'Falha de conexão');}
  }
 };
 const refreshRef=useRef(refresh);refreshRef.current=refresh;
 useEffect(()=>{
  if(!code)return;
  let disposed=false;
  const signal=()=>{if(!disposed)void refreshRef.current()};
  const channel=supabase.channel('react-live-'+role+'-'+code+'-'+Math.random().toString(36).slice(2));
  channel.on('postgres_changes',{event:'*',schema:'public',table:'game_room_public'},signal)
   .on('postgres_changes',{event:'*',schema:'public',table:'game_player_public'},signal)
   .on('broadcast',{event:'sync'},signal).subscribe();
  const presence=supabase.channel('presence-'+code,{
   config:{presence:{key:sessionRef.current?.playerId||role+'-'+crypto.randomUUID()}}
  });
  presence.on('presence',{event:'sync'},()=>{
   const users=Object.values(presence.presenceState()).flat().filter(x=>x&&'playerId'in x) as unknown as Array<{playerId:string;avatarId?:string}>;
   const ids=Array.from(new Set(users.map(x=>x.playerId)));
   setPresence(ids,Object.fromEntries(users.filter(x=>x.avatarId).map(x=>[x.playerId,x.avatarId!])));
  }).subscribe(async status=>{
   if(status==='SUBSCRIBED'&&role==='player'&&sessionRef.current)
     await presence.track({playerId:sessionRef.current.playerId,nickname:sessionRef.current.nickname,avatarId:sessionRef.current.avatarId,at:new Date().toISOString()});
  });
  void refreshRef.current();
  const timer=setInterval(signal,role==='player'?2800:3200);
  const online=()=>signal();
  window.addEventListener('focus',online);window.addEventListener('online',online);
  const visible=()=>{if(document.visibilityState==='visible')signal();};
  document.addEventListener('visibilitychange',visible);
  return()=>{disposed=true;clearInterval(timer);window.removeEventListener('focus',online);window.removeEventListener('online',online);document.removeEventListener('visibilitychange',visible);void supabase.removeChannel(channel);void supabase.removeChannel(presence);};
 },[code,role,session?.playerId,setPresence]);
 return {refresh:()=>refreshRef.current()};
}
export async function broadcastRoom(code:string){
 try{
 const c=supabase.channel('react-command-'+code);
 await new Promise<void>(resolve=>{c.subscribe(()=>resolve());setTimeout(resolve,700);});
 await c.send({type:'broadcast',event:'sync',payload:{ts:Date.now()}});
 await supabase.removeChannel(c);
 }catch{/* polling and postgres_changes remain authoritative */}
}

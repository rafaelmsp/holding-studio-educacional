import {create} from 'zustand';
import type {RoomState,PublicRoom,PublicPlayer,PrivateSnapshot,AdminSnapshot} from './types';
type UIState=RoomState&{
 code:string;adminToken:string;modal:string|null;selectedCase:string;busy:boolean;
 setCode:(s:string)=>void;setToken:(s:string)=>void;setCase:(s:string)=>void;
 setModal:(s:string|null)=>void;setBusy:(s:boolean)=>void;
 setPublic:(room:PublicRoom|null,players:PublicPlayer[])=>void;
 setPresence:(ids:string[],avatars:Record<string,string>)=>void;
 setAdmin:(data:AdminSnapshot)=>void;setPlayer:(data:PrivateSnapshot)=>void;
 setError:(msg:string|null)=>void;setOnline:(status:boolean)=>void;reset:(code:string)=>void;
}
export const useGame=create<UIState>((set,get)=>({
 code:'',adminToken:'',selectedCase:'credores',modal:null,busy:false,
 room:null,players:[],admin:null,player:null,online:false,loading:false,error:null,
 presenceIds:[],avatars:{},
 setCode:code=>set({code}),setToken:adminToken=>set({adminToken}),
 setCase:selectedCase=>set({selectedCase}),setModal:modal=>set({modal}),setBusy:busy=>set({busy}),
 setPublic:(room,players)=>set(previous=>{
  if(room&&previous.room?.code===room.code&&Number(room.room_revision)<Number(previous.room.room_revision))return previous;
  return {room,players,online:true,error:null};
 }),
 setPresence:(presenceIds,avatars)=>set(prev=>({presenceIds,avatars:{...prev.avatars,...avatars}})),
 setAdmin:admin=>set(previous=>{
  const incoming=Number(admin.room?.room_revision??-1),current=Number(previous.admin?.room?.room_revision??-1);
  return previous.admin&&incoming>=0&&incoming<current?previous:{admin,online:true,error:null};
 }),
 setPlayer:player=>set(previous=>{
  const incoming=Number(player.room?.room_revision??-1),current=Number(previous.player?.room?.room_revision??-1);
  return previous.player&&incoming>=0&&incoming<current?previous:{player,online:true,error:null};
 }),
 setError:error=>set({error}),setOnline:online=>set({online}),
 reset:code=>set({code,room:null,players:[],admin:null,player:null,online:false,presenceIds:[],avatars:{},error:null})
}));
export const getSession=(code:string)=>{
 try{return JSON.parse(localStorage.getItem('tc-player-'+code)||'null') as import('./types').Session|null}catch{return null;}
};
export const saveSession=(code:string,s:import('./types').Session)=>localStorage.setItem('tc-player-'+code,JSON.stringify(s));
export const adminStorage=(code:string)=>'tc-admin-'+code;

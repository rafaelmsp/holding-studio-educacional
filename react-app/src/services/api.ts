import {createClient} from '@supabase/supabase-js';
import type {PublicRoom,PublicPlayer,AdminSnapshot,PrivateSnapshot} from './types';

const SUPABASE_URL='https://ouiqzhdhgughkspxqvnj.supabase.co';
const SUPABASE_KEY='sb_publishable_VO-RkaU9Pr8h8c6LV2IJdQ_eefoD-7h';
const FUNCTION_URL=SUPABASE_URL+'/functions/v1/the-crimes-live';
export const supabase=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
export class GameApiError extends Error{
 payload:Record<string,unknown>;status:number;
 constructor(msg:string,payload:Record<string,unknown>,status:number){super(msg);this.name='GameApiError';this.payload=payload;this.status=status;}
}
export async function action<T extends Record<string,unknown>>(name:string,payload:Record<string,unknown>={}):Promise<T>{
 const response=await fetch(FUNCTION_URL,{method:'POST',headers:{'Content-Type':'application/json',apikey:SUPABASE_KEY},body:JSON.stringify({action:name,...payload})});
 const result=await response.json().catch(()=>({ok:false,error:'Resposta inválida do servidor'})) as T&{ok?:boolean;error?:string;stale?:boolean};
 if(!response.ok||!result.ok)throw new GameApiError(result.error||'Falha no servidor',result,response.status);
 return result;
}
export async function getPublicRoom(code:string):Promise<{room:PublicRoom|null;players:PublicPlayer[]}>{
 const {data,error}=await supabase.from('game_room_public').select('*').eq('code',code).maybeSingle();
 if(error)throw error;
 if(!data)return {room:null,players:[]};
 const {data:people,error:pError}=await supabase.from('game_player_public').select('*').eq('room_id',data.room_id).order('score',{ascending:false});
 if(pError)throw pError;
 return {room:data as PublicRoom,players:(people||[]) as PublicPlayer[]};
}
export function getAdmin(code:string,adminToken:string){return action<AdminSnapshot&{ok:boolean}>('adminState',{code,adminToken});}
export function getPlayer(code:string,sessionToken:string){return action<PrivateSnapshot&{ok:boolean}>('playerState',{code,sessionToken});}
export function playerUrl(code:string){const u=new URL('./',location.href);u.search='?view=player&room='+encodeURIComponent(code);return u.toString();}
export function screenUrl(code:string){const u=new URL('./',location.href);u.search='?view=screen&room='+encodeURIComponent(code);return u.toString();}

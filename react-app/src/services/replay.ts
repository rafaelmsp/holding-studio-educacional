/* V7.2 — intentional two-stage replay, separate from return-to-lobby.
   Never retry a reset automatically: multiple administrators may be connected.
   A failed start leaves the existing room in its waiting state. */
import {action,getAdmin} from './api';
import {broadcastRoom} from './realtime';
import {requestId} from './types';

export async function replayFinishedRoom(code:string,adminToken:string):Promise<void>{
 const first=await getAdmin(code,adminToken);
 if(first.room?.status!=='finished'){
  throw new Error('A partida já mudou. Atualize a sala antes de jogar novamente.');
 }
 await action('reset',{code,adminToken,expectedRevision:Number(first.room.room_revision||0),requestId:requestId('replay-reset')});
 await broadcastRoom(code);
 const afterReset=await getAdmin(code,adminToken);
 if(afterReset.room?.status!=='waiting'){
  throw new Error('A sala não voltou ao lobby. Verifique o estado antes de reiniciar.');
 }
 try{
  await action('start',{code,adminToken,expectedRevision:Number(afterReset.room.room_revision||0),requestId:requestId('replay-start')});
  await broadcastRoom(code);
 }catch(e){
  throw new Error('Sala reiniciada no lobby, mas não foi possível iniciar a nova partida. Use INICIAR PARTIDA no Host.',{cause:e});
 }
}

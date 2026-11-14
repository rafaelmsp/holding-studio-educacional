import {Clock3} from 'lucide-react';
import type {PublicRoom} from '../services/types';
import {Countdown} from './Chrome';

/** Uses the shared synchronized clock; never introduces a decorative timer. */
export default function RoundTelemetry({room}:{room:PublicRoom}){
 const label=room.status==='paused'?'PARTIDA PAUSADA':room.revealed?'RESPOSTA REVELADA':room.locked?'RESPOSTAS BLOQUEADAS':'RODADA EM ANDAMENTO';
 return <section className="v7-telemetry" aria-label="Tempo e estado da rodada">
  <h2><Clock3 size={22}/> TEMPO DA RODADA</h2>
  <Countdown room={room}/>
  <p>{label}</p>
 </section>;
}

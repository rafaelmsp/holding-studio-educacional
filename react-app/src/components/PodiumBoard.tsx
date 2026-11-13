import {motion,useReducedMotion} from 'framer-motion';
import {Crown,Trophy,Scale,Users,Target,RotateCcw,ShieldCheck} from 'lucide-react';
import type {PublicPlayer,PublicRoom} from '../services/types';
import {avatar,characterPortrait,profileName} from '../services/catalog';
import {answeredAttempts} from '../services/score';

type Props={players:PublicPlayer[];room:PublicRoom;avatars?:Record<string,string>;onRestart?:()=>void;restarting?:boolean};
const points=(n:number)=>new Intl.NumberFormat('pt-BR').format(n);
const answered=(p:PublicPlayer)=>answeredAttempts(p.counters);
const hits=(p:PublicPlayer)=>Number(p.counters?.correct||0);
export function CharacterFace({player,avatars={},hero=false}:{player:PublicPlayer;avatars?:Record<string,string>;hero?:boolean}){
 const id=player.avatar_id||avatars[player.player_id]||'detetive';
 return <div className={'v6-character-face '+(hero?'hero':'')}>
  <img loading="eager" src={hero?characterPortrait(id):avatar(id)} alt={'Personagem '+profileName(id)+' de '+player.nickname}/>
  <span className="v6-face-glint" aria-hidden="true"/>
 </div>;
}
function FinishCard({player,rank,avatars}:{player:PublicPlayer|null;rank:number;avatars?:Record<string,string>}){
 const reduced=useReducedMotion();
 const total=player?answered(player):0,right=player?hits(player):0,accuracy=total?Math.round(right/total*100):0;
 return <motion.article className={'v6-finish-card v6-finish-'+rank+(player?'':' is-vacant')}
  initial={reduced?false:{opacity:0,y:38,scale:.94}} animate={{opacity:1,y:0,scale:1}}
  transition={{duration:reduced?0:.55,delay:reduced?0:rank===3?0:rank===2?.3:.6}}>
  <div className="v6-finish-art">{player?<CharacterFace player={player} avatars={avatars} hero/>:<div className="v6-empty-portrait"><Users size={35}/></div>}</div>
  <div className="v6-finish-medal" aria-label={rank+'º lugar'}>{rank===1?<Crown size={21}/>:<Trophy size={16}/>}<b>{rank}</b></div>
  <div className="v6-finish-info">
   <strong title={player?.nickname}>{player?.nickname||'AGUARDANDO'}</strong>
   <span className="v6-finish-score">{player?points(Number(player.score||0)):'—'} <small>pts</small></span>
   {player?<><span className="v6-finish-hits">{right}/{total} acertos ({accuracy}%)</span>
    <small>{player.ocultacao_descoberta?'⚠ Ocultação descoberta':player.ocultou_bens?'⚠ Exposição patrimonial':'✓ Investigação concluída'}</small></>:<small>Sem participante</small>}
  </div>
 </motion.article>;
}
export default function PodiumBoard({players,room,avatars={},onRestart,restarting=false}:Props){
 const ordered=[...players].sort((a,b)=>a.rank!=null&&b.rank!=null&&a.rank!==b.rank?Number(a.rank)-Number(b.rank):Number(b.score||0)-Number(a.score||0)||a.nickname.localeCompare(b.nickname,'pt-BR'));
 const total=ordered.reduce((s,p)=>s+answered(p),0),correct=ordered.reduce((s,p)=>s+hits(p),0),pct=total?Math.round(correct/total*100):null;
 return <div className="v6-final-board">
  <div className="v62-award-sparks" aria-hidden="true">{Array.from({length:18},(_,i)=><i key={i} style={{left:((i*23+7)%96)+'%',animationDelay:(-(i%9)*.43)+'s',animationDuration:(4.2+(i%5)*.6)+'s'}}/>)}</div>
  <div className="v6-final-heading"><span className="v6-eyebrow"><Scale size={16}/> INVESTIGAÇÃO CONCLUÍDA</span><h1>RANKING <em>FINAL</em></h1><p>{room.case_title} • Sala {room.code}</p></div>
  <div className="v6-final-grid">
   <section className="v6-podium-wrap" aria-label="Pódio dos três primeiros colocados">
    <div className="v6-podium-stage">{[1,0,2].map(i=><FinishCard key={i} player={ordered[i]||null} rank={i+1} avatars={avatars}/>)}</div>
   </section>
   <aside className="v6-final-sidebar" aria-label="Classificação complementar"><h2><Trophy size={20}/> RANKING FINAL</h2>
    <div className="v6-final-ranking">{ordered.length<=3?<p className="v6-no-rank">Todos os participantes estão no pódio.</p>:
      ordered.slice(3).map((p,i)=><div className="v6-final-rank-row" key={p.player_id}>
       <b>{i+4}º</b><CharacterFace player={p} avatars={avatars}/><span title={p.nickname}>{p.nickname}</span><strong>{points(Number(p.score||0))} <small>pts</small></strong>
      </div>)}</div>
   </aside>
  </div>
  <div className="v6-class-summary" aria-label="Estatísticas reais da partida">
   <strong className="v6-summary-caption"><Target size={27}/> DESEMPENHO DA TURMA</strong>
   <div><span>ACERTOS</span><b className="v6-mint">{pct===null?'—':pct+'%'}</b></div>
   <div><span>RESPOSTAS</span><b>{points(total)}</b></div>
   <div><Users size={18}/><span>JOGADORES</span><b>{room.players_total}</b></div>
   <div><Scale size={18}/><span>RODADAS</span><b>{Math.min(8,Number(room.current_round||0))}/8</b></div>
   <div><ShieldCheck size={18}/><span>OCULTAÇÕES</span><b>{room.ocultou_bens_count??'—'}</b></div>
   <div><Target size={18}/><span>DESCOBERTAS</span><b>{room.ocultacao_descoberta_count??'—'}</b></div>
  </div>
  <div className="v6-final-actions">{onRestart?<button type="button" className="cinema-button gold v6-restart" onClick={onRestart} disabled={restarting}>
   <RotateCcw size={20}/> VOLTAR AO LOBBY
  </button>:<p className="v6-wait-host">Aguarde o professor para iniciar uma nova partida.</p>}</div>
 </div>;
}

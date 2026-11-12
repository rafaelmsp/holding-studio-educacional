import {motion,useReducedMotion} from 'framer-motion';
import {Crown,RefreshCw,Home,Users,Target,Scale,ShieldCheck,AlertTriangle} from 'lucide-react';
import type {PublicPlayer,PublicRoom} from '../services/types';
import {PERSONAS,avatar,BACKGROUNDS} from '../services/catalog';

type Props={
 room:PublicRoom;players:PublicPlayer[];avatars?:Record<string,string>;
 authorized:boolean;disabled?:boolean;onReplay:()=>void;onLobby:()=>void;
};
const skin='./v6/ui/';
const fmt=(v:number)=>Math.max(0,Number(v)||0).toLocaleString('pt-BR');
const totals=(p:PublicPlayer)=>{
 const c=p.counters||{};
 const correct=Number(c.correct||0),incorrect=Number(c.gray||0)+Number(c.risky||0)+Number(c.criminal||0);
 return {correct,attempts:correct+incorrect,missed:Number(c.unanswered||0)};
};
const portrait=(p:PublicPlayer|undefined,avatars:Record<string,string>)=>{
 if(!p)return null;
 const chosen=p.avatar_id||avatars[p.player_id];
 return PERSONAS.some(x=>x.id===chosen)?avatar(chosen):null;
};
export default function Podium({room,players,avatars={},authorized,disabled,onReplay,onLobby}:Props){
 const reduced=useReducedMotion();
 const sorted=[...players].sort((a,b)=>
   a.rank!=null&&b.rank!=null?Number(a.rank)-Number(b.rank):
   Number(b.score||0)-Number(a.score||0)||String(a.nickname).localeCompare(String(b.nickname),'pt-BR')
 );
 const all=sorted.reduce((acc,p)=>{
  const t=totals(p);acc.correct+=t.correct;acc.incorrect+=Math.max(0,t.attempts-t.correct);acc.unanswered+=t.missed;
  return acc;
 },{correct:0,incorrect:0,unanswered:0});
 const answerCount=all.correct+all.incorrect,accuracy=answerCount?Math.round(all.correct*100/answerCount):null;
 return <motion.section key="v6-podium" className="v6-podium" initial={reduced?false:{opacity:0}} animate={{opacity:1}} transition={{duration:.65}}
  style={{backgroundImage:'linear-gradient(105deg,#050c18dc,#040a15cf),url("'+BACKGROUNDS.final+'")'}}>
  <div className="v6-podium-light" aria-hidden="true"/>
  <header className="v6-podium-title">
   <span className="v6-legal-mark"><Scale size={24}/> INVESTIGAÇÃO CONCLUÍDA</span>
   <div><small>THE CRIMES LIVE</small><h1>PÓDIO FINAL</h1><p>{room.case_title} · Sala {room.code}</p></div>
   <span className="v6-verdict"><ShieldCheck size={20}/> RESULTADO OFICIAL DA SALA</span>
  </header>
  <div className="v6-victory-layout">
   <div className="v6-winners" aria-label="Primeiro, segundo e terceiro colocados">
    {[1,0,2].map((place,i)=>{
      const p=sorted[place],medal=place===0?'gold':place===1?'silver':'bronze';
      const t=p?totals(p):null,photo=portrait(p,avatars);
      return <motion.article key={medal} className={'v6-winner-card v6-place-'+(place+1)+(p?'':' v6-unoccupied')}
       initial={reduced?false:{opacity:0,y:38,scale:.95}} animate={{opacity:1,y:0,scale:1}}
       transition={{duration:.65,delay:reduced?0:i*.16}}>
        <img className="v6-winner-frame" src={skin+'podium-'+medal+'.svg'} alt="" aria-hidden="true"/>
        <div className="v6-winner-figure">
         {photo?<img className="v6-podium-portrait" src={photo} alt={'Personagem escolhido por '+p?.nickname} loading="eager"/>:
           <span className="v6-silhouette" aria-label="Personagem não registrado">?</span>}
        </div>
        <img className="v6-winner-medal" src={skin+'medal-'+medal+'.svg'} alt={'Medalha de '+(place+1)+'º lugar'}/>
        <div className="v6-winner-info">
          <strong className="v6-winner-name">{p?.nickname||'SEM PARTICIPANTE'}</strong>
          <b className="v6-winner-points">{p?fmt(p.score):'—'} <small>pts</small></b>
          <span>{p&&t?t.correct+' acertos · '+t.attempts+' respostas':'Aguardando resultado'}</span>
          <span className={p?.ocultou_bens?'v6-flag':'v6-good'}>{p?(p.ocultou_bens?'⚠ Exposição patrimonial':'✓ Situação regular'):'—'}</span>
        </div>
       </motion.article>;
    })}
   </div>
   <aside className="v6-victory-ranking">
    <h2><Crown size={23}/> RANKING FINAL</h2>
    <div className="v6-rank-rows">
     {sorted.length<=3?<div className="v6-rank-empty">Somente {sorted.length} participante(s) nesta sala.</div>:
       sorted.slice(3,10).map((p,i)=>{
        const photo=portrait(p,avatars),t=totals(p);
        return <div className="v6-rank-row" key={p.player_id}>
         <b>{i+4}º</b>
         {photo?<img src={photo} alt="" loading="lazy"/>:<span className="v6-mini-silhouette">◌</span>}
         <strong title={p.nickname}>{p.nickname}</strong><span>{fmt(p.score)} pts</span>
         <small>{t.correct} / {t.attempts} respostas certas</small>
        </div>;
       })}
    </div>
    {sorted.length>10&&<p className="v6-more-participants">+ {sorted.length-10} participantes na classificação completa</p>}
   </aside>
  </div>
  <section className="v6-class-summary" aria-label="Desempenho real da turma">
   <h2><Target size={25}/> DESEMPENHO DA TURMA</h2>
   <div><b className="v6-good">{accuracy===null?'—':accuracy+'%'}</b><small>Acertos</small></div>
   <div><b className="v6-flag">{accuracy===null?'—':(100-accuracy)+'%'}</b><small>Erros</small></div>
   <div><b><Users size={23}/>{room.players_total}</b><small>Jogadores</small></div>
   <div><b><Scale size={22}/>{room.current_round}</b><small>Rodadas</small></div>
   <div><b><AlertTriangle size={22}/>{room.ocultou_bens_count??'—'}</b><small>Ocultações</small></div>
   <div><b><ShieldCheck size={22}/>{room.ocultacao_descoberta_count??'—'}</b><small>Descobertas</small></div>
  </section>
  <footer className="v6-victory-actions">
   {authorized?<><button className="cinema-button gold" onClick={onReplay} disabled={disabled}>
     <RefreshCw size={23}/> JOGAR NOVAMENTE</button>
     <button className="cinema-button secondary" onClick={onLobby}><Home size={22}/> VOLTAR AO HOST</button></>:
     <p>O professor poderá iniciar uma nova partida pelo Host.</p>}
  </footer>
 </motion.section>;
}

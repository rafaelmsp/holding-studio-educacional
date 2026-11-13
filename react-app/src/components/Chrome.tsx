import {useEffect,useRef,useState} from 'react';
import {motion,AnimatePresence,useReducedMotion} from 'framer-motion';
import gsap from 'gsap';
import {Clock3,Crown,ShieldCheck,Users,FolderOpen,Scale,Clapperboard,Wifi,WifiOff,ChevronRight} from 'lucide-react';
import type {PublicRoom,PublicPlayer,QuestionOption,GameQuestion} from '../services/types';
import {exposureLabel,timeLeft,formatClock} from '../services/types';
import {BACKGROUNDS,avatar,caseScene} from '../services/catalog';
import {useGame} from '../services/store';

export function Brand({small=false}:{small?:boolean}){
 return <div className={'brandmark '+(small?'compact':'')}>
  <img src="../assets/the-crimes-v3/ui/detective-mark.svg" alt="" className="brand-detective"/>
  <div><strong>THE <span>CRIMES</span> <em>LIVE</em></strong><small>JOGO JURÍDICO INVESTIGATIVO</small></div>
  <span className="brand-fingerprint" aria-hidden="true">◉</span>
 </div>;
}
export function CinematicShell({children,mode='host'}:{children:React.ReactNode;mode?:'host'|'screen'|'player'|'join'}){
 const bg=mode==='host'?BACKGROUNDS.host:mode==='screen'?BACKGROUNDS.screen:mode==='join'?BACKGROUNDS.join:BACKGROUNDS.city;
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!ref.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const context=gsap.context(()=>{gsap.fromTo('.cinema-ambient',{opacity:.58},{opacity:.88,duration:4.5,yoyo:true,repeat:-1,ease:'sine.inOut'});},ref);
  return()=>context.revert();
 },[mode]);
 return <div ref={ref} className={'cinema-shell cinema-'+mode}>
   <div className="cinema-background" style={{backgroundImage:'linear-gradient(92deg,rgba(3,9,23,.60),rgba(4,9,20,.30) 44%,rgba(3,9,23,.58)),url("'+bg+'")'}}/>
   <div className="cinema-ambient"/>
   {children}
 </div>;
}
export function LiveStatus(){
 const online=useGame(s=>s.online),code=useGame(s=>s.code);
 return <span className={'live-state '+(online?'connected':'disconnected')}>{online?<Wifi size={14}/>:<WifiOff size={14}/>} {!code?'SALA NÃO INICIADA':online?'SUPABASE ONLINE':'SINCRONIZANDO'}</span>;
}
export function Countdown({room,className=''}:{room:PublicRoom|null;className?:string}){
 const [,setTick]=useState(0);
 useEffect(()=>{const t=setInterval(()=>setTick(x=>x+1),500);return()=>clearInterval(t);},[]);
 const n=timeLeft(room);
 const txt=room?.status==='paused'?'PAUSADO':room?.revealed?'REVELADO':room?.locked?'BLOQUEADO':formatClock(n);
 return <span className={'game-clock '+className+(n<=10&&n>0&&!room?.revealed?' urgent':'')} aria-label="Tempo da rodada"><Clock3 size={19}/>{txt}</span>;
}
export function RoundRail({round=1,finished=false}:{round?:number;finished?:boolean}){
 return <div className="round-rail"><div className="rail-caption"><Clapperboard size={18}/> PROGRESSO DO CASO</div>
  <div className="round-markers">{Array.from({length:8},(_,i)=>{
   const r=i+1,complete=finished?r<=round:r<round,current=!finished&&r===round;
   return <div key={r} className={'round-marker '+(complete?'done':current?'current':'future')} aria-label={'Rodada '+r+(complete?' concluída':current?' atual':' futura')}>{complete?'✓':current?'▶':''}{String(r).padStart(2,'0')}</div>;
  })}</div>
 </div>;
}
export function AnswerRows({question,revealed=false,selected=null,onSelect,disabled=false,className=''}:{
 question:GameQuestion;revealed?:boolean;selected?:number|null;onSelect?:(n:number)=>void;disabled?:boolean;className?:string
}){
 return <div className={'answer-rows '+className}>
 {question.options.map((answer:QuestionOption,i)=>{
   const letter=String.fromCharCode(65+i),correct=revealed&&answer.kind==='correct',risk=revealed&&answer.kind==='criminal';
   return onSelect?
     <button type="button" key={answer.index} className={'answer-row interactive '+(selected===answer.index?'selected ':'')+(correct?'correct ':risk?'criminal ':'')} aria-pressed={selected===answer.index} disabled={disabled} onClick={()=>onSelect(answer.index)}>
       <b className="answer-letter">{letter}</b><span>{answer.text}</span>{selected===answer.index&&<ShieldCheck className="answer-check" size={24}/>}
     </button>
     :<div key={answer.index} className={'answer-row '+(correct?'correct ':risk?'criminal':'')}>
       <b className="answer-letter">{letter}</b><span>{answer.text}</span>{correct?<ShieldCheck className="answer-check" size={24}/>:null}
     </div>;
 })}
 </div>;
}
export function SceneMedia({caseKey,round=1,caseTitle='',large=false,clock}:{caseKey:string;round?:number;caseTitle?:string;large?:boolean;clock?:React.ReactNode}){
 const reduced=useReducedMotion();
 return <div className={'scene-media '+(large?'scene-large':'')}>
  <motion.img key={caseKey+'-'+round} initial={reduced?false:{scale:1.07,opacity:.75}} animate={{scale:1,opacity:1}} transition={{duration:reduced?0:1.1,ease:'easeOut'}} src={caseScene(caseKey,round)} alt={'Cena ilustrativa de '+caseTitle+' na rodada '+round}/>
  <div className="scene-vignette"/>
  <div className="v62-scene-record" aria-hidden="true"><span>● REC</span><b>ARQUIVO {String(round).padStart(2,'0')} / 08</b></div>
  <div className="scene-label"><small>CENA FICTÍCIA • RODADA {String(round).padStart(2,'0')}</small><strong>{caseTitle}</strong></div>
  {clock&&<div className="scene-clock">{clock}</div>}
 </div>;
}
export function ChapterCue({round,caseTitle}:{round:number;caseTitle:string}){
 const reduced=useReducedMotion();
 const [active,setActive]=useState(true);
 useEffect(()=>{
  setActive(true);
  const handle=window.setTimeout(()=>setActive(false),1600);
  return()=>window.clearTimeout(handle);
 },[round,caseTitle]);
 if(reduced)return null;
 return <AnimatePresence>{active&&<motion.div key={round+'-'+caseTitle} className="v62-chapter-cue" aria-hidden="true"
  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
   <div className="v62-chapter-line"/><small>UM NOVO CAPÍTULO DO DOSSIÊ</small>
   <strong>RODADA {String(round).padStart(2,'0')} <span>/ 08</span></strong>
   <p>{caseTitle}</p><div className="v62-chapter-line"/>
  </motion.div>}</AnimatePresence>;
}

export function RankList({players,limit=5,avatars={},ids=[]}:{players:PublicPlayer[];limit?:number;avatars?:Record<string,string>;ids?:string[]}){
 const list=players.slice().sort((a,b)=>a.rank!=null&&b.rank!=null&&a.rank!==b.rank?Number(a.rank)-Number(b.rank):Number(b.score||0)-Number(a.score||0)).slice(0,limit);
 return <div className="rank-list">{Array.from({length:limit},(_,i)=>{
  const p=list[i];
  return <motion.div layout="position" transition={{layout:{duration:.3}}} className={'rank-entry '+(!p?'vacant ':'')+(i===0?'champion':'')} key={p?.player_id||'vacant'+i}>
    <b className={'rank-place pos'+(i+1)}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':''}{i+1}º</b>
    {p?<img src={avatar(p.avatar_id||avatars[p.player_id]||'detetive')} alt="" className="rank-avatar"/>:<div className="rank-avatar rank-empty">◌</div>}
    <div className="rank-person"><strong>{p?.nickname||'AGUARDANDO'}</strong><small>{p?(ids.includes(p.player_id)?'● ONLINE':p.connected?'● CONECTADO':'○ OFFLINE'):'VAGA LIVRE'}</small></div>
    <div className="rank-result"><strong>{p?Number(p.score||0).toLocaleString('pt-BR')+' pts':'—'}</strong><small className={p?.ocultou_bens?'danger':'safe'}>{p?(p.ocultou_bens?'⚠ EXPOSIÇÃO':'✓ REGULAR'):'—'}</small></div>
  </motion.div>;
 })}</div>;
}
export function ClassProgress({room}:{room:PublicRoom}){
 const total=Number(room.players_total||0),answered=Number(room.responded||0),round=Number(room.current_round||1),pct=room.status==='finished'?Math.round(Math.min(8,round)/8*100):total?Math.round(answered/total*100):0;
 return <div className="class-progress">
  <div className="progress-donut" style={{background:'conic-gradient(#39e99a '+pct+'%,#18354b '+pct+'%)'}}><strong>{pct}%</strong></div>
  <div><h3>{room.status==='finished'?'PROGRESSO FINAL':'PROGRESSO DA TURMA'}</h3>{room.status==='finished'?<p><span className="safe">{round}/8 rodadas realizadas</span> • {total} participantes</p>:<p><span className="safe">✓ {answered} respondidos</span> <span className="muted">•</span> <span>{Math.max(0,total-answered)} aguardando</span></p>}</div>
 </div>;
}
export function TopStats({room,online}:{room:PublicRoom|null;online:number}){
 return <div className="top-stats">
  <div><small><FolderOpen size={13}/> CASO ATUAL</small><strong className="gold">{room?.case_title||'Investigação'}</strong></div>
  <div><small><Users size={13}/> JOGADORES</small><strong className="mint">{online} online</strong></div>
  <div><small><Scale size={13}/> RODADA</small><strong>{room?room.current_round+'/8':'—/8'}</strong></div>
  <div><small>◉ PROGRESSO</small><strong>{room?(room.status==='waiting'?0:Math.round(Math.max(0,Math.min(8,Number(room.current_round)))/8*100))+'%':'0%'}</strong></div>
 </div>;
}
export function SectionTitle({children,icon}:{children:React.ReactNode;icon?:React.ReactNode}){return <h3 className="section-heading">{icon||<Crown size={20}/>} {children}<ChevronRight size={17} className="section-arrow"/></h3>;}
export function ErrorLine({message}:{message?:string|null}){return message?<div role="alert" className="error-line">{message}</div>:null;}
export function RoomBadge({room}:{room:PublicRoom|null}){return <span className="room-status">{room?.status==='running'?'● AO VIVO':room?.status==='paused'?'⏸ PAUSADA':room?.status==='finished'?'✓ ENCERRADA':'● AGUARDANDO'}</span>;}
export {exposureLabel};

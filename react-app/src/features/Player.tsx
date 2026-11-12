import {useEffect,useState} from 'react';
import {motion} from 'framer-motion';
import {QRCodeSVG} from 'qrcode.react';
import {ShieldCheck,Clock3,Crown,CheckCircle2,LogIn,LockKeyhole,AlertTriangle} from 'lucide-react';
import {CinematicShell,Brand,LiveStatus,Countdown,RoundRail,AnswerRows,SceneMedia,ErrorLine} from '../components/Chrome';
import {PERSONAS,avatar,BACKGROUNDS} from '../services/catalog';
import type {Gender} from '../services/catalog';
import {useGame,getSession,saveSession} from '../services/store';
import {action} from '../services/api';
import {useRoomRealtime,broadcastRoom} from '../services/realtime';
import {exposureLabel,currentRound,roundKey,requestId} from '../services/types';
import type {Session} from '../services/types';

export default function Player(){
 const code=useGame(s=>s.code),publicRoom=useGame(s=>s.room),players=useGame(s=>s.players);
 const snapshot=useGame(s=>s.player),busy=useGame(s=>s.busy),setBusy=useGame(s=>s.setBusy);
 const error=useGame(s=>s.error),setError=useGame(s=>s.setError);
 const [session,setSession]=useState<Session|null>(()=>code?getSession(code):null);
 const [nickname,setNickname]=useState(''),[gender,setGender]=useState<Gender>('masculino'),[persona,setPersona]=useState<string>('detetive');
 const [selected,setSelected]=useState<number|null>(null),[correction,setCorrection]=useState<{correctIndex?:number;correctText?:string;explanation?:string}|null>(null);
 const {refresh}=useRoomRealtime(code,'player',session);
 const player=snapshot?.player,room=snapshot?.room,question=room?.question;
 const actualRound=currentRound(room),key=roundKey(room);
 const own=(player?.answers||[]).find(a=>a.round_key===key)||(player?.answers||[]).find(a=>a.question_id===question?.id);
 useEffect(()=>{setSelected(null);setCorrection(null);},[key,question?.id]);
 useEffect(()=>{if(code){const restore=getSession(code);if(restore)setSession(restore);}},[code]);
 const join=async()=>{
  if(!code)return;
  if(nickname.trim().length<2||nickname.trim().length>24){setError('Informe um nome de 2 a 24 caracteres.');return;}
  setBusy(true);setError(null);
  try{
   const r=await action<{ok:boolean;sessionToken:string;playerId:string}>('join',{code,nickname:nickname.trim(),avatarId:persona,sessionToken:session?.sessionToken});
   const s:Session={playerId:r.playerId,sessionToken:r.sessionToken,nickname:nickname.trim(),avatarId:persona,genderFilter:gender};
   saveSession(code,s);setSession(s);await refresh();
  }catch(e){setError(e instanceof Error?e.message:'Não foi possível entrar na sala');}
  finally{setBusy(false);}
 };
 const answer=async()=>{
  if(!question||!session||selected===null||busy||own)return;
  setBusy(true);setError(null);
  try{
   await action('answer',{code,sessionToken:session.sessionToken,questionId:question.id,roundKey:key,requestId:requestId('react-answer'),optionIndex:selected});
   await broadcastRoom(code);await refresh();
  }catch(e){setError(e instanceof Error?e.message:'Sua resposta não foi registrada');}
  finally{setBusy(false);}
 };
 const showCorrect=async()=>{
  if(!session||!question||!room)return;
  setBusy(true);setError(null);
  try{const r=await action<{ok:boolean;correctIndex?:number;correctText?:string;explanation?:string}>('showCorrect',{code,sessionToken:session.sessionToken,questionId:question.id,roundKey:key});setCorrection(r);}
  catch(e){setError(e instanceof Error?e.message:'A correção ainda não está disponível');}
  finally{setBusy(false);}
 };
 const options=PERSONAS.filter(x=>x.gender===gender),profile=PERSONAS.find(p=>p.id===persona)||PERSONAS[0];
 const chooseGender=(g:Gender)=>{setGender(g);setPersona(PERSONAS.find(x=>x.gender===g)!.id);};
 const stats=[['SALA',code],['JOGADORES',String(publicRoom?.players_total||0)],['CASO',publicRoom?.case_title||'Aguardando'],['RODADA',String(publicRoom?.current_round||1).padStart(2,'0')+'/08']];
 if(!code)return <CinematicShell mode="join"><div className="player-no-room"><Brand/><h1>ENTRE NA INVESTIGAÇÃO</h1><p>Leia o QR Code apresentado pelo professor ou informe uma sala.</p><form onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);location.href='./?view=player&room='+encodeURIComponent(String(data.get('code')||'').toUpperCase());}}><input name="code" placeholder="CRIM-0000" required pattern="CRIM-[0-9]{4}"/><button type="submit" className="cinema-button gold">ENTRAR</button></form></div></CinematicShell>;

 if(!session||!snapshot){
  return <CinematicShell mode="join"><div className="player-app join-player">
    <header className="player-header"><Brand small/><LiveStatus/></header>
    <main className="join-card">
     <div className="join-heading" style={{backgroundImage:'linear-gradient(90deg,#070f21f2,#0b1b2dbd),url("'+BACKGROUNDS.join+'")'}}>
       <div><small>CRIE SUA IDENTIDADE</small><h1>ENTRE NA INVESTIGAÇÃO</h1><p>Escolha seu personagem e participe do jogo jurídico ao vivo.</p></div>
       <div className="join-stats">{stats.map(([a,b])=><div key={a}><small>{a}</small><strong>{b}</strong></div>)}</div>
     </div>
     <div className="join-layout">
       <section className="join-form">
         <h2><b>01</b> IDENTIFIQUE-SE</h2><label className="join-label" htmlFor="nickname">DIGITE SEU NOME</label>
         <input id="nickname" value={nickname} maxLength={24} autoComplete="nickname" placeholder="Como deseja aparecer no ranking?" onChange={e=>setNickname(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void join();}}/>
         <h2><b>02</b> FILTRO DE PERSONAGENS</h2><div className="gender-filter">{(['masculino','feminino','neutro'] as const).map(g=><button type="button" className={gender===g?'active':''} onClick={()=>chooseGender(g)} key={g}>{g[0].toUpperCase()+g.slice(1)}</button>)}</div>
         <p className="join-help">O filtro visual não modifica suas respostas ou pontuação.</p>
         <h2><b>03</b> ESCOLHA SEU PERSONAGEM</h2><div className="persona-grid">{options.map(p=><button key={p.id} className={'persona-tile '+(persona===p.id?'selected':'')} aria-pressed={persona===p.id} type="button" onClick={()=>setPersona(p.id)}>
           <img src={avatar(p.id)} alt=""/><strong>{p.name}</strong><span>{p.role}</span>
         </button>)}</div>
       </section>
       <aside className="persona-preview">
         <span>PERFIL ESCOLHIDO</span><motion.img key={persona} src={avatar(profile.id)} alt={'Personagem '+profile.name} initial={{opacity:.7,x:6}} animate={{opacity:1,x:0}} transition={{duration:.2}}/>
         <h2>{profile.name}</h2><p>{profile.description}</p><div className="persona-facts"><div><small>CLASSE</small><strong>{profile.role}</strong></div><div><small>ESTILO</small><strong>{profile.style}</strong></div><div><small>NÍVEL INICIAL</small><strong>01</strong></div></div>
       </aside>
     </div>
     <footer className="join-footer"><div><strong><ShieldCheck size={19}/> COMO FUNCIONA</strong><p>O Host controla as rodadas. Responda no celular e acompanhe a revelação no telão.</p></div><button className="cinema-button danger join-cta" type="button" disabled={busy} onClick={join}><LogIn size={21}/> {busy?'CONECTANDO...':'ENTRAR NA PARTIDA'}</button></footer>
     <ErrorLine message={error}/>
    </main>
   </div></CinematicShell>;
 }
 const status=room?.status||publicRoom?.status||'waiting',answered=Boolean(own);
 const myRank=players.find(p=>p.player_id===player?.id)?.rank ?? (players.findIndex(p=>p.player_id===player?.id)>=0?players.findIndex(p=>p.player_id===player?.id)+1:'—');
 const counters=player?.counters||{},sum=Object.values(counters).reduce((a,b)=>a+Number(b||0),0),hit=sum?Math.round(Number(counters.correct||0)/sum*100):0;
 return <CinematicShell mode="player"><div className="player-app">
   <header className="player-header"><Brand small/><LiveStatus/></header>
   {status==='waiting'?<div className="player-lobby" style={{backgroundImage:'linear-gradient(#040e1ebd,#030817eb),url("'+BACKGROUNDS.lobby+'")'}}>
     <img className="lobby-avatar" src={avatar(player?.avatar_id||session.avatarId)} alt=""/>
     <span>JOGADOR CONECTADO • SALA {code}</span><h1>AGUARDANDO INICIAR A PARTIDA...</h1><p>O professor abrirá a primeira rodada. Mantenha esta tela aberta.</p>
     <QRCodeSVG value={location.href} size={90} bgColor="#fff"/><small>{publicRoom?.players_total||1} jogadores inscritos</small>
   </div>:status==='finished'?<div className="player-final" style={{backgroundImage:'linear-gradient(#05101bcc,#020814f6),url("'+BACKGROUNDS.final+'")'}}>
     <span className="red-sign">CASO ENCERRADO</span><img src={avatar(player?.avatar_id||session.avatarId)} alt="" className="final-avatar"/>
     <h1>{player?.nickname}</h1><strong className="final-score">{player?.score||0} PONTOS</strong>
     <div className="final-grid">{[['POSIÇÃO','#'+myRank],['RODADAS',sum+'/8'],['ACERTOS',hit+'%'],['EXPOSIÇÃO',exposureLabel(player?.exposure)]].map(([a,b])=><div key={a}><small>{a}</small><strong>{b}</strong></div>)}</div>
     <section className="final-verdict"><h2>{player?.final_result?.resultLabel||'RESULTADO FINAL'}</h2><p>Ocultou bens: <b>{player?.ocultou_bens?'SIM':'NÃO'}</b> • Descoberta: <b>{player?.ocultacao_descoberta?'SIM':'NÃO'}</b></p><p>Patrimônio bloqueado: <b>{Number(player?.patrimonio_bloqueado||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</b></p></section>
   </div>:question&&room?<main className="gameplay">
      <section className="player-identity">
       <img src={avatar(player?.avatar_id||session.avatarId)} alt="" className="player-avatar"/>
       <div><small>SALA {code}</small><strong>{player?.nickname||session.nickname}</strong></div>
       <div className="player-score"><Crown size={18}/><strong>{player?.score||0} pts</strong><small>EXPOSIÇÃO: {exposureLabel(player?.exposure)}</small></div>
      </section>
      <div className="mobile-round-label">RODADA {actualRound} DE 8 <RoundRail round={actualRound}/></div>
      <SceneMedia caseKey={room.caseKey||publicRoom?.case_key||'credores'} round={actualRound} caseTitle={question.caseTitle||publicRoom?.case_title||''} clock={<Countdown room={publicRoom}/>}/>
      <section className="player-question"><h1>{question.text}</h1><AnswerRows question={question} revealed={Boolean(room.revealed)} selected={own?Number(own.option_index):selected} disabled={answered||Boolean(room.locked)||status!=='running'||busy} onSelect={setSelected}/>
       {!answered?<button type="button" className="cinema-button danger submit-answer" disabled={selected===null||busy||Boolean(room.locked)||status!=='running'} onClick={answer}><CheckCircle2 size={26}/> {busy?'ENVIANDO...':'RESPONDER'}</button>
         :<div className="answered-notice"><CheckCircle2 size={24}/> RESPOSTA REGISTRADA — AGUARDE A PRÓXIMA RODADA</div>}
       {answered&&(room.revealed||correction?.correctIndex!==undefined)?<div className="correction-panel"><strong>RESPOSTA REVELADA</strong><p>{correction?.correctText||question.options.find(o=>o.index===question.correctIndex)?.text||'Confira a resposta no telão.'}</p><p>{correction?.explanation||question.explanation||''}</p></div>:null}
       {answered&&room.correctionPolicy!=='host_reveal'&&!room.revealed&&!correction?<button className="cinema-button secondary" onClick={showCorrect} disabled={busy}><LockKeyhole size={17}/> CONSULTAR CORREÇÃO</button>:null}
       <div className="player-metrics"><span><small>PONTOS</small><strong>{player?.score||0}</strong></span><span><small>EXPOSIÇÃO</small><strong>{exposureLabel(player?.exposure)} ({player?.exposure||0})</strong></span><span><small>OCULTAÇÃO</small><strong>{player?.ocultou_bens?'SIM':'NÃO'}</strong></span></div>
       {status==='paused'&&<div className="game-notice"><Clock3 size={20}/> PARTIDA PAUSADA PELO PROFESSOR</div>}
       {room.locked&&!answered&&<div className="game-notice"><AlertTriangle size={20}/> RESPOSTAS BLOQUEADAS — AGUARDE O HOST</div>}
      </section>
      <ErrorLine message={error}/>
    </main>:<div className="player-lobby"><h1>SINCRONIZANDO A PARTIDA...</h1><p>Verificando a rodada atual.</p></div>}
 </div></CinematicShell>;
}

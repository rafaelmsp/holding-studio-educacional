import PodiumBoard from '../components/PodiumBoard';
import {useEffect,useMemo,useState} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import {Fullscreen,Eye,ChevronsRight,MonitorUp,Users,Crown,Play} from 'lucide-react';
import {motion,AnimatePresence} from 'framer-motion';
import {CinematicShell,Brand,LiveStatus,Countdown,ChapterCue,RoundRail,AnswerRows,SceneMedia,RankList,ClassProgress,TopStats,RoomBadge,ErrorLine} from '../components/Chrome';
import {useGame,adminStorage} from '../services/store';
import {useRoomRealtime,broadcastRoom} from '../services/realtime';
import {playerUrl,action} from '../services/api';
import {requestId} from '../services/types';
import {BACKGROUNDS} from '../services/catalog';
import {CaseBeat,PhaseTag} from '../components/v7/V7UI';

export default function Screen(){
 const code=useGame(s=>s.code),room=useGame(s=>s.room),players=useGame(s=>s.players);
 const ids=useGame(s=>s.presenceIds),avatars=useGame(s=>s.avatars);
 const error=useGame(s=>s.error),setError=useGame(s=>s.setError);
 const busy=useGame(s=>s.busy),setBusy=useGame(s=>s.setBusy);
 const {refresh}=useRoomRealtime(code,'screen');
 const [fullscreen,setFullscreen]=useState(false);
 const screenToken=useMemo(()=>code?localStorage.getItem(adminStorage(code)):'', [code]);
 useEffect(()=>{
  const listener=()=>setFullscreen(Boolean(document.fullscreenElement));
  document.addEventListener('fullscreenchange',listener);
  return()=>document.removeEventListener('fullscreenchange',listener);
 },[]);
 const toggleScreen=async()=>{
  try{
   if(document.fullscreenElement)await document.exitFullscreen();
   else await document.documentElement.requestFullscreen();
  }catch(e){setError(e instanceof Error?e.message:'Tela cheia indisponível');}
 };
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{if(e.key.toLowerCase()==='f'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!(e.target instanceof HTMLInputElement))void toggleScreen();};
  window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 },[]);
 const command=async(kind:'reveal'|'next'|'finish'|'reset'|'start')=>{
  if(!room||!screenToken||busy)return;
  const final=room.current_round>=8&&kind==='next';
  const actual=final?'finish':kind;
  const missing=Math.max(0,room.players_total-room.responded);
  if((actual==='next'&&(!room.revealed||missing>0)&&!confirm(missing>0?'Há '+missing+' jogador(es) sem responder. Avançar?':'Avançar sem revelar?'))||(actual==='finish'&&!confirm('Encerrar a partida para todos os jogadores?')))return;
  setBusy(true);setError(null);
  try{
   const beforeRound=room.current_round,beforeStatus=room.status,beforeRevealed=room.revealed;
   const send=async(rev:number)=>action(actual,{code,adminToken:screenToken,expectedRevision:rev,requestId:requestId('screen-'+actual)});
   try{await send(Number(room.room_revision||0));}
   catch(first){
    if(!(first as {payload?:{stale?:boolean}})?.payload?.stale)throw first;
    await refresh();
    const now=useGame.getState().room;
    const safe=Boolean(now)&&(
      actual==='next'&&now!.current_round===beforeRound&&now!.status==='running'||
      actual==='reveal'&&now!.current_round===beforeRound&&!now!.revealed&&beforeRevealed===false||
      actual==='finish'&&now!.status!=='finished'||
      actual==='reset'&&now!.status!=='waiting'||
      actual==='start'&&now!.status==='waiting'&&beforeStatus==='waiting'
    );
    if(safe)await send(Number(now!.room_revision||0));
   }
   await broadcastRoom(code);await refresh();
  }catch(e){setError(e instanceof Error?e.message:'Falha no comando');}
  finally{setBusy(false);}
 };
 const online=ids.length||Number(room?.players_connected||0);
 const round=Math.max(1,Number(room?.current_round||1));
 return <CinematicShell mode="screen">
   <div className="projector">
     <header className="projector-header"><Brand small/><TopStats room={room} online={online}/><LiveStatus/></header>
     {!code?<div className="projector-no-room"><h1>O TELÃO PRECISA DE UMA SALA</h1><p>Abra pelo botão ABRIR TELÃO da Central do Host.</p><a href="./?view=host">IR PARA O HOST</a></div>
       :<><div className="projector-main">
       <main className="projector-stage">
        {room?.status==='running'&&!room.revealed?<ChapterCue round={round} caseTitle={room.case_title}/>:null}
        <AnimatePresence mode="wait">
         {!room||room.status==='waiting'?<motion.div key="waiting" className="projector-waiting" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{backgroundImage:'linear-gradient(90deg,#06121b98,#040a18ea),url("'+BACKGROUNDS.lobby+'")'}}>
           <span className="red-sign">SALA {code}</span><h1>AGUARDANDO INÍCIO DA PARTIDA...</h1>
           <p>Entre pelo QR Code no seu celular e escolha seu personagem.</p>
           <div className="projector-qr"><QRCodeSVG value={playerUrl(code)} size={180} fgColor="#071421" bgColor="#fff"/></div>
           <strong>{online} jogadores online</strong>
         </motion.div>:room.status==='finished'?<motion.div key="final" className="projector-final v6-cinematic-final" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{backgroundImage:'linear-gradient(#020b1a92,#040b19c7),url("'+BACKGROUNDS.final+'")'}}>
           <PodiumBoard players={players} room={room} avatars={avatars} onRestart={screenToken?()=>void command('reset'):undefined} restarting={busy}/>
         </motion.div>:room.question?<motion.div key={'round-'+round} className="projector-question" initial={{opacity:.45}} animate={{opacity:1}} exit={{opacity:0}}>
           <SceneMedia caseKey={room.case_key} caseTitle={room.case_title} round={round} large/>
           <section className="projector-question-copy">
             <div className="question-round"><span>PERGUNTA DA RODADA {String(round).padStart(2,'0')}</span><Countdown room={room}/></div><CaseBeat round={round} compact/>
             <h1>{room.question.text}</h1>
             <AnswerRows question={room.question} revealed={room.revealed}/>
             {room.revealed?<div className="projector-explanation"><strong>RESPOSTA REVELADA</strong><p>{room.question.explanation||'Observe a alternativa juridicamente adequada e a fundamentação do caso.'}</p></div>:<div className="projector-stats"><span><Users size={17}/> RESPOSTAS RECEBIDAS <b>{room.responded}/{room.players_total}</b></span><span>STATUS <b>{room.locked?'BLOQUEADO':'RESPONDENDO...'}</b></span></div>}
           </section>
         </motion.div>:null}
        </AnimatePresence>
       </main>
       <aside className="projector-side">
         {room&&<ClassProgress room={room}/>}
         <section className="rank-panel"><h2><Crown size={21}/> RANKING (TOP 5)</h2><RankList players={players} ids={ids} avatars={avatars}/></section>
       </aside>
      </div>
      <RoundRail round={round} finished={room?.status==='finished'}/>
      <footer className="projector-footer"><span className="footer-room">SALA {code} <RoomBadge room={room}/> <PhaseTag room={room}/></span>
       <div className="projector-controls">
         {screenToken&&room?.status==='running'&&!room?.revealed?<button disabled={busy} className="cinema-button cyan" onClick={()=>void command('reveal')}><Eye size={22}/> REVELAR RESPOSTA</button>:null}
         {screenToken&&room?.status==='running'?<button disabled={busy} className="cinema-button gold" onClick={()=>void command('next')}><ChevronsRight size={22}/> {round>=8?'ENCERRAR':'PULAR / PRÓXIMA'}</button>:null}
         {screenToken&&room?.status==='waiting'?<button disabled={busy} className="cinema-button mint" onClick={()=>void command('start')}><Play size={20}/> INICIAR</button>:null}
         <button className="cinema-button secondary" onClick={toggleScreen}><Fullscreen size={19}/> {fullscreen?'SAIR DA TELA CHEIA':'TELA CHEIA'}</button>
         <span className="projector-authority"><MonitorUp size={15}/> {screenToken?'CONTROLE AUTORIZADO':'MODO EXIBIÇÃO'}</span>
       </div>
      </footer><ErrorLine message={error}/></>}
   </div>
 </CinematicShell>;
}

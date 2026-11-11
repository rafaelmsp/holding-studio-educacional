import {useCallback,useEffect,useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {QRCodeSVG} from 'qrcode.react';
import {FolderOpen,Users,FileText,BarChart3,Settings2,Monitor,Eye,ChevronsRight,Square,LockKeyhole,Pause,Play,RefreshCw,Copy,BookOpen,SlidersHorizontal,ExternalLink} from 'lucide-react';
import {useGame,adminStorage} from '../services/store';
import {action,screenUrl,playerUrl} from '../services/api';
import {broadcastRoom,useRoomRealtime} from '../services/realtime';
import {CASES,caseCover} from '../services/catalog';
import {revision,requestId} from '../services/types';
import {CinematicShell,Brand,LiveStatus,Countdown,RoundRail,AnswerRows,SceneMedia,RankList,ClassProgress,TopStats,RoomBadge,ErrorLine} from '../components/Chrome';

export default function Host(){
 const code=useGame(s=>s.code),setCode=useGame(s=>s.setCode),token=useGame(s=>s.adminToken),setToken=useGame(s=>s.setToken);
 const room=useGame(s=>s.room),players=useGame(s=>s.players),admin=useGame(s=>s.admin);
 const selectedCase=useGame(s=>s.selectedCase),setCase=useGame(s=>s.setCase);
 const busy=useGame(s=>s.busy),setBusy=useGame(s=>s.setBusy),error=useGame(s=>s.error),setError=useGame(s=>s.setError);
 const modal=useGame(s=>s.modal),setModal=useGame(s=>s.setModal);
 const avatars=useGame(s=>s.avatars),presenceIds=useGame(s=>s.presenceIds);
 const [maxPlayers,setMaxPlayers]=useState(30),[seconds,setSeconds]=useState(60),[policy,setPolicy]=useState('host_reveal');
 const {refresh}=useRoomRealtime(code,'host');
 useEffect(()=>{
   const params=new URLSearchParams(location.search),urlCode=params.get('room');
   if(urlCode&&!code){const stored=localStorage.getItem(adminStorage(urlCode.toUpperCase()));if(stored){setToken(stored);setCode(urlCode.toUpperCase());}}
 },[code,setCode,setToken]);
 const create=async()=>{
  setBusy(true);setError(null);
  try{
   const r=await action<{ok:boolean;code:string;adminToken:string}>('createRoom',{caseKey:selectedCase,maxPlayers,questionTimeSec:seconds,correctionPolicy:policy});
   localStorage.setItem(adminStorage(r.code),r.adminToken);
   setToken(r.adminToken);setCode(r.code);
   const url=new URL(location.href);url.search='?view=host&room='+encodeURIComponent(r.code);history.replaceState({},'',url);
  }catch(e){setError(e instanceof Error?e.message:'Não foi possível criar sala');}
  finally{setBusy(false);}
 };
 const send=useCallback(async(name:string)=>{
  if(!code||!token||busy)return;
  const missing=Math.max(0,Number(room?.players_total||0)-Number(room?.responded||0));
  if(name==='next'&&!confirm(missing>0?'Há '+missing+' jogador(es) sem responder. Avançar mesmo assim?':!room?.revealed?'Avançar sem revelar a resposta desta rodada?':'Ir para a próxima rodada?'))return;
  if(name==='finish'&&!confirm('Encerrar a partida para todos os jogadores?'))return;
  if(name==='reset'&&!confirm('Resetar respostas e pontuações? Jogadores permanecerão na sala.'))return;
  setBusy(true);setError(null);
  const run=async(retry:boolean)=>{
   try{
    const rev=Math.max(Number(room?.room_revision??-1),revision(admin?.room));
    await action(name,{code,adminToken:token,expectedRevision:rev,requestId:requestId('react-'+name)});
   }catch(e){
    const issue=e as {payload?:{stale?:boolean}};
    if(retry&&issue.payload?.stale){
      await refresh();
      const latest=useGame.getState().room;
      const canRetry=Boolean(latest)&&(
       name==='next'&&latest!.current_round===room?.current_round&&latest!.status==='running'||
       name==='reveal'&&latest!.current_round===room?.current_round&&!latest!.revealed||
       name==='start'&&latest!.status==='waiting'||
       name==='pause'&&latest!.status==='running'||
       name==='resume'&&latest!.status==='paused'||
       name==='lock'&&latest!.status==='running'&&!latest!.locked||
       name==='finish'&&latest!.status!=='finished'||
       name==='reset'&&latest!.status!=='waiting'||
       name==='toggleEntry'&&latest!.entry_open===room?.entry_open
      );
      if(canRetry)await action(name,{code,adminToken:token,expectedRevision:Number(latest!.room_revision||0),requestId:requestId('retry-'+name)});
    }else throw e;
   }
  };
  try{await run(true);await broadcastRoom(code);await refresh();}
  catch(e){setError(e instanceof Error?e.message:'Comando não concluído');}
  finally{setBusy(false);}
 },[code,token,busy,room,admin,refresh,setError,setBusy]);

 const online=presenceIds.length||Number(room?.players_connected||0);
 const number=Number(room?.current_round||1),isLive=room?.status==='running';
 return <CinematicShell mode="host">
   <header className="game-header">
     <Brand/><div className="header-content">{code?<TopStats room={room} online={online}/>:<p className="head-slogan">INVESTIGAÇÃO • ESTRATÉGIA • DIREITO • NEGÓCIOS</p>}</div><LiveStatus/>
   </header>
   {!code||!token?<div className="setup-view">
     <div className="setup-title"><h1>ESCOLHA O <span>CASO DA AULA</span></h1><p>Crie uma investigação ao vivo com personagens, respostas e ranking em tempo real.</p></div>
     <div className="case-gallery">{CASES.map((x,i)=><button type="button" key={x.key} className={'case-tile '+(selectedCase===x.key?'chosen':'')} onClick={()=>setCase(x.key)}>
       <img src={caseCover(x.key)} alt=""/><span className="case-tile-caption"><small>CASO {String(i+1).padStart(2,'0')}</small><strong>{x.title}</strong><span>{x.subtitle}</span></span>
     </button>)}</div>
     <section className="create-room-panel">
       <label>Máximo de jogadores<input type="number" min={2} max={100} value={maxPlayers} onChange={e=>setMaxPlayers(Number(e.target.value))}/></label>
       <label>Tempo por pergunta<input type="number" min={10} max={180} value={seconds} onChange={e=>setSeconds(Number(e.target.value))}/></label>
       <label>Correção<select value={policy} onChange={e=>setPolicy(e.target.value)}><option value="host_reveal">Quando o Host revelar</option><option value="all_answered">Quando todos responderem</option><option value="immediate">Imediata no celular</option></select></label>
       <button className="cinema-button gold" type="button" onClick={create} disabled={busy}><Play size={20}/> {busy?'CRIANDO SALA...':'CRIAR SALA ONLINE'}</button>
     </section><ErrorLine message={error}/>
   </div>:<div className="host-body">
     <nav className="host-sidebar" aria-label="Navegação do Host">
       <div className="sidebar-label">CENTRAL DE CONTROLE</div>
       <button className="nav-current" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><Play size={17}/> Partida ao Vivo</button>
       <button onClick={()=>setModal('lobby')}><Users size={17}/> Lobby / Sala</button>
       <button onClick={()=>setModal('cases')}><FileText size={17}/> Casos e Perguntas</button>
       <button onClick={()=>setModal('players')}><Users size={17}/> Jogadores</button>
       <button onClick={()=>setModal('reports')}><BarChart3 size={17}/> Relatórios</button>
       <button onClick={()=>setModal('settings')}><Settings2 size={17}/> Configurações</button>
       <img className="justice-statue" src="../assets/the-crimes-v3/ui/lady-justice.svg" alt="" aria-hidden="true"/>
     </nav>
     <main className="host-main">
       <section className="room-ribbon">
         <div><small><FolderOpen size={16}/> SALA ATIVA</small><strong className="room-code">{code}</strong></div>
         <div><RoomBadge room={room}/><small>Participe pelo QR Code</small></div>
         <div className="room-qr"><QRCodeSVG value={playerUrl(code)} size={72} fgColor="#060d18" bgColor="#ffffff"/></div>
         <div className="room-current" style={{backgroundImage:'linear-gradient(90deg,#081421e8,#050d1dbb),url("'+caseCover(room?.case_key||selectedCase)+'")'}}>
           <small>CASO ATUAL</small><strong>{room?.case_title||CASES.find(x=>x.key===selectedCase)?.title}</strong>
           <button type="button" onClick={()=>{void navigator.clipboard?.writeText(playerUrl(code));}}><Copy size={13}/> Copiar link do jogador</button>
         </div>
       </section>
       <section className="live-layout">
         <div className="live-center">
           <div className="round-bar"><RoomBadge room={room}/><strong>RODADA {String(number).padStart(2,'0')}/08</strong><span className="mint">{room?.responded||0}/{room?.players_total||0} RESPONDERAM</span><Countdown room={room}/></div>
           {room?.question&&room.status!=='waiting'&&room.status!=='finished'?<div className="host-question">
             <SceneMedia caseKey={room.case_key} caseTitle={room.case_title} round={number}/>
             <div className="question-copy"><span className="question-label">PERGUNTA DA RODADA {String(number).padStart(2,'0')}</span>
               <h1>{room.question.text}</h1><AnswerRows question={room.question} revealed={room.revealed}/>
               {room.revealed&&room.question.explanation&&<p className="explanation">{room.question.explanation}</p>}
             </div>
           </div>:room?.status==='finished'?<div className="host-empty final"><h1>PARTIDA FINALIZADA</h1><p>Confira o pódio no telão ou reinicie a sala.</p><button className="cinema-button gold" onClick={()=>void send('reset')}><RefreshCw size={17}/> VOLTAR AO LOBBY</button></div>:<div className="host-empty" style={{backgroundImage:'linear-gradient(#030b17aa,#050d1bea),url("'+caseCover(room?.case_key||selectedCase)+'")'}}>
             <h1>AGUARDANDO O INÍCIO DA INVESTIGAÇÃO</h1><p>Compartilhe o QR Code e inicie a partida quando a turma estiver pronta.</p>
             <button className="cinema-button gold" onClick={()=>void send('start')} disabled={busy}><Play size={21}/> INICIAR PARTIDA</button>
           </div>}
         </div>
         <aside className="host-aside">
           {room?<ClassProgress room={room}/>:null}
           <section className="rank-panel"><h2><span>🏆</span> RANKING (TOP 5)</h2><RankList players={players} avatars={avatars} ids={presenceIds}/></section>
         </aside>
       </section>
       <section className="host-dock" aria-label="Controles administrativos">
         <button className="cinema-button secondary" onClick={()=>window.open(screenUrl(code),'the-crimes-react-screen')}><Monitor size={22}/> ABRIR TELÃO</button>
         {room?.status==='waiting'?<button className="cinema-button mint" disabled={busy} onClick={()=>void send('start')}><Play size={23}/> INICIAR PARTIDA</button>:null}
         {room?.status==='paused'?<button className="cinema-button mint" disabled={busy} onClick={()=>void send('resume')}><Play size={23}/> CONTINUAR</button>:null}
         {isLive&&!room?.revealed?<button className="cinema-button cyan" disabled={busy||room?.locked&&room?.revealed} onClick={()=>void send('reveal')}><Eye size={24}/> REVELAR RESPOSTA</button>:null}
         {isLive?<button className="cinema-button gold" disabled={busy} onClick={()=>void send('next')}><ChevronsRight size={25}/> PULAR / PRÓXIMA</button>:null}
         {(isLive||room?.status==='paused')?<button className="cinema-button danger" disabled={busy} onClick={()=>void send('finish')}><Square size={22}/> ENCERRAR PARTIDA</button>:null}
         <details className="host-toolbox"><summary><SlidersHorizontal size={17}/> FERRAMENTAS</summary><div className="host-tools-popover">
           {isLive?<button onClick={()=>void send('pause')} disabled={busy}><Pause size={16}/> Pausar</button>:null}
           {isLive&&!room?.locked?<button onClick={()=>void send('lock')} disabled={busy}><LockKeyhole size={16}/> Bloquear respostas</button>:null}
           {room?.status!=='finished'?<button onClick={()=>void send('toggleEntry')} disabled={busy}><Users size={16}/> {room?.entry_open?'Fechar entrada':'Abrir entrada'}</button>:null}
           <button onClick={()=>setModal('cases')}><BookOpen size={16}/> Dossiês</button>
           <button onClick={()=>setModal('reports')}><BarChart3 size={16}/> Relatórios</button>
           <button onClick={()=>setModal('activity')}><FileText size={16}/> Atividade</button>
           <button onClick={()=>window.open('./showroom.html','the-crimes-gallery')}><ExternalLink size={16}/> Galeria V4.2</button>
           {(room?.status==='waiting'||room?.status==='finished')?<button onClick={()=>void send('reset')} disabled={busy}><RefreshCw size={16}/> Resetar sala</button>:null}
         </div></details>
       </section>
       <RoundRail round={number} finished={room?.status==='finished'}/>
       <ErrorLine message={error}/>
     </main>
   </div>}
   <AnimatePresence>{modal&&<motion.div className="modal-shade" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.currentTarget===e.target)setModal(null)}}>
     <motion.section className="modal-content" initial={{scale:.95,y:20}} animate={{scale:1,y:0}} exit={{scale:.96,y:10}} role="dialog" aria-modal="true" aria-label={modal}>
       <header><strong>{modal==='players'?'JOGADORES':modal==='reports'?'RELATÓRIO DA TURMA':modal==='cases'?'DOSSIÊS DOS CASOS':modal==='settings'?'CONFIGURAÇÕES DA SALA':modal==='activity'?'ATIVIDADE RECENTE':'LOBBY / SALA'}</strong><button onClick={()=>setModal(null)} aria-label="Fechar">✕</button></header>
       {(modal==='players'||modal==='reports')&&<div className="modal-scroll">
         {modal==='reports'&&<div className="report-metrics">
          <div><small>JOGADORES</small><strong>{players.length}</strong></div>
          <div><small>ACERTOS</small><strong>{(()=>{const all=players.reduce((n,p)=>n+Object.values(p.counters||{}).reduce((a,b)=>a+Number(b||0),0),0);const correct=players.reduce((n,p)=>n+Number(p.counters?.correct||0),0);return all?Math.round(correct*100/all)+'%':'0%'})()}</strong></div>
          <div><small>EXPOSIÇÃO MÉDIA</small><strong>{room?.average_exposure||0}/100</strong></div>
          <div><small>OCULTAÇÕES</small><strong>{room?.ocultou_bens_count||0}</strong></div>
         </div>}
         <table className="data-table"><thead><tr><th>Jogador</th><th>Pontuação</th><th>Exposição</th><th>Rodada</th><th>Resposta</th></tr></thead>
          <tbody>{players.map(p=><tr key={p.player_id}><td>{p.nickname}</td><td>{p.score}</td><td>{p.exposure||0}/100</td><td>{p.current_round||'—'}</td><td>{p.answered_current?'Respondida':'Pendente'}</td></tr>)}</tbody>
         </table><p>Valores recebidos da sala e calculados a partir das escolhas registradas.</p>
         <button className="cinema-button secondary" onClick={()=>{const rows=[['Jogador','Pontos','Exposição','Rodada'],...players.map(p=>[p.nickname,p.score,p.exposure||0,p.current_round||0])];const blob=new Blob(['\ufeff'+rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='the-crimes-'+code+'-ranking.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);}}>EXPORTAR RANKING CSV</button>
        </div>}
       {modal==='cases'&&<div className="modal-scroll">
         {(()=>{const info=(admin?.room as unknown as {dossier?:{objective?:string;question?:string;evidence?:string[]}})?.dossier;return <div className="dossier-content">
          <h2>DOSSIÊ • {room?.case_title||'Caso atual'}</h2><p>{info?.objective||'Reconstrua os fatos e confronte documentos antes de concluir.'}</p>
          <h3>EVIDÊNCIAS-CHAVE</h3><ul>{(info?.evidence||[]).map((x,i)=><li key={i}>{x}</li>)}</ul>
          <h3>QUESTÃO JURÍDICA</h3><p>{info?.question||'Qual consequência jurídica é sustentada pelos fatos e pelas provas?'}</p>
          <p className="dossier-disclaimer">Material acadêmico fictício para análise jurídica, não um roteiro de fraude.</p>
         </div>})()}
         <h3 className="modal-extra-title">OUTROS CASOS DISPONÍVEIS</h3>
         <div className="modal-case-grid">{CASES.map((x,i)=><div key={x.key}><img src={caseCover(x.key)} alt=""/><span>CASO {i+1} · {x.title}</span></div>)}</div>
       </div>}
       {modal==='activity'&&<div className="modal-scroll">
         <p>Feed das ações da sala. As alternativas individuais dos estudantes não são expostas.</p>
         <div className="event-feed">{(admin?.events||[]).length?(admin?.events||[]).slice(-60).reverse().map((event,i)=>{
          const e=event as {event_type?:string;created_at?:string;payload?:{nickname?:string}};
          return <div key={i}><span>{(e.event_type||'Evento').replaceAll('_',' ')} {e.payload?.nickname||''}</span><time>{e.created_at?new Date(e.created_at).toLocaleTimeString('pt-BR'):'—'}</time></div>;
         }):<p>Nenhum evento registrado ainda.</p>}</div>
       </div>}
       {modal==='settings'&&<div className="modal-scroll">
         <p><b>Código:</b> {code}</p><p><b>Status:</b> {room?.status}</p>
         <p><b>Tempo por rodada:</b> {((admin?.room as unknown as {questionTimeSec?:number;question_time_sec?:number})?.questionTimeSec||(admin?.room as unknown as {question_time_sec?:number})?.question_time_sec||seconds)} segundos</p>
         <p><b>Entrada:</b> {room?.entry_open?'Aberta':'Fechada'}</p>
         <p><b>Política de correção:</b> {room?.correction_policy||'Definida no servidor'}</p>
         <p><b>Caso:</b> {room?.case_title}</p>
         <p>O Host é autenticado por token privado da sala, armazenado apenas neste navegador.</p>
       </div>}
       {modal==='lobby'?<div className="modal-scroll"><QRCodeSVG value={playerUrl(code)} size={180} fgColor="#061221" bgColor="white"/><p>Sala {code}</p><a href={playerUrl(code)} target="_blank" rel="noopener">Abrir entrada do jogador</a></div>:null}
     </motion.section>
   </motion.div>}</AnimatePresence>
 </CinematicShell>;
}

(function(){
'use strict';
const SUPABASE_URL='https://ouiqzhdhgughkspxqvnj.supabase.co';
const SUPABASE_KEY='sb_publishable_VO-RkaU9Pr8h8c6LV2IJdQ_eefoD-7h';
const FUNCTION_URL=SUPABASE_URL+'/functions/v1/the-crimes-live';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false}});
const qs=new URLSearchParams(location.search), view=qs.get('view')||'host', room=(qs.get('room')||'').toUpperCase();document.body.dataset.view=view;document.body.classList.add('v3-premium');
const cases=[['credores','Fraude contra credores'],['meacao','Ocultação de meação'],['herdeiros','Prejuízo a herdeiros'],['itbi','Operação de ITBI'],['alugueis','Receitas de aluguéis'],['grupos','Grupo societário']];
let selectedCase=qs.get('case')||'credores', state=null, publicRoom=null, publicPlayers=[], channel=null, playerChannel=null, presenceChannel=null, presenceIds=new Set(), presenceReady=false, poll=null, timer=null, lastRealtimeAt=Date.now(), realtimeHealthy=false, appliedRevision=-1, refreshSerial=0, lastRoundKey='';
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function money(v){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(Number(v||0))}
function playerStatusLabel(s){
 const m={
  waiting:'🟣 AGUARDANDO INÍCIO',
  answering:'🟡 RESPONDENDO',
  answered:'✅ RESPONDEU',
  revealed:'🔵 AG. PRÓXIMA',
  paused:'⏸ PAUSADO',
  no_answer:'⛔ SEM RESPOSTA',
  finished:'🏁 FINALIZADO',
  offline:'⚪ OFFLINE'
 };
 return m[s]||'—';
}
function ownPlayerStatus(r,old){
 if(r.status==='waiting')return 'waiting';
 if(r.status==='paused')return 'paused';
 if(r.status==='finished')return 'finished';
 if(r.revealed)return old?'revealed':'no_answer';
 if(r.locked)return old?'answered':'no_answer';
 if(!old&&roomClockLeft(r)<=0)return 'no_answer';
 return old?'answered':'answering';
}
function formatClock(total){
 const sec=Math.max(0,Number(total)||0),m=Math.floor(sec/60),s=sec%60;
 return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}
function exposureLabel(v){
 const n=Number(v||0);
 if(n<25)return 'BAIXA';
 if(n<50)return 'MODERADA';
 if(n<75)return 'ALTA';
 return 'CRÍTICA';
}
function clockLeft(start,seconds){
 if(!start)return Number(seconds||0);
 return Math.max(0,Number(seconds||0)-Math.floor((Date.now()-new Date(start).getTime())/1000));
}
function roomClockLeft(r){
 if(!r)return 0;
 const paused=r.status==='paused';
 const rem=Number(r.remainingMs ?? r.remaining_ms ?? 0);
 if(paused)return Math.ceil(rem/1000);
 const deadline=r.deadlineAt||r.deadline_at;
 if(deadline)return Math.max(0,Math.ceil((new Date(deadline).getTime()-Date.now())/1000));
 return clockLeft(r.roundStartedAt||r.round_started_at,r.questionTimeSec||r.question_time_sec||60);
}
function roomRevisionOf(r){return Number(r?.roomRevision ?? r?.room_revision ?? -1)}
function roundKeyOf(r){return String(r?.roundKey ?? r?.round_key ?? '')}
function requestId(prefix='req'){return prefix+'-'+crypto.randomUUID()}


function answerRevealSymbol(kind){return({correct:'🟢',gray:'🟡',risky:'🟠',criminal:'🔴'})[kind]||''}
function renderQr(el,text,size=240){if(!el||!window.QRCode)return;el.innerHTML='';new QRCode(el,{text,width:size,height:size,colorDark:'#000000',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M})}
const V3_ASSETS=window.TC_V3_ASSETS||{global:{},cases:{}};
function v3CaseAsset(k,type){const v=V3_ASSETS?.cases?.[k]?.[type];return v||null}
function v3GlobalAsset(type){return V3_ASSETS?.global?.[type]||null}
function scenePath(k,r){
 const legacyNames=['contexto','estrutura','operacao','efeito','conflito','apuracao','consequencias','debate'];
 const v3Names=['01_contexto','02_estrutura','03_instrumento','04_efeito','05_conflito','06_apuracao','07_consequencias','08_debate'];
 return V3_ASSETS?.cases?.[k]?.scenes?.[v3Names[r-1]]||('../assets/the-crimes/scenes/'+k+'/'+String(r).padStart(2,'0')+'_'+legacyNames[r-1]+'.webp')
}
function portraitPath(k){return v3CaseAsset(k,'portrait')||('../assets/the-crimes/portraits/'+k+'.webp')}
function coverPath(k){return v3CaseAsset(k,'cover')||portraitPath(k)}
function cityPath(){return v3GlobalAsset('city')||'../assets/the-crimes/city-banner.webp'}
function status(s){return({waiting:'AGUARDANDO INICIAR A PARTIDA...',running:'PARTIDA EM ANDAMENTO',paused:'PARTIDA PAUSADA',finished:'PARTIDA ENCERRADA'})[s]||s||'—'}
class GameApiError extends Error{constructor(message,payload,status){super(message);this.name='GameApiError';this.payload=payload;this.status=status}}
async function api(action,payload={}){
 const r=await fetch(FUNCTION_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},body:JSON.stringify({action,...payload})});
 let j={};try{j=await r.json()}catch{}
 if(!j.ok)throw new GameApiError(j.error||'Falha no servidor',j,r.status);
 return j;
}
function setOnline(ok=true){const el=document.getElementById('serverState')||document.getElementById('conn');if(el)el.textContent=ok?'● SUPABASE ONLINE':'● DESCONECTADO'}
async function loadPublic(code=room){
 const {data,error}=await sb.from('game_room_public').select('*').eq('code',code).maybeSingle();if(error)throw error;
 if(!data)return publicRoom;
 const incomingRev=Number(data.room_revision??-1),currentRev=(publicRoom&&publicRoom.code===data.code)?Number(publicRoom.room_revision??-1):-1;
 if(incomingRev<currentRev)return publicRoom;
 const p=await sb.from('game_player_public').select('*').eq('room_id',data.room_id).order('score',{ascending:false});if(p.error)throw p.error;
 const afterRev=(publicRoom&&publicRoom.code===data.code)?Number(publicRoom.room_revision??-1):-1;
 if(incomingRev<afterRev)return publicRoom;
 publicRoom=data;publicPlayers=p.data||[];return publicRoom
}
async function watchPublic(code,onChange){if(channel)await sb.removeChannel(channel);const r=await loadPublic(code);if(!r)return;const touch=()=>{lastRealtimeAt=Date.now();realtimeHealthy=true};channel=sb.channel('room-'+r.room_id).on('postgres_changes',{event:'*',schema:'public',table:'game_room_public',filter:'room_id=eq.'+r.room_id},async()=>{touch();await loadPublic(code);onChange()}).subscribe((s)=>{realtimeHealthy=s==='SUBSCRIBED';if(realtimeHealthy)lastRealtimeAt=Date.now()});if(playerChannel)await sb.removeChannel(playerChannel);playerChannel=sb.channel('players-'+r.room_id).on('postgres_changes',{event:'*',schema:'public',table:'game_player_public',filter:'room_id=eq.'+r.room_id},async()=>{touch();await loadPublic(code);onChange()}).subscribe((s)=>{if(s==='SUBSCRIBED'){realtimeHealthy=true;lastRealtimeAt=Date.now()}})}
async function watchPresence(code,onChange,trackPayload=null){
 if(presenceChannel)await sb.removeChannel(presenceChannel);
 presenceReady=false;presenceIds=new Set();
 const key=trackPayload?.playerId||('viewer-'+crypto.randomUUID());
 presenceChannel=sb.channel('presence-'+code,{config:{presence:{key}}})
  .on('presence',{event:'sync'},()=>{const st=presenceChannel.presenceState();const ids=[];Object.values(st).flat().forEach(x=>{if(x?.playerId)ids.push(x.playerId)});presenceIds=new Set(ids);presenceReady=true;onChange?.()})
  .subscribe(async s=>{if(s==='SUBSCRIBED'&&trackPayload)await presenceChannel.track({...trackPayload,online_at:new Date().toISOString()})});
}
function isPlayerOnline(p){return presenceReady?(presenceIds.has(p.id)&&p.connected!==false):!!p.connected}

function distValue(d,k){return Math.max(0,Number(d?.[k]||0))}
function distributionHtml(d){
 const total=distValue(d,'correct')+distValue(d,'gray')+distValue(d,'risky')+distValue(d,'criminal')||1;
 const row=(k,s,l)=>{const n=distValue(d,k),pct=Math.round(n*100/total);return '<div class="distRow '+k+'"><span>'+s+' '+l+'</span><div><i style="width:'+pct+'%"></i></div><strong>'+n+'</strong></div>'};
 return '<div class="distGrid">'+row('correct','🟢','Adequadas')+row('gray','🟡','Zona cinzenta')+row('risky','🟠','Alto risco')+row('criminal','🔴','Criminosas')+'</div>';
}
function base(){return '<div class="shell"><header class="top"><div class="brand">THE <em>CRIMES</em> LIVE<small>TRIVIAL JURÍDICO MULTIPLAYER</small></div><div id="serverState" class="server">● SUPABASE ONLINE</div></header><main id="main" class="container"></main></div>'}
document.getElementById('app').innerHTML=base();
if(view==='player')player();else if(view==='screen')screenView();else host();

function host(){
 const m=document.getElementById('main');
 let adminRefreshTimer=null;
 const scheduleAdminRefresh=()=>{clearTimeout(adminRefreshTimer);adminRefreshTimer=setTimeout(()=>refreshAdmin().catch(()=>{}),180)};
 m.innerHTML='<section id="setup" class="card setup"><div class="head"><div><span class="kicker">Criar partida online</span><h2>Escolha o crime da aula</h2></div></div><div class="inside"><div id="caseGrid" class="cases"></div><div class="grid grid3"><div class="field"><label>Máximo de players</label><input id="maxp" type="number" value="30"></div><div class="field"><label>Tempo por pergunta</label><input id="secs" type="number" value="60"></div><div class="field"><label>Servidor</label><div class="serverBadge">● V3 ONLINE · SÃO PAULO</div></div><div class="field" style="grid-column:1/-1"><label>Correção individual</label><select id="policy"><option value="immediate">Imediata no celular</option><option value="all_answered">Quando todos responderem</option><option value="host_reveal" selected>Somente após o Host revelar</option></select></div></div><div style="text-align:right;margin-top:14px"><button id="create" class="btn gold">CRIAR SALA ONLINE</button></div><p id="err" class="muted"></p></div></section><section id="dash" class="admin hidden"><aside class="card"><div id="hostPanel" class="host"><span class="kicker">Sala ativa</span><div id="code" class="code"></div><div id="rstatus" class="waiting"></div><div id="qr" class="qr-local"></div><div id="joinurl" class="muted" style="font-size:10px;word-break:break-all"></div><div class="controls"><button id="screenBtn" class="btn wide">ABRIR TELÃO</button><button id="entry" class="btn wide">🔓 ENTRADA ABERTA</button><button id="dossierBtn" class="btn">🗂 DOSSIÊ</button><button id="activityBtn" class="btn">◉ ATIVIDADE</button><button id="start" class="btn gold wide">▶ INICIAR PARTIDA</button><button id="pause" class="btn">⏸ PAUSAR</button><button id="resume" class="btn gold wide">▶ CONTINUAR</button><button id="lock" class="btn">🔒 BLOQUEAR</button><button id="reveal" class="btn green">✓ REVELAR</button><button id="next" class="btn gold wide">PRÓXIMA RODADA →</button><button id="finish" class="btn red wide">ENCERRAR PARTIDA</button><button id="reset" class="btn wide">↻ RESETAR SALA</button></div></div></aside><div><div id="roundBar" class="roundBar hidden"></div><div id="metrics" class="metrics"></div><section class="card"><div class="head"><div><span class="kicker">Monitor em tempo real</span><h3>Players</h3></div><strong id="pc"></strong></div><div class="tablewrap"><table class="players"><thead><tr><th>Player</th><th>Status</th><th>Rodada</th><th>Pontos</th><th>Perfil</th><th>Exposição</th></tr></thead><tbody id="pb"></tbody></table></div></section></div></section><div id="v3Modal" class="v3Modal hidden"><div class="v3ModalCard"><button id="v3ModalClose" class="v3ModalClose" type="button">×</button><div id="v3ModalBody"></div></div></div>';
 renderCases();
 function closeV3Modal(){document.getElementById('v3Modal')?.classList.add('hidden')}
 function openV3Modal(kind){
   const modal=document.getElementById('v3Modal'),body=document.getElementById('v3ModalBody');if(!modal||!body||!state)return;
   if(kind==='dossier'){
     const d=state.room?.dossier||{};const ev=(d.evidence||[]).map(x=>'<li>'+esc(x)+'</li>').join('');
     body.innerHTML='<span class="kicker">SALA DE PROVAS</span><h2>Dossiê · '+esc(state.room?.caseTitle||state.caseTitle||'Caso')+'</h2><div class="dossierLead">'+esc(d.objective||'Reconstrua os fatos e confronte a documentação antes de concluir.')+'</div><div class="dossierGrid"><section><small>EVIDÊNCIAS-CHAVE</small><ul>'+ev+'</ul></section><section><small>QUESTÃO JURÍDICA</small><p>'+esc(d.question||'Qual é a consequência juridicamente sustentada pelos fatos e provas?')+'</p></section></div><div class="dossierNote">Material ficcional para análise acadêmica. O objetivo é identificar fatos, requisitos e provas — não ensinar ocultação ou fraude.</div>';
   }else{
     const players=new Map((state.players||[]).map(p=>[p.id,p.nickname]));
     const label=e=>{const t=e.event_type||'';if(t==='player_joined')return '🟢 '+esc(e.payload?.nickname||players.get(e.player_id)||'Jogador')+' entrou';if(t==='answer_submitted')return '✅ '+esc(players.get(e.player_id)||'Jogador')+' respondeu';if(t==='admin_reveal')return '👁 Resposta revelada';if(t==='admin_next')return '➡ Rodada avançada';if(t==='admin_start')return '▶ Partida iniciada';if(t==='admin_pause')return '⏸ Partida pausada';if(t==='admin_resume')return '▶ Partida retomada';if(t==='admin_finish')return '🏁 Partida encerrada';if(t==='room_created')return '◉ Sala criada';return '• '+esc(t.replace('admin_','').replaceAll('_',' '))};
     const rows=(state.events||[]).map(e=>'<div class="eventRow"><span>'+label(e)+'</span><time>'+new Date(e.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})+'</time></div>').join('');
     body.innerHTML='<span class="kicker">FEED DA PARTIDA</span><h2>Atividade recente</h2><div class="eventFeed">'+(rows||'<div class="eventEmpty">Nenhum evento registrado ainda.</div>')+'</div><div class="dossierNote">O feed mostra presença e andamento. A alternativa escolhida por cada aluno não é exibida.</div>';
   }
   modal.classList.remove('hidden')
 }
 document.getElementById('v3ModalClose').onclick=closeV3Modal;
 document.getElementById('v3Modal').onclick=e=>{if(e.target.id==='v3Modal')closeV3Modal()};
 document.getElementById('dossierBtn').onclick=()=>openV3Modal('dossier');
 document.getElementById('activityBtn').onclick=()=>openV3Modal('activity');
 document.getElementById('create').onclick=async()=>{try{const r=await api('createRoom',{caseKey:selectedCase,maxPlayers:+document.getElementById('maxp').value,questionTimeSec:+document.getElementById('secs').value,correctionPolicy:document.getElementById('policy').value});state={code:r.code,adminToken:r.adminToken,caseKey:r.caseKey,caseTitle:r.caseTitle};localStorage.setItem('tc-admin-'+r.code,r.adminToken);document.getElementById('setup').classList.add('hidden');document.getElementById('dash').classList.remove('hidden');await watchPublic(r.code,scheduleAdminRefresh);await watchPresence(r.code,scheduleAdminRefresh);await refreshAdmin();clearInterval(poll);poll=setInterval(()=>syncAdminFromPublic().catch(()=>setOnline(false)),3000)}catch(x){document.getElementById('err').textContent=x.message}};
 function renderCases(){const g=document.getElementById('caseGrid');g.innerHTML='';cases.forEach((c,i)=>{const b=document.createElement('button');b.className='case'+(selectedCase===c[0]?' active':'');b.innerHTML='<img src="'+coverPath(c[0])+'"><span><small>CASO '+String(i+1).padStart(2,'0')+'</small><strong>'+esc(c[1])+'</strong></span>';b.onclick=()=>{selectedCase=c[0];renderCases()};g.appendChild(b)})}
 async function refreshAdmin(){if(!state)return;const r=await api('adminState',{code:state.code,adminToken:state.adminToken});const rev=roomRevisionOf(r.room);if(rev>=appliedRevision){appliedRevision=rev;state={...state,...r}}await loadPublic(state.code);renderAdmin()}
 async function syncAdminFromPublic(){
  if(!state)return;
  const pub=await loadPublic(state.code);
  renderAdmin();
  const publicRev=Number(pub?.room_revision??-1),privateRev=roomRevisionOf(state?.room);
  if(publicRev>privateRev)await refreshAdmin();
 }
 async function cmd(a,extra={}){
 try{
  const rev=Math.max(roomRevisionOf(state?.room),Number(publicRoom?.room_revision??-1));
  await api(a,{code:state.code,adminToken:state.adminToken,expectedRevision:rev,requestId:requestId('host-'+a),...extra});
 }catch(x){
  if(x?.payload?.stale){await refreshAdmin();return}
  throw x;
 }
 await refreshAdmin()
}
 [['start','start'],['pause','pause'],['resume','resume'],['lock','lock'],['reveal','reveal']].forEach(([id,a])=>document.getElementById(id).onclick=()=>cmd(a).catch(x=>alert(x.message)));
 document.getElementById('next').onclick=()=>{const missing=Math.max(0,(publicRoom?.players_total||0)-(publicRoom?.responded||0));const msg=missing>0?'Há '+missing+' jogador(es) sem responder. Pular para a próxima rodada?':(!publicRoom?.revealed?'Avançar sem revelar a resposta desta rodada?':'Ir para a próxima rodada?');if(confirm(msg))cmd('next').catch(x=>alert(x.message))};
 document.getElementById('entry').onclick=()=>cmd('toggleEntry').catch(x=>alert(x.message));
 document.getElementById('finish').onclick=()=>{if(confirm('FINALIZAR PARTIDA para todos os jogadores? Todos serão enviados ao resultado final.'))cmd('finish').catch(x=>alert(x.message))};
 document.getElementById('reset').onclick=()=>{if(confirm('Resetar respostas, score e estado patrimonial desta sala? Os jogadores permanecerão conectados.'))cmd('reset').catch(x=>alert(x.message))};
 document.getElementById('screenBtn').onclick=()=>window.open(location.pathname+'?view=screen&room='+encodeURIComponent(state.code),'the-crimes-screen');
 function renderAdmin(){
  if(!publicRoom||!state.players)return;
  const onlineCount=presenceReady?presenceIds.size:publicRoom.players_connected;
  const join=location.origin+location.pathname+'?view=player&room='+encodeURIComponent(publicRoom.code);
  document.getElementById('code').textContent=publicRoom.code;
  document.getElementById('rstatus').textContent=status(publicRoom.status);
  document.getElementById('joinurl').textContent=join;
  const hostPanel=document.getElementById('hostPanel');hostPanel.classList.toggle('in-game',publicRoom.status!=='waiting');
  const qr=document.getElementById('qr');if(qr.dataset.url!==join){renderQr(qr,join,240);qr.dataset.url=join}
  document.getElementById('pc').textContent=onlineCount+' online';
  document.getElementById('metrics').innerHTML=[['Players',publicRoom.players_total],['Respondidos',publicRoom.responded+'/'+publicRoom.players_total],['Exposição média',exposureLabel(publicRoom.average_exposure)+' · '+publicRoom.average_exposure+'/100'],['Ocultou bens',publicRoom.ocultou_bens_count],['Descobertas',publicRoom.ocultacao_descoberta_count]].map(x=>'<div class="metric"><small>'+x[0]+'</small><strong>'+x[1]+'</strong></div>').join('');
  const rb=document.getElementById('roundBar');
  if(publicRoom.status==='waiting'||publicRoom.status==='finished'){rb.classList.add('hidden');clearInterval(timer)}else{rb.classList.remove('hidden');const missing=Math.max(0,publicRoom.players_total-publicRoom.responded);rb.innerHTML='<div><span class="kicker">RODADA ATUAL</span><strong>'+publicRoom.current_round+'/8 · '+esc(publicRoom.case_title)+'</strong></div><div class="progressText">'+publicRoom.responded+'/'+publicRoom.players_total+' responderam'+(missing?' · '+missing+' faltam':' · todos responderam')+'</div><strong id="hostClock" class="roundClock"></strong>';clearInterval(timer);const tickHost=()=>{const el=document.getElementById('hostClock');if(!el)return;const left=publicRoom.status==='paused'?null:roomClockLeft(publicRoom);el.textContent=publicRoom.status==='paused'?'PAUSADO':(publicRoom.revealed?'REVELADO':publicRoom.locked?'BLOQUEADO':formatClock(left));el.classList.toggle('urgent',left!==null&&left<=10&&left>0&&!publicRoom.locked&&!publicRoom.revealed)};tickHost();timer=setInterval(tickHost,500)}
  const entry=document.getElementById('entry');entry.textContent=publicRoom.entry_open?'🔓 ENTRADA ABERTA · FECHAR':'🔒 ENTRADA FECHADA · ABRIR';entry.className='btn wide '+(publicRoom.entry_open?'green':'red');
  const vis=(id,on)=>document.getElementById(id).classList.toggle('hidden',!on);
  const s=publicRoom.status, revealed=publicRoom.revealed, locked=publicRoom.locked;
  vis('screenBtn',true);vis('dossierBtn',true);vis('activityBtn',true);vis('entry',s!=='finished');vis('start',s==='waiting');vis('pause',s==='running'&&!revealed);vis('resume',s==='paused');vis('lock',s==='running'&&!locked&&!revealed);vis('reveal',s==='running'&&!revealed);vis('next',s==='running'||revealed);vis('finish',s==='running'||s==='paused');vis('reset',s==='waiting'||s==='finished');
  const next=document.getElementById('next');if(s==='running'){const missing=Math.max(0,publicRoom.players_total-publicRoom.responded);next.textContent=missing?'PULAR / PRÓXIMA →':'PRÓXIMA RODADA →'}
  document.getElementById('pb').innerHTML=state.players.map(p=>{const online=isPlayerOnline(p);const stat=online?playerStatusLabel(p.player_status):'⚪ OFFLINE';const profile=p.ocultou_bens?('🔴 Ocultou'+(p.ocultacao_descoberta?' · 🔎 descoberta':'')):'🟢 Regular';const decisions='🟢 '+(p.counters?.correct||0)+' · 🔴 '+(p.counters?.criminal||0)+' · 🟡 '+(p.counters?.gray||0)+' · 🟠 '+(p.counters?.risky||0);return '<tr><td class="playerCell"><strong>'+esc(p.nickname)+'</strong><small>'+(online?'🟢 online':'⚪ offline')+' · '+decisions+'</small></td><td><span class="pstatus '+(online?esc(p.player_status||'waiting'):'offline')+'">'+stat+'</span></td><td>'+p.current_round+'/8</td><td><strong>'+p.score+'</strong></td><td><span class="profileBadge">'+profile+'</span></td><td>'+exposureLabel(p.exposure)+' · '+p.exposure+'/100</td></tr>'}).join('');
 }
}
function startPoll(fn){clearInterval(poll);poll=setInterval(()=>fn().catch(()=>setOnline(false)),10000)}

async function player(){
 document.getElementById('app').innerHTML='<div class="playerShell"><header class="playerTop"><div class="brand" style="font-size:22px">THE <em>CRIMES</em> LIVE</div><span id="conn" class="server">● SUPABASE ONLINE</span></header><main id="pmain"></main></div>';
 const p=document.getElementById('pmain'), key='tc-player-'+room;let sess=JSON.parse(localStorage.getItem(key)||'null');const corrections={};
 const markOffline=()=>{if(!sess?.sessionToken)return;fetch(FUNCTION_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},body:JSON.stringify({action:'playerOffline',code:room,sessionToken:sess.sessionToken}),keepalive:true}).catch(()=>{})};
 window.addEventListener('pagehide',markOffline,{once:true});
 async function refresh(reason='sync'){
 if(!sess)return;
 const seq=++refreshSerial;
 const r=await api('playerState',{code:room,sessionToken:sess.sessionToken});
 if(seq!==refreshSerial)return;
 const rev=roomRevisionOf(r.room);
 if(rev<appliedRevision)return;
 const prevKey=state?.room?roundKeyOf(state.room):'';
 appliedRevision=rev;state=r;
 const nextKey=roundKeyOf(r.room);
 if(prevKey&&nextKey&&prevKey!==nextKey)showPlayerNotice('O professor avançou para a rodada '+r.room.currentRound+'/8.');
 lastRoundKey=nextKey;render();setOnline(true)
}
 async function join(nick){const r=await api('join',{code:room,nickname:nick,sessionToken:sess?.sessionToken});sess={sessionToken:r.sessionToken,playerId:r.playerId,nickname:nick};localStorage.setItem(key,JSON.stringify(sess));await watchPublic(room,()=>refresh('realtime').catch(()=>{}));await watchPresence(room,()=>{}, {playerId:r.playerId,nickname:nick});await refresh('join');startPoll(()=>refresh('poll'))}
 function showPlayerNotice(msg){let n=document.getElementById('playerNotice');if(!n){n=document.createElement('div');n.id='playerNotice';n.className='playerNotice';document.body.appendChild(n)}n.textContent=msg;n.classList.add('show');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('show'),2600)}
 function showJoin(err=''){p.innerHTML='<section class="view"><div class="card joinCard"><span class="kicker">Entrar na partida</span><h1>Sala '+esc(room)+'</h1><div class="field"><label>Seu apelido</label><input id="nick" maxlength="24"></div><button id="join" class="btn gold">ENTRAR</button><p class="muted">'+esc(err)+'</p></div></section>';document.getElementById('join').onclick=()=>join(document.getElementById('nick').value.trim()).catch(x=>showJoin(x.message))}
 function decorateCorrection(q,r){
   const corr=document.getElementById('playerCorrection');if(!corr)return;
   const correctionKey=roundKeyOf(r)||q.id, own=corrections[correctionKey];
   if(own){const letter=String.fromCharCode(65+own.correctIndex);corr.innerHTML='<div class="playerCorrection"><strong>✅ RESPOSTA CORRETA: '+letter+'</strong><br>'+esc(own.correctText)+(own.explanation?'<details class="whyCard"><summary>POR QUE ESSA?</summary><p>'+esc(own.explanation)+'</p></details>':'')+'</div>';return}
   if(r.revealed&&q.correctIndex!==undefined){const letter=String.fromCharCode(65+q.correctIndex);const correct=q.options[q.correctIndex];corr.innerHTML='<div class="playerCorrection"><strong>✅ RESPOSTA CORRETA: '+letter+'</strong><br>'+esc(correct.text)+(q.explanation?'<details class="whyCard"><summary>POR QUE ESSA?</summary><p>'+esc(q.explanation)+'</p></details>':'')+'</div>';return}
   if(r.correctionPolicy==='host_reveal'){
     corr.innerHTML='<div class="playerCorrection locked"><strong>👁 CORREÇÃO BLOQUEADA</strong><br>Aguarde o professor revelar a resposta no telão.</div>';return
   }
   if(r.correctionPolicy==='all_answered'&&!r.revealed&&Number(publicRoom?.responded||0)<Number(publicRoom?.players_total||0)){
     const faltam=Math.max(0,Number(publicRoom?.players_total||0)-Number(publicRoom?.responded||0));
     corr.innerHTML='<div class="playerCorrection locked"><strong>⏳ AGUARDANDO A TURMA</strong><br>Faltam '+faltam+' jogador(es) responderem.</div>';return
   }
   corr.innerHTML='<button id="showCorrectBtn" class="playerRevealBtn" type="button">MOSTRAR RESPOSTA CORRETA</button>';
   const btn=document.getElementById('showCorrectBtn');if(btn)btn.onclick=async()=>{try{const x=await api('showCorrect',{code:room,sessionToken:sess.sessionToken,questionId:q.id,roundKey:roundKeyOf(r)});corrections[correctionKey]=x;render()}catch(err){if(err?.status===409){showPlayerNotice(err.message);await refresh('correction-policy')}else alert(err.message)}};
 }

 if(sess){try{await watchPublic(room,()=>refresh('realtime').catch(()=>{}));await watchPresence(room,()=>{}, {playerId:sess.playerId,nickname:sess.nickname});await refresh('restore');startPoll(()=>refresh('poll'))}catch{localStorage.removeItem(key);sess=null;showJoin()}}else showJoin();
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh('visibility').catch(()=>{})});
 window.addEventListener('focus',()=>refresh('focus').catch(()=>{}));
 window.addEventListener('online',()=>refresh('online').catch(()=>{}));
 function render(){const r=state.room,pl=state.player;if(r.status==='waiting'){p.innerHTML='<section class="view center"><img class="art" src="'+cityPath()+'"><span class="kicker">'+esc(r.caseTitle)+'</span><h1 style="color:var(--gold2)">AGUARDANDO INICIAR A PARTIDA...</h1><div class="spinner"></div><p>🟢 Conectado ao Supabase</p><p class="muted">'+(presenceReady?presenceIds.size:(publicRoom?.players_connected||1))+' jogadores conectados</p></section>';return}if(r.status==='finished'){const fr=pl.final_result||{},pub=publicPlayers.find(x=>x.player_id===pl.id)||{},c=pl.counters||{},answered=Number(c.correct||0)+Number(c.criminal||0)+Number(c.gray||0)+Number(c.risky||0),total=answered+Number(c.unanswered||0),pct=total?Math.round(Number(c.correct||0)*100/total):0,rank=pub.rank||'—';p.innerHTML='<section class="view"><span class="kicker">PARTIDA ENCERRADA PELO HOST</span><h1 style="text-align:center;margin:5px 0">'+esc(pl.nickname)+'</h1><div class="finalScore">'+pl.score+' pts</div><div class="finalSummary"><div class="metric"><small>Posição</small><strong>#'+rank+'</strong></div><div class="metric"><small>Rodadas jogadas</small><strong>'+total+'/8</strong></div><div class="metric"><small>Acerto nas resp.</small><strong>'+pct+'%</strong></div><div class="metric"><small>Exposição</small><strong>'+exposureLabel(pl.exposure)+' · '+pl.exposure+'/100</strong></div></div><div class="finalResult"><strong>'+esc(fr.resultLabel||'Resultado final')+'</strong><p>'+(pl.ocultou_bens?'🔴':'🟢')+' OCULTOU BENS: <b>'+(pl.ocultou_bens?'SIM':'NÃO')+'</b> · '+(pl.ocultacao_descoberta?'🔎':'⚪')+' DESCOBERTA: <b>'+(pl.ocultacao_descoberta?'SIM':'NÃO')+'</b></p><p>💰 PATRIMÔNIO BLOQUEADO: <b>'+money(pl.patrimonio_bloqueado)+'</b></p></div><div class="finalDecisionGrid"><div class="finalDecision"><small>🟢 Corretas</small><strong>'+(c.correct||0)+'</strong></div><div class="finalDecision"><small>🔴 Criminosas</small><strong>'+(c.criminal||0)+'</strong></div><div class="finalDecision"><small>🟡 Cinzenta</small><strong>'+(c.gray||0)+'</strong></div><div class="finalDecision"><small>🟠 Risco</small><strong>'+(c.risky||0)+'</strong></div><div class="finalDecision"><small>⚪ Sem resp.</small><strong>'+(c.unanswered||0)+'</strong></div></div></section>';return}const q=r.question;if(!q)return;const old=(pl.answers||[]).find(a=>a.round_key===roundKeyOf(r))||(pl.answers||[]).find(a=>a.question_id===q.id&&(!a.round_key||a.round_key===''));p.innerHTML='<section class="view"><div class="scene"><img src="'+scenePath(r.caseKey,q.round)+'"><div class="sceneMeta"><small>'+esc(q.caseTitle).toUpperCase()+'</small><strong>RODADA '+String(q.round).padStart(2,'0')+' DE 08</strong></div></div><div class="qhead"><span class="kicker">QUESTÃO '+q.round+'/8</span><strong id="tm" class="timer">00:--</strong></div><h1 class="qtext">'+esc(q.text)+'</h1><div id="ans" class="answers"></div><div id="ast" class="ansStatus hidden"></div><div id="playerCorrection"></div><div class="metrics playerMetrics" style="grid-template-columns:repeat(3,1fr);margin-top:12px"><div class="metric"><small>Pontos</small><strong>'+pl.score+'</strong></div><div class="metric"><small>Exposição</small><strong>'+exposureLabel(pl.exposure)+' · '+pl.exposure+'/100</strong></div><div class="metric"><small>Ocultou bens</small><strong>'+(pl.ocultou_bens?'🔴 SIM':'🟢 NÃO')+'</strong></div></div><div class="ansStatus playerStatusBar" style="margin-top:10px"><strong>Status:</strong> '+playerStatusLabel(ownPlayerStatus(r,old))+'</div></section>';const a=document.getElementById('ans');q.options.forEach(o=>{const b=document.createElement('button');b.className='answer'+(old&&old.option_index===o.index?' sel':'');b.disabled=!!old||r.locked||r.status!=='running';b.innerHTML='<span class="letter">'+String.fromCharCode(65+o.index)+'</span><span>'+esc(o.text)+'</span>';b.onclick=async()=>{try{await api('answer',{code:room,sessionToken:sess.sessionToken,questionId:q.id,roundKey:roundKeyOf(r),requestId:requestId('answer'),optionIndex:o.index});await refresh('answer')}catch(x){if(x?.payload?.stale){showPlayerNotice(x.message);await refresh('stale-answer')}else alert(x.message)}};a.appendChild(b)});if(old){const z=document.getElementById('ast'),meta={correct:'🟢 JURIDICAMENTE ADEQUADA',criminal:'🔴 ATITUDE CRIMINOSA NO CENÁRIO',gray:'🟡 ZONA CINZENTA',risky:'🟠 ALTO RISCO JURÍDICO'}[old.classification]||'RESPOSTA SALVA';z.classList.remove('hidden');z.textContent=meta+' · Resposta salva.';decorateCorrection(q,r)}clearInterval(timer);const t=document.getElementById('tm');if(old){if(t)t.textContent='✓ '+(Number(old.response_time_ms||0)/1000).toFixed(1)+'s'}else{const tick=()=>{const tm=document.getElementById('tm');if(!tm)return;const left=roomClockLeft(r);tm.textContent=left>0?formatClock(left):'TEMPO ESGOTADO';if(left<=0){document.querySelectorAll('.answer').forEach(x=>x.disabled=true);const sb=document.querySelector('.playerStatusBar');if(sb)sb.innerHTML='<strong>Status:</strong> ⛔ SEM RESPOSTA';const z=document.getElementById('ast');if(z&&!old){z.classList.remove('hidden');z.textContent='⛔ TEMPO ESGOTADO · resposta não registrada.'}clearInterval(timer)}};tick();timer=setInterval(tick,500)}}
}

async function screenView(){
 const screenAdminToken=localStorage.getItem('tc-admin-'+room)||'';
 document.getElementById('app').innerHTML='<div class="screen"><header class="top"><div class="brand">THE <em>CRIMES</em> LIVE<small>TELÃO DA PARTIDA</small></div><div id="serverState" class="server">● SUPABASE REALTIME</div></header><main class="screenMain"><section class="stage"><img id="sbg" src="'+cityPath()+'"><div id="scopy" class="stageCopy"></div></section><aside class="screenSide card"><div class="head"><div><span class="kicker">PLACAR AO VIVO</span><h3>Ranking</h3></div><strong id="online"></strong></div><div class="rankHead"><span>#</span><span>Jogador</span><span style="text-align:right">Pts</span><span>Status</span><span>Perfil</span></div><div id="rank"></div></aside></main><footer class="footer"><strong id="froom"></strong><span id="fcase"></span><div id="screenNext" class="screenNext"><span id="screenNextHint" class="screenNextHint"></span><button id="screenRevealBtn" class="screenRevealBtn" type="button">👁 REVELAR RESPOSTA</button><button id="screenNextBtn" class="screenNextBtn" type="button">PRÓXIMA PERGUNTA →</button></div><span>SUPABASE REALTIME · ONLINE</span></footer></div>';
 async function refresh(){await loadPublic(room);render()}
 await watchPublic(room,()=>refresh().catch(()=>{}));await watchPresence(room,render);await refresh();startPoll(refresh);
 const nextBtn=document.getElementById('screenNextBtn'), revealBtn=document.getElementById('screenRevealBtn');
 if(screenAdminToken&&nextBtn){
   if(revealBtn)revealBtn.addEventListener('click',async()=>{
     if(!publicRoom||publicRoom.status!=='running'||publicRoom.revealed)return;
     revealBtn.disabled=true;
     try{await api('reveal',{code:room,adminToken:screenAdminToken,expectedRevision:Number(publicRoom.room_revision||0),requestId:requestId('screen-reveal')});await refresh()}
     catch(x){if(x?.payload?.stale)await refresh();else alert(x.message)}
     finally{revealBtn.disabled=false}
   });
   nextBtn.addEventListener('click',async()=>{
     if(!publicRoom||publicRoom.status==='finished')return;
     const finalRound=publicRoom.current_round>=8;
     const missing=Math.max(0,(publicRoom.players_total||0)-(publicRoom.responded||0));
     if(finalRound){
       if(!confirm('Encerrar a partida para todos os jogadores agora?'))return;
     }else if(!publicRoom.revealed||missing>0){
       const msg=missing>0?'Há '+missing+' jogador(es) sem responder. Avançar mesmo assim?':'Avançar sem revelar a resposta desta rodada?';
       if(!confirm(msg))return;
     }
     nextBtn.disabled=true;
     try{
       if(finalRound) await api('finish',{code:room,adminToken:screenAdminToken,expectedRevision:Number(publicRoom.room_revision||0),requestId:requestId('screen-finish')});
       else await api('next',{code:room,adminToken:screenAdminToken,expectedRevision:Number(publicRoom.room_revision||0),requestId:requestId('screen-next')});
       await refresh();
     }catch(x){alert(x.message)}
   });
 }
 function render(){if(!publicRoom)return;document.getElementById('froom').textContent='Sala '+publicRoom.code+' ·';document.getElementById('fcase').textContent=publicRoom.case_title;document.getElementById('online').textContent=(presenceReady?presenceIds.size:publicRoom.players_connected)+' online';const nav=document.getElementById('screenNext'),navBtn=document.getElementById('screenNextBtn'),navReveal=document.getElementById('screenRevealBtn'),navHint=document.getElementById('screenNextHint');if(nav){nav.classList.toggle('visible',!!screenAdminToken);if(navReveal){navReveal.classList.toggle('hidden',!screenAdminToken||publicRoom.status!=='running'||publicRoom.revealed);navReveal.disabled=publicRoom.locked||publicRoom.revealed;}if(navBtn){const finalRound=publicRoom.current_round>=8;const missing=Math.max(0,(publicRoom.players_total||0)-(publicRoom.responded||0));navBtn.textContent=finalRound?'ENCERRAR PARTIDA':(missing>0?'PULAR / PRÓXIMA →':'PRÓXIMA PERGUNTA →');navBtn.disabled=publicRoom.status==='finished'||publicRoom.status==='waiting';navBtn.classList.toggle('ready',publicRoom.status==='running');}if(navHint){const missing=Math.max(0,(publicRoom.players_total||0)-(publicRoom.responded||0));navHint.textContent=publicRoom.status==='finished'?'PARTIDA FINALIZADA':(publicRoom.revealed?(publicRoom.current_round>=8?'ÚLTIMA RODADA':'RESULTADO REVELADO'):(missing>0?missing+' SEM RESPONDER':'PODE AVANÇAR OU REVELAR'));}}const rankBox=document.getElementById('rank');if(publicPlayers.length){const visibleRank=publicPlayers.slice(0,10),extraRank=Math.max(0,publicPlayers.length-visibleRank.length);rankBox.innerHTML=visibleRank.map((p,i)=>{const pos=p.rank||i+1;const cls=pos===1?' top1':pos===2?' top2':pos===3?' top3':'';const medal=pos===1?'🥇':pos===2?'🥈':pos===3?'🥉':String(pos);const online=presenceReady?presenceIds.has(p.player_id):p.connected;const ps=online?playerStatusLabel(p.player_status):'⚪ OFFLINE';return '<div class="rank'+cls+'"><span class="rankPos">'+medal+'</span><strong class="rankName">'+esc(p.nickname)+'</strong><span class="rankScore">'+p.score+'</span><span class="pstatus rankState '+(online?esc(p.player_status||'waiting'):'offline')+'">'+ps+'</span><span>'+(p.ocultou_bens?'🔴 Ocultou':'🟢 Regular')+'</span></div>'}).join('')+(extraRank?'<div class="rankEmpty"><strong>+'+extraRank+' JOGADORES</strong><br>Ranking completo disponível no Host.</div>':'')}else{rankBox.innerHTML='<div class="rankEmpty"><strong>NENHUM JOGADOR AINDA</strong><br>Os alunos aparecerão aqui assim que entrarem pelo QR Code.</div>'};if(publicRoom.status==='waiting'){const join=location.origin+location.pathname+'?view=player&room='+encodeURIComponent(publicRoom.code);document.getElementById('sbg').src=cityPath();document.getElementById('scopy').innerHTML='<span class="kicker">'+esc(publicRoom.case_title)+'</span><h1>AGUARDANDO INICIAR A PARTIDA...</h1><p>'+(presenceReady?presenceIds.size:publicRoom.players_connected)+' jogadores conectados</p><div id="screenQr" class="qr-local" style="margin:12px 0"></div><p>Escaneie para entrar na sala <strong>'+publicRoom.code+'</strong></p>';renderQr(document.getElementById('screenQr'),join,240);return}if(publicRoom.status==='finished'){document.getElementById('sbg').src=cityPath();const top=publicPlayers.slice(0,3),pod=(pos,cls,medal)=>{const x=top[pos];return x?'<div class="podiumCard '+cls+'"><span class="podiumMedal">'+medal+'</span><span class="podiumName">'+esc(x.nickname)+'</span><span class="podiumScore">'+x.score+' pts</span><small>'+((x.counters?.correct||0))+' corretas · '+(x.ocultou_bens?'🔴 ocultou':'🟢 regular')+'</small></div>':'<div class="podiumCard '+cls+'"><span class="podiumMedal">'+medal+'</span><span class="podiumName">—</span></div>'};const totals=publicPlayers.reduce((a,p)=>{a.correct+=Number(p.counters?.correct||0);a.criminal+=Number(p.counters?.criminal||0);a.gray+=Number(p.counters?.gray||0);a.risky+=Number(p.counters?.risky||0);a.unanswered+=Number(p.counters?.unanswered||0);return a},{correct:0,criminal:0,gray:0,risky:0,unanswered:0});const decisions=totals.correct+totals.criminal+totals.gray+totals.risky+totals.unanswered,hit=decisions?Math.round(totals.correct*100/decisions):0;document.getElementById('scopy').innerHTML='<span class="kicker">RESULTADO FINAL · '+esc(publicRoom.case_title)+'</span><h1 style="margin-bottom:8px">PÓDIO DA TURMA</h1><div class="finalPodium">'+pod(1,'second','🥈')+pod(0,'first','🥇')+pod(2,'third','🥉')+'</div><div class="finalClassStats"><div class="finalClassStat"><small>Acertos da turma</small><strong>🟢 '+hit+'%</strong></div><div class="finalClassStat"><small>Escolhas criminosas</small><strong>🔴 '+totals.criminal+'</strong></div><div class="finalClassStat"><small>Ocultaram bens</small><strong>'+publicRoom.ocultou_bens_count+'</strong></div><div class="finalClassStat"><small>Ocultações descobertas</small><strong>🔎 '+publicRoom.ocultacao_descoberta_count+'</strong></div></div>';return}const q=publicRoom.question;document.getElementById('sbg').src=scenePath(publicRoom.case_key,q.round);const opts=(q.options||[]).map((o,i)=>'<div class="screenOption '+(publicRoom.revealed&&o.kind?'revealed '+esc(o.kind):'')+'"><span class="screenOptionLetter">'+String.fromCharCode(65+i)+'</span><span class="screenOptionText">'+esc(o.text)+'</span><span class="screenOptionMark">'+(publicRoom.revealed?answerRevealSymbol(o.kind):'')+'</span></div>').join('');const answeredNow=publicPlayers.filter(p=>p.answered_current),visibleAnswered=answeredNow.slice(0,8),extraAnswered=Math.max(0,answeredNow.length-visibleAnswered.length);const feed=answeredNow.length?'<div class="respondedFeed"><strong>✅ RESPOSTAS RECEBIDAS ('+answeredNow.length+')</strong><div class="respondedNames">'+visibleAnswered.map(p=>'<span class="respondedChip">'+esc(p.nickname)+'</span>').join('')+(extraAnswered?'<span class="respondedChip">+'+extraAnswered+' responderam</span>':'')+'</div></div>':'<div class="respondedFeed"><strong>AGUARDANDO RESPOSTAS...</strong></div>';const insight=publicRoom.revealed?'<div class="revealInsight"><div><span class="kicker">POR QUE ESSA?</span><p>'+esc(q.explanation||'A resposta adequada é a que melhor integra fatos, prova e requisitos jurídicos do cenário.')+'</p></div>'+distributionHtml(publicRoom.answer_distribution)+'</div>':feed;document.getElementById('scopy').innerHTML='<div class="screenRoundHead"><span class="kicker">RODADA '+String(q.round).padStart(2,'0')+' DE 08</span><strong id="screenClock" class="screenClock"></strong></div><h1>'+esc(q.text)+'</h1><div class="screenOptions">'+opts+'</div><p>'+publicRoom.responded+'/'+publicRoom.players_total+' jogadores responderam</p>'+insight;clearInterval(timer);const tickScreen=()=>{const el=document.getElementById('screenClock');if(!el)return;const left=publicRoom.status==='paused'?null:roomClockLeft(publicRoom);el.textContent=publicRoom.status==='paused'?'PAUSADO':(publicRoom.revealed?'REVELADO':publicRoom.locked?'BLOQUEADO':formatClock(left));el.classList.toggle('urgent',left!==null&&left<=10&&left>0&&!publicRoom.locked&&!publicRoom.revealed)};tickScreen();timer=setInterval(tickScreen,500)}
}
})();
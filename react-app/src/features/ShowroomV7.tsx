import {useState} from 'react';
import {Clapperboard,Play,Eye,RefreshCcw,Monitor,Smartphone,PanelTop,Medal,ExternalLink} from 'lucide-react';
import {Brand,AnswerRows,SceneMedia,RankList,RoundRail,Countdown} from '../components/Chrome';
import PodiumBoard from '../components/PodiumBoard';
import {CASES,caseCover} from '../services/catalog';
import {NeonFrame,ConsoleButton,CaseBeat,PhaseTag} from '../components/v7/V7UI';
import type {GameQuestion,PublicRoom,PublicPlayer} from '../services/types';

type Tab='host'|'screen'|'player'|'podium';
const question:GameQuestion={
 id:'SHOWROOM-QUESTION',round:1,caseTitle:'Fraude contra credores',
 text:'Ao analisar uma reorganização patrimonial, qual conjunto de fatos merece verificação prioritária?',
 options:[
 {index:0,text:'Cronologia das obrigações, situação patrimonial e documentos da operação.',kind:'correct'},
 {index:1,text:'Apenas o nome escolhido para a sociedade.',kind:'gray'},
 {index:2,text:'Somente a aparência do imóvel utilizado.',kind:'risky'},
 {index:3,text:'Desconsiderar indícios e direitos de terceiros.',kind:'criminal'},
 ],correctIndex:0,explanation:'A conclusão jurídica depende das circunstâncias demonstradas e da prova; a constituição de holding não substitui a análise dos atos.'
};
const players:PublicPlayer[]=[
 {player_id:'demo-1',nickname:'Alex',avatar_id:'detetive',score:820,rank:1,connected:true,counters:{correct:7,total:8}},
 {player_id:'demo-2',nickname:'Bia',avatar_id:'perita',score:710,rank:2,connected:true,counters:{correct:6,total:8}},
 {player_id:'demo-3',nickname:'Caio',avatar_id:'delegado',score:640,rank:3,connected:true,counters:{correct:5,total:8}},
 {player_id:'demo-4',nickname:'Duda',avatar_id:'analista',score:590,rank:4,connected:true,counters:{correct:4,total:8}},
];
export default function ShowroomV7(){
 const [tab,setTab]=useState<Tab>('host'),[round,setRound]=useState(1),[reveal,setReveal]=useState(false),[selected,setSelected]=useState<number|null>(null);
 const status=tab==='podium'?'finished':tab==='host'?'waiting':'running';
 const room:PublicRoom={room_id:'showroom',code:'DEMO-V7',case_key:'credores',case_title:'Fraude contra credores',status,room_revision:round,current_round:tab==='podium'?8:round,
 question:question,locked:reveal,revealed:reveal,responded:reveal?4:1,players_total:4,players_connected:4,question_time_sec:60,round_started_at:new Date(Date.now()-12500).toISOString(),
 average_exposure:19,ocultou_bens_count:0,ocultacao_descoberta_count:0};
 const tabs:[Tab,string,React.ReactNode][]=[['host','Host',<PanelTop size={18}/>],['screen','Telão',<Monitor size={18}/>],['player','Jogador',<Smartphone size={18}/>],['podium','Pódio',<Medal size={18}/>]];
 return <div className="v7-showroom-shell">
  <header className="v7-showroom-header"><Brand/><div><strong>DESIGN SYSTEM V7</strong><small>Componentes React reais • estados interativos</small></div><a href="./?view=host"><ExternalLink size={17}/> ABRIR JOGO</a></header>
  <div className="v7-showroom-warning" role="note"><Clapperboard size={22}/><b>SHOWROOM / DEMONSTRAÇÃO</b> — nomes, sala, pontos, tempo e respostas são dados de exemplo. Esta tela não se conecta a partidas reais.</div>
  <nav className="v7-showroom-tabs" aria-label="Prévia de interfaces">{tabs.map(([id,label,icon])=><button aria-current={tab===id?'page':undefined} className={tab===id?'active':''} key={id} onClick={()=>{setTab(id);setSelected(null)}}>{icon}{label}</button>)}</nav>
  <main className={'v7-showroom-preview mode-'+tab}>
   {tab==='host'&&<NeonFrame tone="gold" className="v7-showroom-host">
      <span className="v6-eyebrow">SALA DA INVESTIGAÇÃO</span><h1>DEMO-V7</h1><PhaseTag room={room}/>
      <div className="v7-showroom-columns"><NeonFrame><h2>COMO PARTICIPAR</h2><p>Abra a câmera, leia o QR Code real da partida e escolha seu personagem.</p><p>O Showroom não gera códigos válidos de entrada.</p></NeonFrame><NeonFrame><img src={caseCover('credores')} alt="Fachada da cena do caso"/><strong>{CASES[0].title}</strong><small>8 rodadas fictícias para debate jurídico</small></NeonFrame></div>
      <NeonFrame><h2>JOGADORES EM UMA SALA DE EXEMPLO</h2><RankList players={players} limit={4}/></NeonFrame>
    </NeonFrame>}
   {tab==='screen'&&<div className="v7-showroom-question"><SceneMedia caseKey="credores" caseTitle="Fraude contra credores" round={round} large/><NeonFrame>
      <div className="v7-badge-row"><CaseBeat round={round} compact/><Countdown room={room}/></div><h1>{question.text}</h1>
      <AnswerRows question={question} revealed={reveal}/>
      {reveal&&<p className="v7-showroom-explanation">{question.explanation}</p>}
      <RoundRail round={round}/>
     </NeonFrame></div>}
   {tab==='player'&&<div className="v7-showroom-phone"><div className="v7-showroom-player-head"><span>JOGADOR · DEMONSTRAÇÃO</span><b>Alex · 820 pontos</b></div>
    <SceneMedia caseKey="credores" caseTitle="Fraude contra credores" round={round}/>
    <CaseBeat round={round} compact/><h2>{question.text}</h2><AnswerRows question={question} selected={selected} revealed={reveal} onSelect={setSelected}/>
    <ConsoleButton tone="gold" disabled={selected===null} onClick={()=>setReveal(true)}>CONFIRMAR RESPOSTA DEMO</ConsoleButton>
   </div>}
   {tab==='podium'&&<div className="v7-showroom-podium"><PodiumBoard room={room} players={players}/></div>}
  </main>
  <footer className="v7-showroom-controls">
   <ConsoleButton tone="cyan" disabled={tab==='host'||tab==='podium'} onClick={()=>setReveal(x=>!x)}><Eye size={18}/> {reveal?'OCULTAR CORREÇÃO':'REVELAR CORREÇÃO'}</ConsoleButton>
   <ConsoleButton tone="gold" disabled={tab==='podium'} onClick={()=>{setRound(x=>x===8?1:x+1);setSelected(null);setReveal(false)}}><Play size={18}/> PRÓXIMA CENA</ConsoleButton>
   <ConsoleButton tone="steel" onClick={()=>{setTab('host');setRound(1);setReveal(false);setSelected(null)}}><RefreshCcw size={18}/> REINICIAR</ConsoleButton>
  </footer>
 </div>;
}

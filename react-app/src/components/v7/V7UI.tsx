import {useEffect,useId,useRef,useState} from 'react';
import type {ButtonHTMLAttributes,ReactNode} from 'react';
import {BookOpen,BarChart3,Copy,ExternalLink,FileText,Menu,Monitor,Settings2,Share2,Users,X,ShieldCheck} from 'lucide-react';
import type {PublicRoom} from '../../services/types';

type Tone='cyan'|'gold'|'red'|'mint'|'steel';
export function ConsoleButton({tone='cyan',children,className='',...rest}:ButtonHTMLAttributes<HTMLButtonElement>&{tone?:Tone;children:ReactNode}){
  const c=tone==='red'?'danger':tone==='steel'?'secondary':tone;
  return <button {...rest} type={rest.type||'button'} className={'cinema-button '+c+' v7-button '+className}>{children}</button>;
}
export function NeonFrame({children,tone='cyan',className=''}:{children:ReactNode;tone?:Tone;className?:string}){
  return <div className={'v7-frame v7-frame-'+tone+' '+className}>{children}</div>;
}
export const CASE_BEATS=[
  ['01 · ABERTURA','Contexto e fatos','O que realmente aconteceu antes da constituição da estrutura patrimonial?'],
  ['02 · ESTRUTURA','Agentes e patrimônio','Identifique pessoas, bens e vínculos, distinguindo fatos comprovados de hipóteses.'],
  ['03 · DOCUMENTOS','Instrumentos utilizados','Observe os registros, os títulos e a finalidade declarada de cada ato.'],
  ['04 · EFEITOS','Consequências imediatas','Compare os efeitos pretendidos com os direitos de terceiros.'],
  ['05 · CONFLITO','Interesses em disputa','Localize as contradições entre versões e evidências apresentadas.'],
  ['06 · APURAÇÃO','Rastros documentais','Quais documentos e circunstâncias ajudam a sustentar a conclusão?'],
  ['07 · DESFECHO','Riscos jurídicos','Avalie a possível responsabilidade civil, tributária e penal conforme o caso.'],
  ['08 · VEREDITO','Debate e fundamentação','Encerre a análise justificando a decisão com fatos e normas aplicáveis.']
] as const;
export function CaseBeat({round,compact=false}:{round:number;compact?:boolean}){
  const beat=CASE_BEATS[Math.max(0,Math.min(7,round-1))];
  return <div className={'v7-case-beat'+(compact?' compact':'')}>
    <span>{beat[0]}</span><strong>{beat[1]}</strong>{!compact&&<p>{beat[2]}</p>}
  </div>;
}
export function PhaseTag({room}:{room:PublicRoom|null}){
  const label=!room?'CONECTANDO':room.status==='waiting'?'AGUARDANDO TURMA':room.status==='finished'?'PARTIDA ENCERRADA':
   room.status==='paused'?'PARTIDA PAUSADA':room.revealed?'RESPOSTA REVELADA':room.locked?'RESPOSTAS BLOQUEADAS':'RECEBENDO RESPOSTAS';
  return <span className={'v7-phase-tag phase-'+(room?.status||'offline')} role="status">{label}</span>;
}
const items=[
  {label:'Lobby / Sala',modal:'lobby',Icon:Users},
  {label:'Casos e perguntas',modal:'cases',Icon:BookOpen},
  {label:'Jogadores',modal:'players',Icon:Users},
  {label:'Relatórios',modal:'reports',Icon:BarChart3},
  {label:'Atividade',modal:'activity',Icon:FileText},
  {label:'Configurações',modal:'settings',Icon:Settings2},
] as const;
export function MobileHostNav({onNavigate,onScreen,code}:{onNavigate:(modal:string)=>void;onScreen:()=>void;code:string}){
  const [open,setOpen]=useState(false);
  const id=useId(),trigger=useRef<HTMLButtonElement>(null),closeRef=useRef<HTMLButtonElement>(null),drawer=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(!open)return;
    closeRef.current?.focus();
    const key=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){setOpen(false);trigger.current?.focus();}
      if(event.key==='Tab'){
        const els=[...(drawer.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href]')||[])];
        if(!els.length)return;
        const first=els[0],last=els[els.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
      }
    };
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[open]);
  const dismiss=()=>{setOpen(false);requestAnimationFrame(()=>trigger.current?.focus());};
  return <div className="v7-mobile-nav">
    <button ref={trigger} className="v7-menu-trigger" type="button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls={id} aria-label={open?'Fechar menu do Host':'Abrir menu do Host'}>
      {open?<X size={22}/>:<Menu size={22}/>}<span>MENU</span>
    </button>
    {open&&<div className="v7-menu-overlay" onMouseDown={event=>{if(event.currentTarget===event.target)dismiss()}}>
      <nav ref={drawer} className="v7-menu-drawer" id={id} aria-label="Menu do Host">
        <header><strong>CONTROLE DA SALA</strong><button ref={closeRef} type="button" onClick={dismiss} aria-label="Fechar menu"><X size={21}/></button></header>
        {items.map(({label,modal,Icon})=><button key={modal} type="button" onClick={()=>{dismiss();onNavigate(modal)}}><Icon size={20}/>{label}</button>)}
        <button type="button" onClick={()=>{dismiss();onScreen()}} disabled={!code}><Monitor size={20}/> Abrir telão <ExternalLink size={15}/></button>
        <footer><ShieldCheck size={15}/> Somente o Host autorizado pode alterar a partida.</footer>
      </nav>
    </div>}
  </div>;
}
export function ShareRoom({url,onFeedback}:{url:string;onFeedback?:(text:string,ok:boolean)=>void}){
  const [fallback,setFallback]=useState(false);
  const input=useRef<HTMLInputElement>(null);
  const copy=async()=>{
    try{
      if(!navigator.clipboard?.writeText)throw Error('Clipboard indisponível');
      await navigator.clipboard.writeText(url);setFallback(false);onFeedback?.('Link da sala copiado.',true);
    }catch{
      setFallback(true);onFeedback?.('Copie o endereço selecionado.',false);
      setTimeout(()=>{input.current?.focus();input.current?.select()},0);
    }
  };
  const share=async()=>{
    try{
      if(!navigator.share){await copy();return;}
      await navigator.share({title:'THE CRIMES LIVE',text:'Participe da investigação jurídica',url});
      onFeedback?.('Compartilhamento iniciado.',true);
    }catch(e){if((e as Error)?.name!=='AbortError')await copy();}
  };
  return <div className="v7-share-room">
    <button type="button" onClick={()=>void share()}><Share2 size={17}/> COMPARTILHAR</button>
    <button type="button" onClick={()=>void copy()}><Copy size={16}/> COPIAR LINK</button>
    {fallback&&<input ref={input} value={url} readOnly onClick={e=>(e.target as HTMLInputElement).select()} aria-label="Endereço de entrada na sala para copiar manualmente"/>}
  </div>;
}
export function ReconnectMessage({retry}:{retry:()=>void}){
  return <div className="v7-reconnect" role="status"><span>Não foi possível sincronizar esta rodada.</span><button type="button" onClick={retry}>TENTAR NOVAMENTE</button></div>;
}
export function AccessibilityAnnouncement({children}:{children:ReactNode}){return <span className="v7-screen-reader" role="status" aria-live="polite">{children}</span>;}

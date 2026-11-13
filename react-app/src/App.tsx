import {Suspense,lazy,useEffect} from 'react';
import {useGame} from './services/store';

/* Real players should not download the Host, projector or demonstration code. */
const Host=lazy(()=>import('./features/Host'));
const Screen=lazy(()=>import('./features/Screen'));
const Player=lazy(()=>import('./features/Player'));
const ShowroomV7=lazy(()=>import('./features/ShowroomV7'));

export default function App(){
 const setCode=useGame(s=>s.setCode);
 useEffect(()=>{const code=(new URLSearchParams(location.search).get('room')||'').trim().toUpperCase();if(code)setCode(code);},[setCode]);
 const view=new URLSearchParams(location.search).get('view')||'host';
 const screen=view==='player'?<Player/>:view==='screen'?<Screen/>:view==='showroom'?<ShowroomV7/>:<Host/>;
 return <Suspense fallback={<main role="status" aria-live="polite" className="v7-route-loading"><strong>THE CRIMES LIVE</strong><p>Carregando a investigação...</p></main>}>{screen}</Suspense>;
}

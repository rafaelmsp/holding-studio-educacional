import {useEffect} from 'react';
import Host from './features/Host';
import Screen from './features/Screen';
import Player from './features/Player';
import {useGame} from './services/store';
export default function App(){
 const setCode=useGame(s=>s.setCode);
 useEffect(()=>{const code=(new URLSearchParams(location.search).get('room')||'').trim().toUpperCase();if(code)setCode(code);},[setCode]);
 const view=new URLSearchParams(location.search).get('view')||'host';
 if(view==='player')return <Player/>;
 if(view==='screen')return <Screen/>;
 return <Host/>;
}

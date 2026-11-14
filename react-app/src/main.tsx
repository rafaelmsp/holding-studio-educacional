import React from 'react';import {createRoot} from 'react-dom/client';import App from './App';import './styles/cinematic.css';import './styles/v6.css';import './styles/v6-polish.css';import './styles/v6-cinema.css';import './styles/v7-host.css';import './styles/v7-console.css';
const root=document.getElementById('root');if(!root)throw new Error('Raiz React não encontrada');
createRoot(root).render(<React.StrictMode><App/></React.StrictMode>);

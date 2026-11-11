# THE CRIMES LIVE — React V5

Frontend cinematográfico React 19 + TypeScript + Vite + Tailwind CSS + Motion + GSAP + Zustand + Supabase. Substitui a arquitetura DOM manual num caminho de prévia sem modificar o jogo legado.

## Setup

```bash
npm ci
npm run build
node tests/assets.test.cjs
npm run dev
```

**Estrutura:** `src/features/Host.tsx` (Host), `Screen.tsx` (telão), `Player.tsx` (entrada, jogo e final); `src/components/Chrome.tsx` (componentes compartilhados); `src/services` (dados, autenticação de sessão, sincronização, estado Zustand); `src/styles/cinematic.css` (layout responsivo); `src/assets.json` (manifesto das seis famílias de casos).

A compilação sai para `../react-live/`, pronta para GitHub Pages no caminho `/react-live/`. Os assets compartilhados continuam em `../assets/`, relativos à raiz da publicação.

## QA
`npm run build` e `node tests/assets.test.cjs` verificam build, presença de imagens e acervo existente. QA completo navegador realizado localmente com duas sessões de celular, Host e telão.

**Não publicar por substituição direta do diretório `live/` antes da homologação pública.** Mais detalhes em `../docs/THE_CRIMES_V5_REACT_MIGRATION.md`.

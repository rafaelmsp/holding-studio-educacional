# THE CRIMES LIVE — React V5.0

## Identidade e escopo

Migração de frontend do **THE CRIMES LIVE**, jogo educativo de investigação jurídica, da interface HTML/CSS/JS em `live/` para uma aplicação real React 19, TypeScript, Vite, Tailwind CSS, Motion (Framer Motion), GSAP e Zustand, com Supabase como backend existente.

A implementação React é própria; o projeto `operacoes-clandestinas.html` atualmente presente no repositório ainda usa HTML/CSS/JS. A V5 segue a **arquitetura React que havia sido definida como alvo**, sem afirmar que o arquivo antigo já a utilizava.

## Pastas

```
react-app/
  package.json
  package-lock.json
  vite.config.ts
  tsconfig.json
  tailwind.config.js
  src/
    App.tsx
    main.tsx
    assets.json
    components/Chrome.tsx
    features/Host.tsx
    features/Screen.tsx
    features/Player.tsx
    services/api.ts
    services/catalog.ts
    services/realtime.ts
    services/store.ts
    services/types.ts
    styles/cinematic.css

react-live/
  index.html
  bundles/*.js
  bundles/*.css

live/                      # V4.2 estável, não removida
assets/the-crimes-v3/     # cenas e 12 retratos WebP existentes
```

## Instalação

Requisitos: Node 22 ou superior. Na raiz do repositório:

```powershell
cd react-app
npm ci
npm run dev
```

Preview local Vite: http://127.0.0.1:8127/?view=host

Para preparar os arquivos estáticos no GitHub Pages:

```powershell
npm run build
```

O Vite compila para `../react-live/`. Não editar manualmente o bundle gerado; modificar componentes em `react-app/src` e recompilar.

## Acesso React V5

- **Host:** `https://rafaelmsp.github.io/holding-studio-educacional/react-live/?view=host`
- **Jogador:** QR Code gerado no Host ou `?view=player&room=CRIM-XXXX`
- **Telão:** botão **ABRIR TELÃO** no Host; preserva token administrativo no mesmo perfil de navegador.

Esses links só devem ser considerados publicados após GitHub Pages confirmar a nova compilação e carregar `react-live/` com HTTP 200.

## Componentes e dados

1. **Host** — seletor dos 6 casos, sala, QR Code, opções, relógio, Top 5, 8 rodadas, pausa, bloqueio, revelar, pular, encerrar, reiniciar e controle de entrada.
2. **Jogador** — entrada por nome, filtro visual de gênero (masculino, feminino ou neutro), 12 personagens, perfil, respostas, confirmação, correção e resultado final.
3. **Telão** — cena 16:9, questão, opções, ranking, barra de progresso, tempo, revelação e comandos autorizados, fullscreen real.
4. **Ferramentas** — dossiê do caso vindo do estado administrativo, métricas, tabela de jogadores, eventos e exportação CSV.

Todos os números da partida são recebidos do Supabase. Não existem placares fictícios no frontend.

## Backend e autenticação

- Supabase REST/RPC Edge Function `the-crimes-live` já existente, acionada por `createRoom`, `join`, `adminState`, `playerState`, `answer`, `reveal`, `next`, `finish`, `reset`, `showCorrect` e demais ações implementadas.
- Realtime/Postgres Changes e Presence compartilham os tópicos existentes e fazem atualização periódica como fallback.
- `room_revision`, `round_key`, `requestId` e tentativa conservadora em erros 409 mantêm a proteção contra comandos/rodadas obsoletos.
- Token administrativo continua local ao navegador e não é incluído em URLs públicos. O servidor valida permissões.

## QA local

`react-app/qa-react.cjs`: Chrome Playwright em tela Host 1440×900, Telão 1920×1080, celular 390×844 e 412×915. Foi exercitada a sala **CRIM-3325** com dois jogadores de teste.

- Criação de sala e entrada de dois participantes.
- Personagens, imagens e QR carregados.
- Resposta salva e revelação executada.
- Host avançou a rodada 1→2 enquanto outro jogador não havia respondido.
- Telão autorizado avançou 2→3 após receber o estado da rodada.
- Encerramento com pódio e resultado individual.
- **0 erros JS / 0 imagens quebradas / 0 overflow horizontal nos viewports verificados**.

## Fidelidade visual e assets

O React usa o manifesto do jogo em `assets.json`, com cenas e retratos que já estão versionados no GitHub. Uma nova direção de arte de quatro fundos independentes (Host, telão, entrada, resultado) também foi gerada como pacote WebP. A incorporação desse pacote diretamente no repositório é uma etapa separada da migração de tecnologia; **não afirmar que as quatro artes novas já aparecem na build enquanto os arquivos não estiverem incorporados**.

O HTML dinâmico continua responsável por perguntas, respostas, cronômetro, placar e botões. Fotografias e molduras são camadas visuais separadas.

## Preservação

A V4.2 permanece em `live/`, em operação, sem mudanças nesta migração. A React V5 permanece isolada em `react-live/` para homologação. A troca do endereço oficial deverá ocorrer apenas após o teste público de sala e de carga na rede da aula.

## Pendências

- Verificar o deploy e os CORS de todos os fluxos pelo domínio público.
- Testar com 30–50 jogadores simultâneos.
- Importar a coleção recém-gerada de quatro backgrounds no diretório de assets e executar revisão visual pixel a pixel contra as referências.
- Testar de maneira presencial com o projetor e celulares reais.


## V5.1 — Galeria React e sincronização de partida (11/11/2026)

- Criada a página \`react-app/public/showroom.html\` que o Vite copia para \`react-live/showroom.html\`.
- Galeria com 7 capturas reais de tela: Host, telão, celular, entrada, seleção de casos, pódio e resultado do celular.
- Pacote V5 com 4 backgrounds artísticos WebP e 8 peças de UI importadas. As imagens são apenas fundos e molduras; os componentes React exibem dados reais e mantêm os eventos de clique.
- Canal de broadcast unificado entre emissor e receptor como \`react-sync-{código}\`; atualizações de banco/presença e polling continuam como fallback. Sinais de mudanças em rajadas são agrupados.
- Intervalos de segurança de atualização agora 6,2 s (Host e telão) e 6,5 s (jogador), além de sincronização em tempo real.
- \`npm run test:visual\` verifica assets, links, telas e contrato de Realtime; verificação integrada ao GitHub Actions.
- A versão HTML V4.2 continua acessível em \`/live/\` até homologação de migração.

**Atenção:** uma execução automatizada multiaba registrou avisos Chromium \`ERR_INSUFFICIENT_RESOURCES\` de rede durante o teste completo público, apesar de a partida e o pódio terem funcionado. O teste em aparelhos reais e o teste de carga da sala ainda são necessários.

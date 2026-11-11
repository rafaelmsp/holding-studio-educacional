# THE CRIMES LIVE — V4.1 CINEMATIC ART PACK

Atualizado em 11/11/2026.

## Objetivo
Aproximar a interface real do jogo das referências cinematográficas aprovadas sem trocar controles por imagens estáticas nem alterar regras, pontuação ou backend.

## Entregue
- Oito novas cenas panorâmicas WebP, uma por rodada de **Fraude contra Credores**, mostrando a residência e elementos diferentes da investigação.
- Arte vetorial original da Justiça para a área decorativa do Host, posicionada fora dos itens do menu para não interferir no clique.
- Painel de caso com fundo escolhido dinamicamente pelo caso ativo; outros casos continuam usando seus próprios fundos e 40 cenas já existentes.
- Projetor com botão **TELA CHEIA / SAIR DA TELA CHEIA**, tecla **F** como atalho e suporte à saída pelo próprio botão.
- Destaque aprimorado da revelação correta, controles visuais mais contrastados e suporte a `prefers-reduced-motion`.
- Galeria independente: `live/showroom.html` com cinco capturas reais das telas e oito imagens do caso.
- Novos testes automatizados e guardas no CI.

## Endereços
- Jogo/Host: https://rafaelmsp.github.io/holding-studio-educacional/live/?view=host
- Galeria: https://rafaelmsp.github.io/holding-studio-educacional/live/showroom.html
- Telão com controle: abra no Host com **ABRIR TELÃO**.
- Jogador: link ou QR da sala criada no Host.

## Arte e crédito
- Base arquitetônica: *A modern, two-story home is lit at night*, por **Gul Fatima** (@gulfatimedeveloper), Unsplash, publicada em 08/04/2025.
- Fonte: https://unsplash.com/photos/a-modern-two-story-home-is-lit-at-night--qTD1leeLCw
- Licença: https://unsplash.com/license
- Transformação: composição com as cenas internas preexistentes e correção cinematográfica de cores e vinheta.
- As fotos e personagens ilustram **situações fictícias** e não retratam atos reais de pessoas ou imóveis.
- Créditos detalhados: `assets/the-crimes-v3/CREDITS.md`.

## Arquivos
- `live/ux-v41.css`
- `live/v3-assets.js`
- `live/app.js` e `live/index.html`
- `live/showroom.html`
- `assets/the-crimes-v3/global/holding-estate-unsplash.jpg`
- `assets/the-crimes-v3/ui/lady-justice.svg`
- `assets/the-crimes-v3/scenes/credores/01-cinematic.webp` a `08-cinematic.webp`
- `build-v41-scenes.py` (reprodutor das composições com Pillow)
- `docs/preview/v41/*.webp` e `scenes-contact.jpg`
- `tests/live-ux-v41.test.js`

## QA funcional
Chrome automatizado com Host 1440×900, telão 1920×1080 e celulares 390×844/412×915:
- Jogo de dois participantes: criação, QR, resposta, revelação, avanço sem resposta e encerramento.
- Telão autorizado avançou a rodada.
- Host em 1440×900 sem scroll: comandos até y=811, trilho de progresso até y=866.
- Sem overflow horizontal no Host, telão ou celulares no teste.
- Zero erros de JavaScript reportados.
- Modo Cinema testado entrando e saindo de fullscreen via clique.
- Entradas, retratos e pontuação continuam vinculados ao jogo real.

## Ainda não homologado
- Teste de carga com 30–50 usuários simultâneos.
- Comparação pixel-a-pixel em todos os dispositivos e sistemas operacionais.
- Novas composições fotográficas específicas para cada um dos outros cinco casos (mantidas as cenas anteriores).
- Sincronização pela internet pode depender de latência/Reatime: convém testar na rede da sala antes da apresentação.

## Controle de publicação
Após cada deploy, confirme `The Crimes Live CI`, `pages build and deployment`, carregamento de `ux-v41.css`, de `v3-assets.js` e dos oito arquivos WebP. A galeria é apenas um showroom de capturas reais: a partida interativa é iniciada no endereço do jogo.

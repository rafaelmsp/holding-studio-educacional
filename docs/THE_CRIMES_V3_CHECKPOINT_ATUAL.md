# THE CRIMES LIVE — CHECKPOINT OFICIAL V3.9.0 CINEMATIC
Atualizado em **11/11/2026**.

## Estado
- Release: **V3.9.0 — UX cinematográfica**.
- Produção: GitHub Pages.
- Bundle: `live/app.js?v=20261111-v3-prod-13`.
- CSS: `live/ux-v38.css` e `live/ux-v39.css`.
- Assets: `live/ux-personas.js?v=20261111-2`, 12 retratos WebP; 48 cenas dos seis casos preservadas.
- Backend/realtime: Supabase V3.7, sem migrações.

## Funcionalidades mantidas
Host, telão, dois tipos de acesso, nome e escolha de personagem, QR por sala, votação em tempo real, Presence, room_revision, round_key, controle de comando idempotente, pausa, bloqueio, revelação, pular/avançar, score e exposição, ranking, relatório, resultado individual, pódio, replay e retorno ao lobby.

## QA V3.9 aprovado no navegador
- Sala `CRIM-3751`.
- Host 1440×900 — layout novo, pergunta, ações e monitoramento.
- Telão 1920×1080 — cena separada, ranking e comandos autorizados pelo Host.
- Celulares 390×844 e 412×915 — avatares carregados, quatro respostas e botão responder.
- Jogador 2 avançou para **MISSÃO 02 / 08** mesmo sem ter respondido à primeira.
- Controle administrativo pelo telão avançou para rodada 3.
- Revelação/resultado final aprovados.
- `errors: []`, `expectedConflicts: []`, sem overflow horizontal nas telas.
- 12 retratos WebP gerados e testados; catálogo unitário aprovado.

## Escopo e ressalvas
A interface V3.9 usa DOM/CSS funcional e cenas originais, não screenshots de referência como controles falsos. Os retratos são recortes das imagens do próprio jogo; alguns personagens podem aparecer em cenas diferentes. Teste de carga ampliado (30–50 alunos), múltiplos browsers e UX pixel-a-pixel ainda são evoluções futuras. Não altere políticas de backend ou credenciais em futuras passagens puramente visuais.

## Links
- Host / apresentação: https://rafaelmsp.github.io/holding-studio-educacional/live/?view=host
- Jogador: QR gerado pela sala.
- Telão: botão **ABRIR TELÃO** do Host para compartilhar a sessão administrativa.
- Detalhes: `docs/THE_CRIMES_V39_CINEMATIC_UX.md`.

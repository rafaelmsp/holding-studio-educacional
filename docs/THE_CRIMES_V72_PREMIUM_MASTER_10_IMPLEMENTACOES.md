# THE CRIMES LIVE V7.2 — MASTER PREMIUM · 10 IMPLEMENTAÇÕES
**Data:** 15/11/2026  | **Repositório:** `rafaelmsp/holding-studio-educacional` | **Branch:** `feat/v72-premium-layers` | **PR:** https://github.com/rafaelmsp/holding-studio-educacional/pull/6
**Base:** V7.1 pública, funcionamento multiplayer preservado. **Status:** roteiro de execução; não equivale a homologação visual ou merge na main.

## 0. Objetivo, escopo e restrições
Aproximar, de forma progressiva e reproduzível, cinco estados reais do THE CRIMES LIVE dos conceitos cinematográficos fornecidos: (1) Lobby/Host, (2) Host em rodada, (3) Jogador mobile, (4) Telão, (5) Pódio. Cada tela terá duas implementações independentes: arte fotográfica/layers e integração interativa/responsiva. Prioridade para preto-azulado, ciano, bronze/dourado e vermelho funcional; controles acessíveis e dados reais em HTML/React.

**Preservar:** React 19/TypeScript/Vite; hospedagem GitHub Pages; Supabase real; 6 casos × 8 cenas (48); 12 personas; oito rodadas; autenticação da sala; QR real; pontuação e classificação; preferências de movimento reduzido; imagens originais e repositório histórico. Nenhuma captura da interface conceitual pode substituir a UI funcional.

**Não fazer:** rasterizar perguntas, nomes, QR, ranking ou placar em imagens; expor tokens/.env; usar arte sem licença/proveniência; alterar regras jurídicas ou banco; forçar merge/deploy público sem validação. O layout 1280×720 exige especial cuidado com sobreposições/scroll.

## 1. Protocolo Progress Tracker Pro
Cada implementação I01–I10 vale **8 pontos**: 80 no total. A etapa Q01 (build, regressão de navegador, cenário real multiplayer e acessibilidade básica) vale **15 pontos**. A etapa D01 (documentação, artefatos, PR atualizado e relatório com pendências) vale **5 pontos**. **Somatório 100.** Pontos só se consolidam com arte criada, código realmente aplicado e evidência de verificação; não contam apenas planejamento, intenção, mockup ou execução incompleta.

| ID | Peso | Entrega | Critério de aceite verificável |
| --- | ---: | --- | --- |
| I01 | 8 | **Lobby — arte Premium** | WebP fotográfico versionado, sem texto, gerado de fontes rastreáveis; 200/RIFF em build e visual na sala |
| I02 | 8 | **Lobby — UX e layers** | QR real legível, CTA, instruções e foto convivem em 390/980/1672 px, sem overflow |
| I03 | 8 | **Host ao vivo — arte Premium** | WebP próprio de investigação, preservando imagens jurídicas do caso |
| I04 | 8 | **Host ao vivo — composição** | cena, tempo, perguntas/respostas, controles e ranking mantêm hierarquia, legibilidade e ações |
| I05 | 8 | **Player — arte vertical Premium** | WebP vertical otimizado e independência dos 12 retratos |
| I06 | 8 | **Player — UI Premium** | seleção, feedback, resposta, estados disabled/focus, sem toque acidental, 360/390/412 px |
| I07 | 8 | **Telão — arte Premium** | backdrop 16:9 sem lettering e fallback consistente |
| I08 | 8 | **Telão — UX projetor** | 1920×1080 e 1280×720, pergunta+4 alternativas+Top 5+controles visíveis |
| I09 | 8 | **Pódio — arte e luz** | cena de premiação e layer de luz sem dados fictícios, com medalhas dinâmicas |
| I10 | 8 | **Pódio — classificação e acabamento** | ordem 2–1–3, 12 retratos preservados, nomes/scores dinâmicos, painel secundário e resumo acessíveis |
| Q01 | 15 | **QA completo** | build, testes antigos, V7 browser, novos screenshots e oito rodadas com Supabase real; declarar falhas |
| D01 | 5 | **Entrega documentada** | MD atualizado, manifesto, evidências, commits e PR auditado; main intocada |

## 2. Arquitetura por camadas
1. **Fundo fotográfico:** WebP próprio por estado (paisagem ou retrato), sem qualquer dado de jogo.
2. **Props recortadas:** Justiça, detetive, lupa/documentos existentes e elementos de composição opcionais; `pointer-events:none`, `aria-hidden=true`.
3. **Molduras e iluminação:** SVG original sem scripts e CSS pseudo-elements; nunca sobrepor textos ou QR.
4. **React funcional:** salas, jogo, perguntas, respostas, countdown, status de conexão, ranking, score, progresso, inputs, botões, acessibilidade.
5. **Estados adaptativos:** 360/390/412 mobile, 980 touch em "site desktop", 1280×720 telão, 1672/1920 desktop. Não assumir que validação desktop equivale a teste físico.

## 3. Mapa de arquivos
| Pacote | Fontes principais | Integração |
| --- | --- | --- |
| I01/I02 | `assets/the-crimes-v72/premium/lobby-premium.webp`; `Host.tsx` | `v6-lobby-hero`, `v6-lobby-columns`, `v6-lobby-qr`, `v6-lobby-roster` |
| I03/I04 | `assets/the-crimes-v72/premium/host-live-premium.webp`; `Host.tsx` | `live-layout`, `host-question`, `round-bar`, `host-aside` |
| I05/I06 | `assets/the-crimes-v72/premium/player-premium.webp`; `Player.tsx` | `player-identity`, `scene-media`, `player-question`, `answer-row`, `submit-answer` |
| I07/I08 | `assets/the-crimes-v72/premium/projector-premium.webp`; `Screen.tsx` | `projector-main`, `projector-stage`, `projector-question-copy`, `projector-side` |
| I09/I10 | `assets/the-crimes-v72/premium/podium-premium.webp` + `podium-spotlights.png`; `PodiumBoard.tsx` | `v6-podium-stage`, `v6-finish-card`, `v6-final-sidebar`, `v6-class-summary` |
| QA/Docs | `react-app/tests/v72-premium-composition.cjs`, workflow V7 | `docs/THE_CRIMES_V72_PREMIUM_MASTER_10_IMPLEMENTACOES.md`, `manifest.json` |

## 4. Fontes visuais e qualidade
A referência artística é a coleção de telas conceituais enviada pelo autor (Host ao vivo, player mobile, pódio e telão). Compor os novos backdrops **a partir de fotografias já existentes no repositório**, registradas no manifesto, até a eventual substituição por artes inéditas aprovadas. Isso evita confundir composições derivadas de V3/V6/V7 com uma criação inédita de imagem. Uma geração independente no ChatGPT pode constar como **conceito ainda não integrado** enquanto seu binário não estiver efetivamente no repositório.

Cenários claros e realistas, profundidade fotográfica e reflexos: contraste do texto do próprio React nunca deve depender exclusivamente do fundo. Format WebP para fotos e PNG/SVG transparente para iluminação/ornamentos. Não reutilizar snapshots do conceito que contenham botões estáticos, nomes fictícios ou QR pintado.

## 5. Fluxo técnico de implementação sequencial
**I01→I02 (Lobby):** criar artwork 16:9, incorporar como fundo, revisar QR nítido, contraste, entrada de jogadores, botões e mobile. **I03→I04 (Host live):** criar foto 16:9 própria, ajustar malha de painéis e cena jurídica dinâmica; não alterar comandos Supabase. **I05→I06 (Player):** produzir arte vertical, manter retratos, legibilidade de alternativa e CTA; reforçar estados. **I07→I08 (Telão):** produzir foto própria, validar 720p/1080p e TOP 5 na projeção. **I09→I10 (Final):** produzir palco e spotlights, preservar ordem, score e resumo, sem cortar nomes.
**Q01:** build, contratos e QA com screenshots/replay/sala real. **D01:** registrar execução baseada em evidências, status pendente/implementado/validado, atualizar PR draft.

## 6. Matriz de regressão
| Superfície | Viewports | Estados |
| --- | --- | --- |
| Host lobby | 390, 980-touch, 1672 | QR, conexão, menu, entrada, participantes, ação principal |
| Host rodada | 390, 1280×720, 1672 | pergunta, cena, tempo, bloqueio/revelação, ranking |
| Jogador | 360, 390, 412 | login/persona, escolha, resposta habilitada, enviada, acessibilidade |
| Telão | 1280×720, 1920×1080 | waiting/running/paused/finished, TOP 5, opções, rodapé, fullscreen |
| Pódio | 390, 1280×720, 1920×1080 | 2–1–3, medalhas, score, 4º+, desempenho da turma |
| Backend | real Supabase | criar/entrar, oito rodadas, atualização, reset, ranking |

Verificar ausência de JS exceptions, CSS overflow horizontal, URL 200 de cada imagem nova e arquivos binários WebP/PNG reais (não HTML de fallback). Inspecionar capturas e conferir texto longo. `prefers-reduced-motion` deve funcionar; keyboard/focus deve persistir.

## 7. Critério de encerramento e release
**Código pronto** não implica identidade visual idêntica às referências. **QA aprovado** não equivale a teste físico de QR no projetor. O PR deve ficar **draft** e o deploy público V7.1 permanece intocado até homologação estética e conferência presencial. A porcentagem Progress Tracker Pro será calculada **somente sobre entregas executadas e verificadas**, sem adicionar pontos por passagem do tempo.

## 8. Registro de execução
Este documento define o escopo e a matriz de aceite; atualizar esta seção após cada lote executado, com commit SHA, scripts rodados, prints, casos de regressão, pendências e porcentagem comprovada.

## 9. Execução real do pacote MASTER (15/11/2026)
**Estado técnico local de I01–I10: IMPLEMENTADO E VALIDADO EM NAVEGADOR LOCAL.** Não tratar como identidade artística 1:1 aprovada. O conjunto completo de cinco fundos e uma sobreposição foi construído deterministicamente com `react-app/scripts/generate_v72_premium.py` a partir do acervo V3/V6/V7. Os arquivos são versionados com SHA-256 no `assets/the-crimes-v72/manifest.json`; os 12 retratos e as 48 cenas do jogo não foram modificados.

| ID | Estado técnico | Evidência |
| --- | --- | --- |
| I01 | 🟢 Local | `lobby-premium.webp`, WebP 1920×1080, URL HTTP 200, screenshot `host-lobby-premium.png` |
| I02 | 🟢 Local | QR SVG 190px, guia, caso selecionável, captura Host e QA touch 390/980/1672 |
| I03 | 🟢 Local | `host-live-premium.webp`, WebP 1920×1080, screenshot `host-live-premium.png` |
| I04 | 🟢 Local | quatro alternativas HTML e comandos Host acessíveis, preservando `host-question` |
| I05 | 🟢 Local | `player-premium.webp`, WebP vertical 864×1536, screenshot `player-join.png` |
| I06 | 🟢 Local | seleção ciano/CTA vermelho já integrados; v7-browser valida seleção e 37 estados de interface |
| I07 | 🟢 Local | `projector-premium.webp`, WebP 1920×1080, 200/RIFF e `screen-round.png` |
| I08 | 🟢 Local | QA 1280×720/1920×1080: 4 alternativas, TOP5, rodapé e sem scroll para pergunta de referência |
| I09 | 🟢 Local | `podium-premium.webp` e `podium-spotlights.png` com transparência, 200 e pseudo-camada real |
| I10 | 🟢 Local | ordem 2–1–3, cartões não sobrepostos ao resumo, score e medalhas dinâmicos |

**Validações locais já executadas:**
- `npm --prefix react-app run build` (Vite/TypeScript) — aprovado.
- `test:metrics`, `test:v62`, `test:v6`, `test:visual`, `tests/assets.test.cjs`, `tests/live-primary-react.test.cjs` — aprovados.
- `react-app/tests/v72-premium-assets.cjs` — 5 WebP + 1 PNG reais, SHA, 12 personas, 48 cenas, CSS importado.
- `react-app/tests/v72-host-touch.cjs` — Host 390/980-touch/1672 px sem overflow e QR intacto.
- `react-app/tests/v72-scene-layers.cjs` — 9 estados novos e anteriores, Host/lobby/rodadas/jogador/telão/pódio, incluindo 720p.
- `react-app/tests/v7-browser.cjs` — 37 estados simulados e 8 rodadas mock sem regressões.
- `git diff --check` — aprovado. O pipeline do GitHub também deve executar fluxo **real** de 8 rodadas com Supabase; a aprovação local não o substitui.

**Progresso Progress Tracker Pro:** I01–I10 = 80/100 pontos com evidência local; Q01 = 0/15 até terminar CI/QA remoto neste SHA; D01 = 0/5 até MD e PR publicados. **Progresso técnico comprovado no momento do registro: 80%.**

**Limitações e aceite:** composição fotográfica derivada, não substituição pela arte inédita gerada na conversa, que continua separada. A nova montagem aproxima os conceitos sem prometer reprodução pixel-perfect; depende de comparação humana, câmera real lendo QR e observação no projetor da sala. O PR continua draft e `main` não será modificada.

## 10. Relatório final do Progress Tracker Pro · 15/11/2026
**PROG-FINAL · Escopo de implementação e automação: 100% validado.**

| Pacote | Pontos | Estado | Evidência |
| --- | ---: | --- | --- |
| I01–I10: 5 cenários, layers e UX | 80/80 | 🟢 Concluídos e verificados | Build Vite, manifesto SHA-256, navegador, 9 estados novos + regressões V7 |
| Q01: testes automatizados e multiplayer | 15/15 | 🟢 Concluído | [CI 43731262159](https://github.com/rafaelmsp/holding-studio-educacional/actions/runs/43731262159) e [browser QA 43731262147](https://github.com/rafaelmsp/holding-studio-educacional/actions/runs/43731262147), ambos **success** |
| D01: documentação e evidências | 5/5 | 🟢 Concluído | Este MD, PR #6, scripts, manifesto, screenshots e relatório |

**Progressão comprovada: 80 + 15 + 5 = 100 pontos.** A suíte do GitHub incluiu os testes de integridade Premium, 37 capturas V7, Host touch, nove cenários V7.2 e o exercício de oito rodadas usando Supabase real. Artefato GitHub da execução: `the-crimes-v7-screenshots`, ID `14169055813` (65 PNGs no ZIP, incluindo as nove cenas e capturas do multiplayer).

**Aceite visual não incluído no 100% técnico:** falta comparar presencialmente a composição contra as referências fotográficas aprovadas pelo autor, testar a câmera/QR em smartphone e observar a legibilidade no projetor físico. O PR #6 permanece **draft**, sem merge; a `main` pública permanece V7.1. As novas fotos integradas são **composições derivadas** do acervo V3/V6/V7, não a imagem inédita de Justiça gerada no ChatGPT (separada). Não afirmar fidelidade pixel-perfect antes desse aceite.

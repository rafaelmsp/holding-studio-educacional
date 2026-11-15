# THE CRIMES LIVE V7.2 — GOLDEN MASTERS VISUAIS OFICIAIS

Data de fixação da referência: 15/11/2026.
Origem: quatro imagens conceituais anexadas pelo usuário nesta conversa. **Estas imagens são a fonte de direção artística, não screenshots de execução.** O desenho real mantém componentes React, dados do Supabase e as 48 cenas por caso.

## Referências — preservar exatamente a ordem de envio

| Código | Arquivo original enviado pelo usuário | Formato | Papel canônico |
|---|---|---|---|
| GM-01 | `1000287541.png` | 1536 × 864 (16:9) | **TELÃO/RODADA**: cabeçalho compacto com sala, caso, jogadores, rodada e progresso; foto imersiva à esquerda; pergunta e quatro alternativas ao centro; ranking TOP 5 à direita; telemetria e comandos em duas faixas inferiores |
| GM-02 | `1000287542.png` | 1536 × 864 (16:9) | **PÓDIO**: Justiça bronze grande no lado esquerdo, monumento e livros; pódio 2–1–3 com retratos grandes e molduras prata/ouro/bronze; tabela complementar à direita; métricas em uma barra inferior; dois botões grandes de reiniciar e voltar |
| GM-03 | `1000287543.png` | 1536 × 864 (16:9) | **HOST/AO VIVO**: detetive e marca no topo; menu lateral no desktop; faixa rodada, jogadores e progresso; cena e pergunta na área central; progresso e ranking à direita; três ações grandes com iluminação ciano, âmbar e vermelho; linha de oito fases no rodapé |
| GM-04 | `1000287544.png` | 1024 × 1536 (2:3) | **JOGADOR MOBILE**: cabeçalho THE CRIMES LIVE, status da sala e identidade; oito indicadores de rodada; grande cena jurídica com timer; pergunta em cartão legível; quatro respostas grandes; CTA vermelho habilitado; fundo noir com Justiça e investigação. A *moldura física do smartphone* na arte é apresentação, não UI a renderizar |

### Regras técnicas obrigatórias

1. **Não reproduzir a tela-conceito como um PNG único com palavras pintadas.** Código da sala, nomes de participantes, QR, tempo, respostas, ranking, scores e estado de rede vêm da store/React/Supabase.
2. A fotografia do caso tem origem no catálogo jurídico do projeto e preserva as **seis histórias × oito cenas**; imagens de decoração podem ficar em WebP/AVIF com `aria-hidden`, `alt=""` e `pointer-events:none`.
3. Preservar os IDs dos 12 personagens e suas fotos; usar retratos grandes no pódio, não substituir a identidade existente.
4. Hierarquia visível **foto > pergunta > escolhas > controles** na rodada; no pódio, **personagens 2–1–3 > ranking > estatísticas > reinício**. O estado da sala precisa continuar perceptível.
5. O telão fica legível em 1920×1080 e 1280×720, sem corte dos 5 melhores jogadores, alternativas e comandos; desktop Host em 1672×941, mobile jogador em 360/390/412 px.
6. A paleta vem das referências: azul petróleo `#061827`, ciano `#43D9FF`, ouro `#F2BD65`, vermelho rubi `#E54859`, verde de acerto `#49ECA0`, metais bronze/prata. Contraste de texto é prioritário.
7. Animações discretas em hover/revelação e `prefers-reduced-motion` respeitado. Foco por teclado, títulos e botões HTML não perdem acessibilidade.
8. Os componentes **Host.tsx, Screen.tsx, Player.tsx, PodiumBoard.tsx** continuam ligados ao mesmo multiplayer. Não refatorar lógica de 8 rodadas, autenticação ou mensagens só por motivo estético.
9. As imagens do usuário permanecem no upload da conversa, disponíveis no pacote original de referência. Este MD guarda os nomes/dimensões e os contratos de layout, **mas não finge incorporar os quatro PNG à árvore Git**.
10. A aceitação **não é** igual a CI verde: precisa de comparação humana lado a lado com GM-01..04. A V7.1 da `main` fica protegida até aprovação estética e teste real em sala.

## Matriz de fidelidade e diferenças verificadas

- **GM-01:** V7.2 já tem foto, centro e ranking funcional, mas a cena e o texto são relativamente pequenos e as três faixas de telemetria/controles não têm o mesmo impacto. Priorizar a legibilidade do telão e a faixa de status sem esconder a pergunta.
- **GM-02:** o ranking real e os três retratos estão corretos, porém a arte original mostra **Justiça de corpo inteiro**, retratos heróicos, medalhas e iluminação mais fortes. Adicionar a prop Justiça como camada atrás do pódio e ampliar a hierarquia; evitar sobrepor métricas em 720p.
- **GM-03:** o Host já tem navegação, ranking, comandos e cenas, mas precisa dar maior presença aos controles coloridos, à ação principal e à moldura da cena, preservando o estado da partida.
- **GM-04:** jogador tem pergunta e quatro respostas e envio real, mas o cabeçalho/progresso e o cartão de identidade são visualmente modestos em comparação ao conceito. Aumentar hierarquia sem adicionar rolagem horizontal nem sacrificar o CTA.

## Auditoria: onde entrar no código

- `react-app/src/components/PodiumBoard.tsx`: camadas decorativas e retratos dinâmicos de GM-02.
- `react-app/src/features/Host.tsx`: distribuição e comandos GM-03.
- `react-app/src/features/Screen.tsx`: telão GM-01, manter `SceneMedia`/respostas reais.
- `react-app/src/features/Player.tsx`: experiência GM-04.
- `react-app/src/styles/v72-premium.css`: ajustes de composição, responsividade e estados.
- `react-app/tests/v7-browser.cjs`, `react-app/tests/v72-scene-layers.cjs`: regressões de legibilidade e ausência de sobreposição.

## Aprovação e release

Status de Golden Master: **REFERÊNCIA FIXADA, NÃO HOMOLOGADA**.
Status do PR #6: **DRAFT**.
Pré-requisitos de merge: CI e QA aprovados no SHA final, imagens revisadas junto das GM-01..04, leitura de QR físico, projeção 720p/1080p, entrada/8 rodadas/pódio com jogadores reais.

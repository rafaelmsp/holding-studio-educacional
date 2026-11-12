# THE CRIMES LIVE — Direção de arte V6 (planejamento aprovado)

**Data:** 11/11/2026  
**Status:** projeto visual e produção de artes-conceito; **não integrado ao React nem publicado na produção**.  
**Referências:** quatro capturas enviadas pelo usuário: pódio final, Host de rodada, telão e celular.

## Objetivo
Aproximar o React V5 do visual cinematográfico das referências, criando **artes reais independentes** e organizando-as como um quebra-cabeça: cenários, molduras, componentes, personagens, ícones, efeitos e camadas dinâmicas. Evitar a aparência de dashboard genérico. O texto vivo continua em React, não dentro de screenshots rasterizadas.

## Padrão visual
Noir fotográfico: justiça de bronze, cidade chuvosa, vidro negro, metal escovado e luzes **ciano #43D9FF**, **vermelho #E62D4C**, **ouro #F2BD65**, verde para correto e prata/bronze para o pódio. Bordas facetadas, reflexos controlados, iluminação cinemática e tipografia branca de alto contraste.

## Layout de referência
1. **Entrada/casos:** seis cards fotográficos, ajustes à direita e CTA de sala destacado. Ao criar sala, sair da entrada; nunca empilhar telas.
2. **Host/lobby:** menu à esquerda; QR e número da sala centrais; participantes à direita; barra de status e controles inferiores.
3. **Host/rodada:** cena principal e pergunta/alternativas no centro, ranking e progresso à direita, barra superior com rodada, dock de comandos e progresso do caso no rodapé.
4. **Telão:** fotografia, pergunta e alternativas grandes, timer, respostas e ranking sem menu administrativo; 1920×1080 legível à distância.
5. **Mobile:** composição retrato própria (360/390/412 px), avatar, rodada, imagem, pergunta, opções e botão Responder; não comprimir o desktop.
6. **Final/pódio:** cards em ordem visual **2º–1º–3º**, bustos dos personagens realmente selecionados, medalhas prata/ouro/bronze, ranking 4+, desempenho da turma e ações autorizadas.

## Camadas e assets
- **Backgrounds:** Host, seleção, lobby, telão, jogador e pódio; WebP sem texto/UI.
- **Molduras:** pergunta, ranking, progresso, QR, cards de caso, jogador, modal e pódio; exportação em PNG/WebP com alpha e, quando aplicável, 9-slice.
- **Botões:** famílias ouro, ciano, vermelho, verde e aço; normal, hover e pressed; texto e ação em React, disabled/focus-visível acessíveis.
- **Personagens:** 12 perfis estáveis mais 12 recortes de busto para pódio; ID de avatar persistido e enviado pelo servidor.
- **Conteúdo:** 6 casos × 8 cenas = 48 ilustrações narrativas, aproveitando as existentes até a revisão.
- **Medalhas e props:** 1º/2º/3º, troféu, balança da Justiça, martelo, livros, dossiê, vinheta, flare e texturas.
- **Ícones:** preferencialmente SVG/Lucide com tokens de cor.

## Integração técnica planejada
- `react-app/src/features/Host.tsx`: separar setup/lobby/rodada com estados exclusivos; montar cenários e HUD.
- `react-app/src/features/Screen.tsx`: telão e pódio cinematográficos.
- `react-app/src/features/Player.tsx`: entrada/rodada/final em mobile.
- `react-app/src/components/Chrome.tsx`: extrair skins para `ArtFrame`, `SkinButton`, `CharacterPortrait`, `PodiumCard`, `CaseScene`.
- `react-app/src/services/catalog.ts`: mapa de IDs dos 12 personagens e assets;
- API/Supabase: persistir o avatar escolhido **de forma autenticada**, pois hoje a escolha vive no browser/Presence e não é garantia de imagem estável no pódio final.

## Validação
A ordem do pódio deve seguir o ranking real; nomes, acertos, pontos, sequência e exposição vêm do servidor, **sem métricas fictícias**. Testar entrada de dois jogadores com avatares diferentes, desconexão, resposta, revelação, pódio e reset autorizado. Validar 1366×768, 1440×900, 1920×1080, 360×800, 390×844 e 412×915; sem overflow, textos/QR sobrepostos ou botões sem funcionamento.

## Lotes e autorização
0. **Produzido nesta etapa:** quatro referências catalogadas, sete novas composições-conceito (incluindo styleboards e roadmap visual), cinco backgrounds limpos, dez pranchas de peças e plano detalhado disponibilizados na conversa.
1. Exportar individualmente frames e skins com alpha, incluindo fundo vertical mobile.
2. Persistir personagens no backend e preparar 12 bustos.
3. Compor entrada/lobby e Host.
4. Compor telão e jogador.
5. Montar pódio final e ranking complementar.
6. Aplicar efeitos Motion/GSAP, QA visual/funcional, teste de turma e publicação.

**Regra:** referências são referências, não imagens únicas clicáveis. A implementação e a publicação aguardam um sinal explícito do usuário.

# THE CRIMES LIVE V6.2 — Direção cinematográfica avançada

Data: 12/11/2026

## Produção entregue
- Pódio real no Host ao encerrar a partida, além do pódio do telão. Mesmo ranking e mesmos avatares persistidos, sem dados fictícios.
- Abertura breve de capítulo no telão, com título dinâmico da rodada e do caso, não interativa e sem bloquear comandos. Em preferências de movimento reduzido, a animação não é exibida.
- Indicador REC com número da cena, textura de filme discreta e iluminação suave.
- Resposta revelada com destaque da alternativa correta e animação curta; transição sutil da ordem do ranking.
- Celebração cinematográfica decorativa no pódio, sem áudio, com partículas desligadas em reduced-motion.
- Mobile com botão de resposta persistente durante rolagem, confirmação da resposta e seleção de avatar com destaque.
- Host com feedback de cópia do link, inclusive tratamento de indisponibilidade do Clipboard.
- Galeria real de oito visões, incluindo revelação e pódio do Host, gravadas por Playwright.

## Regras preservadas
- Supabase multiplayer, QR real, 6 casos × 8 rodadas, 12 personagens, temporizador real, correções e pontuação mantidos.
- Nenhuma chamada extra à API, mudança em esquema, sessão ou credenciais.
- Efeitos decorativos não funcionam como cronômetros fictícios, não escondem alternativas e não bloqueiam interação.
- Assets publicados no GitHub Pages; somente componentes e CSS da V6.2 adicionados.

## Evidências
- npm run build: TypeScript e Vite aprovados.
- npm run test:metrics, npm run test:v6, npm run test:visual, tests/assets.test.cjs.
- QA Chrome Playwright com 16 capturas de Host, telão e jogador (1600×900, 1920×1080, 390px).
- Capítulo exibido e removido automaticamente, oculto sob reduced-motion.
- Copiar link confirmou interação; CTA mobile é sticky; pódio do Host existe e aceita reinício.
- Partida de 8/8 rodadas com reset, avatares reais e ERROS [].
- CI GitHub e smoke público previstos após o PR.

## Limites
- Não é uma reprodução pixel a pixel das ilustrações conceituais.
- Este QA não é certificação de desempenho para 50+ jogadores nem compatibilidade universal de navegadores.

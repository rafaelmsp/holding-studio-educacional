# THE CRIMES LIVE — Refinamento V6.1 (12/11/2026)

## Mudanças implementadas
- Identidade visual, tipografia, botões e hierarquia refinadas no Host, telão e mobile: react-app/src/styles/v6-polish.css.
- Layout compacto por altura na Central do Host em 1600 × 900: os controles permanecem dentro do viewport.
- Resultados reais: centralização do cálculo em src/services/score.ts para Host, celular e pódio. Rodadas sem resposta não entram como tentativas de acerto.
- Foco de teclado, legibilidade para apresentação, alvos de toque e preferência de movimento reduzido.
- 15 capturas reais de teste atualizadas, seis miniaturas WebP para a galeria pública.
- QA de regressão com asserção de posição da barra de comandos do Host.

## Validação
- npm run build: aprovado, TypeScript e Vite.
- npm run test:v6, npm run test:visual, node tests/assets.test.cjs: aprovados.
- npm run test:metrics: quatro testes aprovados, inclusive exclusão de unanswered.
- node qa-v6.cjs: 15 telas sem imagens quebradas/overflow horizontal, 8/8 rodadas, pódio com avatar persistido, reset, sem erros de console.
- Capturas Host 1600 × 900, telão 1920 × 1080 e jogador 390 × 1187 (mobile com rolagem vertical natural).
- Código funcional isolado em branch para CI antes do merge.

## Limites
- Capturas são evidência de QA, não certificação cross-browser universal.
- Direção noir aproximada, sem reprodução pixel a pixel das imagens-conceito.

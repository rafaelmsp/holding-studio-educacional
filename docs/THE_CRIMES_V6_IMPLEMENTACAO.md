# THE CRIMES LIVE — V6 Cinemática (implementação)

**Data:** 12/11/2026  
**Código:** \`feat/the-crimes-v6-cinematic\`  
**Jogo:** React 19, TypeScript, Vite, Zustand, Motion, GSAP, Supabase  
**Referências de arte:** as quatro composições aprovadas (Host ao vivo, telão, mobile, pódio).  
**Arquivo gerador:** \`react-app/scripts/build-v6-art.py\`.

## Implementação

- **Visuais independentes:** 5 fundos WebP, 15 texturas de botões para estados normal/hover/pressionado, 12 retratos de personagens com transparência de transição, 5 molduras vetoriais, uma figura decorativa de Justiça (manifesto em \`assets/the-crimes-v6/manifest.json\`).
- **React V6:** tema sobreposto em \`react-app/src/styles/v6.css\`, preservando os componentes, dados e interatividade reais do V5.
- **Casos:** mantidos seis casos jurídicos, 8 questões/cenas por caso; seleção em galeria de imagens premium.
- **Host/Lobby:** composição dedicada para QR de entrada, código, caso escolhido, instruções e lista de jogadores. A tela de partida mantém menu, pergunta, cena, ranking, respostas, pontuação e controles com skins.
- **Telão:** cenas e alternativas em fonte grande, painel responsivo, feedback de correção e classificação; comandos só quando Host autorizado.
- **Mobile:** entrada com 12 personagens, quiz, cronômetro, resposta única, informações da sessão e final individual; ajustes específicos de largura e acessibilidade.
- **Pódio:** \`PodiumBoard.tsx\` com ordem 2º/1º/3º, medalhas, retratos dos personagens selecionados, pontos e acertos verdadeiros, ranking 4+, ações de reset autorizadas. Não contar o campo \`counters.unanswered\` como resposta registrada.
- **Identidade persistente:** o frontend envia \`avatarId\` ao join; a Edge Function já grava \`avatar_id\` nas tabelas privada e pública. O painel usa prioridade da fonte do servidor em vez de Presence.
- **Galeria de homologação:** \`/live/showroom-v6.html\`, composta de seis capturas reais da partida de QA; todas as fotos estão em \`docs/preview/v6/*.webp\`.

## Como gerar

No diretório raiz do repositório:

\`\`\`powershell
python react-app/scripts/build-v6-art.py
python react-app/scripts/build-v6-decor.py
cd react-app
npm ci --no-audit --no-fund
npm run build
npm run test:v6
node tests/assets.test.cjs
npm run test:visual
\`\`\`

Para teste visual end-to-end, sirva **a raiz** do repositório (não apenas \`react-app\`), por exemplo:

\`\`\`powershell
python -m http.server 8148 --bind 127.0.0.1
\`\`\`

Em outro terminal:

\`\`\`powershell
cd react-app
npm run test:v6:browser
python scripts/export-v6-previews.py
\`\`\`

QA faz requisições para o projeto Supabase ativo e cria uma sala de demonstração; não execute em repetição contínua. Para executá-lo em endereço diferente, use \`TC_V6_QA_BASE\`.

## Contratos de segurança e acessibilidade

- O navegador do jogador não recebe \`adminToken\`.
- Rejeita respostas fora da rodada, bloqueadas ou duplicadas no servidor existente.
- O Host confirma avanço com participantes pendentes, reset e encerramento.
- Renderização de textos, alternativas, ranking e estatísticas pelo React (não desenhados em um screenshot sem interação).
- O tema responde a \`prefers-reduced-motion\`, possui \`:focus-visible\` e não exige hover no celular.
- Não expor variáveis de ambiente, tokens de sessão ou senhas ao exibir resultados.

## Validação e evidências

Os testes automatizados incluem seleção de caso, criação de sala, entrada de três jogadores com personagens diferentes, sincronização via Supabase, abertura do telão, início de rodada, registro de resposta, revelação da alternativa correta, encerramento, pódio e retorno ao lobby.

Cada screenshot é gerado por Playwright/Chrome em uma aplicação funcional e exportado em WebP para revisão. O fluxo de reset também está no QA.

Os testes de contratos são executados no GitHub Actions. O teste de navegador foi executado no computador autorizado isolado em \`C:\Temp\the-crimes-v6-local\`, sem alterar a cópia de trabalho pré-existente.

## Arte e limites

Os fundos são adaptações fotográficas dos fundos originais do próprio repositório. A direção de arte procura máxima proximidade composicional com as referências, mas não representa fidelidade pixel a pixel. Os fundos existentes são suficientes para executar V6 sem imagens de tela inteira simuladas.

## URLs após publicar

- Host: \`https://rafaelmsp.github.io/holding-studio-educacional/live/?view=host\`
- Telão: \`https://rafaelmsp.github.io/holding-studio-educacional/live/?view=screen&room=CRIM-XXXX\`
- Jogador: \`https://rafaelmsp.github.io/holding-studio-educacional/live/?view=player&room=CRIM-XXXX\`
- Galeria V6: \`https://rafaelmsp.github.io/holding-studio-educacional/live/showroom-v6.html\`

## Homologação integral de 8 rodadas

Em 12/11/2026, o script `react-app/qa-v6-8rounds.cjs` percorreu as oito perguntas consecutivas de uma partida de teste no Supabase, com personagem **Delegado**, registro de resposta e revelação da alternativa em cada rodada. O comando **CONCLUIR 8ª RODADA** produziu o estado final, e o telão exibiu `8/8` e o avatar escolhido. Saída: `EIGHT_ROUNDS_PASSED 8`, código de saída `0`. Relatório estruturado: `docs/preview/v6/qa-eight-rounds.json`.

O teste de 14 capturas do fluxo principal também comprovou criação de sala, três personagens distintos, resposta, encerramento e retorno ao lobby, sem erros de navegador, imagens quebradas ou overflow horizontal.

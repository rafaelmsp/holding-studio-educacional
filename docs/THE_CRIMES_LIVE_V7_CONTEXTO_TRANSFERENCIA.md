# THE CRIMES LIVE V7 — CONTEXTO DE TRANSFERÊNCIA

> Cole este arquivo inteiro na próxima conversa para continuar a implementação sem perder o contexto.

## 1. Objetivo

Continuar e finalizar o jogo educacional **THE CRIMES LIVE**, uma experiência multiplayer para apresentação em sala de aula. O jogo demonstra casos jurídicos de forma didática, cinematográfica e visualmente inspirada em um painel noir de investigação.

O objetivo é entregar uma versão React funcional, responsiva e publicável no GitHub Pages, com:

- Host/professor criando e controlando a sala;
- alunos entrando pelo celular por código/QR;
- escolha de nome, gênero, personagem e função visual;
- perguntas em oito rodadas;
- respostas individuais com revelação posterior;
- ranking, telemetria e pódio final;
- interface de telão desktop e interface móvel real;
- visual cyber-noir jurídico, sem gravar textos ou controles dentro das imagens.

## 2. Repositório e execução

- Repositório: `rafaelmsp/holding-studio-educacional`
- Branch de trabalho: `feat/v7-mobile-host`
- Pull Request: `#4`
- Base recuperada: V6.2, commit `e4742ac1b097be19e7cbef2513c4bec315c87d27`
- Diretório local: `/workspace/scratch/dd955f9c50f2/holding-studio-educacional`
- Aplicação pública: `https://rafaelmsp.github.io/holding-studio-educacional/live/?view=host`

Comandos principais:

```bash
cd /workspace/scratch/dd955f9c50f2/holding-studio-educacional
npm --prefix react-app ci
npm --prefix react-app run build
npm --prefix react-app run test:metrics4
npm --prefix react-app run test:v62
npm --prefix react-app run test:v6
npm --prefix react-app run test:visual
node react-app/tests/assets.test.cjs
node tests/live-primary-react.test.cjs
```

O build publica os artefatos compilados em `live/` e `react-live/` por meio de `scripts/publish-primary.mjs`.

## 3. Estado já implementado

### Host/lobby

- Lobby desktop inspirado no painel de referência.
- Lobby móvel com composição própria, não apenas desktop reduzido.
- Menu móvel com foco contido, tecla `Escape`, fundo inerte e bloqueio de rolagem.
- Compartilhamento nativo usando `navigator.share`, com fallback para copiar o link.
- QR gerado a partir da URL efetiva da sala.
- Cartão do caso abre detalhes em diálogo real.
- Botão de início utiliza ação dourada.
- Jogadores, código da sala, status e convite aparecem no primeiro viewport.

### Rodada e telão

- Layout desktop em três áreas: cena, pergunta e telemetria.
- Cronômetro usa a mesma data-limite sincronizada da sala.
- A indicação de revelação acompanha o estado real da sala.
- Ranking, fase e contagem de respostas são dados reais.
- Cenas existentes dos casos foram preservadas.
- O jogador vê respostas selecionadas em ciano; verde só aparece depois da revelação.

### Jogador

- Layout móvel para uso em celular.
- Seleção de personagem/gênero preservada.
- Resposta só pode ser enviada uma vez por rodada.
- O jogador recebe orientação para conferir o pódio no telão.

### Pódio

- Composição 2–1–3: segundo à esquerda, primeiro ao centro, terceiro à direita.
- Revelação animada na ordem 3 → 2 → 1.
- Retratos e funções persistem no resultado.
- Medalhas foram afastadas dos nomes e pontuações.
- Existe apenas uma ação final: voltar ao lobby.
- Respeito a `prefers-reduced-motion`.

## 4. Arquivos principais alterados

```text
react-app/src/features/Host.tsx
react-app/src/features/Player.tsx
react-app/src/features/Screen.tsx
react-app/src/components/Chrome.tsx
react-app/src/components/PodiumBoard.tsx
react-app/src/components/RoundTelemetry.tsx
react-app/src/styles/v7-console.css
react-app/src/main.tsx
react-app/src/services/catalog.ts
react-app/tests/v7-browser.cjs
react-app/tests/assets.test.cjs
react-app/qa-v6.cjs
.github/workflows/the-crimes-v7-qa.yml
```

## 5. Artes de produção

As imagens foram criadas para deixar o centro livre para HTML real. Não há textos, botões, QR codes ou resultados incorporados nas imagens.

```text
assets/the-crimes-v7/backgrounds/desktop.webp
assets/the-crimes-v7/backgrounds/mobile.webp
assets/the-crimes-v7/backgrounds/round.webp
assets/the-crimes-v7/backgrounds/player.webp
assets/the-crimes-v7/backgrounds/podium.webp
assets/the-crimes-v7/props/detective.webp
assets/the-crimes-v7/manifest.json
```

Os 12 retratos existentes e as 48 cenas existentes da V6 continuam preservados. Os fundos seguem a direção: cidade noturna, azul-marinho, ciano, ouro, vermelho, objetos jurídicos, bronze e investigação noir.

## 6. Testes já realizados

### Testes locais

- Build TypeScript/Vite concluído.
- Testes de métricas V5/V6/V6.2 concluídos.
- Integridade de assets concluída.
- Integridade dos bundles `live` e `react-live` concluída.
- Verificação de `git diff --check` concluída.

### Playwright no GitHub Actions

Arquivo: `.github/workflows/the-crimes-v7-qa.yml`

A suíte mock testa 360, 390, 412, 1672 e 1920 pixels, incluindo:

- imagens carregadas;
- ausência de erro JavaScript;
- ausência de overflow horizontal;
- menu, `Escape` e compartilhamento;
- diálogo de detalhes do caso;
- dock do host no primeiro viewport;
- seleção de personagem/gênero;
- resposta selecionada sem correção antecipada;
- envio único;
- oito respostas;
- pódio final;
- retrato do vencedor visível;
- respeito a movimento reduzido.

### Teste com Supabase real

O workflow real foi executado com três jogadores de teste. Foram confirmados:

- criação e entrada na sala;
- cópia/convite;
- capítulo e estado da rodada;
- resposta móvel;
- revelação;
- oito rodadas (`1/8` até `8/8`);
- pódio com avatares persistidos;
- reinício da sala;
- log final `ERRORS []`.

## 7. Pendências honestas

Estas verificações não devem ser declaradas como concluídas sem novo teste:

1. leitura física do QR em aparelhos reais;
2. teste em celulares Android/iOS reais com rede móvel;
3. comparação artística pixel a pixel com as imagens-conceito;
4. desempenho em aparelhos de baixo custo;
5. conferência final do bundle publicado após o último ajuste de cabeçalho móvel;
6. eventual revisão estética de fontes, espaçamentos e contraste com o professor/projetor.

Não declarar “100% idêntico às imagens” nem “homologação final” antes dessas verificações.

## 8. Próxima sequência recomendada

1. Conferir `git status` e preservar alterações locais.
2. Executar `npm --prefix react-app run build`.
3. Rodar os testes locais listados acima.
4. Rodar o workflow `the-crimes-v7-qa.yml`.
5. Baixar e visualizar as capturas de Host, rodada, jogador e pódio.
6. Corrigir somente problemas visuais ou funcionais comprovados.
7. Fazer commit e atualizar o PR #4.
8. Depois de todos os checks verdes, publicar/mesclar.
9. Verificar a URL pública e confirmar que o HTML aponta para os bundles novos.

## 9. Instrução para a próxima conversa

Comece lendo este arquivo e responda com:

```text
Contexto V7 carregado. Vou primeiro verificar o estado atual do repositório, o último build, os checks do PR #4 e a URL publicada. Depois continuarei apenas a partir das pendências comprovadas, sem refazer o que já está validado.
```

Em seguida, faça a auditoria real do estado atual antes de editar. Não recrie o projeto do zero e não substitua as artes, cenas, retratos ou lógica já preservados sem evidência de regressão.

## 10. Critério de conclusão

O projeto pode ser considerado entregue quando:

- o build passa;
- os testes mock passam;
- o teste real de multiplayer passa;
- a URL pública carrega a versão atual;
- Host, rodada, jogador e pódio são utilizáveis em desktop e celular;
- não há overflow ou erro JavaScript comprovado;
- QR, convite, respostas, revelação e pódio funcionam;
- as diferenças visuais restantes estão documentadas, não escondidas.


# THE CRIMES — Cidade do Crime

**Projeto completo: simulador jurídico educacional de fraudes patrimoniais**  
**Versão:** 2026-11-09 · **Idioma:** português (Brasil) · **Publicação:** GitHub Pages  
**Endereço da aula:** https://rafaelmsp.github.io/holding-studio-educacional/operacoes-clandestinas.html  
**Módulo complementar preservado:** https://rafaelmsp.github.io/holding-studio-educacional/showroom.html

> **Finalidade acadêmica:** acompanhar fatos fictícios, identificar controvérsias de Direito, documentos e possíveis consequências. O projeto não ensina a executar, ocultar, aperfeiçoar ou burlar a fiscalização de delitos. Um cenário suspeito não significa culpa comprovada.

## 1. Resultado esperado

Um único módulo **The Crimes** integrado ao site **Holding Studio**. Ao selecionar um caso, o projetor exibe uma imagem cinematográfica do acontecimento. O estudante passa por oito cenas, lê três análises curtas (Explicação, Jurídico e Documentos), acompanha uma cronologia e responde ao desafio final. 

**Interface aprovada:** cabeçalho com skyline chuvoso, logotipo branco/vermelho, navegação lateral com seis casos, grande palco fotográfico central, painel jurídico à direita, trilha visual de oito cenas na parte inferior e botões de próxima/anterior no rodapé. Preto grafite, vermelho de crime urbano e dourado de Direito.

## 2. Arquitetura do repositório

```text
holding-studio-educacional/
├── showroom.html                            # Módulo 01: Viabilidade (inalterado)
├── operacoes-clandestinas.html              # Módulo 02: The Crimes (página existente reconstruída)
├── src/
│   ├── operacoes-clandestinas.css           # UX Premium para projetor e celular
│   └── operacoes-clandestinas.js            # 6 casos, navegação, abas e quiz
├── assets/the-crimes/
│   ├── city-banner.webp                     # skyline principal
│   ├── manifest.json                        # catálogo de arquivos
│   ├── portraits/                           # 6 miniaturas dos casos
│   └── scenes/                              # 6 pastas × 8 imagens WebP
└── docs/
    └── THE_CRIMES_PROJETO_COMPLETO.md       # este documento
```

**Tecnologias em produção:** HTML5 semântico, CSS Grid/Flexbox, JavaScript ES2022, SVG inline para ícones e WebP para imagens. Tudo roda diretamente no GitHub Pages **sem backend, npm, React ou build obrigatório**. React/TypeScript/Vite/Motion podem ser usados em futura migração, mas não são necessários para reproduzir esta experiência e acrescentariam risco à calculadora já publicada.

## 3. UX do telão — regras objetivas

| Região | Disposição | Regra de legibilidade |
|---|---|---|
| Cabeçalho | Skyline, marca, título e link Viabilidade | Sem elementos pequenos sobre fotografia clara |
| Lateral | Seis botões com retrato e nome | Seleção por contraste vermelho |
| Palco | Fotografia 16:9 e título da cena | Fotografia sem texto fixo; tipografia HTML sobre gradiente na base |
| Painel | Três abas: Explicação, Jurídico, Documentos | Até três blocos curtos de conteúdo |
| Timeline | Oito miniaturas reais do caso | A cena ativa tem borda dourada |
| Rodapé | Voltar, reiniciar, avançar | Controles preservados na altura da tela |

A grade se adapta à altura do navegador. Em notebooks e celulares abaixo de 1024 px, os painéis são empilhados e a timeline desliza horizontalmente; o conteúdo não é cortado. **NÃO criar tela adicional, dashboard de indicadores, pop-up de instalação de artes ou importação manual de ZIP.**

## 4. Roteiro integral: seis casos × oito quadros

Cada quadro corresponde a um arquivo WebP **1280 × 720** e a um objeto de dados no JavaScript. As cenas são representações artísticas de acontecimentos, sem retratar documentos reais nem pessoas reais.


### Caso 01 — Fraude contra credores
**Diretório:** `assets/the-crimes/scenes/credores/`

| Etapa | Objetivo do quadro | Imagem exata |
|---:|---|---|
| 1 | Contexto inicial | `01_contexto.webp` |
| 2 | Estrutura jurídica | `02_estrutura.webp` |
| 3 | Operação representada | `03_operacao.webp` |
| 4 | Efeito patrimonial | `04_efeito.webp` |
| 5 | Conflito | `05_conflito.webp` |
| 6 | Apuração documental | `06_apuracao.webp` |
| 7 | Consequências jurídicas | `07_consequencias.webp` |
| 8 | Debate e quiz | `08_debate.webp` |

**Retrato:** `assets/the-crimes/portraits/credores.webp`


### Caso 02 — Ocultação patrimonial na meação
**Diretório:** `assets/the-crimes/scenes/meacao/`

| Etapa | Objetivo do quadro | Imagem exata |
|---:|---|---|
| 1 | Contexto inicial | `01_contexto.webp` |
| 2 | Estrutura jurídica | `02_estrutura.webp` |
| 3 | Operação representada | `03_operacao.webp` |
| 4 | Efeito patrimonial | `04_efeito.webp` |
| 5 | Conflito | `05_conflito.webp` |
| 6 | Apuração documental | `06_apuracao.webp` |
| 7 | Consequências jurídicas | `07_consequencias.webp` |
| 8 | Debate e quiz | `08_debate.webp` |

**Retrato:** `assets/the-crimes/portraits/meacao.webp`


### Caso 03 — Questionamento de cessões e legítima
**Diretório:** `assets/the-crimes/scenes/herdeiros/`

| Etapa | Objetivo do quadro | Imagem exata |
|---:|---|---|
| 1 | Contexto inicial | `01_contexto.webp` |
| 2 | Estrutura jurídica | `02_estrutura.webp` |
| 3 | Operação representada | `03_operacao.webp` |
| 4 | Efeito patrimonial | `04_efeito.webp` |
| 5 | Conflito | `05_conflito.webp` |
| 6 | Apuração documental | `06_apuracao.webp` |
| 7 | Consequências jurídicas | `07_consequencias.webp` |
| 8 | Debate e quiz | `08_debate.webp` |

**Retrato:** `assets/the-crimes/portraits/herdeiros.webp`


### Caso 04 — ITBI e integralização de imóveis
**Diretório:** `assets/the-crimes/scenes/itbi/`

| Etapa | Objetivo do quadro | Imagem exata |
|---:|---|---|
| 1 | Contexto inicial | `01_contexto.webp` |
| 2 | Estrutura jurídica | `02_estrutura.webp` |
| 3 | Operação representada | `03_operacao.webp` |
| 4 | Efeito patrimonial | `04_efeito.webp` |
| 5 | Conflito | `05_conflito.webp` |
| 6 | Apuração documental | `06_apuracao.webp` |
| 7 | Consequências jurídicas | `07_consequencias.webp` |
| 8 | Debate e quiz | `08_debate.webp` |

**Retrato:** `assets/the-crimes/portraits/itbi.webp`


### Caso 05 — Receitas locatícias em disputa
**Diretório:** `assets/the-crimes/scenes/alugueis/`

| Etapa | Objetivo do quadro | Imagem exata |
|---:|---|---|
| 1 | Contexto inicial | `01_contexto.webp` |
| 2 | Estrutura jurídica | `02_estrutura.webp` |
| 3 | Operação representada | `03_operacao.webp` |
| 4 | Efeito patrimonial | `04_efeito.webp` |
| 5 | Conflito | `05_conflito.webp` |
| 6 | Apuração documental | `06_apuracao.webp` |
| 7 | Consequências jurídicas | `07_consequencias.webp` |
| 8 | Debate e quiz | `08_debate.webp` |

**Retrato:** `assets/the-crimes/portraits/alugueis.webp`


### Caso 06 — Operações entre empresas do grupo
**Diretório:** `assets/the-crimes/scenes/grupos/`

| Etapa | Objetivo do quadro | Imagem exata |
|---:|---|---|
| 1 | Contexto inicial | `01_contexto.webp` |
| 2 | Estrutura jurídica | `02_estrutura.webp` |
| 3 | Operação representada | `03_operacao.webp` |
| 4 | Efeito patrimonial | `04_efeito.webp` |
| 5 | Conflito | `05_conflito.webp` |
| 6 | Apuração documental | `06_apuracao.webp` |
| 7 | Consequências jurídicas | `07_consequencias.webp` |
| 8 | Debate e quiz | `08_debate.webp` |

**Retrato:** `assets/the-crimes/portraits/grupos.webp`


## 5. Ícones e componentes

Todos os ícones da interface são **vetores SVG declarados no próprio HTML**, com `viewBox` escalável, `currentColor` e contraste alto. Inventário: pasta, moedas/credores, alianças/meação, pessoas/herdeiros, casa/ITBI, chave/aluguéis, edifício/grupo societário, livro/explicação, balança/jurídico, documento, alerta, alvo, play, setas, reiniciar, lupa, ficha e filme/timeline. Nenhum arquivo de fonte ou pacote externo é necessário.

## 6. Funcionamento da aula

1. Abra **The Crimes**, selecione o caso na coluna esquerda.
2. Apresente a **cena 1** e leia o resumo sobreposto na imagem.
3. Use **Explicação**, **Jurídico** e **Documentos** para discutir o mesmo fato.
4. Clique em **Próxima etapa** ou no quadro da timeline; as imagens mudam junto com os textos.
5. Use **Aprofundar esta etapa** para abrir o material do docente com documentos e links oficiais.
6. No quadro 8, abra **Explicação**, escolha uma das três alternativas e confira a justificativa.
7. Continue para outro caso; o estado é salvo localmente no navegador (sem cadastro).

**Atalhos:** `←`, `→` para navegação, `1` a `8` para salto de etapa. Botões têm rótulos acessíveis e `aria-pressed` na seleção.

## 7. Fontes legais e rigor acadêmico

- [Código Civil compilado](https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm): arts. 50, 158–167, 544, 549.
- [CPC](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm): arts. 133–137 e 792.
- [Constituição Federal](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm): art. 156, § 2º, I.
- [Lei 8.137/1990](https://www.planalto.gov.br/ccivil_03/leis/l8137.htm): ordem tributária.
- [Lei 9.613/1998](https://www.planalto.gov.br/ccivil_03/leis/l9613.htm): lavagem e ocultação de bens.

**Distinção a ensinar:** fraude contra credores e fraude à execução não produzem necessariamente o mesmo efeito. Para a primeira, examinar as hipóteses do CC; para a segunda, examinar as do art. 792 do CPC, incluindo eventual ineficácia em relação ao exequente. A lavagem exige elementos típicos específicos; a simples existência de holdings, múltiplos CNPJs ou operações intragrupo não comprova delito.

## 8. Arte e organização dos arquivos

As **48 cenas finais** são **composições cinematográficas individuais** criadas a partir de um conjunto de artes-base ultrarrealistas previamente produzidas no estilo noir urbano aprovado: ambientes corporativos noturnos, personagens fictícios, interiores de escritórios, cidade chuvosa, arquivos e tribunais. Cada arquivo tem nome, ordem, proporção e rota definidos. **Não são 48 gerações independentes por IA**; são 48 composições finalizadas a partir das artes-base, com enquadramentos e cenas complementares. Não incluir textos dentro do WebP: todo título, número, quiz, botão e explicação é HTML editável.

**Otimização:** WebP 1280×720 para os quadros, WebP 440×280 para retratos, banner panorâmico 1600×300. O navegador baixa sob demanda os oito frames do caso exibido, com miniaturas e pré-carregamento da próxima cena.

## 9. Publicação e atualização

A aplicação usa o caminho existente `operacoes-clandestinas.html`, publicado na branch `main` do repositório `rafaelmsp/holding-studio-educacional`. Ao confirmar o commit, o GitHub Pages serve os arquivos estáticos conforme sua configuração existente. Se não atualizar automaticamente, consulte **Settings → Pages** no repositório. Faça refresh sem cache (`Ctrl + F5`).

Para substituir uma ilustração: exporte outra imagem WebP 16:9 com o **mesmo nome e na mesma pasta** indicada no catálogo. Não precisa editar o JS. Para alterar a análise jurídica, revise o bloco de dados da respectiva etapa em `src/operacoes-clandestinas.js`.

## 10. Checklist de aceite

- [x] Seis casos descritos, oito cenas por caso.
- [x] Inventário de 48 WebP 1280×720, 6 retratos e banner.
- [x] Layout com cinema, painel jurídico, timeline e navegação.
- [x] Tabs de conteúdo e quiz de conclusão para cada caso.
- [x] Sem backend e sem importação manual de artes.
- [x] Renderização validada em navegador automatizado no viewport 1920×1080; 6 casos, 8 etapas, abas e quiz funcionais.
- [x] 48 cenas WebP verificadas em 1280×720 e sem falhas de carregamento no pacote.
- [x] GitHub Pages publicou com sucesso o commit principal do projeto; o ajuste final de rótulos de timeline é acompanhado pela mesma pipeline.

**Notas de autoria:** recurso didático não oficial. Personagens, organizações e valores são fictícios. A redação não constitui orientação jurídica individual ou manual para prática de ilícitos.


## 11. Validação final — 09/11/2026

- **Viewport de QA:** 1920×1080 (projetor/telão 16:9).
- **Cenas verificadas:** 48/48 com `naturalWidth=1280` e `naturalHeight=720`.
- **Controles verificados:** seis casos, oito etapas, abas Explicação/Jurídico/Documentos, navegação anterior/próxima, reinício e quiz.
- **Comparação visual:** a renderização preserva a estrutura aprovada — skyline, sidebar de casos, palco cinematográfico central, painel jurídico direito, oito miniaturas e controles inferiores.
- **Deploy:** GitHub Pages executa a publicação automática a partir da branch `main`.
- **Limitação de QA:** o navegador conectado do ChatGPT não estava disponível nesta sessão; a inspeção visual foi feita por Chromium/Playwright local com os mesmos arquivos publicados.


## 12. Upgrade de apresentação e progresso — implementação final

Implementado na página existente `operacoes-clandestinas.html`, sem criar novo módulo:

- **Modo Telão:** reduz elementos secundários e aumenta a área útil da aula; estado persistido localmente.
- **Tela cheia:** botão dedicado e atalho `F`, usando a Fullscreen API do navegador.
- **Atalho `P`:** ativa/desativa o Modo Telão.
- **Atalhos `1–8`:** saltam diretamente para qualquer cena mesmo após uso das abas.
- **Progresso por caso:** cada card mostra `x/8 cenas` e uma barra discreta na base.
- **Progresso geral:** rodapé mostra `x/48 CENAS`.
- **Persistência:** caso, etapa, respostas, cenas vistas e Modo Telão são salvos em `localStorage`.
- **Pré-carregamento:** cena atual, anterior e próxima são carregadas imediatamente; as demais do caso entram em idle preload.
- **Transição de cena:** troca fotográfica com fade/zoom curto, respeitando `prefers-reduced-motion`.
- **Fallback de imagem:** se uma cena falhar, o banner panorâmico assume temporariamente.
- **Correção de assets:** retrato de Herdeiros e quadro 8 de Meação foram reconstruídos após QA detectar arquivos corrompidos.

### QA funcional final

Teste automatizado executado contra o commit final em servidor local isolado, viewport **1920×1080**:

- **6/6 casos** renderizados.
- **48/48 cenas** carregadas em **1280×720**.
- **6/6 retratos** carregados em **440×280**.
- Abas **Explicação**, **Jurídico** e **Documentos** funcionais.
- Quiz final com **3 alternativas** e feedback.
- Atalhos `1–8`, `←`, `→`, `F` e `P` implementados.
- Modo Telão confirmado por estado visual e `aria-pressed`.
- Persistência confirmada com **48/48 cenas vistas**.
- Fullscreen API disponível no navegador de QA.
- **0 erros de console** durante a varredura.
- GitHub Pages: deploy do commit funcional `f69d370a` concluído com sucesso.


## 13. Zona Cinzenta — exceções lícitas, limites e prova

Implementado como quarta aba do painel do The Crimes, ao lado de **Como foi feito**, **Ilícito** e **Provas & Leis**.

A aba **Zona Cinzenta** não oferece instruções para contornar a lei. Ela ensina o aluno a separar:

- **🟢 Permitido em tese:** estrutura ou ato que pode ser juridicamente válido.
- **🟡 Zona cinzenta:** conclusão dependente de cronologia, finalidade, valores, documentos ou outros requisitos.
- **🔴 Limite ultrapassado no caso fictício:** somente quando os fatos narrativos fornecem os elementos necessários para a conclusão didática.

Cada etapa mostra quatro blocos:

1. **Possibilidade lícita / argumento de defesa**
2. **Onde está o limite**
3. **O que ainda falta provar**
4. **Precedente ou regra-chave**

### Atualizações jurisprudenciais incorporadas

- **STF Tema 1.348 (20/10/2026):** a imunidade de ITBI na integralização de capital independe da atividade preponderante, inclusive imobiliária, ressalvada simulação ou fraude à lei e observado o limite quantitativo do Tema 796.
- **STF Tema 796:** a imunidade fica limitada ao valor destinado à integralização do capital social.
- **STJ Tema 1.210 (2026):** desconsideração da personalidade jurídica, nas relações civis e empresariais, exige prova efetiva de abuso por desvio de finalidade ou confusão patrimonial; mera falta de bens penhoráveis ou encerramento irregular não basta.
- **STJ Súmula 375:** para fraude à execução envolvendo terceiro adquirente, o registro da penhora ou a prova de má-fé do terceiro é elemento central da tese.
- **STJ REsp 2.171.573/MS:** utilizado no módulo sucessório para discutir liberalidade dissimulada, colação e necessidade de manifestação expressa quando pertinente.

O botão **Aprofundar esta etapa** também passa a mostrar a tese defensiva, o limite da zona cinzenta e o que ainda precisa ser provado, com links para as fontes oficiais.


## 15. THE CRIMES LIVE — Multiplayer final

Implementado em `/live/` com três modos na mesma interface:

- **Host/Admin:** cria a sala, escolhe o crime, exibe QR, inicia/pausa/bloqueia/revela/avança e monitora cada player.
- **Player mobile:** entra pelo QR, vê **AGUARDANDO INICIAR A PARTIDA...**, responde às 8 rodadas e recebe o resultado.
- **Telão:** acompanha QR, progresso, ranking e estado patrimonial em tempo real.

O servidor está em `/server/index.js`, usando Node.js + Express + Socket.IO, com persistência JSON das salas, eventos e respostas.

Cada resposta salva: alternativa, símbolo, classificação, tempo, score e estado patrimonial. O campo **OCULTOU BENS: SIM/NÃO** é explícito e separado da pontuação acadêmica. Ocultação nunca gera bônus.


## 16. QA final do multiplayer

Teste ponta a ponta executado em navegador real com Host + 2 players em sessões independentes e servidor Socket.IO local.

Resultado confirmado:

- sala criada com código `CRIM-####`;
- estado **AGUARDANDO INICIAR A PARTIDA...** exibido para os players;
- Host mostrou 2 jogadores conectados;
- partida iniciou e as alternativas foram sincronizadas;
- um player escolheu a alternativa 🔴 **ATITUDE CRIMINOSA NO CENÁRIO**;
- o servidor registrou `ocultouBens=true` e **0 pontos** para essa escolha;
- outro player escolheu 🟢 **JURIDICAMENTE ADEQUADA** e recebeu a pontuação acadêmica;
- o Admin exibiu explicitamente **OCULTOU BENS: SIM/NÃO**;
- o resultado final do player 🔴 mostrou **BENS AINDA NÃO LOCALIZADOS** sem tratar isso como vitória;
- o resultado final do player 🟢 mostrou **ESTRUTURA JURIDICAMENTE DEFENSÁVEL**;
- respostas, símbolos, classificações, score e eventos ficaram persistidos em JSON;
- reconexão é baseada em `sessionToken`;
- ranking permanece separado do resultado narrativo do personagem.

### Implantação

O frontend é publicado pelo GitHub Pages em `/live/`.

O servidor WebSocket fica isolado em `/server/` e exige um endpoint público HTTPS/WSS. Foram adicionados Dockerfile, compose de exemplo, healthcheck e CI. O endpoint de produção deve ser configurado em `PUBLIC_SERVER_URL` e `PUBLIC_PLAYER_URL`.


## 17. THE CRIMES LIVE — 100% online com Supabase

Migração concluída em 10/11/2026.

### Arquitetura online

Frontend:
- GitHub Pages
- `/live/?view=host`
- `/live/?view=player&room=CRIM-####`
- `/live/?view=screen&room=CRIM-####`

Backend:
- Supabase projeto `the-crimes-live`
- região `sa-east-1` (São Paulo)
- Postgres
- Realtime
- Edge Function `the-crimes-live`

O multiplayer não depende mais de:
- PC local;
- servidor Node rodando manualmente;
- VPS do LexJuridicus;
- IP local;
- campo de configuração de servidor.

### Segurança

A Edge Function é a autoridade do jogo.

Tabelas privadas:
- `game_rooms`
- `game_players`
- `game_answers`
- `game_events`

Tabelas públicas de estado em tempo real:
- `game_room_public`
- `game_player_public`

As tabelas privadas possuem RLS, negação explícita a clientes públicos e não expõem tokens do Host ou dos players.

O frontend usa apenas chave publicável do Supabase.

### Realtime

O Host, Player e Telão recebem atualizações por Supabase Realtime.

Há também polling de fallback para recuperar estado em caso de perda momentânea da conexão WebSocket.

### QA online real

Teste realizado diretamente pelo GitHub Pages público contra o Supabase:

- sala criada online;
- 2 players em sessões independentes;
- estado **AGUARDANDO INICIAR A PARTIDA...**;
- Host reconheceu 2 conectados;
- Rafael Cloud QA escolheu 🔴:
  - 0 pts;
  - `OCULTOU BENS: SIM`;
  - resultado: `BENS AINDA NÃO LOCALIZADOS`;
- Ana Cloud QA escolheu 🟢:
  - 129 pts;
  - `OCULTOU BENS: NÃO`;
- respostas persistidas no Postgres;
- placar sincronizado;
- Security Advisor do Supabase: **0 lints**.

### Observação

Os índices de eventos ainda aparecem como "unused" no Performance Advisor porque o ambiente acabou de ser criado e possui pouco volume. Eles são mantidos para o crescimento da auditoria e não representam falha de segurança ou funcionamento.


## 18. THE CRIMES LIVE — Versão 1.0 de sala

Fechamento da versão 1.0 em 10/11/2026.

### Melhorias finais

- QR Code passou a ser gerado no próprio navegador.
- Removida dependência do serviço externo `api.qrserver.com`.
- Polling de fallback reduzido: o Realtime é a via principal; o fallback só consulta o estado quando a conexão não está saudável ou fica sem evento por mais de 15 segundos.
- Adicionado **↻ RESETAR SALA** no painel do Host.
- O reset:
  - mantém os jogadores na sala;
  - apaga respostas da partida;
  - zera score;
  - volta exposição e evidência ao estado inicial;
  - limpa `OCULTOU BENS`, descoberta, bloqueios e desfechos;
  - volta para **AGUARDANDO INICIAR A PARTIDA...**.
- Edge Function otimizada para sincronizar players públicos em lote e reduzir custo de atualização.
- Realtime continua como mecanismo principal.

### Teste de carga

Teste online com burst de **50 jogadores**:

- 50 joins concluídos;
- 50 respostas simultâneas persistidas;
- 12 personagens com `OCULTOU BENS: SIM` no cenário de carga;
- reset completo confirmado;
- após reset: 50 players, score total 0, ocultações 0, status `waiting`.

Medições do burst sintético:

- entrada dos 50 players: ~11,6 s;
- processamento das 50 respostas: ~9,9 s;
- ciclo completo com reset: ~23,6 s.

Esse teste é deliberadamente mais agressivo do que uma entrada normal de sala, em que os alunos escaneiam o QR ao longo de vários segundos.

### QA público

Validado diretamente no GitHub Pages:

- botão **↻ RESETAR SALA** visível;
- QR renderizado localmente;
- nenhuma chamada ao antigo serviço externo de QR;
- estado inicial correto: **AGUARDANDO INICIAR A PARTIDA...**.

### Segurança

- projeto Supabase: `ACTIVE_HEALTHY`;
- Edge Function: ativa;
- Security Advisor: **0 lints**;
- salas de QA e carga removidas após os testes.


## 19. Perguntas únicas e status dos jogadores

Atualização implementada em 10/11/2026.

### Banco de perguntas

O The Crimes Live deixou de usar o mesmo enunciado genérico em todas as rodadas.

Agora existem:

- **6 casos**;
- **8 rodadas por caso**;
- **48 perguntas**;
- **48 enunciados únicos**;
- alternativas próprias por contexto;
- posição da resposta juridicamente adequada variando entre A, B, C e D.

Os casos cobrem:

1. Fraude contra credores;
2. Ocultação de meação;
3. Prejuízo a herdeiros;
4. ITBI e integralização;
5. Receitas de aluguéis;
6. Grupo societário.

As perguntas alternam entre:

- cronologia;
- prova;
- finalidade econômica;
- avaliação;
- solvência;
- efeitos patrimoniais;
- requisitos legais;
- zona cinzenta;
- consequência;
- conclusão jurídica.

O servidor continua classificando a escolha como:

- 🟢 juridicamente adequada;
- 🔴 atitude criminosa no cenário;
- 🟡 zona cinzenta;
- 🟠 alto risco jurídico.

### Status dos jogadores

O painel do Host agora separa **Conexão** de **Status da rodada**.

Estados:

- 🟣 **AGUARDANDO INÍCIO**;
- 🟡 **RESPONDENDO**;
- ✅ **RESPONDEU**;
- 🔵 **AG. PRÓXIMA**;
- ⏸ **PAUSADO**;
- ⛔ **SEM RESPOSTA**;
- 🏁 **FINALIZADO**;
- ⚪ **OFFLINE**.

O telão também exibe o status ao lado do jogador.

### QA

Teste direto na Edge Function percorreu todos os casos e confirmou:

```text
48 perguntas
48 enunciados únicos
```

Transição testada com dois jogadores:

```text
waiting:
waiting / waiting

partida iniciada:
answering / answering

um jogador respondeu:
answered / answering

resultado revelado:
revealed / no_answer
```

As salas sintéticas utilizadas no QA foram removidas.

Security Advisor do Supabase após a atualização:

```text
0 lints
```

Commit do frontend:

```text
9381be47f9dec207178a37fc7b8cda7b903ebcbb
```


## 20. UX 2.0 — Host contextual, mobile compacto e presença real

Atualização implementada em 10/11/2026.

### Host contextual

O painel do Host agora muda conforme o estado da partida.

**Waiting:** Abrir telão, Entrada aberta/fechada, Iniciar partida e Resetar sala.

**Running:** Abrir telão, Entrada aberta/fechada, Pausar, Bloquear, Revelar, Pular/Próxima e Encerrar partida.

**Paused:** Continuar e Encerrar partida.

**Finished:** Abrir telão e Resetar sala.

Foi removido o excesso de ações simultâneas.

### Monitor do Host

A tabela foi reduzida para Player, Status, Rodada, Pontos, Perfil e Exposição. Os contadores de decisões ficam resumidos abaixo do nome.

Resumo da rodada mostra: RODADA 1/8, quantos responderam e quantos faltam.

### Entrada da sala

O Host pode alternar entre 🔓 ENTRADA ABERTA e 🔒 ENTRADA FECHADA. Novos jogadores são bloqueados quando fechada; reconexões existentes continuam permitidas.

### Presença real

Supabase Realtime Presence passou a controlar quem está realmente online. Teste confirmado: 2 online → fechamento de um celular → 1 online.

### Timer real

O tempo deixou de ser apenas visual. A Edge Function rejeita respostas após o prazo com HTTP 409 e a mensagem “Tempo esgotado para esta pergunta”. No celular, depois de responder, aparece o tempo real, por exemplo ✓ 1.2s.

### Mobile compacto

Validado em 390 × 844: scrollHeight = 844 e innerHeight = 844. Pergunta, imagem, quatro alternativas, métricas e status cabem sem rolagem.

### Resultado final

No celular: posição, pontuação, percentual de acertos, exposição, resultado jurídico, ocultou bens, descoberta, patrimônio bloqueado e contadores 🟢/🔴/🟡/🟠/⚪.

No telão: pódio 🥇🥈🥉, TOP 3, acertos da turma, escolhas criminosas, personagens que ocultaram bens e ocultações descobertas.

### Ranking de sala cheia

O telão exibe TOP 10 e depois “+N JOGADORES — Ranking completo disponível no Host”. Teste com 12 jogadores confirmou 10 linhas + 2 jogadores e zero overflow.

### Segurança e QA

Supabase Security Advisor: 0 lints. CI: success. GitHub Pages: success.

Commits principais da UX 2.0:

- 30efb9b9cd99780cfd4dfee30900521738ee38ee
- 3ba8c4b27c80a4cbbe60868fcaf683c2ec34092d
- cc45390d7b0e87409d8674b23f3e7089b5ff1440
- c48e437f92902352599bb8741f7190c9727bb50d

## 20. UX Premium V3.3 — Implementação validada

Baseline funcional/visual validada em 11/11/2026.

### Estado da implementação

A UX Premium V3.3 está implementada no fluxo online com:

- Host / Central de Operações premium;
- menu lateral para Partida ao Vivo, Lobby/Sala, Casos e Perguntas, Jogadores, Relatórios e Configurações;
- progresso da turma com indicador circular;
- QR e controles contextuais por estado;
- Telão premium com:
  - caso atual;
  - jogadores;
  - rodada;
  - progresso;
  - TOP 5;
  - perguntas A–D;
  - respostas recebidas;
  - cronômetro;
  - REVELAR RESPOSTA;
  - PULAR / PRÓXIMA;
  - ENCERRAR PARTIDA;
  - trilho de progresso 01–08;
  - barra de tempo / respostas / status;
- Mobile premium com:
  - identidade do jogador;
  - pontos;
  - exposição;
  - imagem da missão;
  - progresso da rodada;
  - seleção A–D;
  - botão explícito **RESPONDER**;
  - correção individual conforme política da sala;
- Resultado final com:
  - pódio 1º/2º/3º;
  - TOP 5;
  - métricas da turma;
  - **JOGAR NOVAMENTE**;
  - **VOLTAR AO LOBBY**.

### Sincronização de rodada

A proteção contra o jogador permanecer preso em uma rodada anterior foi reforçada com:

- `room_revision`;
- `round_key`;
- rejeição de respostas pertencentes a rodada antiga;
- atualização autoritativa via broadcast;
- fallback mobile de 5 segundos;
- atualização no foco/visibilidade/reconexão;
- correção histórica ligada a `questionId + roundKey`.

Validação observada:

```text
Rodada 1 no servidor
↓
Host/Telão envia NEXT
↓
Servidor muda para rodada 2
↓
playerState retorna rodada 2
↓
Mobile muda para MISSÃO 02 / 08
```

A correção da rodada anterior continua disponível depois do avanço porque a API consulta a resposta histórica pelo identificador da pergunta e pela chave da rodada.

### Fluxo de resposta mobile

O celular não envia mais a resposta ao tocar imediatamente na alternativa.

Fluxo:

```text
Selecionar alternativa
↓
alternativa recebe destaque
↓
RESPONDER é habilitado
↓
jogador confirma
↓
servidor persiste a resposta
↓
status = RESPONDEU
```

### Biblioteca visual

O arquivo `live/v3-assets.js` está ativo e mapeia a biblioteca cinematográfica existente:

```text
6 casos
×
8 cenas
=
48 cenas cinematográficas
```

As cenas são utilizadas como backgrounds/contexto de missões, Host, lobby e resultado conforme a tela.

As imagens conceituais premium aprovadas durante o design continuam sendo **referência visual de direção de arte**. Elas não foram copiadas literalmente para o repositório; a produção atual utiliza os assets cinematográficos já versionados em `assets/the-crimes/`.

### QA validado

Foram observados:

- seleção no mobile sem submissão automática;
- botão RESPONDER persistindo uma única resposta;
- avanço para a rodada seguinte;
- mobile acompanhando a nova rodada;
- correção histórica da rodada anterior;
- REVELAR no telão;
- TOP 5;
- trilho 01–08;
- pódio;
- replay;
- retorno ao lobby;
- 1920×1080 sem overflow;
- mobile 390×844;
- console sem erros relevantes.

### Infraestrutura

- Supabase: `ACTIVE_HEALTHY`;
- Security Advisor: 0 lints;
- Performance Advisor: 0 lints;
- GitHub CI: success;
- GitHub Pages: success.

### Baseline

Commit funcional mais recente da V3.3:

```text
3c56b19cb38e79be775f00ce210e122a36dc604a
```

Inclui o bundle com sincronização autoritativa por broadcast e fallback mobile de 5 segundos.


## 21. UX Premium V3.4 — Central de Operações e polimento visual

Atualização publicada em 11/11/2026.

### Mudanças da V3.4

A V3.4 mantém toda a máquina de estados e sincronização validada na V3.3 e acrescenta:

- quadro da pergunta atual diretamente no **Host / Central de Operações**;
- profundidade visual cinematográfica adicional no Host;
- trilho mobile das oito missões / rodadas;
- trilho 01–08 também no telão;
- refinamento do pódio e do ranking final;
- atualização do ranking após replay/reset;
- manutenção do fluxo explícito **selecionar → RESPONDER** no celular;
- manutenção do botão **REVELAR RESPOSTA** no telão;
- manutenção de **PULAR / PRÓXIMA** mesmo com jogadores sem responder;
- manutenção de **JOGAR NOVAMENTE** e **VOLTAR AO LOBBY** no resultado final.

### Compatibilidade funcional

A análise estática do bundle público V3.4 confirmou:

```text
JavaScript: syntax OK
submitAnswer: presente
screenRevealBtn: presente
v3MobileSteps: presente
v3ScreenSteps: presente
finalPodium: presente
screenReplay: presente
screenLobby: presente
watchControl: presente
```

O bundle publicado é:

```text
app.js?v=20261111-v3-prod-8
v3-premium.css?v=20261111-4
```

### QA herdado e preservado

O fluxo V3.3 imediatamente anterior foi validado no site público com:

```text
seleção da alternativa sem envio automático
↓
RESPONDER
↓
resposta persistida
↓
MISSÃO 01 → MISSÃO 02
↓
correção histórica da missão anterior via roundKey
↓
FINALIZAR
↓
resultado individual no celular
↓
pódio no telão
↓
VOLTAR AO LOBBY
```

Validações observadas:

- mobile 390×844 sem overflow;
- telão 1920×1080 sem overflow;
- pódio com três posições;
- QR restaurado ao voltar ao lobby;
- console sem erros durante o fluxo validado;
- Supabase `ACTIVE_HEALTHY`;
- Security Advisor: 0 lints;
- Performance Advisor: 0 lints;
- GitHub CI: success;
- GitHub Pages: success.

### Direção de arte e assets

O mapa `live/v3-assets.js` está ativo para os seis casos e usa as 48 cenas cinematográficas já versionadas em `assets/the-crimes/`.

As imagens conceituais ultrarrealistas aprovadas continuam sendo o **design target oficial** para Host, Telão, Mobile e Resultado Final. O layout HTML/CSS foi aproximado dessas referências sem gravar textos dinâmicos dentro das imagens.

Os backgrounds conceituais específicos — Central de Operações, Investigação e Tribunal/Pódio — ainda devem ser importados como arquivos binários em `assets/the-crimes-v3/global/` quando os originais estiverem disponíveis no repositório ou no computador autorizado. Até lá, o sistema utiliza os fallbacks cinematográficos já versionados, sem quebrar nenhuma tela.

### Baseline V3.4

Commit público validado pelo CI e GitHub Pages:

```text
8836dc62648c3f9b70ca70ac51474ef9e917339f
```

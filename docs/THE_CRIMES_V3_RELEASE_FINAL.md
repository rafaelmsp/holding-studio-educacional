# THE CRIMES LIVE — RELEASE FINAL V3.7.0

Atualizado em **11/11/2026**.

## Status

**RELEASE READY / PRODUÇÃO**

Código funcional base: `16abcc40b034722bde54d058aeee36fb6afaf6cd`  
Bundle: `live/app.js?v=20261111-v3-prod-11`  
Assets: `live/v3-assets.js?v=20261111-7`

URL pública:

`https://rafaelmsp.github.io/holding-studio-educacional/live/`

## Escopo entregue

- Host / Central de Operações;
- sala por código + QR Code;
- até múltiplos jogadores simultâneos;
- Supabase Realtime + Presence + fallback de sincronização;
- revisão autoritativa por `room_revision`;
- chave de rodada `round_key`;
- comandos administrativos idempotentes com `requestId`;
- proteção contra comando obsoleto / concorrente;
- seleção de alternativa + botão explícito **RESPONDER**;
- bloqueio, pausa, continuação e revelação;
- botão **REVELAR RESPOSTA** no telão autorizado;
- avanço com jogadores faltantes mediante confirmação;
- jogador não fica preso quando Host/Telão avança;
- correção vinculada à pergunta e à rodada;
- ranking ao vivo;
- trilho 01–08;
- score, exposição e estado patrimonial;
- resultado individual;
- pódio da turma;
- jogar novamente;
- voltar ao lobby;
- UX Premium responsiva;
- 48 cenas dos seis casos preservadas;
- masters premium globais integrados para Host, investigação, lobby, briefing, reconexão e resultado.

## QA público final V3.7.0

Partida real automatizada executada contra o GitHub Pages com:

- 1 Host;
- 1 Telão;
- 2 jogadores;
- sala de QA: `CRIM-4701`;
- Host: 1440×900;
- Telão: 1920×1080;
- Mobile: 390×844.

Resultado:

```text
QA FINAL: PASS
blockingErrors: 0
overflowX Host: false
overflowX Telão: false
overflowX Player 1: false
overflowX Player 2: false
```

Cenário crítico validado:

```text
Player 2 antes: MISSÃO 01 / 08
Host avança com jogador faltante
Telão depois: RODADA 02 DE 08
Player 2 depois: MISSÃO 02 / 08
reload manual: não necessário
```

Os retornos HTTP `409` observados durante comandos administrativos concorrentes são **esperados**: representam a proteção de revisão obsoleta funcionando e não foram classificados como erro bloqueante.

## QA visual

Validado visualmente:

- Host completo sem overflow;
- pergunta e alternativas legíveis no telão;
- ranking lateral;
- revelação com classificação por cores;
- explicação “POR QUE ESSA?”;
- mobile com A–D e RESPONDER;
- mobile avançando de rodada automaticamente;
- pódio final;
- resultado individual;
- rodapé do telão sem controle de avanço depois da finalização;
- encerramento antecipado marca como concluídas apenas as rodadas realmente percorridas.

## CI

O workflow `The Crimes Live CI` valida:

- servidor Node;
- sintaxe de `live/app.js`;
- sintaxe de `live/v3-assets.js`;
- referências do bundle V3.7.0;
- presença dos três masters globais premium;
- pelo menos oito cenas por cada um dos seis casos.

## Critério de pronto

A V3.7.0 está pronta para apresentação em sala e publicação. Novas imagens distintas para estados já cobertos pelos masters atuais ou substituição artística adicional das 48 cenas são **evolução visual opcional**, não bloqueio de release.

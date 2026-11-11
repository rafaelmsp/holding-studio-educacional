# THE CRIMES LIVE — CHECKPOINT OFICIAL V3.7.0 FINAL

Atualizado em **11/11/2026**.

> Este é o ponto oficial de retomada. A V3.7.0 foi validada em produção e está pronta para apresentação.

## Estado

```text
RELEASE: V3.7.0
STATUS: READY
BUNDLE: live/app.js?v=20261111-v3-prod-11
ASSETS: live/v3-assets.js?v=20261111-7
QA PÚBLICO: PASS
```

## O que não deve ser refeito

- sincronização autoritativa;
- room_revision / round_key;
- idempotência de comandos;
- Presence e fallback;
- Host;
- Telão;
- Mobile;
- REVELAR;
- PULAR / PRÓXIMA;
- correção individual;
- ranking;
- pódio;
- resultado individual;
- replay / lobby;
- UX Premium;
- 48 cenas existentes.

## Último QA

Sala: `CRIM-4701`

- Host 1440×900: sem overflow;
- Telão 1920×1080: sem overflow;
- Mobile 390×844: sem overflow;
- 2 jogadores simultâneos;
- jogador faltante avançou 01→02 sem reload;
- revelação correta;
- finalização correta;
- zero erro bloqueante.

## Próxima retomada

Somente criar novas funcionalidades ou expansão artística opcional. Para detalhes e evidências, ler:

`docs/THE_CRIMES_V3_RELEASE_FINAL.md`

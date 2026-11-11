# THE CRIMES LIVE — CHECKPOINT ATUAL V3.6.1

Atualizado em **11/11/2026**.

> Este arquivo é o ponto oficial de retomada. **Não retomar pela V3.2/V3.3/V3.4.**
> O baseline atual de produção é a **UX Premium V3.6.1**.

## 1. Ponto exato onde paramos

Branch: `main`

HEAD validado:

```text
ecf49f3485f5900cd42f19615dc3b1db7245ab1e
UX V3.6.1: publish final master activation
```

Bundle publicado:

```text
live/app.js?v=20261111-v3-prod-10
live/v3-premium.css?v=20261111-7
```

Estado da publicação neste checkpoint:

```text
GitHub CI: success
GitHub Pages: success
```

## 2. Progresso real

```text
PROG-V3 · Implementação completa · 75%
[███████████████░░░░░] 75%
```

Pesos usados:

| Bloco | Peso | Estado |
| --- | ---: | --- |
| Sincronização autoritativa e fluxo Host/Telão/Mobile | 20% | 🟢 Concluído |
| Host + Telão + Mobile + Resultado premium funcionais | 25% | 🟢 Concluído |
| 3 masters globais premium integrados | 10% | 🟢 Concluído |
| QA público funcional V3.5 | 15% | 🟢 Concluído |
| Documentação/checkpoint | 5% | 🟢 Concluído |
| 4 masters globais restantes | 10% | ⚪ Pendente |
| Expansão visual V3 por caso/cenas | 10% | ⚪ Pendente |
| QA visual final da V3.6.1 | 5% | ⚪ Pendente |

## 3. Funcionalidades já implementadas — NÃO refazer

### Sincronização / multiplayer

- `room_revision` / `roomRevision`;
- `round_key` / `roundKey`;
- `requestId` para comandos administrativos;
- rejeição de comando com revisão obsoleta;
- Presence online/offline;
- fallback de sincronização;
- atualização em foco/visibilidade/reconexão;
- correção histórica ligada a pergunta + rodada;
- Host e Telão não avançam a mesma rodada duas vezes.

### Telão

- pergunta e alternativas A–D;
- TOP 5;
- trilho 01–08;
- contador de respostas;
- timer;
- **REVELAR RESPOSTA**;
- **PULAR / PRÓXIMA**;
- avanço mesmo com faltantes mediante confirmação;
- resultado/pódio;
- **JOGAR NOVAMENTE**;
- **VOLTAR AO LOBBY**.

### Mobile

- seleção da alternativa sem envio automático;
- botão explícito **RESPONDER**;
- barra/trilho de missão;
- score e exposição;
- correção individual conforme política do Host;
- atualização para a rodada nova sem ficar preso na anterior;
- resultado individual final.

### Host / Central de Operações

- navegação premium;
- progresso da turma;
- QR e código da sala;
- abrir/fechar entrada;
- iniciar/pausar/continuar;
- bloquear/revelar;
- próxima rodada;
- finalizar;
- dossiê;
- atividade;
- jogadores;
- relatório;
- configurações.

## 4. QA funcional já comprovado

Baseline funcional V3.5:

```text
4d6c613955b1904fa4a99ce0b89b735b8f6e96f4
```

Teste de concorrência:

```text
START                  200
ANSWER                 200
SHOW CORRECT antes     409 esperado
REVEAL                 200
SHOW CORRECT depois    200
NEXT Host              200
NEXT Telão concorrente 409 stale
rodada resultante      2/8
FINISH                 200
RESET                  200
```

QA público já observado:

- Host 1440×900 sem overflow;
- Player 390×844 sem overflow;
- Telão 1920×1080 sem overflow;
- Presence funcionando;
- RESPONDER explícito funcionando;
- REVELAR no Telão funcionando;
- PULAR / PRÓXIMA preservado;
- pódio e resultado final preservados;
- console sem erros no QA da V3.5.

## 5. Masters premium já integrados

Arquivos reais:

```text
assets/the-crimes-v3/global/
├── command-center.webp
├── courtroom.webp
└── investigation-keyart.webp
```

Uso:

- `command-center.webp` → Central do Host;
- `investigation-keyart.webp` → Telão;
- `courtroom.webp` → resultado/pódio e tratamento do resultado individual.

Integridade registrada no documento principal:

```text
command-center.webp       7754f6f7ee35b05306489b480902661d024e97e9f1ea3a694697908b0bdb04ba
courtroom.webp            fe862acf82739743f19b15dcd2cb1b250aca1374d5e6ea37d2da75c642cbac89
investigation-keyart.webp d905c231a1f1b0a99c87e315658e9557a6b2d0d6424a61c4ddb365438db783c6
```

## 6. Próximo passo exato

### PRIMEIRO — não gerar mais código antes disso

Executar **QA visual público da V3.6.1**:

1. Host em 1440×900;
2. Telão em 1920×1080;
3. Mobile em 390×844;
4. resultado individual;
5. pódio final;
6. confirmar carregamento dos três novos masters;
7. confirmar zero overflow;
8. confirmar zero erro de console;
9. testar uma partida curta Host + Telão + 2 jogadores.

### DEPOIS

Gerar/integrar os quatro masters globais ainda ausentes:

```text
assets/the-crimes-v3/global/
├── city-night.webp
├── lobby-investigation.webp
├── briefing-room.webp
└── reconnect.webp
```

### EM SEGUIDA

Expandir o pacote visual V3 por caso, preservando as 48 cenas atuais como fallback até cada substituição ser validada.

## 7. Regra de retomada

Ao continuar:

```text
1. ler este checkpoint;
2. conferir HEAD atual do main;
3. nunca sobrescrever commits posteriores;
4. comparar antes de editar;
5. começar pelo QA visual V3.6.1;
6. só depois continuar geração/importação de imagens.
```

**Não voltar para o estado V3.2. O ponto de continuação é V3.6.1 / commit ecf49f3485f5900cd42f19615dc3b1db7245ab1e.**

# THE CRIMES LIVE — Assets V3

Este diretório é o pacote visual premium da UX V3.4. Ele foi desenhado para receber **68 masters premium** sem sobrescrever os 55 assets estáveis já existentes em `assets/the-crimes/`.

## Estado atual

A aplicação está funcional e usa `live/v3-assets.js` como mapa de assets. Enquanto os masters premium não estiverem versionados, o mapa usa automaticamente os backgrounds e cenas cinematográficas estáveis de `assets/the-crimes/`.

Isso significa que **nenhuma tela quebra** se um master V3 ainda não estiver disponível.

## Targets globais aprovados

Os conceitos visuais aprovados passam a ter estes nomes definitivos:

```text
assets/the-crimes-v3/global/
├── investigation-keyart.webp   # key art / telão / investigação
├── command-center.webp         # Host / Central de Operações
├── courtroom.webp              # pódio / resultado / audiência
├── city-night.webp             # cidade / transições
├── lobby-investigation.webp    # lobby / QR / sala de espera
├── briefing-room.webp          # briefing / seleção de caso
└── reconnect.webp              # reconexão / offline
```

`courtroom.webp` pode ser reutilizado temporariamente como `hearing` e `podium`.

## Estrutura dos seis casos

```text
cases/<case>/
├── cover.webp
├── portrait.webp
├── mobile-cover.webp
├── 01_contexto.webp
├── 02_estrutura.webp
├── 03_instrumento.webp
├── 04_efeito.webp
├── 05_conflito.webp
├── 06_apuracao.webp
├── 07_consequencias.webp
└── 08_debate.webp
```

Casos:

- credores
- meacao
- herdeiros
- itbi
- alugueis
- grupos

## Regra de produção

Textos, perguntas, nomes, ranking, pontuação, cronômetros, símbolos e botões **não devem ser gravados nas imagens**. Eles permanecem HTML/CSS/SVG para preservar nitidez no projetor, acessibilidade e atualização em tempo real.

## Fallback

`manifest.json` mantém `null` nos arquivos ainda não versionados. O runtime ativo permanece em `live/v3-assets.js`, apontando para assets existentes até a troca pelos masters premium.

Assim que um arquivo premium for colocado no caminho definitivo, basta atualizar a entrada correspondente de `live/v3-assets.js`; nenhuma tela ou regra do jogo precisa ser reescrita.

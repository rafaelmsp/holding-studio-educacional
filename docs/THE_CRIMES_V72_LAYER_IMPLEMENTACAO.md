# THE CRIMES LIVE V7.2 — camada cinematográfica do Host

Base: `main` depois da V7.1. Branch: `feat/v72-premium-layers`. Escopo desta entrega: **primeiro módulo da V7.2**, sem alterar banco, regras de jogo, imagens de casos nem identidade das personas.

## O que realmente foi implementado

1. `react-app/src/styles/v72-premium.css`: última folha de estilo do React, para compor fundo fotográfico existente, placa de lobby, brilho âmbar/ciano, moldura QR e efeitos de profundidade. Os elementos dinâmicos permanecem HTML.
2. `Chrome.tsx`: layer `v72-premium-art` independente, com recortes já existentes `assets/the-crimes-v6/decor/lady-justice-bronze.webp` e `assets/the-crimes-v7/props/detective.webp`. Ambos são `alt=""`, `aria-hidden`, `pointer-events:none` e ficam atrás dos controles.
3. `Host.tsx`: legenda textual acessória `DOSSIÊ DE INVESTIGAÇÃO`, sem rasterizar nomes, texto variável ou código da sala.
4. `v7-host.css`: adaptação a touch com viewport CSS até 1100 px, inclusive celular configurado para pedir versão desktop no navegador, sem depender exclusivamente do breakpoint 760 px.
5. `react-app/tests/v72-host-touch.cjs`: screenshots e asserts a 390 (touch), 980 (touch/Desktop Site) e 1672 px (desktop), cobrindo QR, navegação, barra lateral, integridade das imagens, overflow e sobreposição do cabeçalho. A workflow V7 executa o teste adicional antes da verificação Supabase real.

## Imagens Premium: distinção essencial

- As imagens decorativas efetivamente usadas neste passo **já estão no repositório**. Nenhuma foi substituída por uma captura de interface com letras e QR falsos.
- Um novo cenário noir limpo, gerado nesta conversa, está disponível como arte-conceito, mas **não foi incorporado como asset ao GitHub nesta etapa**. Não declarar o contrário.
- A V7.2 final ainda exige análise visual humana contra os conceitos C01–C08, arte-final isolada para Host/jogador/telão/pódio, teste físico QR/celular e projetor.
- Não mesclar o PR #5 integralmente: contém código de base antiga. A V7.1 fica estável enquanto o trabalho artístico amadurece em branch.

## Critérios e limites

- Não quebrar as oito rodadas, o Supabase, respostas, ranking ou o conteúdo jurídico existente.
- Responder sem rolagem horizontal, QR legível, botões clicáveis, sidebar oculta em touch e texto acessível.
- Emulação 980 px touch é um teste para o comportamento de CSS, não uma garantia de que todos os navegadores e modos desktop mobile terão identicamente o mesmo motor de viewport.
- `prefers-reduced-motion` deve continuar respeitado. Não incorporar áudio por padrão.
- **Versão pública:** não atualizar /live/ até validação do PR e aceite visual das artes.

## Desenvolvimento

```powershell
npm --prefix react-app ci
npm --prefix react-app run build
npm --prefix react-app run test:metrics
npm --prefix react-app run test:v62
npm --prefix react-app run test:v6
npm --prefix react-app run test:visual
python -m http.server 8152 --bind 127.0.0.1
# Em outro terminal: TC_QA_BASE=http://127.0.0.1:8152/live/
node react-app/tests/v72-host-touch.cjs
node react-app/tests/v7-browser.cjs
```

Próxima etapa visual: separar arte original aprovada em recortes transparentes com licenciamento/proveniência verificados, integrar nos 5 estados prioritários sem apagar o conteúdo do jogo, e comparar lado a lado com Golden Masters.

## Etapa 2 — Jogador, telão e pódio em layers (14/11/2026)

Quatro imagens cinematográficas sem interface gravada foram recuperadas da branch do PR #5 e copiadas para `assets/the-crimes-v72/scenes/`, com manifesto de proveniência:

| Asset V7.2 | Origem do PR #5 | Aplicação |
| --- | --- | --- |
| `telao-rodada.webp` | `bg-round-projector.webp` | Telão durante rodada e pausa |
| `telao-final.webp` | `bg-final-projector.webp` | Telão na finalização |
| `jogador-mobile.webp` | `bg-player-mobile.webp` | Fundo do jogador / escolha da persona |
| `podio-desktop.webp` | `bg-podium.webp` | Pódio do Host |

As imagens do PR #5 foram derivadas de materiais fotográficos já existentes nas versões V3/V6. A etapa não incorpora uma nova imagem gerada nesta conversa nem presume fidelidade pixel a pixel com os Golden Masters. Os assets novos entram no build Vite como WebP em `live/bundles` e `react-live/bundles`, com URL versionada por hash.

O CSS `v72-premium.css` agora estiliza separadamente os cenários das rodadas do telão, a entrada e as perguntas do jogador, e a iluminação em três tons do pódio. Texto jurídico, avatar persistido, perguntas, alternativas, QR, pontuação, cronômetro, ranking e resultados continuam renderizados por React com dados reais.

**Correção de apresentação:** o pódio do telão antes reservava uma coluna invisível do grid para um painel lateral oculto, usando aproximadamente 70% da tela. A regra final `.cinema-screen .projector-main:has(.v6-cinematic-final)` utiliza toda a largura, mantém o ranking adicional visível no próprio pódio e impede a sobreposição do quadro-resumo aos cartões. Confirmar nas capturas V7.2.

Novo teste `react-app/tests/v72-scene-layers.cjs` cobrindo `screen-round`, `screen-final`, `player-join` e `host-final`: confirma 200 e assinatura RIFF/WEBP dos quatro fundos, ausência de overflow horizontal e erros em console, 4 alternativas reais em DOM, pódio com 3 cartões e uso de ao menos 88% da largura na final do telão. Imagens/estados são de simulação QA; não representam dados reais de jogadores.

**Pendente para homologação artística:** separar e otimizar props transparentes Premium novos, painel do Host com fidelidade às referências, aplicação das 48 cenas a layouts móveis reais, comparar cada modo com a referência original e teste QR com câmera no projetor. Sem aprovação visual do usuário, não promover o PR #6 à `main`.

## Etapa 3 — ornamentação original Premium e arte conceitual da Justiça (15/11/2026)

Foram criados **dois SVGs transparentes inéditos**, independentes do acervo recuperado do PR #5: `assets/the-crimes-v72/overlays/premium-frame-gold-cyan.svg` e `assets/the-crimes-v72/overlays/premium-justice-seal.svg`. São novas molduras com acabamentos dourado/ciano e um brasão de balança e louros, ambos sem palavras, QR, controles ou pontuações incorporados. A origem está descrita em `assets/the-crimes-v72/manifest.json`.

A última seção de `react-app/src/styles/v72-premium.css` acopla esses visuais como pseudo-elementos não interativos nas molduras do lobby Host, nas perguntas do telão, nos painéis de ranking, na pergunta do jogador e no cabeçalho do pódio. `pointer-events:none` evita bloquear cliques; `prefers-reduced-motion` continua respeitado.

O QA `react-app/tests/v72-scene-layers.cjs` agora checa a presença dessas imagens na propriedade `background-image`, o HTTP 200 e a entrega de SVG real, além das verificações já existentes de cenas, alternativas, avatares e geometria.

Foi gerada nesta conversa uma **estátua nova de Justiça** em PNG RGBA de alta resolução e uma versão WebP otimizada. Esses arquivos estão no ambiente de trabalho da conversa, mas **não entraram no repositório**: o computador remoto está offline e ainda não foi possível transportar o binário sem perda para a branch. Não reportar essa arte fotográfica como implementada.

**Restrição de release:** como a alteração de fonte CSS ocorreu via GitHub, os bundles versionados em `live/` e `react-live/` ainda precisam ser reconstruídos a partir do commit final e registrados no PR antes de mesclar. A workflow de PR executa o build e verifica o código-fonte, mas não publica os bundles automaticamente. O PR permanece draft; a V7.1 pública não foi alterada.

Revisão pendente: fidelidade das molduras às referências conceituais em capturas mobile e telão, verificação física do QR, eventual substituição do elemento antigo pelo PNG Premium da Justiça, sem modificar as oito rodadas e as 48 cenas.

## Etapa 4 — props fotográficos com transparência e estados de espera (15/11/2026)

Criados em `assets/the-crimes-v72/props/` dois elementos derivados de fotografias que já integram o projeto:

- `justice-bronze-cutout.webp` (400 × 672): máscara de transparência por realces bronze, retirada de partes do fundo vermelho e suavização das bordas a partir de `assets/the-crimes-v6/decor/lady-justice-bronze.webp`. Substitui o plano retangular antigo da Justiça na barra lateral do Host e na camada ambiental fixa do Host.
- `evidence-lens-cutout.webp` (646 × 555): composição fotográfica de lupa e documentos extraída de `assets/the-crimes-v72/scenes/podio-desktop.webp`, com recorte e máscara alfa suave. Fica por trás do aviso de sala vazia do Host; também aparece como detalhe atmosférico na espera do telão.

O script reprodutível `react-app/scripts/generate_v72_props.py` usa Pillow e NumPy somente para recriar os binários de arte durante o desenvolvimento. A aplicação publicada não depende de Python. Foram mantidos `pointer-events:none`, prioridade do QR e do texto em DOM, breakpoint sensível a ponteiro coarse e `prefers-reduced-motion`.

`react-app/tests/v72-host-touch.cjs` passou a verificar o caminho do recorte da Justiça e os fundos CSS do cenário de evidências, além de suas verificações de dimensões 390/980/1672, sobreposição e QR. A origem e os nomes dos binários estão descritos em `assets/the-crimes-v72/manifest.json`.

**Observação de proveniência:** estas duas imagens são recortes novos de fotos pré-existentes no repositório, não são a PNG inédita da Justiça gerada no ChatGPT. A PNG de alta resolução permanece como arte conceitual externa até eventual incorporação própria e validação de fidelidade.

## Etapa 5 — Compatibilidade real com projetores HD (15/11/2026)

A auditoria visual revelou falhas relevantes no modo `screen` em 1280×720: cabeçalho sobrepondo os indicadores, área da pergunta ultrapassando os botões inferiores, ranking secundário cortado e, na finalização, cartões de pódio cobertos pelas estatísticas.

A correção está confinada a `react-app/src/styles/v72-premium.css`, em `@media(min-width:1101px) and (max-height:800px)`, preservando o visual 1080p e o player mobile.

- Header do telão: grid e marca compactos, sem conflito com os KPIs.
- Rodada: cena e pergunta redimensionadas; quatro opções, tempo, status e controle permanecem visíveis sem scroll para a questão de regressão QA.
- Ranking: telemetria condensada permite visualizar efetivamente o TOP 5 na mesma superfície do projetor.
- Pódio: cards HD de 237/257 px e resumo de turma posicionados sem recobrimento; mantida ordem 2–1–3.
- Rodapé/controles: confinados à área do viewport em 720p.
- `react-app/tests/v72-scene-layers.cjs`: adicionados casos `screen-round-hd` e `screen-final-hd` (1280×720), assert de geometria, cabeçalho sem sobreposição e visibilidade da quinta posição do ranking, além dos testes anteriores.
- QA registra screenshots específicas para avaliação de legibilidade física.

Restrições: os testes automatizados usam uma pergunta/alternativas de tamanho representativo. Casos particularmente longos podem exigir rolagem interna no telão; não cortar textos jurídicos. Homologação em projetor real permanece necessária. A arte fotográfica nova da Justiça criada no chat não foi incorporada nesta etapa; nenhum arquivo PNG/AVIF não validado foi associado à aplicação.

**Release:** PR #6 deve permanecer como draft até revisão artística e validação física. Publicação V7.1 (main) não afetada.

## Etapa 6 — skin cinematográfica interativa do jogador (15/11/2026)

Com base no conceito móvel Premium, a V7.2 agora tem diferenciação explícita entre estados `não selecionado`, `alternativa selecionada`, `botão Responder habilitado` e `resposta enviada`, sem imagens estáticas contendo perguntas ou placares:

- `react-app/src/styles/v72-premium.css`: alternativa ativa em ciano com glow e contorno; botão ativo em vermelho cinematográfico, em substituição ao antigo bitmap dourado; botão desativado permanece atenuado. `focus-visible` mantém navegação por teclado; `prefers-reduced-motion` desativa transições.
- `react-app/tests/v7-browser.cjs`: assert de estado `aria-pressed=true`, botão só habilitado após escolha, gradiente Premium ativo (não bitmap dourado) e ausência de overflow móvel; nova captura `player-selected` nas três larguras de celular.
- QA local antes do commit: 37 capturas de navegação e jogo completo com oito rodadas simuladas, aprovadas. Imagens foram conferidas visualmente; alternativa B destacada, CTA vermelho e texto legível.

**Nota de proveniência:** o recorte fotorrealista novo de Justiça, gerado nesta conversa, permanece como arte separada; esta etapa não copia a fotografia para o repositório, para não degrada-la nem criar arquivo ausente. O recorte já integrado `justice-bronze-cutout.webp` continua sendo o original existente V6/V7. Não confundir esses arquivos.

**Release:** PR #6 permanece draft; a V7.1 da main não será mesclada antes de aprovação visual e verificação física.

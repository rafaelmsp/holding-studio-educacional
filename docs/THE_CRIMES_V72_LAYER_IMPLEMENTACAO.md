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

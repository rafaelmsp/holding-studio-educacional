# Holding Studio — Edição Educacional para GitHub Pages

**Objetivo:** ensinar, com demonstrações concretas, como se analisa a viabilidade econômica e sucessória de uma holding patrimonial familiar. Não é uma calculadora de tributos oficial.

## Como hospedar no GitHub Pages

1. Crie um repositório público e coloque todos os arquivos desta pasta na raiz do repositório, incluindo `index.html`, `src/`, `assets/` e `tax-rules.json`.
2. No repositório, acesse **Settings → Pages → Build and deployment → Deploy from a branch**; escolha `main`, pasta `/ (root)` e salve.
3. Abra o endereço publicado pelo GitHub. Não é necessário servidor Node.js para simular; a aplicação calcula localmente no navegador.

## Estrutura da aula

- Conceito: o que é holding, função patrimonial, limites e riscos.
- Patrimônio: quanto valem os imóveis, ocupação, aluguel e despesas.
- Tributos: IRPF incremental versus IRPJ, CSLL e PIS/Cofins no lucro presumido.
- Constituição: custos, hipóteses jurídicas de ITBI, investimentos e governança.
- Decisão: VPL, prazo de retorno, cenários e o que ficou de fora.
- **A conta explicada:** quadro dinâmico com os valores informados e as fórmulas utilizadas no exemplo.

## Atualização dos dados e transparência

- `tax-rules.json` é **instantâneo normativo datado de 2026**, carregado pelo navegador. O GitHub Pages **não atualiza a legislação automaticamente**.
- Na edição estática, a API local Node.js não é necessária e indicadores BCB dinâmicos permanecem assinalados como não conectados. Não exibir valores fictícios como se fossem ao vivo.
- A edição com servidor permanece incluída para execução local com `npm start`.
- Os dados digitados permanecem no armazenamento local do navegador do visitante, sem envio a servidor no modo estático.
- A edição é exclusivamente acadêmica; o VPL não representa parecer tributário, sucessório ou orientação de constituição.

## Testes

No ambiente Node.js 20+: `npm test`.

## Fontes e metodologia

Consulte `docs/METODOLOGIA.md` e as fontes do snapshot tributário em `tax-rules.json`.

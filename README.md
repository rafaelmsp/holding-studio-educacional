# Showroom Acadêmico — versão guiada

## Formato de slides para projetor (16:9)

O arquivo showroom.html foi ajustado para caber **inteiramente no formato de apresentação 16:9**, ocupando a maior área possível da tela (inclui margens quando o monitor tem outra proporção). Cada uma das oito etapas exibe simultaneamente o preenchimento e uma explicação do cálculo. As fórmulas são recalculadas ao editar os dados e **não necessitam de slides separados**.

- Painel esquerdo: pergunta, dados e orientação para a fala.
- Painel direito: valores numéricos, fórmula aplicada, resultado, explicação e fonte/restrições.
- Ativar **Tela cheia** na barra superior; usar **setas** fora dos campos para passar ou voltar etapas.
- O layout do projetor reduz o espaçamento automaticamente e busca acomodar o conteúdo sem rolagem. Em telas móveis, permanece o modo responsivo.
- Teste estrutural: node tests/showroom-layout.test.js.

**Página principal:** https://rafaelmsp.github.io/holding-studio-educacional/ — abre **showroom.html**.

Esta é a modalidade própria para **apresentação de faculdade**. Em vez de uma galeria de slides estáticos, o professor/aluno preenche dados em um fluxo de **8 etapas** e os valores são recalculados no navegador, enquanto a interface ensina a fórmula, a natureza do tributo, as limitações e as fontes.

Fluxo: (1) patrimônio e objetivo; (2) aluguel, ocupação, renda e despesas; (3) IRPF incremental; (4) honorários, abertura e contabilidade; (5) IRPJ, adicional, CSLL, PIS/Cofins; (6) ITBI, imunidade e VPL; (7) ITD, doação direta, doação de quotas e inventário; (8) conclusão com aluguel e patrimônio de equilíbrio estimados.

Navegação por **botões / setas ← → / Page Up e Page Down** (fora de campos de edição), tela cheia na tecla **F** e opção de impressão da conclusão. Alterações permanecem durante o percurso; voltar a uma etapa e editar atualiza os resultados seguintes.

- **Modo livre:** calculadora-v2.html; a versão anterior permanece em simulador.html.
- **Código do showroom:** showroom.html, src/showroom.css, src/showroom.js.
- **Motor tributário:** src/tax-engine.js e tax-rules.json.
- **Valores de honorários, contador e cartórios são hipóteses editáveis**, não preços oficiais.
- **Tributos NÃO vêm de APIs jurídicas em tempo real.** Os resultados reagem em tempo real aos dados usando base normativa de referência datada de 2026. A solução mantém condições jurídicas incertas como cenários, não certezas.
- **Limitações:** a comparação de doação/inventário é estimativa nominal; não modela definitivamente usufruto, regimes de bens, meação, legítima, isenções, IR ganho de capital, tributação mínima de altas rendas, dividendos ou reformas futuras.

Testes de integração manual simulada: navegação 1→8, patrimônio de R$ 150 mil, aluguel zero, município com ITBI pendente e alíquota municipal editada.

---

# Holding Studio 2.0 — Calculadora explicada

**Nova entrada:** https://rafaelmsp.github.io/holding-studio-educacional/ (redireciona para calculadora-v2.html).

A versão 2.0 é uma calculadora de decisão, não um slide. A pessoa informa o valor dos imóveis e seus aluguéis; depois ajusta os custos para comparar **pessoa física x holding patrimonial** e visualizar **doação direta x doação de quotas x inventário futuro**. Cada fórmula é explicada na interface e acompanha a alteração dos campos.

- **Comece com um imóvel de R$ 150 mil**, inclusive sem renda de aluguel; use os exemplos editáveis.
- Compare **IRPF incremental, IRPJ, adicional de IRPJ, CSLL, PIS, Cofins, ITBI, manutenção da PJ, VPL e aluguel mínimo de equilíbrio**.
- Explore uma **estimativa matemática de patrimônio mínimo por cenário**, não um limite legal ou recomendação automática.
- Faça a comparação sucessória em seção separada. **Doação com usufruto não recebe tratamento fiscal presumido**: exige avaliação específica.
- **Honorários advocatícios, abertura, cartórios, contabilidade e custos de sucessão são hipóteses editáveis**, não tabela oficial de preços.
- Calcula instantaneamente no navegador; usa src/tax-engine.js e a **base jurídica de referência tax-rules.json, ano 2026, atualização manual/versionada**. Isso não é atualização de impostos por API em tempo real.
- Municípios diferentes do Rio exigem preenchimento manual de alíquota do ITBI. Não se presume imunidade sem análise da operação.
- As explicações exibem o passo a passo, as premissas, os valores e links às fontes oficiais.
- O botão de impressão permite imprimir o resultado ou salvá-lo como PDF pelo navegador.

**Conservação do trabalho anterior:** simulador.html, aula.html, apresentacao.html continuam acessíveis; a antiga raiz Modo Palco foi preservada em legado/index-modo-palco-2026.html.

Para testar cálculos no Node.js, execute: node tests/tax-engine-v2.test.js.

**Limites legais:** projeções financeiras não modelam todas as hipóteses de ganho de capital, tributação de dividendos e rendas elevadas, reforma tributária futura, regimes de bens, legítima, doação com usufruto e valorização futura. Comparações de inventário usam regras e valores presentes como *estimativa nominal*, não previsão de transmissão futura.

---

## Modo Palco — apresentação acadêmica 16:9

Acesse a **página inicial** em https://rafaelmsp.github.io/holding-studio-educacional/ para exibir a aula interativa no projetor. Também disponível em `apresentacao.html`.

- Nove telas: abertura, problema de pesquisa, conceito, dados, tributos, custos, viabilidade, limites e conclusão.
- Fontes legíveis no projetor, navegação com setas direita/esquerda, Page Up/Page Down e tecla **F** para tela cheia.
- Simulação ao vivo reutilizando o mesmo motor determinístico do projeto (`src/tax-engine.js`) e a base normativa `tax-rules.json`.
- Exemplo de contraste: alterar ITBI hipotético e observar o impacto no VPL; isso **não** equivale a concluir a incidência tributária no caso real.
- O **simulador completo** permanece em [simulador.html](simulador.html).
- Abra diretamente um slide com `?slide=6` (índice começa em 0).
- Em computadores mais antigos, o efeito WebGL é dispensável; a aula e os cálculos continuam funcionando.

**Uso educacional:** cálculos são hipóteses explícitas com regras-base de 2026, não atualizações legislativas em tempo real nem parecer jurídico.

---

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

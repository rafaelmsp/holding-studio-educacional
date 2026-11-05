# Metodologia jurídica e econômica — ano-base 2026

## Modelo de decisão

Compara dois tratamentos da **mesma carteira de imóveis destinados à locação**: titularidade em pessoa física versus sociedade patrimonial no lucro presumido. Critério financeiro principal: **valor presente líquido (VPL)** da diferença após custos de implantação e manutenção. Um VPL positivo é **um sinal preliminar**, não prova jurídica ou tributária de que a holding seja recomendável.

### Fonte de rendas

Ocupação = `rent` × (`occupancy` / 100). Receita efetiva anual = 12 × soma das rendas de aluguel esperadas após vacância. Custos dos imóveis são considerados simetricamente para PF e PJ no comparativo econômico, mas as regras de dedução fiscal são distintas. A elegibilidade da despesa no IRPF deve ser conferida; o motor não apura cada tipo separadamente.

### IRPF incremental

Aplica a tabela anual de 2026, o desconto simplificado anual de até R$ 17.640, as deduções legais informadas e as reduções anuais da Lei 15.270/2025, conforme regra. Para outras fontes de renda, calcula a diferença entre IRPF total com aluguel e IRPF total sem aluguel. Se houver mais de um coproprietário, presume repartição igual. Diferentes titulares, regimes conjugais e documentos podem alterar o resultado. **Não substitui o carnê-leão.**

Fonte: [Receita Federal: Tributação 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026).

### PJ no lucro presumido

Modelo usual simplificado para receita de locação de imóvel próprio: base presumida de 32% para IRPJ e CSLL; IRPJ de 15% sobre a base; CSLL de 9%; PIS 0,65% e Cofins 3%; adicional de IRPJ de 10% acima de R$ 20 mil de base ao mês, observada a apuração trimestral. Aplicada presunção acrescida de 10% à parcela da receita acima de R$ 5 milhões/ano, no contexto da LC 224/2025. A apuração é aproximada, com receitas distribuídas uniformemente durante o ano, sem receitas extraordinárias.

Fonte: [Receita Federal, LC 224/2025 — perguntas e respostas](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/beneficios-fiscais/perguntas-e-respostas-reducao-dos-incentivos-e-beneficios-tributarios.pdf/@@download/file).

### Tributação de transferência patrimonial no RJ

ITBI é municipal. No Município do **Rio de Janeiro**, a alíquota geral de 3% alcança as transmissões tributáveis; a imunidade de realização de capital exige enquadramento jurídico e consideração do Tema 796 e do Tema 1348/STF, inclusive suas ressalvas. A base simulada de ITBI simplifica valor venal fiscal, capital integralizado e avaliação do bem. A simulação apresenta cenários, não um crédito tributário reconhecido.

Fontes: [Prefeitura do Rio: cálculo do ITBI](https://fazenda.prefeitura.rio/calculo-itbi/) e [STF: Tema 1348](https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?classeProcesso=RE&incidente=6929423&numeroProcesso=1495108&numeroTema=1348).

ITD (imposto estadual de transmissão gratuita): faixas de 4% a 8% da Lei estadual 7.174/2015. A UFIR-RJ de 2026 é **R$ 4,9604**, conforme Resolução SEFAZ-RJ nº 849/2025. O simulador exibe estimativa da aplicação da faixa à base total, sem realizar análise de isenção, doações anteriores, frações, critérios de quotas, antecipação de legítima ou desconsideração de personalidade.

Fonte: [Secretaria de Fazenda RJ — UFIR 2026](https://portal.fazenda.rj.gov.br/tecnologia-informacao/wp-content/uploads/sites/7/2026/01/RESOLUCAO-SEFAZ-No-848-DE-22-DE-DEZEMBRO-DE-2025.pdf) (documento oficial compilado; confira ato nº 849/2025) e [Lei 7.174/2015](https://www.legisweb.com.br/legislacao/?id=314557).

### Projeção

`VPL = -(custo de implantação + ITBI estimado) + Σ (economia anual líquido de manutenção)/(1 + taxa de desconto)^ano`.

Por simplificação, legislação-base fiscal **mantida constante em 2026** para todo o horizonte. O usuário controla reajuste da receita, custos e taxa de desconto. Evite tratar a série temporal como estimativa de impostos futuros, sobretudo sob transição de IBS/CBS ou mudança normativa.

## Exclusões e alertas

**Não são modelados:** Imposto de Renda de ganho de capital na transferência ou futura venda de imóveis, recolhimento efetivo de IRRF sobre dividendos e ajuste de IRPF mínimo de altas rendas, tributação societária de cessão de quotas, isenções municipais e estaduais, receitas financeiras, financiamento, fluxo de caixa patrimonial total, custos de liquidação, obrigações específicas de locação, consulta individual à matrícula do imóvel, benefícios subjetivos de governança, ITD real por quinhão e tributação definitiva de CBS/IBS. Contrate avaliação técnico-jurídica antes de qualquer decisão.

## Verificação de dados

O arquivo `tax-rules.json` é uma **fotografia normativa revisada manualmente** em 04/11/2026. A API pública do Banco Central fornece somente indicadores econômicos. Uma atualização diária automatizada da legislação e de todas as alíquotas tributárias exige fonte fiscal especializada, versionamento de regras, controle de alterações e homologação por profissionais habilitados.

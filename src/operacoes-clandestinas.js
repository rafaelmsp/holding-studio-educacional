(function(){
"use strict";
const doc=document,$=id=>doc.getElementById(id);
const money=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(n);
const SOURCE=[
["Código Civil: arts. 50, 158–167, 544 e 549","https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm"],
["CPC: arts. 133–137 e 792","https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm"],
["Constituição Federal: art. 156, § 2º, I","https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"],
["Lei 8.137/1990: ordem tributária","https://www.planalto.gov.br/ccivil_03/leis/l8137.htm"],
["Lei 9.613/1998: lavagem de dinheiro","https://www.planalto.gov.br/ccivil_03/leis/l9613.htm"]
];
const CASES=[
{
 id:"credores",short:"Credores",range:"R$ 250 mil",name:"Patrimônio pequeno: dívida e transferência",
 wealth:250000,issue:"Crédito de R$ 160 mil",
 summary:"Uma pessoa possui um imóvel de R$ 250 mil e uma dívida de R$ 160 mil. Em seguida, transfere o bem para uma holding familiar. A turma investiga se houve planejamento legítimo ou prejuízo a credor.",
 lawful:"É lícito constituir uma sociedade para administrar o imóvel, receber aluguéis, organizar quotas e planejar sucessão, desde que os atos sejam reais e preservem direitos de terceiros.",
 stages:[
  {time:"Antes da holding",title:"Surge uma obrigação exigível",fact:"O titular possui um imóvel de R$ 250 mil, recebe R$ 1.500 de aluguel mensal e já responde por uma obrigação de R$ 160 mil.",concern:"A existência de dívida não impede automaticamente a criação de uma empresa. O ponto inicial é identificar quando o crédito surgiu.",docs:["Contrato e datas de vencimento da dívida","Matrícula e valor de referência do imóvel","Situação patrimonial anterior à transferência"],analysis:"Organize a linha do tempo: crédito, patrimônio, constituição e eventual processo. Os requisitos variam entre fraude contra credores e fraude à execução."},
  {time:"Operação societária",title:"A holding recebe o imóvel",fact:"É registrada a integralização do imóvel na sociedade controlada pela família. A documentação formal aparenta uma operação societária regular.",concern:"Transferir imóvel para a holding não comprova fraude. A validade exige examinar finalidade, realidade do negócio e patrimônio remanescente.",docs:["Contrato social e alterações","Título de transferência e matrícula atualizada","Registros contábeis da integralização"],analysis:"Compare a operação declarada com os registros. Verifique se houve efetiva titularidade, quais direitos foram recebidos e se a transferência prejudicou a solvência."},
  {time:"Após a transferência",title:"Aparece divergência sobre os aluguéis",fact:"Há informação de que o antigo titular continuou recebendo valores de locação em conta pessoal, enquanto a sociedade consta como locadora.",concern:"O recebimento em conta pessoal pode ter explicações contratuais ou operacionais; exige conciliação antes de afirmar confusão patrimonial.",docs:["Contrato de locação e aditivos","Comprovantes de pagamento dos aluguéis","Lançamentos contábeis e justificativa de repasses"],analysis:"O advogado procura correspondência entre titularidade do crédito, recebimento e contabilidade. O problema é a falta de coerência econômica comprovada, não o parentesco dos sócios."},
  {time:"Na cobrança",title:"O credor não encontra bens pessoais suficientes",fact:"O credor inicia cobrança e alega que a transferência deixou o devedor sem patrimônio suficiente para responder pela obrigação.",concern:"Insolvência e transferência próxima à cobrança são indícios relevantes, mas não bastam isoladamente para desconsideração da personalidade.",docs:["Autos da cobrança, citações e averbações","Certidões de bens e ônus","Balancetes e prova de patrimônio remanescente"],analysis:"Verifique requisitos do Código Civil ou art. 792 do CPC e garanta contraditório. O art. 50 exige demonstração de abuso para a desconsideração."},
  {time:"Exame do caso",title:"O advogado organiza os elementos",fact:"A prova disponível deverá indicar se a transferência foi real, se houve lesão a credor e qual era a situação jurídica no momento do negócio.",concern:"É incorreto presumir que toda integralização posterior à dívida seja fraudulenta. O efeito jurídico depende dos requisitos de cada instituto.",docs:["Cronologia consolidada e documentos originais","Prova do prejuízo e da situação patrimonial","Identificação de terceiros de boa-fé"],analysis:"Possíveis medidas: ação pauliana quando cabível, arguição de fraude à execução ou incidente de desconsideração conforme fundamento próprio. São vias diferentes, não uma sanção automática."}
 ],
 quiz:{question:"Qual é a conclusão juridicamente mais defensável?",options:["A holding é fraudulenta porque o sócio tinha uma dívida.","É necessário examinar cronologia, insolvência, documentos e requisitos legais específicos.","Todo imóvel integralizado pode ser penhorado sem decisão judicial."],correct:1,why:"A suspeita precisa ser demonstrada. Fraude contra credores, fraude à execução e desconsideração da personalidade têm pressupostos e consequências distintos."},
 basis:"CC, arts. 50 e 158 a 165; CPC, art. 792 e arts. 133 a 137. STJ, Tema 1.210: abuso não se presume apenas pela ausência de bens.",sources:["cc","cpc","stj"],
 conclusion:"Patrimônio pequeno não torna a holding fraudulenta nem a protege da responsabilidade. O advogado demonstra quando o crédito surgiu, o que ocorreu com os bens, se houve insolvência e qual medida processual cabe."
},
{
 id:"meacao",short:"Meação",range:"R$ 1,2 milhão",name:"Divórcio: ocultação de patrimônio e meação",
 wealth:1200000,issue:"Partilha contestada",
 summary:"Um casal discute a partilha de bens adquiridos na união. Parte do patrimônio está vinculada a uma holding administrada por um cônjuge, e os dados societários divergem das informações apresentadas no divórcio.",
 lawful:"É legítimo centralizar imóveis na holding e disciplinar a administração familiar. Os direitos patrimoniais dos cônjuges e o regime de bens não desaparecem pelo registro em nome da empresa.",
 stages:[
  {time:"Vida em comum",title:"Bens adquiridos durante a união",fact:"Dois imóveis avaliados em R$ 1,2 milhão foram adquiridos ao longo do casamento. O regime patrimonial aplicável precisa ser confirmado.",concern:"Nem todo bem adquirido por um cônjuge é automaticamente comunicável: origem, datas e regime matrimonial importam.",docs:["Certidão de casamento e pacto antenupcial","Matrículas com histórico aquisitivo","Comprovantes de origem e pagamento dos bens"],analysis:"A primeira tarefa é delimitar a massa partilhável e identificar eventual patrimônio particular, sub-rogação e ônus."},
  {time:"Gestão patrimonial",title:"Imóveis passam a integrar a sociedade",fact:"Os imóveis são integralizados em uma holding. O cônjuge que administra a sociedade passa a concentrar decisões sobre os ativos.",concern:"A integralização pode ser legítima. Importa saber que direitos e quotas surgiram em contrapartida e se houve anuências necessárias.",docs:["Contrato social e quadro de quotas","Registros de integralização e matrículas","Atas e documentos de administração"],analysis:"O valor econômico pode estar representado por quotas ou direitos societários; a personalidade jurídica não torna o patrimônio irrelevante para a partilha."},
  {time:"Início do litígio",title:"A declaração patrimonial não coincide com os registros",fact:"Na ação de divórcio, um cônjuge afirma possuir participação pequena, embora documentos societários mostrem alterações relevantes próximas à separação.",concern:"Inconsistências exigem investigação. Nem toda mudança societária é dissimulada; o advogado precisa de documentos e prova.",docs:["Últimas alterações do contrato social","Declarações patrimoniais apresentadas nos autos","Documentos da contrapartida das cessões"],analysis:"Confronte datas, titularidades, pagamentos reais e valor econômico das quotas, observando que diferenças documentais não bastam para concluir dolo."},
  {time:"Produção de provas",title:"A perícia avalia patrimônio e controle",fact:"São requeridos documentos societários e contábeis para apurar quem controla a holding e como os resultados econômicos foram distribuídos.",concern:"Controle formal, administração e benefício econômico são aspectos diferentes; investigar sem presumir que familiares são interpostas pessoas.",docs:["Balanços e documentos de avaliação patrimonial","Extratos e comprovantes sob ordem judicial cabível","Instrumentos de cessão de quotas"],analysis:"Pode ser adequada prova pericial contábil e societária; o pedido deve ser específico, proporcional e respeitar sigilos e contraditório."},
  {time:"Análise judicial",title:"Decidir se existe abuso ou mero conflito de avaliação",fact:"A questão passa a ser se houve violação de direitos patrimoniais mediante uso abusivo da pessoa jurídica, ou uma disputa legítima sobre o valor das quotas.",concern:"A desconsideração inversa é excepcional; exige requisitos próprios. A partilha societária pode demandar outros instrumentos.",docs:["Laudo pericial e manifestações das partes","Demonstração de eventual confusão patrimonial","Fundamentação do pedido judicial"],analysis:"STJ admite a discussão de desconsideração inversa em situações de abuso no divórcio, mas não a aplica automaticamente por existir sociedade familiar."}
 ],
 quiz:{question:"A holding elimina o direito à meação?",options:["Sim, os imóveis passaram ao nome da pessoa jurídica.","Não; conforme o regime e os fatos, quotas e direitos podem ser relevantes para partilha.","Sim, se os sócios forem parentes de um dos cônjuges."],correct:1,why:"A autonomia patrimonial deve ser respeitada, mas não extingue direitos familiares. A análise exige regime de bens, natureza dos ativos, quotas e eventual abuso."},
 basis:"Código Civil, art. 50 e regras do regime de bens; CPC, art. 133, § 2º; STJ, REsp 1.522.142/PR: possibilidade de examinar desconsideração inversa em divórcio.",sources:["cc","cpc","meacao"],
 conclusion:"O advogado deve defender a autonomia societária sem transformar a holding em meio de ocultação patrimonial. Primeiro identifica bens comunicáveis e valor das quotas; só depois considera pedidos excepcionais."
},
{
 id:"herdeiros",short:"Herdeiros",range:"R$ 3 milhões",name:"Sucessão: doação dissimulada e legítima",
 wealth:3000000,issue:"Três descendentes",
 summary:"Uma holding familiar concentra imóveis de R$ 3 milhões. Uma reorganização das quotas beneficia um dos três descendentes, e os demais questionam se houve doação dissimulada e violação da legítima.",
 lawful:"A holding permite organizar sucessão, doar quotas, estabelecer regras de governança e, quando juridicamente adequado, beneficiar um herdeiro dentro da parte disponível e dos limites legais.",
 stages:[
  {time:"Planejamento inicial",title:"O titular organiza os imóveis",fact:"O proprietário integraliza três imóveis na sociedade para facilitar administração e sucessão.",concern:"Não há fraude em converter bens em quotas. É preciso identificar o patrimônio total e direitos de terceiros.",docs:["Matrículas e avaliações dos imóveis","Contrato social e capital integralizado","Informações sobre regime de bens e herdeiros"],analysis:"Planejamento sucessório legítimo exige considerar a composição do patrimônio, a meação e a existência de herdeiros necessários."},
  {time:"Mudança nas quotas",title:"Um descendente recebe participação superior",fact:"O quadro societário passa a atribuir participação majoritária a um dos filhos, mediante instrumento qualificado como cessão onerosa.",concern:"A preferência pode ter fundamento válido. O ponto relevante é se a causa declarada corresponde à operação efetiva e aos limites sucessórios.",docs:["Instrumentos de cessão ou doação","Atos societários e datas","Critérios de avaliação das quotas"],analysis:"Compare o que foi declarado com a substância jurídica, sem presumir que desigualdade entre herdeiros significa ilicitude."},
  {time:"Divergência econômica",title:"Aparece dúvida sobre a contraprestação",fact:"Os herdeiros apontam ausência de prova do pagamento declarado na cessão, enquanto o sócio beneficiado afirma que houve negócio válido.",concern:"A ausência de documento isolado não prova simulação. É necessário verificar fatos, registros e meios de prova admissíveis.",docs:["Comprovantes de pagamento disponíveis","Contabilidade societária","Declarações e instrumentos contemporâneos"],analysis:"Uma venda dissimulando doação pode provocar discussão sobre colação, redução ou nulidade por simulação, mas o enquadramento depende da prova."},
  {time:"Abertura da sucessão",title:"Os demais herdeiros impugnam os valores",fact:"Após o falecimento, os sucessores questionam a extensão da liberalidade e a preservação de seus direitos sucessórios.",concern:"É preciso avaliar o patrimônio relevante, liberalidades, dispensas válidas de colação e a parte disponível; não simplificar tudo em parcelas iguais.",docs:["Inventário e relação dos bens","Documentos das liberalidades em vida","Avaliações e demonstrações societárias"],analysis:"CC arts. 544 e 549 são referências, mas o exame inclui regras de colação, legítima e avaliação pertinentes ao caso."},
  {time:"Conclusão da investigação",title:"Distinguir preferência lícita de doação irregular",fact:"A turma compara documentos e calcula juridicamente o alcance da liberalidade com os valores cabíveis à data pertinente.",concern:"Nem toda doação desigual é inoficiosa; há parte disponível e regras específicas. Fraude não é deduzida apenas da desproporção.",docs:["Memória da avaliação patrimonial","Cronologia dos atos e herdeiros","Análise do negócio real e da legítima"],analysis:"O advogado deverá escolher entre apuração de quotas, colação, redução de liberalidade excessiva e discussão de simulação, conforme fatos e legitimidade."}
 ],
 quiz:{question:"Uma participação maior de um herdeiro demonstra fraude?",options:["Sim, o capital deve ser dividido igualmente em vida.","Não; é preciso avaliar causa da transferência, legítima, parte disponível e provas.","Não há limites sucessórios quando os bens estão numa holding."],correct:1,why:"É possível planejamento sucessório legítimo e até tratamento diferenciado, desde que observadas a legítima e as condições legais. A forma societária não afasta tais limites."},
 basis:"Código Civil, arts. 167, 544 e 549, além das regras de legítima e colação. A doação de quotas não extingue automaticamente direitos dos herdeiros necessários.",sources:["cc"],
 conclusion:"O ponto não é condenar a holding por distribuir quotas de forma desigual, mas verificar se a operação documentada reflete o negócio real e respeita os direitos sucessórios."
},
{
 id:"itbi",short:"ITBI",range:"R$ 5 milhões",name:"ITBI: imunidade legítima versus simulação",
 wealth:5000000,issue:"Capital: R$ 3 milhões",
 summary:"Uma sociedade recebe imóveis avaliados ilustrativamente em R$ 5 milhões e registra integralização de capital de R$ 3 milhões. A turma precisa separar a imunidade constitucional real de documentos incompatíveis com o negócio efetivo.",
 lawful:"O STF reconheceu no Tema 1.348, julgado em 20/10/2026, imunidade na realização do capital social independentemente da atividade imobiliária preponderante, observado o limite reconhecido no Tema 796 e ressalvada simulação ou fraude à lei.",
 stages:[
  {time:"Planejamento societário",title:"A empresa pretende capitalizar seus ativos",fact:"Os titulares anunciam o aporte de imóveis no capital de uma holding patrimonial. Administrar ou locar imóveis não elimina, por si, a imunidade do ITBI.",concern:"É incorreto tratar a própria atividade de locação como prova automática de ausência de imunidade após o Tema 1.348.",docs:["Contrato social e ato de integralização","Matrículas e avaliações dos imóveis","Documentos do capital social"],analysis:"Identifique o fato jurídico de realização do capital: ele recebe o tratamento constitucional próprio, sem imunidade irrestrita a qualquer operação."},
  {time:"Valores da operação",title:"Patrimônio e capital social não coincidem",fact:"O conjunto de imóveis tem valor ilustrativo de R$ 5 milhões, mas a parcela declarada em realização de capital é de R$ 3 milhões.",concern:"A diferença de R$ 2 milhões exige análise da natureza jurídica e da base aplicável; não comprova fraude, nem permite impor cálculo fiscal automático.",docs:["Instrumentos societários e destinação das parcelas","Laudos e critérios de avaliação","Registros imobiliários e documentação municipal"],analysis:"O Tema 796 limita a imunidade ao valor do capital a integralizar. O efetivo tratamento da parcela excedente exige exame do caso e das regras pertinentes."},
  {time:"Documentos divergentes",title:"O negócio real é colocado em dúvida",fact:"A fiscalização aponta divergências entre o negócio apresentado nos instrumentos e obrigações econômicas registradas em outros documentos.",concern:"A inconsistência pode decorrer de erro ou de operação distinta. Somente provas podem sustentar alegação de simulação.",docs:["Instrumentos assinados e registros oficiais","Documentos bancários e contábeis pertinentes","Esclarecimentos e defesa administrativa"],analysis:"Não é suficiente alegar que a empresa negocia imóveis. Investigue se documentos representam fielmente a operação e se há negócio dissimulado."},
  {time:"Discussão administrativa",title:"Município questiona a aplicação da imunidade",fact:"O município solicita esclarecimentos e debate a extensão do benefício para a operação concreta.",concern:"Imunidade não é isenção. A discussão deve distinguir o direito constitucional, o limite do capital e eventual simulação provada.",docs:["Processo administrativo e notificações","Fundamentos do lançamento e da defesa","Documentos de integralização e avaliação"],analysis:"Use o Tema 1.348 para a regra sobre atividade preponderante e o Tema 796 para o limite. Não presuma fraude a partir da atividade econômica."},
  {time:"Conclusão da aula",title:"A questão é a realidade da operação",fact:"A turma decide quais parcelas têm fundamento jurídico para discussão e se existem elementos suficientes para afirmar negócio simulado.",concern:"A ausência de documentos conclusivos impede uma condenação antecipada. O resultado deve refletir os fatos demonstrados.",docs:["Quadro: bem, valor e destinação jurídica","Linha do tempo societária e registral","Decisão motivada e possibilidade de revisão"],analysis:"Defenda a imunidade verdadeira e conteste a simulação comprovada. O reconhecimento constitucional não autoriza documentação falsa ou fraude à lei."}
 ],
 quiz:{question:"Qual afirmação está correta após o Tema 1.348?",options:["Holding que aluga imóveis nunca tem imunidade de ITBI.","A imunidade é incondicionada quanto à atividade preponderante, mas não protege simulação e observa o limite do capital integralizado.","Qualquer transferência para holding é sempre imune, independentemente do negócio."],correct:1,why:"O STF distinguiu a imunidade da integralização de capital da simulação/fraude à lei e manteve o limite do Tema 796."},
 basis:"CF/88, art. 156, § 2º, I; STF, Temas 1.348 e 796; CC, art. 167. A aplicação aos valores concretos requer avaliação jurídica específica.",sources:["stf","cc"],
 conclusion:"A holding imobiliária pode ter imunidade de ITBI legítima; a fiscalização deve fundamentar qualquer alegação de simulação. A existência de imóveis ou de locação não constitui fraude."
},
{
 id:"aluguéis",short:"Aluguéis",range:"R$ 3 milhões",name:"Aluguéis: divergência entre recebimentos e registros",
 wealth:3000000,issue:"Diferença: R$ 8 mil/mês",
 summary:"Uma holding de R$ 3 milhões administra imóveis locados. Contratos indicam recebimentos mensais de R$ 20 mil, mas os registros apresentados apontam R$ 12 mil. O objetivo é investigar a divergência, não presumir crime.",
 lawful:"A sociedade pode administrar aluguéis próprios em regime tributário permitido e organizar os recursos em conta empresarial, com contratos, escrituração e declarações verdadeiras.",
 stages:[
  {time:"Contratos vigentes",title:"Os imóveis geram receita locatícia",fact:"Os contratos de locação do caso indicam aluguéis totais de R$ 20 mil por mês.",concern:"Aluguel contratado nem sempre equivale ao recebido: vacância, inadimplência, encargos e competência precisam ser verificados.",docs:["Contratos e aditivos","Comprovantes de ocupação e pagamentos","Regras de reconhecimento da receita"],analysis:"Comece pela base econômica correta. Não conclua sonegação apenas pela diferença entre receita contratada e receita contabilizada."},
  {time:"Registros fiscais",title:"Aparece uma diferença a explicar",fact:"O resumo contábil disponibilizado à turma indica R$ 12 mil mensais, R$ 8 mil abaixo do total contratual.",concern:"R$ 8 mil/mês corresponde a R$ 96 mil/ano de diferença aritmética, não automaticamente a imposto omitido.",docs:["Livro razão e relatórios contábeis","Declarações fiscais e memória de cálculo","Mapa de recebimentos e inadimplência"],analysis:"Distinguir diferença bruta de renda omitida exige conciliação por competência, aluguel efetivamente recebido e ajustes tributários legalmente aplicáveis."},
  {time:"Conciliação financeira",title:"Advogado pede explicações documentadas",fact:"As partes fornecem informações bancárias e justificativas para as diferenças de valores e datas.",concern:"É possível haver explicação lícita para parte ou todo o descompasso. O problema surge se informações falsas forem comprovadas.",docs:["Extratos e conciliações admissíveis","Comprovantes de repasses e taxas","Explicação documentada das divergências"],analysis:"O advogado deve montar um quadro rastreável de valores e origem, preservando sigilo e cadeia de custódia quando pertinente."},
  {time:"Atribuição de responsabilidade",title:"É necessário analisar intenção e autoria",fact:"Se a divergência persistir sem justificativa e houver informações fiscais inexatas, a autoridade examinará a conduta de quem prestou as declarações.",concern:"Erro contábil, inadimplência, inadimplemento fiscal e crime tributário não são sinônimos. Cada consequência tem requisitos próprios.",docs:["Autoria e revisão das declarações","Comunicações, retificações e regularizações","Processos fiscais e provas legalmente obtidas"],analysis:"A Lei 8.137/1990 tem requisitos típicos específicos. Evite afirmar crime antes de examinar constituição de tributo, autoria e circunstâncias."},
  {time:"Diagnóstico",title:"A diferença precisa ser qualificada",fact:"A turma formula conclusão condicionada: inconsistência explicada, irregularidade fiscal possível ou indícios para apuração mais aprofundada.",concern:"Não há fórmula que transforme R$ 96 mil de divergência em imposto ou sanção. As bases tributárias dependem do fato concreto.",docs:["Planilha de conciliação auditável","Fundamentos contábeis e fiscais","Provas e justificativas documentais"],analysis:"A conclusão responsável demonstra as diferenças comprovadas, as explicações consideradas e o enquadramento jurídico sem antecipar condenações."}
 ],
 quiz:{question:"A diferença de R$ 96 mil/ano prova sonegação?",options:["Sim, toda diferença de registros é automaticamente crime.","Não; a diferença é um alerta para conciliar documentos e investigar os requisitos da infração.","Não é necessário examinar livros ou declarações de uma holding."],correct:1,why:"Uma diferença contábil pode ser explicada ou indicar irregularidade. O correto é conciliar, confirmar o fato gerador e verificar os elementos legais."},
 basis:"Lei 8.137/1990, art. 1º; regras fiscais aplicáveis à receita de locação; CC, art. 50 se houver questão de abuso societário.",sources:["crimes","cc"],
 conclusion:"A holding pode trazer gestão e eficiência tributária legítimas. O advogado identifica receitas e documentos incompatíveis, verifica explicações e delimita se houve erro, infração fiscal ou possível ilícito penal."
},
{
 id:"grupos",short:"Grupo complexo",range:"R$ 15 milhões",name:"Grande patrimônio: grupo societário e beneficiário real",
 wealth:15000000,issue:"Diversas sociedades",
 summary:"Uma família administra R$ 15 milhões por meio de uma holding e empresas controladas. Surgem dúvidas sobre contratos entre empresas e sobre quem recebe os benefícios econômicos de certos ativos.",
 lawful:"Grupos de empresas podem organizar investimentos, isolar atividades e formalizar governança lícita. Estrutura complexa e participação familiar, por si, não caracterizam fraude.",
 stages:[
  {time:"Formação do grupo",title:"Há várias empresas com funções distintas",fact:"A holding participa de duas sociedades que possuem imóveis e investimentos. Cada empresa apresenta contratos e patrimônio próprios.",concern:"Complexidade não basta para fraude; é preciso compreender o mapa de controle e a substância das atividades.",docs:["Organograma e contratos sociais","Quadro de participações e administradores","Demonstrações financeiras"],analysis:"Construa o mapa de titularidade e direitos econômicos. Autonomia das empresas é a premissa inicial, não algo a ignorar automaticamente."},
  {time:"Transações vinculadas",title:"Operações entre empresas são questionadas",fact:"Um relatório aponta transferências de valores entre sociedades do grupo e ausência de documentação suficiente em algumas partidas.",concern:"Transferências intragrupo podem ser regulares, por contratos, mútuos, distribuição e prestação de serviços. A falta de lastro é sinal para investigar.",docs:["Instrumentos de mútuo e contratos","Registros contábeis e extratos pertinentes","Atas e autorizações societárias"],analysis:"Investigue razão econômica, competência de administradores e correspondência entre obrigações, registros e pagamentos."},
  {time:"Benefícios pessoais",title:"Existem despesas de uso privado discutidas",fact:"Alguns ativos mantidos pelas sociedades são utilizados por familiares. O grupo apresenta justificativas sobre locações, remuneração ou disponibilização dos bens.",concern:"Uso privado de bem societário não é automaticamente ilícito; documentação, contabilização e tratamento fiscal importam.",docs:["Contratos de utilização e condições econômicas","Comprovantes de pagamentos e despesas","Demonstrações de resultados e notas explicativas"],analysis:"Confronte os benefícios efetivos com contratos e encargos. A confusão patrimonial exige prova concreta."},
  {time:"Interesse de terceiros",title:"Um credor questiona a separação patrimonial",fact:"Uma execução contra uma sociedade não encontra bens suficientes. O credor pede extensão de responsabilidade às outras empresas.",concern:"STJ Tema 1.210: só a inexistência de bens penhoráveis ou encerramento irregular não comprova abuso.",docs:["Execução e relação da dívida com empresas","Provas de desvio ou confusão patrimonial","Contratos e balanços individualizados"],analysis:"A desconsideração exige demonstrar os requisitos aplicáveis ao responsável pretendido; não basta um grupo econômico com empresas relacionadas."},
  {time:"Síntese técnica",title:"Separar complexidade de abuso demonstrado",fact:"O advogado compara mapa de empresas, prova documental e fluxo econômico. A hipótese de irregularidade só avança na medida dos elementos efetivos.",concern:"Fraude societária, ilícito fiscal e lavagem de dinheiro são categorias distintas e não se inferem automaticamente da estrutura de holdings.",docs:["Organograma e mapa de operações documentadas","Laudo contábil e justificativas confrontadas","Fundamentação específica por obrigação e empresa"],analysis:"A conclusão pode preservar empresas regulares e apontar fatos concretos a investigar em outras. Evite imputações penais sem requisitos e prova."}
 ],
 quiz:{question:"Ter várias empresas e poucos bens na executada permite atingir todas?",options:["Sim, basta provar que pertencem à mesma família.","Não; é preciso identificar o fundamento legal específico e demonstrar os requisitos aplicáveis.","Sim, porque holding nunca tem autonomia patrimonial."],correct:1,why:"A existência de grupo econômico ou o insucesso da execução não substitui prova de desvio de finalidade ou confusão patrimonial nos casos regidos pelo art. 50 do CC."},
 basis:"Código Civil, art. 50; CPC, arts. 133 a 137; STJ, Tema 1.210. Eventuais infrações fiscais e penais têm requisitos autônomos.",sources:["cc","cpc","stj"],
 conclusion:"O advogado não deve confundir planejamento de grupos familiares com fraude. A investigação identifica operações concretas e preserva a autonomia legítima das sociedades."
}
];

const FLOW=[["01","Contexto"],["02","Ato central"],["03","Manobra"],["04","Efeito"],["05","Conflito"],["06","Apuração"],["07","Consequências"],["08","Desafio"]];
const MECHANISMS={
credores:{title:"Transferência patrimonial com possível prejuízo ao credor",narrative:"A simulação representa a hipótese em que um bem é transferido para uma sociedade familiar quando já existe uma obrigação relevante. A sequência permite discutir se a operação foi legítima ou se reduziu, de forma juridicamente relevante, a garantia patrimonial do credor.",explanation:"O núcleo didático é a relação entre a data da obrigação, a situação patrimonial antes e depois do ato e o prejuízo alegado. A mera constituição da holding ou a transferência do imóvel não prova fraude.",impact:"Se os requisitos forem demonstrados, podem ser discutidas fraude contra credores ou fraude à execução, cada qual com pressupostos e efeitos próprios.",label:"Fraude contra credores / fraude à execução"},
meacao:{title:"Ocultação ou subavaliação de direitos na partilha",narrative:"A simulação apresenta uma holding que concentra bens do casal. No conflito, a participação societária ou o valor econômico declarado não corresponde, em tese, à realidade patrimonial discutida entre os cônjuges.",explanation:"A pessoa jurídica não apaga direitos decorrentes do regime de bens. A hipótese fraudulenta está na eventual ocultação, dissimulação ou manipulação da informação patrimonial, não na existência da holding.",impact:"Conforme os fatos e a prova, podem surgir consequências na partilha, discussão de simulação e, em situação excepcional, desconsideração inversa da personalidade jurídica.",label:"Ocultação patrimonial em contexto de meação"},
herdeiros:{title:"Cessão aparente e possível doação dissimulada",narrative:"A simulação acompanha uma reorganização de quotas apresentada como negócio oneroso, embora os fatos levantem dúvida sobre a existência de contraprestação real ou sobre o respeito à legítima dos herdeiros necessários.",explanation:"O ponto jurídico é comparar a natureza declarada do negócio com sua realidade econômica, considerando liberalidade, colação, parte disponível e legítima. A desigualdade entre herdeiros, isoladamente, não é fraude.",impact:"Se comprovados os requisitos, podem ser discutidas simulação, colação ou redução de liberalidade inoficiosa, conforme o caso.",label:"Simulação negocial / violação da legítima"},
itbi:{title:"Declaração incompatível com a operação tributária real",narrative:"A simulação compara o valor dos imóveis, o capital efetivamente integralizado e a natureza jurídica atribuída às parcelas da operação. A hipótese ilícita surge se os documentos não representarem o negócio real e forem usados para obter vantagem fiscal indevida.",explanation:"É preciso separar imunidade constitucional legítima, limite da integralização e eventual simulação. A atividade imobiliária, por si só, não demonstra fraude nem afasta automaticamente a imunidade, conforme a orientação indicada no caso.",impact:"A consequência depende da operação efetiva, da parcela abrangida pela imunidade e da prova de simulação ou fraude à lei. Não há lançamento ou crime automático.",label:"Simulação tributária / fraude à lei"},
"aluguéis":{title:"Omissão intencional de receitas locatícias (hipótese)",narrative:"A simulação apresenta contratos de locação com um valor total e registros fiscais ou contábeis com valor diferente. A turma acompanha a hipótese de que parte da receita tenha sido deliberadamente omitida, sem confundir divergência aritmética com crime comprovado.",explanation:"O núcleo é a diferença entre receita contratada, efetivamente recebida, competência contábil e valor declarado. Vacância, inadimplência, encargos e erros podem explicar diferenças; a infração exige análise dos elementos legais e da autoria.",impact:"Se a omissão dolosa e os demais requisitos legais forem comprovados, pode haver consequência tributária e, conforme o tipo penal, responsabilização por crime contra a ordem tributária.",label:"Possível sonegação de receita"},
grupos:{title:"Dissimulação de operações e confusão patrimonial",narrative:"A simulação acompanha operações entre sociedades relacionadas e o uso de ativos por pessoas físicas. O cenário questiona se há negócios reais e documentados ou se a estrutura está sendo usada para dissimular o beneficiário econômico, a origem ou o destino de recursos.",explanation:"Estruturas complexas e transações entre empresas podem ser legítimas. O ponto crítico é a falta de causa econômica real, a mistura patrimonial ou a dissimulação comprovada. Lavagem de dinheiro exige elementos próprios e não decorre automaticamente de uma holding.",impact:"Podem surgir consequências societárias, civis, fiscais e, se comprovados os elementos típicos, penais. A responsabilidade de cada pessoa e empresa deve ser individualizada.",label:"Possível confusão patrimonial / dissimulação de recursos"}
};
const state={case:0,step:0,quizChoice:null};
const current=()=>CASES[state.case];
const make=(tag,cls,t)=>{const e=doc.createElement(tag);if(cls)e.className=cls;if(t!==undefined)e.textContent=t;return e;};
const put=(id,t)=>{const el=$(id);if(el)el.textContent=t;};
function simulationData(c,i){
 const s=c.stages,m=MECHANISMS[c.id],last=s[s.length-1];
 if(i===0)return{tag:"CENA 01 · CONTEXTO",title:s[0].title,text:s[0].fact,operationTitle:"Situação de partida",operationText:c.summary,legalTitle:"O que a turma precisa compreender",legalText:s[0].concern,impactTitle:"Questão central",impactText:c.issue,docs:s[0].docs.join(" · ")};
 if(i===1)return{tag:"CENA 02 · ATO CENTRAL",title:s[1].title,text:s[1].fact,operationTitle:"Instrumento jurídico que aparece",operationText:m.narrative,legalTitle:"A forma não decide o caso",legalText:s[1].concern,impactTitle:"O que muda nesta cena",impactText:"A estrutura societária passa a integrar a história. A validade e os efeitos dependem da realidade do negócio e dos direitos envolvidos.",docs:s[1].docs.join(" · ")};
 if(i===2)return{tag:"CENA 03 · MANOBRA REPRESENTADA",title:m.title,text:m.narrative,operationTitle:"Explicação da manobra",operationText:m.explanation,legalTitle:"Finalidade ilícita em tese",legalText:"A vantagem indevida possível é descrita em termos jurídicos e conceituais. A simulação não ensina a executar, ocultar ou aperfeiçoar a conduta.",impactTitle:"Classificação didática",impactText:m.label,docs:s[2].docs.join(" · ")};
 if(i===3)return{tag:"CENA 04 · EFEITO DA OPERAÇÃO",title:s[2].title,text:s[2].fact,operationTitle:"Como a fraude se manifesta no caso",operationText:m.explanation,legalTitle:"O que diferencia irregularidade de crime",legalText:s[2].concern,impactTitle:"Efeito ou prejuízo em discussão",impactText:m.impact,docs:s[2].docs.join(" · ")};
 if(i===4)return{tag:"CENA 05 · CONFLITO",title:s[3].title,text:s[3].fact,operationTitle:"Quem pode ser afetado",operationText:"A situação chega a quem teve um direito potencialmente atingido: credor, cônjuge, herdeiro, Fisco ou terceiro. A simulação deixa claro qual interesse jurídico está em jogo.",legalTitle:"Limite da conclusão",legalText:s[3].concern,impactTitle:"Consequência em debate",impactText:m.impact,docs:s[3].docs.join(" · ")};
 if(i===5)return{tag:"CENA 06 · APURAÇÃO DO CASO",title:last.title,text:last.fact,operationTitle:"O que precisa ser demonstrado",operationText:last.analysis,legalTitle:"Documentos que entram na aula",legalText:last.docs.join(" · "),impactTitle:"Explicação alternativa legítima",impactText:c.lawful,docs:last.docs.join(" · ")};
 if(i===6)return{tag:"CENA 07 · CONSEQUÊNCIAS JURÍDICAS",title:"Enquadramento e consequências",text:c.conclusion,operationTitle:"Possível enquadramento",operationText:m.label+". "+last.analysis,legalTitle:"Fundamentos jurídicos para discussão",legalText:c.basis,impactTitle:"Regra essencial",impactText:"Não se presume fraude, dolo, simulação ou responsabilidade penal. A conclusão depende dos fatos provados, dos requisitos legais e do contraditório.",docs:"Use a cronologia e os documentos citados nas cenas anteriores."};
 return{tag:"CENA 08 · DESAFIO DA TURMA",title:"O que você conclui a partir da simulação?",text:c.quiz.question,operationTitle:"Escolha a resposta juridicamente adequada",operationText:"Leia as três alternativas e selecione a conclusão que melhor corresponde aos fatos e aos fundamentos apresentados.",legalTitle:"Objetivo da aprendizagem",legalText:"Distinguir o planejamento patrimonial legítimo da conduta ilícita, identificar o bem jurídico afetado e reconhecer os requisitos da responsabilização.",impactTitle:"Fundamento para a resposta",impactText:c.quiz.why,docs:"Caso: "+c.short+" · "+c.range};
}
function renderCases(){
 const root=$("caseButtons");root.replaceChildren();
 CASES.forEach((c,i)=>{const b=make("button","case-tab"+(i===state.case?" active":""));b.type="button";b.setAttribute("aria-pressed",String(i===state.case));b.append(make("strong","",c.short),make("small","",c.range));b.addEventListener("click",()=>{state.case=i;state.step=0;state.quizChoice=null;render();});root.append(b);});
 put("caseLabel","CENÁRIO "+(state.case+1)+" / "+CASES.length);
}
function renderFlow(){
 const root=$("flowSteps");root.replaceChildren();
 FLOW.forEach((step,i)=>{const b=make("button","flow-tab"+(i===state.step?" active":"")+(i<state.step?" passed":""));b.type="button";b.setAttribute("aria-pressed",String(i===state.step));b.append(make("span","flow-num",step[0]),make("strong","",step[1]));b.addEventListener("click",()=>changeStep(i));root.append(b);});
 put("stepLabel","PASSO "+(state.step+1)+" DE 8");put("stepNum",String(state.step+1).padStart(2,"0")+" / 08");$("simFill").style.width=((state.step+1)/8*100)+"%";
}
function renderQuiz(c){
 const root=$("quizOptions");root.replaceChildren();
 c.quiz.options.forEach((option,i)=>{const b=make("button","quiz-option"+(state.quizChoice===i?" selected":""));b.type="button";b.append(make("span","quiz-letter",String.fromCharCode(65+i)),make("span","",option));b.setAttribute("aria-pressed",String(state.quizChoice===i));b.addEventListener("click",()=>{state.quizChoice=i;renderQuiz(c);put("impactText",c.quiz.why);});root.append(b);});
 const feedback=$("quizFeedback");feedback.hidden=state.quizChoice===null;
 if(state.quizChoice!==null){const correct=state.quizChoice===c.quiz.correct;feedback.className="quiz-feedback "+(correct?"correct":"review");put("quizResult",correct?"Resposta correta":"Revise esta conclusão");put("quizWhy",c.quiz.why);}
}
function renderSources(){const root=$("sourceLinks");root.replaceChildren();SOURCE.forEach(([label,url])=>{const a=make("a","",label+" ↗");a.href=url;a.target="_blank";a.rel="noopener noreferrer";root.append(a);});}
function render(){
 const c=current(),d=simulationData(c,state.step);renderCases();renderFlow();
 renderArt(c,state.step);
 put("lessonTopic",MECHANISMS[c.id].label);
 put("detailHeading",c.short+" · "+d.title);
 put("detailNarrative",d.text);put("detailOperation",d.operationText);put("detailLegal",d.legalText);
 put("detailImpact",d.impactText);put("detailDocs",d.docs);
 $("lessonCopy").hidden=state.step===7;

 put("scenarioTitle",c.name);put("scenarioLead",c.summary);put("wealth",money(c.wealth));put("theme",c.issue);
 put("sceneTag",d.tag);put("eventTitle",d.title);put("eventNarrative",d.text);
 put("operationTitle",d.operationTitle);put("operationText",d.operationText);put("legalTitle",d.legalTitle);put("legalText",d.legalText);
 put("impactTitle",d.impactTitle);put("impactText",state.step===7&&state.quizChoice===null?"Responda ao desafio para revelar a fundamentação jurídica.":d.impactText);put("docsText",d.docs);
 $("simulationView").hidden=false;$("quizPanel").hidden=state.step!==7;
 if(state.step===7){put("quizQuestion",c.quiz.question);renderQuiz(c);}
 $("previous").disabled=state.step===0;$("next").textContent=state.step===7?(state.case===CASES.length-1?"Reiniciar primeiro caso":"Próximo caso →"):"Próxima cena →";
 put("announce",c.short+", passo "+(state.step+1)+": "+d.title);
}
function changeStep(i){state.step=Math.max(0,Math.min(7,i));state.quizChoice=null;render();}
function advance(){if(state.step<7){changeStep(state.step+1);return;}state.case=(state.case+1)%CASES.length;state.step=0;state.quizChoice=null;render();}
$("previous").addEventListener("click",()=>changeStep(state.step-1));$("next").addEventListener("click",advance);
$("restart").addEventListener("click",()=>{state.step=0;state.quizChoice=null;render();});
$("fullscreen").addEventListener("click",()=>{if(doc.fullscreenElement)doc.exitFullscreen?.();else doc.documentElement.requestFullscreen?.();});
$("sourceToggle").addEventListener("click",()=>{const box=$("sourceBox");box.hidden=!box.hidden;$("sourceToggle").setAttribute("aria-expanded",String(!box.hidden));if(!box.hidden)renderSources();});
doc.addEventListener("keydown",ev=>{const tag=ev.target?.tagName?.toLowerCase();if(["input","textarea","select","button","a","summary"].includes(tag)||ev.altKey||ev.metaKey||ev.ctrlKey)return;if(ev.key==="ArrowRight"||ev.key==="PageDown"){ev.preventDefault();advance();}if(ev.key==="ArrowLeft"||ev.key==="PageUp"){ev.preventDefault();$("previous").click();}if(ev.key.toLowerCase()==="f")$("fullscreen").click();});

/* Illustrations are loaded from the repository when published, or from a locally
   imported, persistent classroom pack. Nothing is uploaded to another service. */
const ART_DIR="assets/the-crimes/";
const ART_NAMES=[
"01_capa_crimcity.webp","02_credores.webp","03_meacao.webp",
"04_herdeiros.webp","05_itbi.webp","06_alugueis.webp",
"07_grupo.webp","08_investigacao.webp","09_julgamento.webp","10_final.webp"];
const ART_CASE={credores:"02_credores.webp",meacao:"03_meacao.webp",herdeiros:"04_herdeiros.webp",
itbi:"05_itbi.webp","aluguéis":"06_alugueis.webp",grupos:"07_grupo.webp"};
const artMemory=new Map();let artEpoch=0,lastObjectURL=null;
function sceneArt(c,step){
 if(step===5)return "08_investigacao.webp";
 if(step===6)return "09_julgamento.webp";
 if(step===7)return "10_final.webp";
 if(step===0&&c.id==="credores")return "01_capa_crimcity.webp";
 return ART_CASE[c.id];
}
function artDB(){
 return new Promise((resolve,reject)=>{
  if(!("indexedDB" in window)){reject(Error("Armazenamento local indisponível"));return;}
  const q=indexedDB.open("the-crimes-illustrations",1);
  q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains("images"))q.result.createObjectStore("images");};
  q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);
 });
}
async function readStoredArt(name){
 if(artMemory.has(name))return artMemory.get(name);
 try{
  const db=await artDB();
  return await new Promise(resolve=>{
   const tx=db.transaction("images","readonly"),req=tx.objectStore("images").get(name);
   req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null);
   tx.oncomplete=()=>db.close();tx.onerror=()=>db.close();
  });
 }catch{return null;}
}
async function saveArt(name,blob){
 try{
  const db=await artDB();
  await new Promise((resolve,reject)=>{
   const tx=db.transaction("images","readwrite");
   tx.objectStore("images").put(blob,name);
   tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
  });
  db.close();return true;
 }catch{return false;}
}
function showArtBlob(blob){
 const el=$("sceneImage");if(lastObjectURL)URL.revokeObjectURL(lastObjectURL);
 lastObjectURL=URL.createObjectURL(blob);
 el.onload=()=>{$("artPlaceholder").hidden=true;};
 el.onerror=()=>{$("artPlaceholder").hidden=false;};
 el.src=lastObjectURL;
}
async function renderArt(c,step){
 const token=++artEpoch, name=sceneArt(c,step),img=$("sceneImage");
 img.alt="Ilustração cinematográfica fictícia: "+c.short+", cena "+(step+1);
 $("artPlaceholder").hidden=false;
 const blob=await readStoredArt(name);
 if(token!==artEpoch)return;
 if(blob){showArtBlob(blob);return;}
 if(lastObjectURL){URL.revokeObjectURL(lastObjectURL);lastObjectURL=null;}
 img.onload=()=>{if(token===artEpoch)$("artPlaceholder").hidden=true;};
 img.onerror=()=>{if(token===artEpoch)$("artPlaceholder").hidden=false;};
 img.src=ART_DIR+name;
}
function parseArtZip(buffer){
 const b=new Uint8Array(buffer),v=new DataView(buffer),dec=new TextDecoder(),out=[];
 let p=0;
 while(p+30<=b.byteLength&&v.getUint32(p,true)===0x04034b50){
  const flags=v.getUint16(p+6,true),method=v.getUint16(p+8,true),size=v.getUint32(p+18,true);
  const namelen=v.getUint16(p+26,true),extra=v.getUint16(p+28,true);
  const name=dec.decode(b.slice(p+30,p+30+namelen)).split("/").pop();
  const start=p+30+namelen+extra,end=start+size;
  if(flags&8||end>b.length)throw Error("ZIP incompatível. Utilize o pacote de ilustrações preparado para o simulador.");
  if(ART_NAMES.includes(name)){
   if(method!==0)throw Error("O pacote precisa estar em ZIP sem compressão adicional.");
   out.push([name,new Blob([b.slice(start,end)],{type:"image/webp"})]);
  }
  p=end;
 }
 return out;
}
$("artImportButton").addEventListener("click",()=>$("artImportFile").click());
$("artImportFile").addEventListener("change",async event=>{
 const files=Array.from(event.target.files||[]);if(!files.length)return;
 try{
  const all=[];
  for(const file of files){
   if(file.name.toLowerCase().endsWith(".zip"))all.push(...parseArtZip(await file.arrayBuffer()));
   else if(ART_NAMES.includes(file.name))all.push([file.name,file]);
  }
  if(!all.length)throw Error("Nenhuma das 10 imagens foi encontrada no arquivo.");
  let stored=0;
  for(const [name,blob] of all){artMemory.set(name,blob);if(await saveArt(name,blob))stored++;}
  $("artStatus").textContent=all.length+" artes disponíveis"+(stored===0?" nesta sessão":"");
  if(stored===0)$("artStatus").textContent=all.length+" artes nesta sessão (sem armazenamento permanente)";
  renderArt(current(),state.step);
 }catch(err){$("artStatus").textContent="Falha ao importar";window.alert(String(err.message||err));}
 finally{event.target.value="";}
});
$("detailsButton").addEventListener("click",()=>$("detailDialog").showModal());
$("closeDetails").addEventListener("click",()=>$("detailDialog").close());

render();
})();
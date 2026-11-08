(function(){
"use strict";
const doc=document;
const $=id=>doc.getElementById(id);
const money=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(n);
const SOURCE={
 cc:{name:"Código Civil — arts. 50, 158 a 165, 167, 544 e 549",url:"https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm"},
 cpc:{name:"CPC — arts. 133 a 137 e 792",url:"https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm"},
 stj:{name:"STJ — Tema 1.210 (abuso da personalidade jurídica)",url:"https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2026/16102026-Desconsideracao-da-personalidade-juridica-exige-prova-de-abuso--define-Segunda-Secao.aspx"},
 meacao:{name:"STJ — REsp 1.522.142/PR (desconsideração inversa em divórcio)",url:"https://scon.stj.jus.br/jurisprudencia/externo/informativo/?acao=pesquisar&livre=%28%22REsp%22+adj+%28%221522142%22+ou+%221522142%22-PR+ou+%221522142%22%2FPR+ou+%221.522.142%22+ou+%221.522.142%22-PR+ou+%221.522.142%22%2FPR%29%29.prec%2Ctext."},
 stf:{name:"STF — Tema 1.348 (imunidade ITBI, julgamento de 20/10/2026)",url:"https://portal.stf.jus.br/processos/detalhe.asp?incidente=6929423"},
 crimes:{name:"Lei 8.137/1990 — crimes contra a ordem tributária",url:"https://www.planalto.gov.br/ccivil_03/leis/l8137.htm"}
};
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
const state={caseIndex:0,step:0,revealed:false,answers:{}};
const add=(parent,tag,className,textValue)=>{const e=doc.createElement(tag);if(className)e.className=className;if(textValue!==undefined)e.textContent=textValue;parent.appendChild(e);return e;};
function setText(id,v){$(id).textContent=v;}
function renderCases(){
 const root=$("caseButtons");root.replaceChildren();
 CASES.forEach((c,i)=>{
  const b=add(root,"button","case-choice"+(i===state.caseIndex?" active":""),undefined);
  b.type="button";b.setAttribute("aria-pressed",String(i===state.caseIndex));b.addEventListener("click",()=>setCase(i));
  add(b,"b","",String(i+1).padStart(2,"0")+" · "+c.short);
  add(b,"small","",c.range);
 });
 setText("caseCounter",(state.caseIndex+1)+" de "+CASES.length);
}
function renderTimeline(c){
 const root=$("timeline");root.replaceChildren();
 c.stages.forEach((s,i)=>{
  const b=add(root,"button",i===state.step?"active":"",String(i+1)+". "+(i===0?"Início":i===4?"Conclusão":"Fato "+(i+1)));
  b.type="button";b.setAttribute("aria-pressed",String(i===state.step));b.addEventListener("click",()=>setStep(i));
 });
}
function renderQuiz(c){
 const root=$("quizOptions");root.replaceChildren();
 setText("quizQuestion",c.quiz.question);
 const canAnswer=state.step===c.stages.length-1;
 const selected=state.answers[c.id];
 c.quiz.options.forEach((option,i)=>{
  const b=add(root,"button","audit-answer"+(selected===i?" selected":""),undefined);
  b.type="button";b.disabled=!canAnswer;b.setAttribute("aria-pressed",String(selected===i));
  add(b,"span","",String.fromCharCode(65+i));add(b,"div","",option);
  if(canAnswer)b.addEventListener("click",()=>{state.answers[c.id]=i;renderQuiz(c);});
 });
 const feedback=$("quizFeedback");feedback.classList.remove("good","bad");
 if(!canAnswer){feedback.textContent="Reúna os cinco fatos para abrir a votação da turma.";return;}
 if(selected===undefined){feedback.textContent="Escolha uma alternativa. A resposta é explicada a partir dos fatos e da lei.";return;}
 const correct=selected===c.quiz.correct;
 feedback.classList.add(correct?"good":"bad");
 feedback.textContent=(correct?"Resposta fundamentada. ":"Reexamine a hipótese. ")+c.quiz.why;
}
function renderLinks(c){
 const root=$("legalLinks");root.replaceChildren();
 for(const key of c.sources){
  const entry=SOURCE[key];if(!entry)continue;
  const a=add(root,"a","",entry.name+" ↗");
  a.href=entry.url;a.target="_blank";a.rel="noopener noreferrer";
 }
}
function render(){
 const c=CASES[state.caseIndex],s=c.stages[state.step];
 renderCases();renderTimeline(c);
 setText("caseTitle",c.name);setText("caseSummary",c.summary);
 setText("caseWealth",money(c.wealth));setText("caseIssue",c.issue);
 setText("caseLawful",c.lawful);
 setText("caseStepLabel","Fato "+(state.step+1)+" de "+c.stages.length);
 const pct=Math.round((state.step+1)*100/c.stages.length);
 $("auditProgressFill").style.width=pct+"%";setText("auditPercent",pct+"%");
 setText("eventTime",s.time);setText("eventIndex",String(state.step+1).padStart(2,"0")+" / "+c.stages.length);
 setText("eventTitle",s.title);setText("eventFact",s.fact);
 setText("eventConcern",s.concern);
 const ul=$("eventDocs");ul.replaceChildren();
 s.docs.forEach(d=>add(ul,"li","",d));
 setText("evidenceCount",s.docs.length+" itens");
 setText("analysis",s.analysis);$("analysis").hidden=!state.revealed;
 $("reveal").setAttribute("aria-expanded",String(state.revealed));
 $("reveal").textContent=state.revealed?"Ocultar análise ↑":"Revelar a análise do advogado ↓";
 setText("legalBasis",c.basis);renderLinks(c);
 setText("caseConclusion",c.conclusion);renderQuiz(c);
 $("previousFact").disabled=state.step===0;
 $("nextFact").textContent=state.step===c.stages.length-1?(state.caseIndex===CASES.length-1?"Recomeçar casos ↻":"Próximo dossiê →"):"Próximo fato →";
 setText("auditFooterStatus","Dossiê "+(state.caseIndex+1)+" de "+CASES.length+" · Fato "+(state.step+1));
}
function setCase(i){state.caseIndex=i;state.step=0;state.revealed=false;render();window.scrollTo({top:0,behavior:"instant"});}
function setStep(i){state.step=Math.max(0,Math.min(CASES[state.caseIndex].stages.length-1,i));state.revealed=false;render();}
$("previousFact").addEventListener("click",()=>setStep(state.step-1));
$("nextFact").addEventListener("click",()=>{
 if(state.step<CASES[state.caseIndex].stages.length-1)setStep(state.step+1);
 else setCase((state.caseIndex+1)%CASES.length);
});
$("reveal").addEventListener("click",()=>{state.revealed=!state.revealed;render();});
$("fullscreen").addEventListener("click",()=>doc.fullscreenElement?doc.exitFullscreen?.():doc.documentElement.requestFullscreen?.());
$("printCase").addEventListener("click",()=>{state.revealed=true;render();window.print();});
doc.addEventListener("keydown",ev=>{
 const tag=ev.target?.tagName?.toLowerCase();
 if(["button","input","select","textarea","a"].includes(tag)||ev.altKey||ev.ctrlKey||ev.metaKey)return;
 if(ev.key==="ArrowRight"||ev.key==="PageDown"){ev.preventDefault();$("nextFact").click();}
 if(ev.key==="ArrowLeft"||ev.key==="PageUp"){ev.preventDefault();if(state.step>0)$("previousFact").click();}
 if(ev.key?.toLowerCase()==="f"){ev.preventDefault();$("fullscreen").click();}
});
render();
})();

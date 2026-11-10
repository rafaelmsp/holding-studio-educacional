(()=>{
'use strict';
const $=id=>document.getElementById(id);
const BASE='assets/the-crimes/';
const NAMES=['contexto','estrutura','operacao','efeito','conflito','apuracao','consequencias','debate'];
const STEP_TITLES={
credores:['A dívida','Criação da holding','Transferência do imóvel','Efeito patrimonial','Reação do credor','Apuração','Consequências','Debate'],
meacao:['Patrimônio do casal','Holding familiar','Quotas','Valores','Partilha','Apuração','Decisão','Debate'],
herdeiros:['Acervo familiar','Holding sucessória','Cessão de quotas','Valor contestado','Conflito entre herdeiros','Apuração','Consequências','Debate'],
itbi:['Imóveis','Integralização','Capital social','Registro','Fisco','Apuração','Consequências','Debate'],
alugueis:['Contratos','Receitas','Divergência','Efeito fiscal','Questionamento','Apuração','Consequências','Debate'],
grupos:['Grupo familiar','Contratos','Pagamentos','Aquisição de ativos','Divergências','Fluxo financeiro','Consequências','Debate']
};
const ICONS=['coins','rings','users','house','key','building'];
const KEYS=['credores','meacao','herdeiros','itbi','alugueis','grupos'];
const laws={cc:['Código Civil — arts. 50, 158–167, 544 e 549','https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm'],cpc:['CPC — arts. 133–137 e 792','https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm'],cf:['Constituição Federal — art. 156, § 2º, I','https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm'],tax:['Lei nº 8.137/1990 — ordem tributária','https://www.planalto.gov.br/ccivil_03/leis/l8137.htm'],launder:['Lei nº 9.613/1998 — lavagem de dinheiro','https://www.planalto.gov.br/ccivil_03/leis/l9613.htm'],stj375:['STJ — Súmula 375: fraude à execução','https://scon.stj.jus.br/SCON/sumstj/doc.jsp?b=SUMU&livre=%22375%22.num.'],stj1210:['STJ — Tema 1.210: desconsideração e prova de abuso','https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2026/16102026-Desconsideracao-da-personalidade-juridica-exige-prova-de-abuso--define-Segunda-Secao.aspx'],stf1348:['STF — Tema 1.348: ITBI e integralização','https://portal.stf.jus.br/processos/detalhe.asp?incidente=6929423'],stf796:['STF — Tema 796: limite do capital integralizado','https://portal.stf.jus.br/jurisprudenciaRepercussao/tema.asp?num=796'],stj2171573:['STJ — REsp 2.171.573/MS: doação dissimulada e colação','https://scon.stj.jus.br/jurisprudencia/externo/informativo/?livre=%40CNOT%3D021332']};
// Cada conjunto tem 8 quadros. Um quadro = título, narração curta, fato, discussão jurídica, possível consequência, documentos.
const CASES=[
{key:'credores',title:'FRAUDE CONTRA CREDORES',short:'Fraude contra credores',subtitle:'Um imóvel passa a integrar uma holding enquanto já existe uma obrigação relevante.',topic:'Responsabilidade patrimonial',law:['cc','cpc'],quiz:['A transferência é automaticamente nula.','É necessário examinar a data do crédito, a situação patrimonial e os requisitos legais.','Toda holding afasta a responsabilidade do sócio.'],correct:1,
scenes:[
['O contexto: a dívida','O empresário possui um imóvel e enfrenta uma cobrança de R$ 160 mil.','A obrigação já existe antes da reorganização familiar.','A data do crédito e a situação patrimonial anterior são determinantes para o enquadramento.','A existência de dívida não torna ilícito todo planejamento posterior.',['Contrato da obrigação','Histórico de cobrança','Matrícula do imóvel']],
['A holding familiar','Uma sociedade é constituída para centralizar a administração dos bens.','O empresário passa a participar de uma pessoa jurídica familiar.','A constituição da sociedade é lícita quando possui finalidade real.','A forma societária não elimina os direitos de terceiros.',['Contrato social','Quadro de quotas','Documentos de registro']],
['O imóvel muda de titular','O imóvel aparece integralizado no patrimônio da holding.','O negócio societário substitui a titularidade direta por direitos societários.','É preciso analisar a equivalência patrimonial, a solvência e a efetividade do ato.','O registro não prova fraude por si só.',['Instrumento de integralização','Matrícula atualizada','Lançamentos contábeis']],
['O patrimônio aparenta diminuir','O credor identifica menos bens diretamente registrados em nome do devedor.','Os ativos e as quotas continuam sujeitos a análise econômica e jurídica.','A redução de bens pessoais não significa ausência de patrimônio ou insolvência automática.','O prejuízo ao credor dependerá dos fatos demonstrados.',['Declarações patrimoniais','Participações societárias','Balanços']],
['O credor contesta','O credor questiona se a mudança de titularidade prejudicou seu crédito.','O litígio passa a discutir o momento e os efeitos da operação.','Fraude contra credores e fraude à execução têm requisitos e consequências distintos.','Uma ação não substitui a prova dos pressupostos exigidos.',['Autos judiciais','Datas do crédito e transferência','Documentos do patrimônio']],
['A cronologia é reconstruída','Advogados comparam os atos societários com as datas da cobrança.','As peças são organizadas em uma linha do tempo jurídica.','É necessário separar indícios, fatos comprovados e explicações alternativas.','O contraditório permite examinar a versão de todos os envolvidos.',['Contrato social','Registros imobiliários','Atos processuais']],
['Consequências em discussão','O tribunal examina eventual prejuízo e os requisitos da tutela solicitada.','O resultado depende da natureza do ato, do crédito e do contexto processual.','O art. 158 do CC trata de hipóteses de fraude contra credores; o art. 792 do CPC de fraude à execução.','Os efeitos jurídicos não são idênticos: não confunda anulação com ineficácia perante o exequente.',['Código Civil','CPC','Decisão fundamentada']],
['O veredito da turma','A classe decide se a prova reunida permite concluir pela fraude.','Os participantes avaliam a operação sob o ponto de vista do credor e da defesa.','Nem toda transferência é fraudulenta; a análise depende de fatos e requisitos.','O objetivo é fundamentar a conclusão, não adivinhar o resultado.',['Resumo da cronologia','Matriz de documentos','Fundamentos legais']]
]},
{key:'meacao',title:'OCULTAÇÃO DE MEAÇÃO',short:'Ocultação de meação',subtitle:'Uma reorganização empresarial provoca divergência sobre os direitos patrimoniais do casal.',topic:'Regime de bens e partilha',law:['cc','cpc'],quiz:['A holding sempre exclui direitos do cônjuge.','A titularidade das quotas dispensa a apuração do regime de bens.','O regime de bens e o valor econômico da participação devem ser examinados.'],correct:2,
scenes:[
['O patrimônio do casal','Imóveis e participações empresariais são discutidos no contexto de separação.','Os cônjuges possuem possíveis direitos sobre um acervo comum.','A extensão da meação depende do regime patrimonial, da origem e da data dos bens.','O nome no registro não resolve sozinho todas as questões.',['Certidão de casamento','Regime de bens','Matrículas']],
['A sociedade familiar','Bens de uso familiar passam a ser administrados por uma holding.','Uma pessoa jurídica reúne participações econômicas antes dispersas.','A administração societária pode ser legítima mesmo durante conflito familiar.','A personalidade jurídica não apaga o regime patrimonial.',['Contrato social','Alterações','Histórico de integralização']],
['As quotas são questionadas','O casal diverge sobre quem tem direito econômico às quotas.','Participação formal e conteúdo patrimonial precisam ser diferenciados.','O administrador não é necessariamente titular integral das participações.','Desconsideração inversa exige requisitos concretos.',['Quadro societário','Procurações','Balancetes']],
['Valores não coincidem','A avaliação de um bem diverge do valor atribuído à participação societária.','Os documentos apresentam critérios e datas distintos.','Diferença de valores pode decorrer de avaliação legítima ou exigir esclarecimento.','A prova de simulação não nasce somente da diferença numérica.',['Laudos','Instrumentos societários','Avaliações']],
['A partilha é contestada','Um cônjuge afirma que o acervo declarado não reflete os direitos econômicos reais.','Os interesses do casal entram em conflito judicial.','A eventual ocultação deve ser individualizada e demonstrada.','Não se presume dolo apenas por existir pessoa jurídica.',['Petição','Declarações de bens','Documentos de renda']],
['A prova é confrontada','Extratos e registros são analisados nos limites da autorização legal.','A reconstituição compara bens, quotas e rendimentos.','O exame verifica titularidade, regime de bens e atos efetivamente praticados.','A cooperação processual não permite violar direitos de terceiros.',['Registros públicos','Documentos contábeis','Extratos admissíveis']],
['A decisão patrimonial','O juiz avalia direitos e eventual necessidade de medidas de proteção.','A decisão delimita o que integra a partilha e os efeitos dos negócios discutidos.','Simulação, fraude e desconsideração inversa são institutos com requisitos próprios.','A solução deve preservar o contraditório.',['Decisão judicial','Fundamentação jurídica','Partilha']],
['O debate da meação','A turma decide se há prova suficiente para alterar a partilha.','Os estudantes justificam a resposta a partir do regime de bens.','O ponto central é o direito econômico, não somente o nome no contrato.','Apurar corretamente também pode confirmar a regularidade da estrutura.',['Regime patrimonial','Cronologia','Fundamentos legais']]
]},
{key:'herdeiros',title:'PREJUÍZO A HERDEIROS',short:'Prejuízo a herdeiros',subtitle:'Uma cessão de quotas gera suspeita de doação dissimulada e discussão sobre a legítima.',topic:'Família e sucessões',law:['cc'],quiz:['Uma participação desigual prova crime.','É necessário avaliar a realidade do negócio, a contraprestação e os direitos sucessórios.','Toda cessão entre parentes é inválida.'],correct:1,
scenes:[
['O acervo familiar','A família possui imóveis e três descendentes com expectativas sucessórias.','Os bens e direitos econômicos são identificados antes da reorganização.','Os herdeiros necessários possuem proteção legal da legítima.','Planejamento sucessório é lícito nos limites da lei.',['Matrículas','Relação de bens','Documentos de família']],
['A holding sucessória','Os imóveis passam a ser administrados por uma sociedade.','A família recebe quotas relacionadas ao patrimônio integralizado.','As quotas também integram o patrimônio e podem ter efeitos sucessórios.','A sociedade não elimina a proteção da legítima.',['Contrato social','Quadro de quotas','Registros']],
['Uma cessão é formalizada','Uma transferência de quotas é apresentada como negócio oneroso.','O instrumento declara uma contraprestação que depois passa a ser questionada.','O essencial é investigar a realidade econômica sem presumir o negócio simulado.','O vínculo familiar não invalida automaticamente a operação.',['Contrato de cessão','Documentos de pagamento','Avaliação']],
['O valor é contestado','O preço declarado diverge de outras referências patrimoniais.','A divergência é examinada em relação às circunstâncias do ato.','Pode haver justificativas econômicas; para simulação é preciso prova do ajuste aparente.','O valor isolado não estabelece violação da legítima.',['Avaliações','Contabilidade','Histórico de preços']],
['Os herdeiros divergem','Descendentes questionam se a operação favoreceu um deles indevidamente.','A discussão alcança doações, colação e parte disponível.','A desigualdade pode ser lícita dentro dos limites sucessórios aplicáveis.','O conflito familiar não é sinônimo de crime.',['Doações anteriores','Testamento','Participações']],
['Os documentos são confrontados','Advogados verificam pagamentos, datas e conteúdo das participações.','A cronologia busca distinguir venda real de eventual liberalidade dissimulada.','Examine CC arts. 167, 544, 549 e regras da legítima.','Preservar prova não significa antecipar uma conclusão.',['Cessões','Comprovantes','Laudos']],
['Os efeitos sucessórios','A controvérsia é submetida à solução jurídica adequada.','Podem ser discutidas simulação, colação ou redução de liberalidade inoficiosa.','Cada medida possui requisitos próprios e efeitos distintos.','A pessoa jurídica não invalida toda a sucessão.',['Inventário','Decisão','Fundamentos legais']],
['O debate sucessório','A turma delibera se a documentação demonstra a natureza do negócio.','Os grupos defendem interpretações possíveis dos mesmos fatos.','A conclusão precisa respeitar a legítima e a autonomia patrimonial legítima.','O exercício não pressupõe que tenha havido fraude.',['Linha do tempo','Mapa de quotas','Fundamentação']]
]},
{key:'itbi',title:'ITBI E INTEGRALIZAÇÃO',short:'Operação de ITBI',subtitle:'Uma integralização imobiliária exige distinguir imunidade constitucional de eventual declaração simulada.',topic:'Tributário e societário',law:['cf','cc'],quiz:['A imunidade constitucional nunca se aplica a holdings.','Todo valor divergente é fraude tributária.','É preciso separar a operação real, os limites da imunidade e eventual simulação.'],correct:2,
scenes:[
['O patrimônio imobiliário','Uma família pretende organizar imóveis avaliados em R$ 5 milhões.','Há valores fiscais, contábeis e de mercado que podem usar critérios distintos.','O planejamento patrimonial regular não é ilícito.','Valores divergentes pedem contexto.',['Matrículas','Avaliações','Registros fiscais']],
['O projeto societário','A holding é constituída com capital social formalmente registrado.','O contrato define participações e a operação de integralização.','É preciso distinguir a titularidade e a finalidade econômica real.','O art. 156, § 2º, I, da CF disciplina a imunidade na hipótese legal.',['Contrato social','Capital declarado','Atos de constituição']],
['Bens integram capital','Imóveis são relacionados aos instrumentos de integralização.','O ato deve ser lido conforme o capital e os títulos efetivos.','A imunidade não deve ser tratada como automaticamente aplicável a qualquer parcela.','Também não se presume fraude quando a transmissão é válida.',['Títulos','Matrículas','Quadro de quotas']],
['Há diferença de valores','Uma avaliação imobiliária não coincide com o capital indicado.','O órgão competente examina os valores e a natureza das parcelas.','Critérios e datas de avaliação podem explicar diferenças.','A operação precisa ser enquadrada conforme os limites constitucionais e jurisprudenciais aplicáveis.',['Laudos','Declarações fiscais','Registros societários']],
['O enquadramento é contestado','A administração tributária questiona as bases da operação.','A sociedade sustenta que realizou integralização legítima.','Controvérsia tributária não significa, por si, crime.','Falsidade ou simulação exige prova específica.',['Notificações','Defesa administrativa','Atos registrados']],
['A documentação fiscal','Documentos são confrontados para identificar a realidade econômica.','O exame distingue erro, divergência de interpretação e eventual falsidade.','A auditoria deve aplicar o regime legal pertinente à data dos fatos.','Não inventar alíquotas ou imunidades automáticas.',['Laudos','Contratos','Decisões fiscais']],
['A solução jurídica','Uma autoridade decide sobre a operação ou seu enquadramento.','Os efeitos tributários dependem do negócio e da prova.','A validade societária e a incidência tributária não são idênticas.','A sanção exige os pressupostos legais aplicáveis.',['Decisão fundamentada','Normas locais','Constituição Federal']],
['O debate do ITBI','A turma analisa quando existe planejamento lícito ou simulação.','Os alunos justificam a distinção com base nos documentos.','A imunidade não é uma fraude; a realidade da operação deve ser examinada.','Evite conclusões automáticas.',['Matrículas','Instrumentos','Fundamentos']]
]},
{key:'alugueis',title:'RECEITAS DE ALUGUÉIS',short:'Receitas de aluguéis',subtitle:'Uma divergência entre contratos, recebimentos e registros fiscais levanta discussão sobre receitas omitidas.',topic:'Tributário e locações',law:['tax','cc'],quiz:['Toda diferença entre aluguel e declaração prova crime.','A prova deve distinguir valores contratados, recebidos, registrados e eventual dolo.','Uma holding de locação é sempre irregular.'],correct:1,
scenes:[
['Os imóveis estão locados','Uma holding administra apartamentos e contratos de locação.','Há contratos, vencimentos e recebimentos com datas diferentes.','O regime de competência pode diferir do fluxo de caixa.','A locação por pessoa jurídica é lícita.',['Contratos','Recibos','Matrículas']],
['A administração dos contratos','Uma pessoa gestora recebe informações sobre o aluguel de cada imóvel.','As receitas dependem de obrigações, cobranças e pagamentos reais.','A gestão da carteira exige registros adequados.','Não presuma omissão com base na quantidade de imóveis.',['Planilha de contratos','Adendos','Balancetes']],
['Surge uma divergência','Um conjunto de comprovantes não coincide com a receita informada.','A diferença levanta hipóteses que precisam ser investigadas.','Inadimplência, encargos ou períodos distintos podem explicar parte da diferença.','A hipótese de omissão dolosa exige elementos específicos.',['Comprovantes','Livro razão','Declarações']],
['Os registros são confrontados','A auditoria encontra datas e critérios distintos em documentos da carteira.','Os lançamentos são cotejados com contratos e pagamentos.','É essencial distinguir receita faturada, recebida e declarada.','Nenhuma divergência isolada demonstra fraude.',['DRE','Extratos admissíveis','Documentos fiscais']],
['A fiscalização questiona','O Fisco solicita esclarecimentos sobre valores e exercícios.','A empresa apresenta sua documentação e justificativas.','A existência de fiscalização não indica responsabilidade penal.','Não confunda infração tributária, dolo e crime.',['Intimações','Respostas','Guias']],
['O exame das receitas','As diferenças são classificadas segundo os períodos e a natureza do pagamento.','O trabalho identifica o que é receita, adiantamento, encargo ou inadimplência.','Só dados reconciliados permitem fundamentar uma conclusão.','Prova documental precisa ser lícita e contextual.',['Contratos','Extratos','Livros contábeis']],
['Consequências em tese','A autoridade avalia correções ou eventual responsabilização.','Os requisitos tributários e penais devem ser examinados separadamente.','A Lei nº 8.137/1990 trata de crimes contra a ordem tributária em hipóteses específicas.','Erro, atraso e dolo não são equivalentes.',['Legislação tributária','Decisão administrativa','Fundamentos penais']],
['O debate dos aluguéis','Os alunos escolhem a conclusão juridicamente sustentável.','A turma discute se os fatos bastam para demonstrar omissão intencional.','O método exige identificar receita real, período e autoria.','A dúvida pode exigir diligências adicionais.',['Matriz de conciliação','Documentos','Parecer']]
]},
{key:'grupos',title:'GRUPO SOCIETÁRIO',short:'Grupo societário',subtitle:'Empresas ligadas movimentam recursos e adquirem bens, exigindo análise da substância dos negócios.',topic:'Societário e lavagem em tese',law:['cc','cpc','launder'],quiz:['Qualquer operação entre empresas caracteriza lavagem.','O número de empresas prova dolo.','Deve-se demonstrar a origem penal e atos típicos de ocultação ou dissimulação.'],correct:2,
scenes:[
['O grupo familiar','O grupo possui participações e imóveis avaliados em R$ 15 milhões.','Sociedades operacionais e patrimoniais atuam de modo interligado.','Um grupo complexo pode ser economicamente legítimo.','A quantidade de CNPJs não prova ilícito.',['Organograma','Contratos sociais','Balanços']],
['Empresas e contratos','Algumas sociedades prestam serviços e outras administram ativos.','Documentos atribuem receitas e obrigações a empresas específicas.','É necessário verificar se as atividades têm substância econômica real.','A presença de contratos não basta nem impede análise adicional.',['Contratos','Demonstrações','Registros']],
['Pagamentos intragrupo','Transferências são identificadas entre empresas relacionadas.','As descrições contratuais e os documentos de execução são confrontados.','Pagamentos intragrupo são possíveis quando há causa real e escrituração adequada.','A dissimulação requer fatos e elementos típicos.',['Extratos','Contratos','Contabilidade']],
['Recursos associados a ativos','Uma holding registra aquisição imobiliária significativa.','A documentação da origem de parte dos pagamentos é questionada.','Comprar ativos pela pessoa jurídica pode ser legítimo.','A origem penal de recursos não se presume do destino patrimonial.',['Escrituras','Matrículas','Comprovantes']],
['A divergência é debatida','Informações das empresas não coincidem integralmente em um período.','A autoridade examina a causa dos pagamentos e a titularidade econômica.','Contradições exigem apuração e direito de defesa.','Não equipare toda confusão patrimonial a lavagem.',['Balancetes','Procurações','Notas']],
['O fluxo é reconstruído','Investigadores ordenam documentos, datas e transações relevantes.','O objetivo é verificar a realidade econômica e a origem dos valores.','Para lavagem, a Lei nº 9.613/1998 exige elementos específicos.','A prova deve respeitar os direitos e o contraditório.',['Cronologia','Mapa de operações','Documentos lícitos']],
['Consequências possíveis','A análise separa consequências civis, fiscais e penais.','O caso discute desconsideração, responsabilidade e eventual dissimulação.','Cada instituto tem pressupostos independentes.','O número de transferências não representa probabilidade de culpa.',['Código Civil','Lei nº 9.613/1998','Decisões pertinentes']],
['O conselho da turma','Os grupos apresentam pareceres alternativos para os mesmos fatos.','A turma deve apontar o que foi provado e o que permanece desconhecido.','A boa análise admite a hipótese de estrutura regular.','O objetivo é aprender a distinguir aparência e prova.',['Matriz de evidências','Documentos','Fundamentos legais']]
]}
];

const TRACE_PHASE=[
'Fixe a situação anterior ao ato: datas, titularidade, obrigação, regime familiar ou origem econômica conforme o caso.',
'Compare a data de criação da estrutura com o problema jurídico que já existia ou começava a surgir.',
'Confronte o instrumento formal com registros públicos, contabilidade e a realidade econômica que ele afirma representar.',
'Meça o efeito produzido depois do ato: quem passou a aparecer como titular, qual valor mudou e qual direito foi afetado.',
'Use a reação da parte prejudicada ou da fiscalização para identificar exatamente qual fato passou a ser contestado.',
'Monte a linha do tempo e procure convergência entre documentos independentes, evitando concluir apenas por aparência.',
'Relacione cada consequência a um requisito efetivamente provado; efeitos civis, tributários e penais não são intercambiáveis.',
'Feche o caso com uma matriz: fato comprovado, documento, norma, requisito, argumento contrário e conclusão.'
];
const ANALYSIS={
credores:{
aim:'Reduzir a exposição patrimonial percebida diante de uma cobrança já existente, sustentando que parte relevante do patrimônio passou a integrar a sociedade.',
law:'Código Civil, arts. 158 a 165; CPC, art. 792 quando houver contexto executivo; art. 167 do Código Civil se a prova apontar simulação.',
consequence:'Se os requisitos forem demonstrados, o negócio pode sofrer a consequência civil ou processual cabível, sem confundir fraude contra credores com fraude à execução.',
standard:'A prova precisa ligar cronologia, situação patrimonial, natureza do negócio e prejuízo. A mudança formal de titularidade, sozinha, não fecha o caso.',
moves:[
'O personagem já possui uma obrigação relevante e um imóvel diretamente ligado ao seu patrimônio. A história fixa esse ponto antes de qualquer reorganização.',
'Depois do surgimento da obrigação, ele constitui uma holding familiar e passa a concentrar nela a administração patrimonial.',
'O imóvel que antes aparecia diretamente em seu nome passa a integrar o patrimônio da sociedade por negócio societário formalizado.',
'Após a mudança, o credor encontra menos bens diretamente registrados em nome do devedor, embora participações societárias e outros direitos ainda precisem ser analisados.',
'O credor compara a situação anterior e posterior e questiona se a reorganização reduziu a garantia patrimonial do crédito.',
'Os atos são colocados em ordem: nascimento do crédito, constituição da sociedade, transferência, cobrança e atos processuais.',
'Com a cronologia reconstruída, o tribunal separa a validade formal do negócio de seus possíveis efeitos perante o credor.',
'A turma recebe a linha do tempo, os documentos e as teses opostas para decidir se os requisitos da consequência jurídica foram efetivamente provados.'
],
wrongs:[
'O ponto de partida não é ilícito por si só, mas a anterioridade do crédito é decisiva para saber se atos posteriores podem atingir a garantia do credor.',
'O problema aparece se a sociedade deixa de ser simples organização patrimonial e passa a integrar um encadeamento destinado a esvaziar a garantia do crédito.',
'A transferência torna-se juridicamente crítica quando, somada aos demais fatos, reduz a solvência ou produz prejuízo juridicamente relevante ao credor.',
'É nesta fase que o efeito econômico aparece: a forma societária pode criar distância entre o bem e o devedor, mas não apaga direitos, quotas, datas ou efeitos legais.',
'O ilícito alegado precisa ser provado; não basta afirmar que houve blindagem porque o imóvel mudou de titular formal.',
'A reconstrução pode revelar coincidência temporal, falta de equivalência econômica, insolvência ou outros elementos que sustentem a tese de fraude.',
'A consequência depende do instituto correto: fraude contra credores e fraude à execução possuem pressupostos e efeitos distintos.',
'O erro seria concluir apenas pela aparência. O veredito deve apontar fato, norma, requisito e prova correspondente.'
]},
meacao:{
aim:'Fazer bens economicamente relevantes aparecerem concentrados na estrutura societária controlada por um dos cônjuges durante a ruptura, reduzindo o que aparenta integrar diretamente a partilha.',
law:'Código Civil, regras do regime de bens aplicável; art. 167 em hipótese de simulação; art. 50 se houver abuso da personalidade jurídica; CPC, arts. 133 a 137 no incidente cabível.',
consequence:'Se houver ocultação, simulação ou abuso comprovado, a solução pode envolver recomposição patrimonial, reconhecimento de direitos na partilha e, quando cabível, desconsideração inversa.',
standard:'É preciso distinguir patrimônio da sociedade, valor econômico das quotas e direitos comunicáveis do casal. Controle empresarial não equivale automaticamente à propriedade pessoal de todos os ativos.',
moves:[
'A história começa identificando casamento, regime de bens, datas de aquisição e patrimônio conhecido antes da ruptura.',
'Durante a vida familiar, bens passam a ser administrados por uma holding controlada no núcleo familiar.',
'As quotas e o controle formal ficam concentrados, enquanto o valor econômico dos ativos permanece relacionado à sociedade.',
'Na ruptura, valores atribuídos aos bens e às participações societárias não coincidem integralmente.',
'Um dos cônjuges sustenta que determinados ativos pertencem à empresa; o outro afirma que a estrutura esconde direitos econômicos comunicáveis.',
'Registros, quotas, origem dos recursos, rendimentos e movimentações admitidas no processo são confrontados.',
'O juiz separa o que pertence à sociedade do valor econômico que pode repercutir na partilha e examina eventual abuso.',
'A turma decide se a prova demonstra simples organização empresarial ou utilização abusiva da estrutura para prejudicar a meação.'
],
wrongs:[
'O ilícito não decorre da existência de empresa. O problema surge se bens ou direitos comunicáveis forem deliberadamente ocultados da apuração patrimonial.',
'A holding se torna relevante para a investigação quando sua utilização coincide com atos destinados a afastar da partilha patrimônio economicamente comum.',
'O controle das quotas pode ser usado como argumento de exclusividade, mas a análise precisa alcançar origem dos recursos, regime de bens e conteúdo econômico da participação.',
'Diferença de avaliação não prova fraude. Torna-se crítica quando documentos e atos revelam subavaliação simulada ou outra manipulação patrimonial deliberada.',
'A possível violação está em apresentar como exclusivamente societário ou particular aquilo que, conforme o regime de bens e os fatos, repercute economicamente na meação.',
'A investigação busca demonstrar se houve simulação, confusão patrimonial, desvio de finalidade ou simples divergência legítima de avaliação.',
'Se comprovado abuso, a personalidade jurídica não pode ser utilizada como barreira artificial para impedir a tutela do direito patrimonial reconhecido.',
'O veredito precisa indicar exatamente qual direito foi ocultado, qual ato produziu o efeito e qual prova sustenta essa conclusão.'
]},
herdeiros:{
aim:'Favorecer economicamente um descendente por meio de negócio societário apresentado como oneroso, reduzindo o valor que aparece disponível para os demais na sucessão.',
law:'Código Civil, arts. 167, 544, 549, 1.789, 1.846 e regras de colação aplicáveis ao caso.',
consequence:'Se a realidade demonstrar liberalidade dissimulada, violação da legítima ou simulação, podem ser discutidas colação, redução do excesso, nulidade do negócio simulado e demais efeitos sucessórios cabíveis.',
standard:'O foco é a realidade econômica do negócio: contraprestação, valor, datas, parte disponível e proteção da legítima. Relação familiar ou preço baixo, isoladamente, não bastam.',
moves:[
'O patrimônio familiar e os três descendentes são apresentados antes das transferências societárias.',
'Os imóveis passam a compor uma holding sucessória e o valor patrimonial passa a ser representado também por quotas.',
'Um descendente recebe quotas por negócio apresentado documentalmente como oneroso.',
'O preço e a contraprestação declarados passam a ser comparados com avaliações e documentos econômicos disponíveis.',
'Os demais herdeiros sustentam que o negócio aparente escondeu favorecimento patrimonial relevante.',
'Advogados confrontam cessão, pagamentos, avaliações, doações anteriores e cronologia sucessória.',
'O efeito do negócio é testado contra a parte disponível, a legítima e as regras de colação ou redução aplicáveis.',
'A turma decide qual era a natureza econômica do ato e se ele ultrapassou os limites sucessórios.'
],
wrongs:[
'Não há ilícito no simples planejamento sucessório. A investigação começa porque os direitos dos herdeiros necessários possuem limites protegidos por lei.',
'A sociedade não elimina a legítima; transformar bens em quotas altera a forma patrimonial, não os limites materiais da sucessão.',
'O ponto crítico surge se a cessão onerosa for apenas aparente e encobrir liberalidade que deveria receber outro tratamento sucessório.',
'A divergência de valor torna-se relevante quando, junto com ausência de contraprestação real e outros fatos, sustenta a hipótese de negócio simulado ou liberalidade excessiva.',
'O possível prejuízo está em retirar economicamente da futura sucessão parcela protegida sem respeitar os limites da parte disponível.',
'A prova precisa mostrar a realidade do pagamento e do negócio, não apenas a aparência do contrato ou a insatisfação entre familiares.',
'Se a liberalidade invade a legítima ou se o negócio é simulado, surgem consequências próprias; cada instituto deve ser aplicado separadamente.',
'O veredito deve responder: houve venda real, liberalidade válida, liberalidade excessiva ou negócio simulado?'
]},
itbi:{
aim:'Apresentar uma transmissão imobiliária como integralização de capital protegida constitucionalmente e obter tratamento tributário favorável, embora a realidade do caso possa não corresponder integralmente ao enquadramento declarado.',
law:'Constituição Federal, art. 156, § 2º, I; legislação municipal do ITBI; Código Civil, art. 167 se houver simulação; jurisprudência aplicável à data dos fatos.',
consequence:'Quando a operação não se enquadra na hipótese constitucional ou quando há simulação comprovada, podem surgir cobrança tributária, acréscimos legais e outras responsabilidades conforme os fatos e a legislação aplicável.',
standard:'É preciso distinguir imunidade constitucional legítima, divergência de avaliação, parcela efetivamente integralizada e eventual simulação. Planejamento tributário e fraude não são sinônimos.',
moves:[
'A família parte de um conjunto de imóveis com valores fiscais, contábeis e de mercado potencialmente diferentes.',
'A sociedade é constituída e declara capital que servirá de referência para a operação patrimonial.',
'Os imóveis são vinculados ao ato de integralização e passam à esfera patrimonial da pessoa jurídica.',
'Os registros revelam diferença entre valores atribuídos aos imóveis e valores relacionados ao capital social.',
'O Município questiona o enquadramento tributário e exige explicações sobre a realidade da operação.',
'São confrontados contrato social, registros imobiliários, avaliações e declarações apresentadas ao Fisco.',
'A autoridade decide quais parcelas e fatos estão ou não abrangidos pelo tratamento constitucional invocado.',
'A turma separa imunidade legítima, divergência interpretativa, erro e eventual simulação.'
],
wrongs:[
'O ilícito não está em buscar a imunidade prevista na Constituição. Surge se os fatos declarados forem manipulados para enquadrar artificialmente operação diferente.',
'A constituição da sociedade é regular; o problema é usar capital meramente aparente ou informação falsa para sustentar tratamento tributário indevido.',
'A integralização deve corresponder ao negócio real. Se o documento encobrir transmissão diversa, a forma societária não impede a análise da substância.',
'Diferença de valores não prova fraude. Ela se torna relevante quando conectada a declaração falsa, simulação ou parcela fora dos limites do enquadramento jurídico.',
'A fiscalização precisa demonstrar por que o fato tributável difere da operação declarada; mera discordância interpretativa não equivale a crime.',
'A eventual falsidade aparece na comparação entre o que foi declarado, o que foi registrado e o que economicamente ocorreu.',
'A cobrança ou sanção deve corresponder ao fato demonstrado e ao regime vigente; consequência tributária não gera automaticamente consequência penal.',
'O veredito deve indicar se há imunidade, incidência, erro ou simulação e qual prova sustenta a classificação.'
]},
alugueis:{
aim:'Fazer parte da receita de locação efetivamente recebida não aparecer integralmente na apuração fiscal apresentada, reduzindo a base tributável percebida.',
law:'Legislação tributária aplicável às receitas e obrigações de declaração; Lei nº 8.137/1990, art. 1º, apenas se os elementos penais previstos em lei forem demonstrados.',
consequence:'Se houver omissão tributária dolosa comprovada, podem surgir exigência do tributo, multas e, nas hipóteses legais, responsabilização prevista na Lei nº 8.137/1990.',
standard:'A prova precisa distinguir aluguel contratado, valor efetivamente recebido, competência, encargos, inadimplência, contabilização e declaração. Divergência contábil isolada não prova crime.',
moves:[
'A holding possui imóveis locados e contratos com valores e datas de vencimento identificáveis.',
'A gestão reúne informações de cobrança e pagamentos efetivamente realizados pelos locatários.',
'A auditoria encontra diferença entre parte dos recebimentos documentados e os valores registrados ou declarados.',
'Contratos, extratos admitidos, contabilidade e declarações fiscais são colocados lado a lado.',
'O Fisco questiona a origem da diferença e pede justificativas para exercícios e imóveis específicos.',
'Cada divergência é classificada: valor não recebido, encargo, período diferente ou receita efetivamente omitida.',
'Depois da reconciliação, a autoridade separa simples erro ou infração administrativa de eventual conduta dolosa.',
'A turma decide se a documentação demonstra omissão intencional ou apenas inconsistência ainda não esclarecida.'
],
wrongs:[
'A existência de receita tributável não é ilícita. O problema começa quando receita efetivamente auferida é deliberadamente excluída da apuração exigida.',
'A gestão se torna relevante porque permite comparar o que foi cobrado, o que foi efetivamente recebido e o que foi registrado.',
'A possível fraude aparece na diferença não explicada entre recebimentos reais e informações contábeis ou fiscais apresentadas.',
'O ilícito não está na mera diferença numérica; está na eventual supressão ou redução de tributo por conduta que preencha os elementos legais.',
'A fiscalização é o momento em que explicações e documentos são confrontados com a hipótese de omissão.',
'A análise precisa eliminar causas legítimas da divergência antes de atribuir intenção fraudulenta.',
'Responsabilidade tributária e penal são distintas; dolo e demais elementos do tipo precisam ser demonstrados quando se discute crime.',
'O veredito deve indicar quais receitas foram efetivamente recebidas, quais foram declaradas e qual prova sustenta eventual intenção de omitir.'
]},
grupos:{
aim:'Usar a complexidade de um grupo de empresas para afastar a aparência documental da origem econômica de determinados recursos e ativos, dificultando a compreensão de quem realizou cada operação.',
law:'Código Civil, art. 50; CPC, arts. 133 a 137; Lei nº 9.613/1998, art. 1º, somente quando origem criminosa e atos de ocultação ou dissimulação forem demonstrados.',
consequence:'Se houver abuso societário, podem existir efeitos civis de desconsideração; se a origem criminosa e atos típicos forem demonstrados, incide a análise própria da Lei nº 9.613/1998.',
standard:'Complexidade, empresas relacionadas e transferências intragrupo não provam lavagem. É indispensável demonstrar origem ilícita quando exigida e os atos típicos correspondentes, separando consequências civis, fiscais e penais.',
moves:[
'O grupo familiar é apresentado com holding, sociedades operacionais, imóveis e participações cruzadas.',
'Empresas relacionadas celebram contratos e atribuem receitas, despesas e responsabilidades a pessoas jurídicas distintas.',
'A investigação identifica pagamentos entre sociedades do mesmo grupo e passa a confrontá-los com contratos e execução econômica.',
'Uma das sociedades registra aquisição relevante de ativo e a origem econômica de parte dos recursos é questionada no caso fictício.',
'Dados societários, contábeis e financeiros apresentam contradições que exigem reconstrução da substância das operações.',
'Os investigadores ordenam empresas, contratos, datas, pagamentos e ativos para identificar o fluxo econômico real.',
'Os fatos são separados em possíveis efeitos civis, tributários e, somente quando presentes elementos próprios, penais.',
'A turma recebe organograma e matriz de operações para apontar quais fatos foram comprovados e qual enquadramento é possível.'
],
wrongs:[
'O grupo societário é lícito. O problema surge quando a separação entre empresas é instrumentalizada para esconder abuso, confusão patrimonial ou fatos penalmente relevantes.',
'Contrato intragrupo não é ilícito por si só; torna-se crítico quando é apenas aparente ou não corresponde a atividade econômica demonstrável.',
'Pagamentos relacionados precisam ter causa econômica identificável. A falta de correspondência pode ser indício, não prova automática de lavagem.',
'A aquisição de ativo é regular em si. A questão penal somente surge se houver origem criminosa demonstrada e conduta de ocultação ou dissimulação prevista em lei.',
'Contradições podem revelar escrituração deficiente ou algo mais grave; o enquadramento depende de prova da realidade econômica e da autoria.',
'O fluxo reconstruído permite distinguir operação real de ato aparente e verificar, quando pertinente, origem e destino dos recursos.',
'Confusão patrimonial pode sustentar consequências civis sem automaticamente caracterizar lavagem; os pressupostos não se confundem.',
'O veredito deve separar fato comprovado, hipótese investigativa e elemento ainda ausente, evitando transformar complexidade empresarial em presunção de culpa.'
]}
};


const ZONE_LEVELS={
 green:{label:'PERMITIDO EM TESE',icon:'🟢',className:'zone-green'},
 yellow:{label:'ZONA CINZENTA',icon:'🟡',className:'zone-yellow'},
 red:{label:'LIMITE ULTRAPASSADO NO CASO FICTÍCIO',icon:'🔴',className:'zone-red'}
};
const ZONES={
 credores:{
  status:['green','green','yellow','yellow','yellow','yellow','yellow','yellow'],
  lawful:'Reorganizar patrimônio, constituir uma holding ou integralizar um imóvel pode ser lícito. A existência de dívida não congela automaticamente toda administração patrimonial.',
  limit:'O limite aparece quando os fatos e os requisitos do instituto aplicável mostram prejuízo juridicamente relevante ao credor. Fraude contra credores e fraude à execução não são a mesma coisa.',
  proof:'Cronologia do crédito e da transferência; solvência antes e depois; contraprestação; patrimônio remanescente; atos processuais; registro de constrição e má-fé do terceiro quando juridicamente relevantes.',
  precedent:'Súmula 375/STJ: para fraude à execução envolvendo terceiro adquirente, o registro da penhora ou a prova de má-fé do terceiro é central.',
  refs:['stj375']
 },
 meacao:{
  status:['green','green','yellow','yellow','yellow','yellow','yellow','yellow'],
  lawful:'A sociedade possui patrimônio próprio. Administrar uma holding ou concentrar bens na pessoa jurídica não significa, sozinho, que todos os ativos pertençam pessoalmente a um dos cônjuges.',
  limit:'A zona deixa de ser lícita se a prova demonstrar simulação, ocultação de direitos comunicáveis, desvio de finalidade ou confusão patrimonial.',
  proof:'Regime de bens; data e origem da aquisição; valor econômico das quotas; fluxos entre sócio e sociedade; pagamentos pessoais pela empresa; atos de administração e eventual abuso.',
  precedent:'Tema 1.210/STJ: nas relações civis e empresariais, desconsideração exige prova efetiva de abuso por desvio de finalidade ou confusão patrimonial; falta de bens, sozinha, não basta.',
  refs:['stj1210']
 },
 herdeiros:{
  status:['green','green','yellow','yellow','yellow','yellow','yellow','yellow'],
  lawful:'É possível organizar a sucessão e favorecer economicamente um herdeiro dentro dos limites da parte disponível, observadas as regras legais e a natureza real do negócio.',
  limit:'O problema surge quando uma venda aparente encobre liberalidade, quando a doação invade a legítima ou quando a dispensa de colação não observa os requisitos aplicáveis.',
  proof:'Contraprestação real; valor do patrimônio no momento relevante; parte disponível; pagamentos; avaliações; liberalidades anteriores; declaração formal de dispensa de colação quando pertinente.',
  precedent:'O STJ distingue venda real de liberalidade dissimulada e exige atenção à legítima, à colação e à manifestação expressa quando a liberalidade recai sobre a parte disponível.',
  refs:['stj2171573']
 },
 itbi:{
  status:['green','green','green','yellow','yellow','yellow','yellow','yellow'],
  lawful:'A integralização de bens no capital social pode gozar de imunidade de ITBI. No Tema 1.348, julgado em 20/10/2026, o STF afirmou que a imunidade independe da atividade preponderante, inclusive imobiliária.',
  limit:'A imunidade fica limitada ao valor do capital social a integralizar, nos termos do Tema 796, e não impede o Fisco de demonstrar simulação ou fraude à lei para usufruir indevidamente do benefício.',
  proof:'Contrato social; capital efetivamente integralizado; valor e natureza da transmissão; matrícula; lançamentos societários; eventual parcela excedente; elementos concretos de simulação, se alegada.',
  precedent:'STF, Tema 1.348: imunidade incondicionada quanto à atividade preponderante, ressalvada simulação/fraude à lei; limite quantitativo conforme Tema 796.',
  refs:['stf1348','stf796']
 },
 alugueis:{
  status:['green','green','yellow','yellow','yellow','yellow','yellow','yellow'],
  lawful:'Diferença entre aluguel contratado e valor efetivamente recebido pode decorrer de inadimplência, vacância, descontos, encargos, período parcial ou critérios contábeis.',
  limit:'A questão muda quando a prova demonstra receita efetivamente auferida e deliberadamente omitida ou informação falsa relevante para a obrigação tributária.',
  proof:'Contratos; vencimentos; comprovantes de recebimento; inadimplência; extratos admissíveis; razão contábil; declarações fiscais; período de competência e autoria da informação.',
  precedent:'Divergência contábil não equivale automaticamente a crime. A responsabilidade tributária e penal exige enquadramento e prova dos respectivos requisitos.',
  refs:[]
 },
 grupos:{
  status:['green','green','green','yellow','yellow','yellow','yellow','yellow'],
  lawful:'Controle comum, mesmo endereço, contratos entre empresas e pagamentos intragrupo podem ter fundamento econômico legítimo. Complexidade societária não é sinônimo de ilícito.',
  limit:'O limite aparece com prova de abuso da personalidade, confusão patrimonial ou, para lavagem, atos típicos de ocultação/dissimulação ligados a bens provenientes de infração penal.',
  proof:'Substância econômica; contratos e entregas; contabilidade separada; origem dos recursos; beneficiário econômico; fluxos financeiros; pagamentos pessoais; finalidade dos atos e eventual origem ilícita.',
  precedent:'Tema 1.210/STJ exige prova de abuso para desconsideração civil/empresarial. Para lavagem, a Lei 9.613/1998 exige os elementos típicos próprios; múltiplas empresas não bastam.',
  refs:['stj1210']
 }
};


const LIVE_CLASS_META={
  correct:{symbol:'🟢',label:'JURIDICAMENTE ADEQUADA',className:'is-correct'},
  criminal:{symbol:'🔴',label:'ATITUDE CRIMINOSA NO CENÁRIO',className:'is-criminal'},
  gray:{symbol:'🟡',label:'ZONA CINZENTA',className:'is-gray'},
  risky:{symbol:'🟠',label:'ALTO RISCO JURÍDICO',className:'is-risky'}
};
function buildLiveQuestions(c){
  return c.scenes.map((s,i)=>{
    const mode=i%4;
    if(mode===0)return{
      q:'Na etapa "'+s[0]+'", qual leitura jurídica é mais adequada?',
      options:[
        {text:s[3],kind:'correct'},
        {text:'Concluir pela fraude apenas porque existe uma holding.',kind:'risky'},
        {text:'Ocultar deliberadamente patrimônio para frustrar a atuação judicial.',kind:'criminal'},
        {text:'Adiar qualquer análise sem examinar os documentos já disponíveis.',kind:'gray'}
      ],correct:0
    };
    if(mode===1)return{
      q:'Qual elemento probatório merece atenção nesta etapa?',
      options:[
        {text:s[5][0],kind:'correct'},
        {text:'Somente a aparência visual da operação, sem documentação.',kind:'risky'},
        {text:'Eliminar ou esconder documentos relevantes do caso.',kind:'criminal'},
        {text:'Apenas relatos informais ainda não confirmados.',kind:'gray'}
      ],correct:0
    };
    if(mode===2)return{
      q:'Qual conclusão é compatível com os fatos apresentados até aqui?',
      options:[
        {text:s[4],kind:'correct'},
        {text:'Presumir condenação automática sem examinar os requisitos legais.',kind:'risky'},
        {text:'Criar nova ocultação patrimonial para impedir o alcance dos bens.',kind:'criminal'},
        {text:'Reconhecer que ainda pode haver questão controvertida dependente de prova.',kind:'gray'}
      ],correct:0
    };
    return{
      q:'Qual fato da etapa "'+s[0]+'" deve integrar a reconstrução do caso?',
      options:[
        {text:s[2],kind:'correct'},
        {text:'Considerar irrelevante toda a cronologia da operação.',kind:'risky'},
        {text:'Destruir rastros documentais para dificultar a apuração.',kind:'criminal'},
        {text:'Tratar a existência da sociedade, isoladamente, como prova definitiva.',kind:'gray'}
      ],correct:0
    };
  });
}
const liveState={case:0,question:0,selected:null};

const persisted=(()=>{try{return JSON.parse(localStorage.getItem('the-crimes-progress')||'{}');}catch{return {};}})();
const state={case:Math.max(0,Math.min(5,Number(persisted.case)||0)),step:Math.max(0,Math.min(7,Number(persisted.step)||0)),tab:'explanation',answers:persisted.answers||{},visited:persisted.visited||{},present:Boolean(persisted.present)};
const icon=name=>`<svg class="ico" aria-hidden="true"><use href="#ic-${name}"></use></svg>`;
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
const formatStage=n=>String(n+1).padStart(2,'0');
function persist(){try{localStorage.setItem('the-crimes-progress',JSON.stringify({case:state.case,step:state.step,answers:state.answers,visited:state.visited,present:state.present}));}catch{}}
function markVisited(c,step){const list=new Set(Array.isArray(state.visited[c.key])?state.visited[c.key]:[]);list.add(step);state.visited[c.key]=[...list].sort((a,b)=>a-b);}
function visitedCount(key){return Array.isArray(state.visited[key])?new Set(state.visited[key]).size:0;}
function overallVisited(){return CASES.reduce((total,c)=>total+visitedCount(c.key),0);}
function scenePath(c,step){return `${BASE}scenes/${c.key}/${formatStage(step)}_${NAMES[step]}.webp`;}
const preloaded=new Set();
function preloadImage(src){if(preloaded.has(src))return;preloaded.add(src);const im=new Image();im.decoding='async';im.src=src;}
function preloadCase(c,step){[step,step+1,step-1].filter(i=>i>=0&&i<8).forEach(i=>preloadImage(scenePath(c,i)));const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,180));idle(()=>NAMES.forEach((_,i)=>preloadImage(scenePath(c,i))));}
function setSceneImage(c,step){const img=$('sceneImage'),src=scenePath(c,step);img.classList.add('is-changing');img.alt=`Cena fictícia ${step+1} do caso ${c.short}: ${c.scenes[step][0]}`;const settle=()=>img.classList.remove('is-changing');img.onload=settle;img.onerror=()=>{img.onerror=null;img.src=BASE+'city-banner.webp';img.alt='Panorama noturno fictício da Cidade do Crime';settle();};if(img.getAttribute('src')!==src)img.src=src;else settle();preloadCase(c,step);}
function renderCases(){const box=$('cases');box.replaceChildren();CASES.forEach((c,i)=>{const seen=visitedCount(c.key);const b=el('button','case-btn'+(i===state.case?' active':''));b.type='button';b.setAttribute('aria-pressed',String(i===state.case));b.setAttribute('aria-label',`Caso ${i+1}: ${c.short}. ${seen} de 8 cenas vistas.`);b.style.setProperty('--case-progress',`${seen/8*100}%`);const img=el('img');img.src=`${BASE}portraits/${c.key}.webp`;img.alt='';img.loading=i===state.case?'eager':'lazy';const text=el('span','label');text.append(el('span','number','CASO '+formatStage(i)),el('strong','case-name',c.short),el('span','case-progress',seen+'/8 cenas'));b.append(img,text);b.addEventListener('click',()=>{state.case=i;state.step=0;state.tab='explanation';markVisited(CASES[i],0);persist();render();});box.append(b);});}function renderSteps(){const box=$('steps');box.replaceChildren();const c=CASES[state.case];NAMES.forEach((_,i)=>{const b=el('button','step-card'+(i===state.step?' active':''));b.type='button';b.setAttribute('aria-pressed',String(i===state.step));b.setAttribute('aria-label',`Etapa ${i+1}: ${STEP_TITLES[c.key][i]}`);const frame=el('span','step-thumb');const img=el('img');img.src=scenePath(c,i);img.alt='';img.loading=Math.abs(i-state.step)<2?'eager':'lazy';frame.append(img);b.append(frame,el('span','step-idx',String(i+1)),el('strong','step-name',STEP_TITLES[c.key][i]));b.addEventListener('click',()=>go(i));box.append(b);});}
function fact(iconName,title,text){const row=el('section','fact');const i=el('span','fact-icon');i.innerHTML=icon(iconName);const content=el('div');content.append(el('h3','',title),el('p','',text));row.append(i,content);return row;}
function zoneBanner(level,stage){const cfg=ZONE_LEVELS[level]||ZONE_LEVELS.yellow;const wrap=el('section','zone-banner '+cfg.className);const top=el('div','zone-banner-top');top.append(el('strong','zone-status',cfg.icon+' '+cfg.label),el('span','zone-stage','ETAPA '+formatStage(stage)));wrap.append(top,el('p','zone-caption','Classificação didática desta etapa no caso fictício — não é presunção de culpa nem conclusão automática sobre casos reais.'));return wrap;}

function renderPanel(){const box=$('lessonFacts');box.replaceChildren();const c=CASES[state.case],s=c.scenes[state.step],a=ANALYSIS[c.key],z=ZONES[c.key];const [title,sub,what,legal,risk,docs]=s;const trace=TRACE_PHASE[state.step]+' Documentos desta fase: '+docs.join(' · ')+'.';
 let items=[];
 if(state.tab==='explanation')items=[['target','O que o personagem fez?',a.moves[state.step]],['alert','O que ele buscava?',a.aim],['book','Efeito produzido nesta fase',what]];
 else if(state.tab==='legal')items=[['alert','Onde está o ilícito em tese?',a.wrongs[state.step]],['scale','Leis em jogo',a.law],['target','Consequência possível',state.step>=6?a.consequence:risk]];
 else if(state.tab==='documents')items=[['search','Como isso foi descoberto?',trace],['file','Provas desta fase',docs.join(' · ')],['clipboard','O que precisa ser demonstrado',a.standard]];
 else {box.append(zoneBanner(z.status[state.step],state.step));items=[['shield','Possibilidade lícita / argumento de defesa',z.lawful],['alert','Onde está o limite',z.limit],['search','O que ainda falta provar',z.proof],['scale','Precedente ou regra-chave',z.precedent]];}
 for(const item of items)box.append(fact(...item));
 const q=$('quizBox');q.replaceChildren();q.hidden=!(state.step===7&&state.tab==='explanation');if(!q.hidden){q.append(el('p','quiz-question','Com os fatos reconstruídos, qual conclusão é juridicamente sustentável?'));c.quiz.forEach((choice,i)=>{const b=el('button','quiz-option'+(state.answers[c.key]===i?' chosen':''),String.fromCharCode(65+i)+'. '+choice);b.type='button';b.setAttribute('aria-pressed',String(state.answers[c.key]===i));b.addEventListener('click',()=>{state.answers[c.key]=i;persist();renderPanel();});q.append(b);});if(state.answers[c.key]!==undefined)q.append(el('div','quiz-feedback',(state.answers[c.key]===c.correct?'✓ Conclusão adequada: ':'⚖ Reavalie os pressupostos: ')+c.quiz[c.correct]));}}
function renderTabs(){for(const b of document.querySelectorAll('.tab')){const active=b.dataset.tab===state.tab;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));}}

function renderLiveCases(){
  const box=$('liveCaseGrid');box.replaceChildren();
  CASES.forEach((c,i)=>{
    const b=el('button','live-case-card'+(i===liveState.case?' active':''));
    b.type='button';b.setAttribute('aria-pressed',String(i===liveState.case));
    const img=el('img');img.src=BASE+'portraits/'+c.key+'.webp';img.alt='';
    const copy=el('span','live-case-copy');
    copy.append(el('small','','CASO '+formatStage(i)),el('strong','',c.short),el('span','',c.topic));
    b.append(img,copy);
    b.addEventListener('click',()=>{liveState.case=i;liveState.question=0;liveState.selected=null;renderLiveCases();});
    box.append(b);
  });
  const c=CASES[liveState.case];
  $('liveCaseSelected').textContent='Selecionado: '+c.short;
  $('liveOpenQuestions').disabled=false;
}
function renderLiveQuestion(){
  const c=CASES[liveState.case],qs=buildLiveQuestions(c),q=qs[liveState.question],scene=c.scenes[liveState.question];
  $('liveGameTitle').textContent=c.short;
  $('liveQuestionCase').textContent='CASO '+formatStage(liveState.case)+' · '+c.short.toUpperCase();
  $('liveQuestionStep').textContent='RODADA '+formatStage(liveState.question)+' DE 08';
  $('liveQuestionCount').textContent='QUESTÃO '+(liveState.question+1)+'/8';
  $('liveQuestionText').textContent=q.q;
  const img=$('liveQuestionImage');img.src=scenePath(c,liveState.question);img.alt='Cena da rodada '+(liveState.question+1)+' do caso '+c.short;
  const answers=$('liveAnswerOptions');answers.replaceChildren();
  q.options.forEach((opt,i)=>{
    const b=el('button','live-answer'+(liveState.selected===i?' selected':''));
    b.type='button';
    b.append(el('span','live-answer-letter',String.fromCharCode(65+i)),el('span','live-answer-text',opt.text));
    b.addEventListener('click',()=>{liveState.selected=i;renderLiveQuestion();});
    answers.append(b);
  });
  const fb=$('liveAnswerFeedback');
  if(liveState.selected===null){fb.hidden=true;fb.replaceChildren();}
  else{
    const chosen=q.options[liveState.selected],meta=LIVE_CLASS_META[chosen.kind]||LIVE_CLASS_META.risky;
    fb.hidden=false;fb.className='live-answer-feedback '+meta.className;
    fb.textContent=meta.symbol+' '+meta.label+(liveState.selected===q.correct?' · resposta esperada para a aula.':' · a resposta juridicamente mais adequada é a alternativa '+String.fromCharCode(65+q.correct)+'.');
  }
  $('livePrevQuestion').disabled=liveState.question===0;
  $('liveNextQuestion').textContent=liveState.question===7?'FINALIZAR PRÉVIA':'PRÓXIMA →';
}
function openLiveGame(){
  liveState.case=state.case;liveState.question=0;liveState.selected=null;
  $('liveGameTitle').textContent='Escolha o crime da aula';
  $('liveCasePhase').hidden=false;$('liveQuestionPhase').hidden=true;
  renderLiveCases();$('liveGameDialog').showModal();
}
function startLiveQuestions(){
  liveState.question=0;liveState.selected=null;
  $('liveCasePhase').hidden=true;$('liveQuestionPhase').hidden=false;
  renderLiveQuestion();
}
function changeLiveQuestion(delta){
  if(liveState.question===7&&delta>0){$('liveCasePhase').hidden=false;$('liveQuestionPhase').hidden=true;$('liveGameTitle').textContent='Prévia concluída · escolha o crime da aula';renderLiveCases();return;}
  liveState.question=Math.max(0,Math.min(7,liveState.question+delta));liveState.selected=null;renderLiveQuestion();
}

function render(){const c=CASES[state.case],s=c.scenes[state.step];markVisited(c,state.step);$('app').classList.toggle('presentation-mode',state.present);$('presentMode').setAttribute('aria-pressed',String(state.present));$('presentMode').classList.toggle('active',state.present);$('presentMode').querySelector('span').textContent=state.present?'Telão ativo':'Modo telão';$('caseNumber').textContent='CASO '+formatStage(state.case);$('caseTitle').textContent=c.title;$('caseBlurb').textContent=c.subtitle;$('lessonCount').textContent='AULA '+formatStage(state.step)+' DE 08';$('sceneNumber').textContent='PASSO '+formatStage(state.step)+' DE 08';$('sceneTitle').textContent=s[0];$('sceneSub').textContent=ANALYSIS[c.key].moves[state.step];setSceneImage(c,state.step);renderCases();renderSteps();renderTabs();renderPanel();$('prev').disabled=state.step===0;$('next').innerHTML=(state.step===7?'PRÓXIMO CASO':'PRÓXIMA ETAPA')+' '+icon('chevron');$('progressStat').innerHTML=icon('scale')+' '+overallVisited()+'/48 CENAS';$('live').textContent=`${c.short}, etapa ${state.step+1} de 8: ${s[0]}`;persist();
}
function go(step){state.step=Math.max(0,Math.min(7,step));state.tab='explanation';render();}
function next(){if(state.step===7){state.case=(state.case+1)%CASES.length;go(0);}else go(state.step+1);}
function detail(){const c=CASES[state.case],s=c.scenes[state.step],a=ANALYSIS[c.key],z=ZONES[c.key],docs=s[5];$('detailTitle').textContent=c.short+' · '+s[0];const b=$('detailBody');b.replaceChildren();for(const [title,text]of [['Reconstituição da fase',a.moves[state.step]],['Objetivo atribuído ao personagem',a.aim],['Onde está o ilícito em tese',a.wrongs[state.step]],['Possibilidade lícita / tese defensiva',z.lawful],['Limite da zona cinzenta',z.limit],['O que ainda falta provar',z.proof],['Leis em jogo',a.law],['Como foi descoberto',TRACE_PHASE[state.step]+' Documentos: '+docs.join(' · ')+'.'],['Consequências possíveis',state.step>=6?a.consequence:s[4]],['Padrão de prova',a.standard],['Regra da aula','A reconstituição descreve fatos fictícios para análise jurídica. A zona cinzenta mostra requisitos, exceções e argumentos opostos; não é instrução para ocultar patrimônio, dissimular recursos ou evitar fiscalização.']]){b.append(el('h3','',title),el('p','',text));}const links=$('referenceLinks');links.replaceChildren();const refs=[...new Set([...(c.law||[]),...(z.refs||[])])];for(const key of refs){const [title,href]=laws[key];const x=el('a','',title+' ↗');x.href=href;x.target='_blank';x.rel='noopener noreferrer';links.append(x);}$('detailsDialog').showModal();}
$('liveGame').addEventListener('click',openLiveGame);
$('closeLiveGame').addEventListener('click',()=>$('liveGameDialog').close());
$('liveOpenQuestions').addEventListener('click',startLiveQuestions);
$('liveBackCases').addEventListener('click',()=>{$('liveQuestionPhase').hidden=true;$('liveCasePhase').hidden=false;$('liveGameTitle').textContent='Escolha o crime da aula';renderLiveCases();});
$('livePrevQuestion').addEventListener('click',()=>changeLiveQuestion(-1));
$('liveNextQuestion').addEventListener('click',()=>changeLiveQuestion(1));
$('next').addEventListener('click',next);$('playScene').addEventListener('click',next);$('presentMode').addEventListener('click',()=>{state.present=!state.present;persist();render();});$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}});document.addEventListener('fullscreenchange',()=>{$('fullscreen').classList.toggle('active',Boolean(document.fullscreenElement));$('fullscreen').querySelector('span').textContent=document.fullscreenElement?'Sair da tela cheia':'Tela cheia';});$('prev').addEventListener('click',()=>go(state.step-1));$('restart').addEventListener('click',()=>go(0));$('detailsBtn').addEventListener('click',detail);$('closeDialog').addEventListener('click',()=>$('detailsDialog').close());document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{state.tab=b.dataset.tab;renderTabs();renderPanel();}));
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','SELECT','A'].includes(e.target?.tagName)||$('detailsDialog').open||$('liveGameDialog').open)return;if(e.key==='ArrowRight'){e.preventDefault();next();}else if(e.key==='ArrowLeft'){e.preventDefault();go(state.step-1);}else if(/^[1-8]$/.test(e.key)){go(Number(e.key)-1);}else if(e.key.toLowerCase()==='f'){$('fullscreen').click();}else if(e.key.toLowerCase()==='p'){$('presentMode').click();}});
render();
})();

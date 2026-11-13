/* Exclusive to showroom: illustrative classroom questions, NEVER used by real-room scoring. */
import type {GameQuestion,QuestionOption} from '../services/types';

type Stage={title:string;prompt:string;options:[string,string,string,string];answer:0|1|2|3;explanation:string;};
export const STAGES:readonly Stage[]=[
  {
    title:'Contexto e fatos',
    prompt:'O crédito do fornecedor surgiu antes da transferência dos imóveis. Que informação deve ser verificada primeiro?',
    options:[
      'Comparar a cronologia do crédito com a situação de solvência antes e depois dos atos.',
      'Presumir que a existência de uma holding afasta qualquer discussão.',
      'Ignorar a data da obrigação e analisar somente o valor do imóvel.',
      'Tratar todo planejamento patrimonial como automaticamente ilícito.'
    ],answer:0,
    explanation:'Cronologia, existência do crédito, elementos patrimoniais e prova são relevantes para avaliar eventual fraude contra credores. A conclusão depende do conjunto do caso.'
  },
  {
    title:'Agentes e patrimônio',
    prompt:'Um imóvel está vinculado a uma sociedade familiar. Como confirmar os vínculos relevantes para a investigação?',
    options:[
      'Concluir que todos os familiares são proprietários diretos do imóvel.',
      'Consultar a matrícula, os atos societários e a documentação de transferência.',
      'Utilizar somente fotografias do imóvel.',
      'Desconsiderar a titularidade registral e os direitos de terceiros.'
    ],answer:1,
    explanation:'Registros e atos documentais ajudam a distinguir titularidade, participação societária e patrimônio pessoal, sem presumir equivalência entre essas categorias.'
  },
  {
    title:'Instrumentos utilizados',
    prompt:'Qual documentação permite confrontar a finalidade declarada de uma reorganização patrimonial com seus atos efetivos?',
    options:[
      'Apenas o nome fantasia escolhido pelos sócios.',
      'Somente comentários informais sobre a empresa.',
      'Contratos, registros públicos pertinentes e documentos dos atos praticados.',
      'A aparência das pessoas envolvidas.'
    ],answer:2,
    explanation:'A análise jurídica considera instrumentos, registros e fatos comprováveis. Um único rótulo contratual não demonstra, por si só, regularidade ou irregularidade.'
  },
  {
    title:'Consequências imediatas',
    prompt:'Uma transferência ocorreu depois do surgimento de uma obrigação. Qual deve ser a abordagem do investigador?',
    options:[
      'Anular automaticamente qualquer transferência posterior.',
      'Assumir que o credor jamais poderá questionar o ato.',
      'Concluir apenas pela vontade declarada da família.',
      'Verificar a situação patrimonial e os efeitos jurídicos com base nas provas.'
    ],answer:3,
    explanation:'A anterioridade isolada não encerra o exame. A avaliação depende das circunstâncias, dos requisitos legais e da demonstração dos efeitos sobre os envolvidos.'
  },
  {
    title:'Interesses em disputa',
    prompt:'Duas partes oferecem versões contraditórias sobre a transferência de bens. Qual metodologia é mais adequada?',
    options:[
      'Separar fatos admitidos, alegações, provas e pontos ainda controvertidos.',
      'Adotar integralmente a primeira versão apresentada.',
      'Ignorar documentos que contrariem a hipótese inicial.',
      'Escolher a narrativa que pareça mais cinematográfica.'
    ],answer:0,
    explanation:'O contraditório e a documentação confiável orientam o debate; divergências devem ser explicitadas, não ocultadas no relatório.'
  },
  {
    title:'Rastros documentais',
    prompt:'Uma conclusão depende da autenticidade de registros e contratos. Qual é o cuidado técnico mais importante?',
    options:[
      'Tratar capturas de tela sem origem conhecida como prova definitiva.',
      'Guardar as fontes, conferir sua integridade e relacionar cada achado ao fato investigado.',
      'Apagar os documentos contrários à tese preferida.',
      'Substituir documentos por depoimentos de personagens fictícios.'
    ],answer:1,
    explanation:'Rastreabilidade, autenticidade e pertinência dos documentos fortalecem a qualidade da investigação e seus limites probatórios.'
  },
  {
    title:'Riscos jurídicos',
    prompt:'Quais consequências devem ser consideradas ao final da análise de uma operação patrimonial?',
    options:[
      'Uma pena criminal automática sempre que existir sociedade familiar.',
      'Nenhuma consequência se houver escritura pública.',
      'Consequências civis e eventualmente tributárias ou penais, conforme os fatos e requisitos de cada hipótese.',
      'Somente consequências sociais, sem exame normativo.'
    ],answer:2,
    explanation:'Responsabilidades de naturezas diferentes possuem requisitos próprios. Não se deve confundir conflito civil com crime sem base fática e jurídica.'
  },
  {
    title:'Debate e fundamentação',
    prompt:'Qual é a forma juridicamente responsável de concluir o dossiê da investigação?',
    options:[
      'Ocultar as limitações das fontes para parecer mais convincente.',
      'Escolher o resultado com maior pontuação no jogo.',
      'Declarar culpa apenas com uma suspeita.',
      'Apresentar conclusão fundamentada, provas utilizadas, dúvidas remanescentes e garantias aplicáveis.'
    ],answer:3,
    explanation:'O veredito didático deve diferenciar hipóteses, provas e conclusões. A atividade não substitui a apreciação de uma autoridade competente.'
  }
] as const;

export function showroomQuestion(round:number):GameQuestion{
 const r=Math.min(8,Math.max(1,Math.trunc(round)||1));
 const stage=STAGES[r-1];
 const options:QuestionOption[]=stage.options.map((text,index)=>({
    index,text,kind:index===stage.answer?'correct':index===((stage.answer+2)%4)?'criminal':'gray'
 }));
 return {id:'SHOWROOM-V7-'+r,round:r,caseTitle:'Fraude contra credores',
   text:stage.prompt,options,correctIndex:stage.answer,explanation:stage.explanation};
}

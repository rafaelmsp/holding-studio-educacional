import manifest from '../assets.json';

export const CASES = [
  {key:'credores', title:'Fraude contra credores',subtitle:'Holding familiar e patrimônio'},
  {key:'meacao', title:'Ocultação de meação',subtitle:'Partilha e direitos do casal'},
  {key:'herdeiros', title:'Prejuízo a herdeiros',subtitle:'Sucessão e legítima'},
  {key:'itbi', title:'Operação de ITBI',subtitle:'Integralização e imunidade'},
  {key:'alugueis', title:'Receitas de aluguéis',subtitle:'Documentos e fluxos financeiros'},
  {key:'grupos', title:'Grupo societário',subtitle:'Pessoas jurídicas e patrimônio'}
] as const;
export type CaseKey = typeof CASES[number]['key'];
export const PERSONAS=[
{id:'detetive',name:'Detetive',gender:'masculino',role:'Investigação',style:'Analítico e observador',description:'Reconstrói fatos e conecta evidências.'},
{id:'advogado',name:'Advogado',gender:'masculino',role:'Direito',style:'Argumentação e estratégia',description:'Confronta argumentos e consequências jurídicas.'},
{id:'delegado',name:'Delegado',gender:'masculino',role:'Apuração',style:'Firme e objetivo',description:'Coordena diligências e identifica contradições.'},
{id:'estrategista',name:'Estrategista',gender:'masculino',role:'Estratégia',style:'Investigativo e metódico',description:'Analisa decisões e riscos de cada etapa.'},
{id:'perita',name:'Perita',gender:'feminino',role:'Perícia',style:'Técnica e detalhista',description:'Analisa documentos e indícios relevantes.'},
{id:'advogada',name:'Advogada',gender:'feminino',role:'Direito',style:'Persuasiva e precisa',description:'Examina teses, obrigações e documentos.'},
{id:'investigadora',name:'Investigadora',gender:'feminino',role:'Investigação',style:'Atenta e perspicaz',description:'Identifica conexões patrimoniais e suspeitas.'},
{id:'analista',name:'Analista',gender:'feminino',role:'Inteligência',style:'Lógica e precisa',description:'Cruza dados e documentos para orientar conclusões.'},
{id:'especialista',name:'Especialista',gender:'neutro',role:'Consultoria',style:'Criterioso e técnico',description:'Avalia requisitos das operações patrimoniais.'},
{id:'auditor',name:'Auditor',gender:'neutro',role:'Auditoria',style:'Metódico e imparcial',description:'Compara operações, registros e dados financeiros.'},
{id:'arquivista',name:'Arquivista',gender:'neutro',role:'Documentos',style:'Paciente e observador',description:'Organiza documentos e identifica inconsistências.'},
{id:'mediador',name:'Mediador',gender:'neutro',role:'Mediação',style:'Equilibrado e cauteloso',description:'Identifica interesses, conflitos e soluções.'}
] as const;
export type Persona=typeof PERSONAS[number];
export type Gender=Persona['gender'];
export const avatar=(id:string)=>'../assets/the-crimes-v3/avatars/'+(PERSONAS.some(x=>x.id===id)?id:'detetive')+'.webp';
export const characterPortrait=(id:string)=>'../assets/the-crimes-v6/portraits/'+(PERSONAS.some(x=>x.id===id)?id:'detetive')+'.webp';
export function caseScene(key:string,round:number){
 const sceneNames=['01_contexto','02_estrutura','03_instrumento','04_efeito','05_conflito','06_apuracao','07_consequencias','08_debate'];
 const k=(key in manifest.cases?key:'credores') as keyof typeof manifest.cases;
 const scene=sceneNames[Math.max(0,Math.min(7,round-1))] as keyof typeof manifest.cases[typeof k]['scenes'];
 return (manifest.cases[k].scenes as unknown as Record<string,string>)[scene] || (manifest.cases[k].scenes as unknown as Record<string,string>)['01_contexto'];
}
export function caseCover(key:string){const k=(key in manifest.cases?key:'credores') as keyof typeof manifest.cases;return manifest.cases[k].cover;}
export const BACKGROUNDS={
host:'../assets/the-crimes-v6/backgrounds/host-control.webp', screen:'../assets/the-crimes-v6/backgrounds/projector.webp',join:'../assets/the-crimes-v6/backgrounds/lobby-qr.webp',
lobby:'../assets/the-crimes-v6/backgrounds/lobby-qr.webp',final:'../assets/the-crimes-v6/backgrounds/podium.webp',city:manifest.global.city,
};
export function profileName(id:string){return PERSONAS.find(p=>p.id===id)?.name||'Detetive';}

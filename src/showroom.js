(function(){
"use strict";
const E=window.HoldingTaxEngine,doc=document;
const $=id=>doc.getElementById(id);
const nodes=Array.from(doc.querySelectorAll("[data-bind]"));
const fmt=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:2,maximumFractionDigits:2}).format(Number.isFinite(Number(n))?Number(n):0);
const dec=n=>new Intl.NumberFormat("pt-BR",{maximumFractionDigits:2}).format(Number(n)||0);
const safe=id=>{const v=Number($(id).value);return Number.isFinite(v)?Math.max(0,v):0;};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const asPct=n=>dec(n)+"%";
const bind=(key,value)=>{nodes.filter(n=>n.dataset.bind===key).forEach(n=>{n.textContent=value;});};
const config={step:0,rules:E?E.FALLBACK:null,loadStatus:"contingência",caseName:"Patrimônio pequeno"};
const titles=[
 ["Abertura · O patrimônio","Tudo começa com uma pergunta.","Escolha um caso para apresentar à turma."],
 ["Etapa 2 · A renda","Patrimônio não é a mesma coisa que aluguel.","Preencha e acompanhe a fórmula de receita."],
 ["Etapa 3 · Custos dos imóveis","IPTU e condomínio também entram na conta.","Separe impostos, despesas e quem realmente paga."],
 ["Etapa 4 · Pessoa física","Primeiro, quanto se paga sem a holding?","Explique o efeito dos aluguéis no IRPF."],
 ["Etapa 5 · Custos da holding","Nenhuma estrutura é gratuita.","Mostre honorários, abertura e manutenção."],
 ["Etapa 6 · Tributos da empresa","Entenda os impostos da pessoa jurídica.","IRPJ, CSLL, PIS e Cofins separados."],
 ["Etapa 7 · ITBI e viabilidade","Uma economia pode desaparecer na implantação.","Compare os cenários tributários."],
 ["Etapa 8 · Sucessão","Nem tudo depende da economia de aluguel.","Compare doar, estruturar e inventariar."],
 ["Conclusão · Resultado final","A holding realmente vale a pena?","Revele a conclusão com os números preenchidos."]
];
if(!E){doc.body.innerHTML='<h1>Motor de cálculo não carregou</h1><p>Confira a rede e atualize a página. Os dados não foram enviados a nenhum servidor.</p>';return;}
function read(){
 const property=safe("property"),rent=safe("rent"),occ=clamp(safe("occupancy"),0,100);
 const ownerIptu=$("iptuPayer").value==="dono"?safe("iptuAnnual"):0;
 const ownerCondo=$("condoPayer").value==="dono"?safe("condoMonthly")*12:0;
 const otherFees=safe("municipalFeesAnnual");
 const agency=safe("agencyMonthly")*12;
 const insurance=safe("insuranceAnnual"),repairs=safe("repairsAnnual");
 // No cenário didático, encargos pagos diretamente pelo inquilino não são recebidos pela empresa.
 // Na prática, reembolsos ou encargos cobrados pela PJ podem integrar a receita bruta tributável.
 const deductibleAnnual=ownerIptu+ownerCondo+otherFees+agency;
 const totalOwnerAnnual=deductibleAnnual+insurance+repairs;
 const expenses=deductibleAnnual/12;
 const rawDelta=Number($("costPjDifference").value);
 const propertyCostDifferenceAnnual=Number.isFinite(rawDelta)?rawDelta:0;
 const city=$("municipality").value, rawRate=$("itbiRate").value.trim(), rateMissing=city==="outro"&&(rawRate===""||!Number.isFinite(Number(rawRate)));
 const rate=city==="rio"?3:clamp(safe("itbiRate"),0,20);
 const rules=JSON.parse(JSON.stringify(config.rules));rules.rj.itbiMunicipalRate=rate/100;
 const s={
  assets:[{id:1,name:"Imóvel do caso",value:property,rent,expenses,occupancy:occ}],
  owners:clamp(Math.round(safe("owners")||1),1,20),
  otherIncomeMonthly:safe("otherIncome"),pfDeductionMode:$("deductionMode").value,otherLegalDeductionYear:0,
  legalFees:safe("legalFees"),corporateRegistry:safe("corporateRegistry"),propertyRegistry:safe("propertyRegistry"),otherTransferTax:0,
  monthlyAccounting:safe("accounting"),annualOtherCompany:safe("annualOther"),
  propertyCostDifferenceAnnual,
  capitalPercent:100,itbiTreatment:$("itbiTreatment").value,
  horizon:clamp(Math.round(safe("horizon")||10),1,30),annualRentGrowth:0,annualCostGrowth:0,
  discountRate:clamp(safe("discountRate"),0,30),successionEnabled:false,scenarioName:config.caseName
 };
 return {s,rules,rate,rateMissing,city,property,rent,occ,ownerIptu,ownerCondo,otherFees,agency,insurance,repairs,deductibleAnnual,totalOwnerAnnual,propertyCostDifferenceAnnual};
}
function inherit(r,rule,ready){
 const n=clamp(Math.round(safe("heirs")||1),1,20);
 const amount=r.totalValue,quotaBase=$("quotaBase").value.trim()===""?amount:safe("quotaBase");
 // modelo de partes iguais, sem isenções ou condições especiais
 const directT=E.itd(amount/n,rule),quotaT=E.itd(quotaBase/n,rule);
 const directITD=E.round(directT.value*n),quotaITD=E.round(quotaT.value*n);
 const direct=directITD+safe("donFees")+safe("donReg");
 const quota=quotaITD+safe("quotaFees")+safe("quotaReg")+(ready?r.initConservative:0);
 const inventory=directITD+safe("invFees")+safe("invReg");
 return {n,amount,quotaBase,directITD,quotaITD,direct,quota,inventory,directRate:directT.rate};
}
function searchMinPatrimony(s,rule){
 const asset=s.assets[0];
 if(!asset.value||!asset.rent)return null;
 const yieldRatio=asset.rent/asset.value;
 if(yieldRatio<=0)return null;
 const check=v=>{
   const x={...s,assets:[{...asset,value:v,rent:v*yieldRatio}]};
   return E.run(x,rule).npvConservative;
 };
 let first=null,low=50000,previous=50000;
 for(let i=0;i<=150;i++){
   const v=50000+(20000000-50000)*i/150;
   if(check(v)>=0){first=v;low=i===0?v:previous;break;}
   previous=v;
 }
 if(first===null)return null;
 let high=first;
 for(let i=0;i<22&&high>low;i++){
  const mid=(low+high)/2;
  if(check(mid)>=0)high=mid;else low=mid;
 }
 return Math.ceil(high/100)*100;
}
function render(){
 const data=read(),s=data.s,rule=data.rules,ready=!data.rateMissing;
 let r;
 try{r=E.run(s,rule);}catch(err){$("sourceBadge").textContent="Erro no cálculo";return;}
 const annualRent=r.monthlyGross*12,annualExpense=r.monthlyExpenses*12,annualMaint=s.monthlyAccounting*12+s.annualOtherCompany;
 const ownerCosts=data.totalOwnerAnnual;
 const pjOwnerCosts=ownerCosts+data.propertyCostDifferenceAnnual;
 const pf=E.irpfIncrementalRental(annualRent,Math.min(annualExpense,annualRent),s.otherIncomeMonthly,s.owners,s.pfDeductionMode,0,rule);
 const tax=r.firstYear?.pjDetails||E.pjTaxes(annualRent,rule);
 const opening=r.initialBase,annualGain=r.firstYearNet;
 const succession=inherit(r,rule,ready);
 const calc={
  property:fmt(r.totalValue), annualRent:fmt(annualRent),effectiveRent:fmt(r.monthlyGross),annualExpenses:fmt(annualExpense),
  annualPropertyCosts:fmt(ownerCosts),ownerIptu:fmt(data.ownerIptu),ownerCondo:fmt(data.ownerCondo),
  otherPropertyCosts:fmt(data.otherFees+data.agency+data.insurance+data.repairs),
  deductibleCosts:fmt(data.deductibleAnnual),propertyCostDelta:fmt(data.propertyCostDifferenceAnnual),
  netPfRent:fmt(annualRent-ownerCosts-r.firstYearPf),
  netPjRent:fmt(annualRent-pjOwnerCosts-r.firstYearPj-annualMaint),
  pfBefore:fmt(pf.before),pfAfter:fmt(pf.after),pfTax:fmt(r.firstYearPf),
  opening:fmt(opening),monthlyAccounting:fmt(s.monthlyAccounting),annualMaintenance:fmt(annualMaint),
  irpj:fmt(tax.irpj+tax.additionalIrpj),csll:fmt(tax.csll),pis:fmt(tax.pis),cofins:fmt(tax.cofins),pjTax:fmt(r.firstYearPj),
  itbiFull:ready?fmt(r.itbi.fullTax):"Defina a alíquota",
  annualGain:fmt(annualGain),vplTax:ready?fmt(-opening-r.itbi.fullTax+sumDiscounts(r)): "ITBI pendente",
  vplImmunity:ready?fmt(-opening-r.itbi.partialTax+sumDiscounts(r)): "ITBI pendente",
  itdDirect:fmt(succession.directITD),directTotal:fmt(succession.direct),quotaTotal:ready?fmt(succession.quota):"ITBI pendente",inventoryTotal:fmt(succession.inventory),
  vplCon:ready?fmt(r.npvConservative):"ITBI pendente"
 };
 for(const [k,v]of Object.entries(calc))bind(k,v);
 $("propertyFormula").innerHTML="1 imóvel × "+fmt(s.assets[0].value)+" = <strong>"+fmt(r.totalValue)+"</strong>.<span class='sub'>Valor patrimonial não é renda tributável de aluguel. Nesta aula, começamos com um único imóvel.</span>";
 $("rentFormula").innerHTML=fmt(s.assets[0].rent)+" × 12 × "+asPct(s.assets[0].occupancy)+" = <strong>"+fmt(annualRent)+"</strong><span class='sub'>Receita efetivamente recebida no ano (sem atualização de aluguel).</span>";
 $("propertyCostsFormula").innerHTML=
  "IPTU "+fmt(data.ownerIptu)+" + condomínio "+fmt(data.ownerCondo)+
  " + taxas "+fmt(data.otherFees)+" + administração "+fmt(data.agency)+
  " + seguro "+fmt(data.insurance)+" + reparos "+fmt(data.repairs)+
  " = <strong>"+fmt(ownerCosts)+" por ano</strong>.<span class='sub'>Exclusão potencial no rendimento tributável da PF: "+
  fmt(data.deductibleAnnual)+". Os encargos só entram como despesa do proprietário se efetivamente pagos por ele. Na PJ não se presumiu redução automática dos custos.</span>";
 $("pfFormula").innerHTML=fmt(pf.after)+" − "+fmt(pf.before)+" = <strong>"+fmt(pf.tax)+"</strong><span class='sub'>Comparação anual, considerando "+s.owners+" titular(es) e o modelo de dedução selecionado.</span>";
 $("openingFormula").innerHTML=fmt(s.legalFees)+" + "+fmt(s.corporateRegistry)+" + "+fmt(s.propertyRegistry)+" = <strong>"+fmt(opening)+"</strong><span class='sub'>Sem ITBI. Contabilidade: "+fmt(s.monthlyAccounting)+" × 12 + "+fmt(s.annualOtherCompany)+" = "+fmt(annualMaint)+"/ano. Diferença de gastos dos imóveis na PJ (informada): "+fmt(data.propertyCostDifferenceAnnual)+"/ano.</span>";
 let irBase=annualRent*rule.pj.presumedIrpj, csBase=annualRent*rule.pj.presumedCsll;
 $("pjFormula").innerHTML="Receita anual "+fmt(annualRent)+". IRPJ: "+fmt(tax.irpj)+" + adicional "+fmt(tax.additionalIrpj)+". CSLL: "+fmt(tax.csll)+". PIS: "+fmt(tax.pis)+". Cofins: "+fmt(tax.cofins)+".<span class='sub'>Bases presumidas usuais: IRPJ "+asPct(rule.pj.presumedIrpj*100)+" e CSLL "+asPct(rule.pj.presumedCsll*100)+". Aplica-se o regime e as faixas do motor tributário 2026; receitas altas podem ter ajustes de presunção.</span>";
 $("itbiFormula").innerHTML=ready?
  fmt(r.totalValue)+" × "+asPct(data.rate)+" = <strong>"+fmt(r.itbi.fullTax)+"</strong> se a transmissão for totalmente tributável.<span class='sub'>Economia operacional anual: IRPF "+fmt(r.firstYearPf)+" − PJ "+fmt(r.firstYearPj)+" − manutenção "+fmt(annualMaint)+" − mudança nos custos dos imóveis "+fmt(data.propertyCostDifferenceAnnual)+" = "+fmt(annualGain)+". VPL = − implantação e ITBI + ganhos anuais trazidos a valor presente.</span>":
  "Informe primeiro a alíquota do ITBI da prefeitura. <span class='sub'>Não é correto presumir 3% fora do Município do Rio.</span>";
 $("finalFormula").innerHTML="IRPF "+fmt(r.firstYearPf)+" − PJ "+fmt(r.firstYearPj)+" − manutenção "+fmt(annualMaint)+" − mudança nos custos do imóvel "+fmt(data.propertyCostDifferenceAnnual)+" = <strong>"+fmt(annualGain)+" por ano</strong>.<span class='sub'>VPL = soma dos ganhos anuais trazidos a valor presente − abertura − ITBI. Hipóteses jurídicas e tributárias podem alterar o resultado.</span>";
 $("successionFormula").innerHTML=fmt(r.totalValue)+" ÷ "+succession.n+" = "+fmt(r.totalValue/succession.n)+" por beneficiário, hipótese de partes iguais.<span class='sub'>ITD direto estimado: "+asPct(succession.directRate*100)+" por transmissão, sujeito a hipóteses legais, isenções e bases específicas. Total: "+fmt(succession.directITD)+".</span>";
 // Narrativa final
 const goal=$("goal").value;
 let verdict,why,type;
 if(r.totalValue===0){verdict="Informe um patrimônio";why="O valor do imóvel precisa ser maior que zero para iniciar a comparação.";type="neutral";}
 else if(!ready){verdict="Falta confirmar o ITBI";why="Preencha a alíquota do município para concluir a comparação econômica. Os impostos anuais continuam estimados.";type="neutral";}
 else if(annualRent===0){verdict="Não há economia recorrente de aluguéis";why="Com aluguel zero, os custos fixos da empresa não são recuperados por economia fiscal sobre aluguéis. Uma decisão sucessória merece análise separada.";type="neutral";}
 else if(r.npvConservative>0){verdict="Há potencial econômico no exemplo";why="Até a hipótese conservadora de ITBI apresenta VPL positivo. O resultado depende das premissas e não substitui análise tributária e jurídica.";type="good";}
 else if(r.npvOptimistic>0){verdict="O ITBI pode mudar a decisão";why="Somente a hipótese otimista gera VPL positivo. Confirmar o tratamento jurídico da operação é fundamental.";type="neutral";}
 else {verdict="A holding não se paga neste exemplo";why="A economia tributária projetada não recupera os custos de constituição e manutenção no prazo escolhido. Outras opções merecem estudo.";type="bad";}
 if(goal==="sucessao")why+=" O foco declarado da família é sucessório; esse objetivo não pode ser reduzido ao VPL.";
 $("verdict").textContent=verdict;$("verdictReason").textContent=why;
 const v=$("verdict");v.style.color=type==="good"?"#a5f1ce":type==="bad"?"#f2c2aa":"#f4e7c6";
 $("itbiLesson").textContent=!ready?"Não foi informada alíquota municipal: VPL e custo completo da doação de quotas não serão exibidos como números confiáveis.":
 "VPL com ITBI integral: "+fmt(-opening-r.itbi.fullTax+sumDiscounts(r))+". VPL na hipótese de imunidade modelada: "+fmt(-opening-r.itbi.partialTax+sumDiscounts(r))+". Esses são cenários, não reconhecimento automático de imunidade. A decisão também depende de regras sobre a operação.";
 if(config.step===8){
  const minRent=annualRent>0&&ready?E.minViableRent(s,rule):null;
  const minPat=annualRent>0&&ready?searchMinPatrimony(s,rule):null;
  bind("minRent",!ready?"ITBI pendente":annualRent===0?"Sem aluguel":minRent===null?"Não encontrado":fmt(minRent)+"/mês");
  bind("minPatrimony",!ready?"ITBI pendente":annualRent===0?"Sem aluguel":minPat===null?"Não encontrado até R$ 20 milhões":fmt(minPat));
 }
 const date=rule.reviewedAt||"sem data";
 $("finalSources").textContent="Cálculo instantâneo no navegador; regras tributárias de referência "+rule.year+" revisadas em "+date+" ("+config.loadStatus+"). Sem atualização tributária automática por API. Valores de honorários, cartórios e manutenção são hipóteses editáveis. Não é parecer jurídico nem previsão de tributação futura.";
 scheduleFit();
}
function sumDiscounts(r){return (r.lines||[]).reduce((sum,y)=>sum+y.discountedGain,0);}
/* Enquadra os dois painéis de cada etapa na área do slide.
   A compressão é progressiva; no celular mantém rolagem natural. */
function prepareFit(){
 if(!doc.createElement)return;
 for(const pane of doc.querySelectorAll(".stage .pane")){
  if(pane.querySelector?.(".pane-content"))continue;
  const inner=doc.createElement("div");
  inner.className="pane-content";
  while(pane.firstChild)inner.appendChild(pane.firstChild);
  pane.appendChild(inner);
 }
}
function fitSlide(){
 if(!window.matchMedia?.("(min-width:971px)")?.matches||!window.getComputedStyle)return;
 for(const pane of doc.querySelectorAll(".stage.active .pane")){
  const inner=pane.querySelector(".pane-content");
  if(!inner)continue;
  inner.style.zoom="1";
  pane.classList.remove("tight");
  let styles=window.getComputedStyle(pane);
  let available=pane.clientHeight-parseFloat(styles.paddingTop)-parseFloat(styles.paddingBottom)-3;
  if(!Number.isFinite(available)||available<=0)return;
  if(inner.scrollHeight>available+2){
   pane.classList.add("tight");
   styles=window.getComputedStyle(pane);
   available=pane.clientHeight-parseFloat(styles.paddingTop)-parseFloat(styles.paddingBottom)-3;
  }
  if(inner.scrollHeight>available+2){
   const ratio=Math.max(.68,Math.min(1,(available-5)/inner.scrollHeight));
   inner.style.zoom=ratio.toFixed(3);
  }
 }
}
function scheduleFit(){
 if(window.requestAnimationFrame)window.requestAnimationFrame(fitSlide);
}
function go(n){
 const old=config.step;const next=clamp(n,0,8);config.step=next;
 doc.querySelectorAll(".stage").forEach(stage=>{
  const yes=Number(stage.dataset.step)===next;
  stage.classList.toggle("active",yes);stage.hidden=!yes;
 });
 const [k,title,note]=titles[next];
 $("chapterKicker").textContent=k;$("chapterTitle").textContent=title;$("chapterNote").textContent=note;
 $("stepLabel").textContent="ETAPA "+(next+1)+" DE 9";
 const percent=Math.round((next+1)/9*100);
 $("percent").textContent=percent+"%";$("progressBar").style.width=percent+"%";
 $("previous").disabled=next===0;
 $("next").textContent=next===8?"Rever desde o início ↻":"Continuar →";
 $("footerStep").textContent="Etapa "+(next+1)+": "+(next===8?"conclusão e comparação":"preencha, confira a conta e avance");
 $("announce").textContent="Etapa "+(next+1)+": "+title;
 doc.querySelectorAll(".pane").forEach(pane=>{pane.scrollTop=0;});
 window.scrollTo?.({top:0,behavior:"auto"});
 render();
}
function preset(name,clicked){
 const cases={
  "150":{name:"Patrimônio pequeno",property:150000,rent:900},
  "500":{name:"Um imóvel de R$ 500 mil",property:500000,rent:3000},
  "1500":{name:"Imóvel de R$ 1,5 milhão",property:1500000,rent:10500}
 };
 const p=cases[name];if(!p)return;
 config.caseName=p.name;$("property").value=p.property;$("rent").value=p.rent;
 doc.querySelectorAll("[data-case]").forEach(b=>b.classList.toggle("active",b.dataset.case===name));
 refreshQuickValues();render();
}

/* Valores rápidos são cenários didáticos editáveis, nunca preços oficiais. */
function setupQuickValues(){
 const presets={
  property:[150000,300000,500000,1000000,1500000,3000000],
  rent:[0,900,1500,3000,6000,12000],
  occupancy:[50,75,90,100],owners:[1,2,3,4],
  otherIncome:[0,3000,5000,10000],
  iptuAnnual:[0,900,1800,3600],condoMonthly:[0,250,500,1000],
  municipalFeesAnnual:[0,250,600],agencyMonthly:[0,200,400,800],
  insuranceAnnual:[0,600,1500],repairsAnnual:[0,1500,5000],
  legalFees:[2500,5000,10000,20000],
  corporateRegistry:[500,1500,3000],propertyRegistry:[1000,3000,7000],
  costPjDifference:[-1200,0,1200],
  accounting:[350,700,1200,2000],annualOther:[0,1200,3600,6000],
  itbiRate:[2,3,4,5],horizon:[5,10,15,20],discountRate:[0,5,10,15],
  heirs:[1,2,3,4],quotaBase:[150000,500000,1500000],
  donFees:[2500,5000,10000],donReg:[1000,3000,6000],
  quotaFees:[2000,5000,10000],quotaReg:[500,1500,4000],
  invFees:[4500,10000,20000],invReg:[2500,6000,12000]
 };
 const plain=new Set(["occupancy","owners","horizon","heirs","discountRate","itbiRate"]);
 const money=n=>n>=1000000?"R$ "+(n/1000000).toLocaleString("pt-BR")+" mi":n>=1000?"R$ "+(n/1000).toLocaleString("pt-BR")+" mil":"R$ "+n.toLocaleString("pt-BR");
 for(const [id,values] of Object.entries(presets)){
  const input=$(id);
  if(!input)continue;
  const parent=input.closest(".field");
  if(!parent)continue;
  const group=doc.createElement("div");
  group.className="quick-values";
  group.setAttribute("role","group");
  const label=input.labels?.[0]?.textContent||id;
  group.setAttribute("aria-label","Valores rápidos: "+label);
  for(const value of values){
   const btn=doc.createElement("button");
   btn.type="button";
   btn.className="quick-value";
   btn.textContent=plain.has(id)?String(value)+(id==="itbiRate"||id==="discountRate"||id==="occupancy"?"%":""):money(value);
   btn.dataset.value=String(value);
   btn.setAttribute("aria-pressed","false");
   btn.addEventListener("click",()=>{
    if(input.readOnly||input.disabled)return;
    input.value=String(value);
    input.dispatchEvent(new Event("input",{bubbles:true}));
    input.dispatchEvent(new Event("change",{bubbles:true}));
    refreshQuickValues();
   });
   group.appendChild(btn);
  }
  parent.appendChild(group);
 }
 refreshQuickValues();
}
function refreshQuickValues(){
 for(const group of doc.querySelectorAll(".quick-values")){
  const input=group.closest(".field")?.querySelector("input");
  if(!input)continue;
  const current=Number(input.value);
  for(const btn of group.querySelectorAll(".quick-value")){
   const active=input.value!==""&&Number(btn.dataset.value)===current;
   btn.classList.toggle("selected",active);
   btn.setAttribute("aria-pressed",String(active));
   btn.disabled=Boolean(input.readOnly||input.disabled);
  }
 }
}

function bindControls(){
 $("previous").addEventListener("click",()=>go(config.step-1));
 $("next").addEventListener("click",()=>go(config.step===8?0:config.step+1));
 $("restart").addEventListener("click",()=>{
  if(!window.confirm("Recomeçar o showroom com o exemplo de R$ 150 mil? Os valores atuais serão substituídos."))return;
  window.location.reload();
 });
 $("full").addEventListener("click",()=>{
  if(doc.fullscreenElement)doc.exitFullscreen?.();else doc.documentElement.requestFullscreen?.();
 });
 $("print").addEventListener("click",()=>window.print());
 doc.querySelectorAll("[data-case]").forEach(b=>b.addEventListener("click",()=>preset(b.dataset.case,b)));
 doc.querySelectorAll("input,select").forEach(input=>{
  input.addEventListener("input",()=>{if(input.id==="property")doc.querySelectorAll("[data-case]").forEach(b=>b.classList.remove("active"));refreshQuickValues();render();});
  input.addEventListener("change",render);
 });
 $("municipality").addEventListener("change",()=>{
  const isRio=$("municipality").value==="rio";
  $("itbiRate").value=isRio?"3":"";
  $("itbiRate").readOnly=isRio;
  $("rateHint").textContent=isRio?"Rio: alíquota de referência de 3%.":"Informe a alíquota municipal aplicável antes de concluir.";
  refreshQuickValues();render();
 });
 doc.addEventListener("keydown",ev=>{
  const tag=ev.target?.tagName?.toLowerCase();if(["input","select","textarea","button"].includes(tag)||ev.altKey||ev.ctrlKey||ev.metaKey)return;
  if(ev.key==="ArrowRight"||ev.key==="PageDown"){ev.preventDefault();go(config.step+1);}
  if(ev.key==="ArrowLeft"||ev.key==="PageUp"){ev.preventDefault();go(config.step-1);}
  if(ev.key?.toLowerCase()==="f"){ev.preventDefault();if(doc.fullscreenElement)doc.exitFullscreen?.();else doc.documentElement.requestFullscreen?.();}
 });
}
function boot(){
 prepareFit();setupQuickValues();bindControls();go(0);
 window.addEventListener?.("resize",scheduleFit);
 fetch("tax-rules.json",{cache:"no-store"}).then(x=>{if(!x.ok)throw Error("arquivo indisponível");return x.json();}).then(rule=>{
  if(rule.schemaVersion!==1||!rule.irpf||!rule.pj||!rule.rj)throw Error("base incorreta");
  config.rules=rule;config.loadStatus="base local versionada";
  $("sourceBadge").textContent="Cálculo ao vivo · regras "+rule.year;
  render();
 }).catch(()=>{
  config.loadStatus="base de contingência";
  $("sourceBadge").textContent="Atenção · regras de contingência";
  render();
 });
}
boot();
})();
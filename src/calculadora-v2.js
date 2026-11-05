
(function(){
"use strict";
const E=window.HoldingTaxEngine;
if(!E){document.body.insertAdjacentHTML("afterbegin","<p>Não foi possível carregar o motor de cálculos. Atualize a página.</p>");return;}
const el=id=>document.getElementById(id);
const money=v=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(v)||0);
const pct=v=>new Intl.NumberFormat("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:2}).format(Number(v)||0)+"%";
const num=v=>{let s=String(v==null?"":v).trim().replace(",",".");let k=Number(s);return Number.isFinite(k)?Math.max(0,k):0;};
const get=id=>num(el(id).value);
const val=(id,v)=>{el(id).value=String(v);};
const only=(n,a,b)=>Math.min(b,Math.max(a,n));
const br=(s)=>"<p>"+s+"</p>";
const fom=s=>'<div class="formula">'+s+'</div>';
let rules=E.FALLBACK,confirmed=false,assets=[{value:150000,rent:900,expenses:0,occupancy:100}];
let lastResult=null;
function addWarning(node,kind,message){node.className="result-message "+kind;node.textContent=message;}
function drawAssets(){
 const target=el("assets");target.innerHTML="";
 assets.forEach((a,i)=>{
  const wrap=document.createElement("div");wrap.className="property";wrap.innerHTML=
  '<div class="property-head"><strong>Imóvel '+(i+1)+'</strong><button type="button" data-remove="'+i+'" '+(assets.length===1?"disabled":"")+' aria-label="Excluir imóvel '+(i+1)+'">Remover</button></div>'+
  '<div class="field-grid">'+
  '<div class="field"><label for="v'+i+'">Valor de mercado (R$)</label><input id="v'+i+'" type="number" min="0" step="1000" inputmode="decimal" data-index="'+i+'" data-field="value" value="'+a.value+'"><small>Quanto este imóvel vale hoje? Não é o valor do aluguel.</small></div>'+
  '<div class="field"><label for="r'+i+'">Aluguel por mês (R$)</label><input id="r'+i+'" type="number" min="0" step="50" inputmode="decimal" data-index="'+i+'" data-field="rent" value="'+a.rent+'"><small>Se não está alugado, coloque zero.</small></div>'+
  '<div class="field"><label for="o'+i+'">Meses alugados no ano (%)</label><input id="o'+i+'" type="number" min="0" max="100" step="5" inputmode="decimal" data-index="'+i+'" data-field="occupancy" value="'+a.occupancy+'"><small>100% significa alugado o ano todo; 75% equivale a 9 meses.</small></div>'+
  '<div class="field"><label for="d'+i+'">Despesas dedutíveis por mês (R$)</label><input id="d'+i+'" type="number" min="0" step="50" inputmode="decimal" data-index="'+i+'" data-field="expenses" value="'+a.expenses+'"><small>Informe somente despesas de locação que você pode comprovar e que a lei admite deduzir.</small></div>'+
  '</div>';target.appendChild(wrap);
 });
}
function state(){
 return {
  assets:assets.map((a,i)=>({id:i+1,name:"Imóvel "+(i+1),value:num(a.value),rent:num(a.rent),expenses:num(a.expenses),occupancy:only(num(a.occupancy),0,100)})),
  owners:only(Math.round(get("owners")),1,20),
  otherIncomeMonthly:get("otherIncome"),pfDeductionMode:el("deductionMode").value,otherLegalDeductionYear:get("otherLegal"),
  legalFees:get("legalFees"),corporateRegistry:get("corporateRegistry"),propertyRegistry:get("propertyRegistry"),
  monthlyAccounting:get("accounting"),annualOtherCompany:get("annualCompany"),otherTransferTax:get("otherTransferTax"),
  capitalPercent:only(get("capitalPercent"),0,100),itbiTreatment:el("itbiTreatment").value,
  horizon:only(Math.round(get("horizon")),1,30),discountRate:only(get("discount"),0,30),
  annualRentGrowth:only(get("rentGrowth"),0,30),annualCostGrowth:only(get("costGrowth"),0,30),
  successionEnabled:false,scenarioName:"Comparação educativa de imóveis no RJ"
 };
}
function cfg(){
 const c=JSON.parse(JSON.stringify(rules));
 const city=el("municipality").value,rate=el("itbiRate").value.trim();
 const pending=city==="outro"&&(rate===""||!Number.isFinite(Number(rate))||Number(rate)<0);
 c.rj.itbiMunicipalRate=city==="rio"?0.03:only(num(rate),0,20)/100;
 return {rules:c,missingMunicipality:pending,city:city};
}
function explain(title,html,source){
 const d=document.createElement("details");d.className="explain";
 const summary=document.createElement("summary");summary.textContent=title;
 const content=document.createElement("div");content.innerHTML=html+(source?'<p class="source">'+source+'</p>':"");
 d.appendChild(summary);d.appendChild(content);return d;
}
function minPatrimonio(s,c){
 if(s.assets.length!==1||s.assets[0].value<=0||s.assets[0].rent<=0)return null;
 const y=s.assets[0].rent/s.assets[0].value;
 if(y<=0)return null;
 // Busca por grade e refinamento; não é mínimo legal nem garante monotonicidade.
 const check=p=>{
  const t=Object.assign({},s,{assets:[Object.assign({},s.assets[0],{value:p,rent:p*y})]});
  return E.run(t,c).npvConservative;
 };
 let prev=50000,hit=null,lo=null,hi=null;
 for(let n=0;n<=120;n++){
  const p=50000+(20000000-50000)*n/120;
  if(check(p)>=0){hit=p;hi=p;lo=n===0?50000:prev;break;}
  prev=p;
 }
 if(hit===null)return null;
 if(lo===hi)return Math.round(hi);
 for(let j=0;j<18;j++){const mid=(lo+hi)/2;if(check(mid)>=0)hi=mid;else lo=mid;}
 return Math.round(hi);
}
function itdFor(amount,heirs,c){
 const each=num(amount)/heirs;const x=E.itd(each,c);return {total:x.value*heirs,rate:x.rate,one:each};
}
function succession(c,r,s,ready){
 const h=only(Math.round(get("heirs")),1,20);
 const direct=itdFor(r.totalValue,h,c);
 const qBase=el("quotaBase").value.trim()===""?r.totalValue:get("quotaBase");
 const quota=itdFor(qBase,h,c);
 const directCost=direct.total+get("donationFees")+get("donationRegistry");
 const inventory=direct.total+get("inventoryFees")+get("inventoryRegistry");
 const quoteCost=quota.total+get("quotaFees")+get("quotaRegistry")+(ready?r.initConservative:0);
 const cards=[
  ["Doação direta",money(directCost),"ITD "+money(direct.total)+" + honorários e registros."],
  ["Doação de quotas com nova holding",ready?money(quoteCost):"ITBI pendente","ITD "+money(quota.total)+" + doação das quotas + abertura/transferência. Não inclui manutenção futura."],
  ["Inventário futuro",money(inventory),"Referência nominal de ITD atual + custos informados; não prevê regras futuras."]
 ];
 el("successionCards").innerHTML=cards.map(a=>'<div class="succession-card"><strong>'+a[0]+'</strong><b>'+a[1]+'</b><small>'+a[2]+'</small></div>').join("");
 return {h,direct,quota,qBase,directCost,quoteCost,inventory,ready};
}
function breakdown(s,r,c,extras,inherit,ready){
 const parent=el("explanations");parent.innerHTML="";
 const cur=money;const taxes=r.firstYear?r.firstYear.pjDetails:E.pjTaxes(0,c);
 const months=r.monthlyGross*12;const taxBefore=E.irpfIncrementalRental(months,Math.min(r.monthlyExpenses*12,months),s.otherIncomeMonthly,s.owners,s.pfDeductionMode,s.otherLegalDeductionYear,c);
 const annualMaint=s.monthlyAccounting*12+s.annualOtherCompany;
 const b=[
 ["Como calculamos os aluguéis?",
 br("Somamos o aluguel de cada imóvel e ajustamos pelo período efetivamente ocupado.")+fom("Receita anual = soma [aluguel por mês × ocupação (%) × 12] = <strong>"+cur(months)+"</strong>.")+br("O valor do patrimônio não é tributado como se fosse renda. O aluguel é a receita recorrente.")],
 ["Quanto de IRPF incide nos aluguéis?",
 br("Estimamos a diferença de imposto de renda da pessoa física antes e depois de receber os aluguéis. Isso ajuda a comparar apenas o efeito da nova renda.")+
 fom("IRPF adicional = (IRPF com outras rendas e aluguéis − IRPF só com outras rendas) × "+s.owners+" titular(es) = <strong>"+cur(r.firstYearPf)+"</strong>.")+
 br("No cenário: imposto anterior de "+cur(taxBefore.before)+"; com aluguéis de "+cur(taxBefore.after)+". A apuração anual considera faixa, deduções selecionadas e reduções legais. A realidade pode exigir carnê-leão mensal.")+
 br("As despesas dedutíveis informadas são hipótese sujeita a requisitos legais. O simulador considera rendas iguais entre os titulares.") ,
 'Fonte: <a href="https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026" target="_blank" rel="noopener">Receita Federal — tabelas do IRPF 2026</a>.'],
 ["Como a holding paga IRPJ, CSLL, PIS e Cofins?",
 br("Neste estudo utilizamos uma sociedade que aluga imóveis próprios e adota o <strong>lucro presumido</strong>. Outros regimes e atividades podem ter resultado diferente.")+
 fom("IRPJ: "+cur(taxes.irpj)+"; adicional IRPJ: "+cur(taxes.additionalIrpj)+"; CSLL: "+cur(taxes.csll)+"; PIS: "+cur(taxes.pis)+"; Cofins: "+cur(taxes.cofins)+".<br><strong>Total estimado: "+cur(taxes.total)+"</strong>.")+
 br("Para receitas dentro das faixas usuais: base presumida de 32% para IRPJ (alíquota 15%) e CSLL (9%), PIS de 0,65% e Cofins de 3%. O adicional de IRPJ é calculado quando aplicável. Em receitas maiores, as regras exigem verificações adicionais.")+
 br("<strong>Não</strong> foram calculados de forma definitiva todos os efeitos de distribuição de dividendos, tributação mínima de altas rendas, ganho de capital nem regras futuras da reforma tributária."),
 'Fonte: <a href="https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=81268" target="_blank" rel="noopener">IN RFB 1700/2017</a> e base normativa datada.'],
 ["Por que o contador diminui a economia?",
 br("A sociedade tem custos recorrentes. Por isso é incorreto comparar somente IRPF e IRPJ.")+
 fom(cur(s.monthlyAccounting)+" por mês × 12 + "+cur(s.annualOtherCompany)+" por ano = <strong>"+cur(annualMaint)+" anuais</strong>.")],
 ["O ITBI é obrigatório na transferência dos imóveis?",
 br("Depende da operação. A integralização no capital social exige análise de imunidade, valor efetivamente integralizado, eventual excesso e procedimentos do município.")+
 fom("Se for integralmente tributável: "+cur(r.totalValue)+" × "+pct(c.rj.itbiMunicipalRate*100)+" = <strong>"+cur(r.itbi.fullTax)+"</strong>. Hipótese parcial na modelagem: "+cur(r.itbi.partialTax)+".")+
 br("Se o reconhecimento ainda não ocorreu, não tratamos a imunidade como certa. "+(ready?"":"A alíquota municipal precisa ser informada para concluir o cálculo.")),
 'Referências: <a href="https://fazenda.prefeitura.rio/calculo-itbi/" target="_blank" rel="noopener">Prefeitura do Rio (apenas Rio)</a> e Constituição Federal, art. 156, § 2º, I.'],
 ["Quanto custa abrir a empresa?",
 fom("Advogado "+cur(s.legalFees)+" + registro da empresa "+cur(s.corporateRegistry)+" + registro dos imóveis "+cur(s.propertyRegistry)+" + outros "+cur(s.otherTransferTax)+" = <strong>"+cur(r.initialBase)+"</strong>, sem ITBI.")+
 br("Os valores de honorários e registros são exemplos fornecidos/editáveis, não preços oficiais. O ITBI entra em cenário separado."),
 'Referência para negociar honorários: <a href="https://www.oabrj.org.br/tabela-honorarios" target="_blank" rel="noopener">tabela OAB-RJ</a>.'],
 ["Quando a holding começa a compensar financeiramente?",
 fom("Economia operacional anual = IRPF "+cur(r.firstYearPf)+" − tributos da holding "+cur(r.firstYearPj)+" − manutenção "+cur(annualMaint)+" = <strong>"+cur(r.firstYearNet)+"</strong>.")+
 br("Para avaliar o longo prazo, calculamos o VPL (valor presente líquido), descontando o investimento inicial e trazendo os resultados anuais a valor de hoje pela taxa informada.")+
 fom("VPL = − custo inicial + soma [ganho líquido de cada ano ÷ (1 + "+pct(s.discountRate)+") elevado ao ano].")+
 br("VPL positivo no cenário significa que a economia projetada superou o custo sob as hipóteses fornecidas; não garante vantagem jurídica, comercial ou fiscal real.")],
 ["Qual o menor aluguel ou patrimônio viável?",
 br("O sistema procura um aluguel mensal que torne o VPL conservador igual ou superior a zero, mantendo os demais custos e parâmetros.")+
 fom(extras.minRent===null?"Não encontramos um valor com o método ou faltam dados.":"Aluguel mensal mínimo estimado: <strong>"+cur(extras.minRent)+"</strong>.")+
 br(extras.minWealth===null?"Para estimar patrimônio mínimo, precisamos de um imóvel com valor e aluguel positivos e alíquota do ITBI definida. Mesmo assim, pode não haver solução na faixa testada.":"Com a mesma relação aluguel/valor do imóvel e os custos atuais, a primeira faixa testada com VPL conservador não negativo foi de aproximadamente <strong>"+cur(extras.minWealth)+"</strong>.")+
 br("<strong>Não existe mínimo legal universal.</strong> É somente um ponto de equilíbrio matemático para o cenário. Patrimônio, aluguel, ITBI e custos devem ser avaliados juntos.")],
 ["Como estimamos doação, doação de quotas e inventário?",
 br("Usamos o ITD do Rio de Janeiro apenas como referência, assumindo "+inherit.h+" beneficiário(s) recebendo partes iguais. A alíquota depende da base por transmissão e das regras aplicáveis.")+
 fom("Doação direta: ITD estimado "+cur(inherit.direct.total)+" + advogado/cartório = <strong>"+cur(inherit.directCost)+"</strong>.")+
 fom("Quotas: ITD sobre base informada "+cur(inherit.qBase)+" = "+cur(inherit.quota.total)+"; somamos custos da transmissão e de constituição da holding (cenário cauteloso).")+
 fom("Inventário futuro: ITD calculado com as regras atuais + despesas inseridas = <strong>"+cur(inherit.inventory)+"</strong>.")+
 br("Não calculamos automaticamente usufruto, ganho de capital, divisão desigual, regimes de bens, legítima, meação, isenções nem futura mudança legislativa. Comparar o custo nominal não decide sozinho a melhor estratégia."),
 'Fonte: Lei RJ 7.174/2015 e legislação estadual vigente, sujeitas a conferência.']
 ];
 b.forEach(item=>parent.appendChild(explain(item[0],item[1],item[2]||"")));
 const all=r.warnings||[];
 if(all.length){
  const warnings=all.map(w=>'<strong>'+w.label+'</strong>: '+w.detail).join("<br>");
  parent.appendChild(explain("Quais limites e alertas se aplicam ao meu caso?",br(warnings)));
 }
}
function update(){
 const s=state();const x=cfg();const c=x.rules,ready=!x.missingMunicipality;let r;
 try{r=E.run(s,c)}catch(err){el("status").textContent="Revisar dados";addWarning(el("decision"),"no","Não foi possível realizar o cálculo. Verifique os valores informados.");return;}
 lastResult=r;
 const noRent=r.monthlyGross<=0;
 const annualMaint=s.monthlyAccounting*12+s.annualOtherCompany;
 el("totalValue").textContent=money(r.totalValue);
 el("yearRent").textContent=money(r.monthlyGross*12);
 el("pfTax").textContent=money(r.firstYearPf);
 el("pjTax").textContent=money(r.firstYearPj);
 el("maintenance").textContent=money(annualMaint);
 el("initialBase").textContent=money(r.initialBase);
 el("itbiFull").textContent=ready?money(r.itbi.fullTax):"Alíquota pendente";
 el("horizonLabel").textContent=String(s.horizon);
 el("horizonLabel2").textContent=String(s.horizon);
 el("npvCon").textContent=ready?money(r.npvConservative):"ITBI pendente";
 el("npvOpt").textContent=ready?money(r.npvOptimistic):"ITBI pendente";
 el("annualDifference").textContent=money(r.firstYearNet);
 const rentalCostToPj=r.firstYearPj+annualMaint;
 const diff=el("differenceLegend");
 diff.textContent="PF "+money(r.firstYearPf)+" − (holding "+money(r.firstYearPj)+" + manutenção "+money(annualMaint)+"). "+(r.firstYearNet>=0?"Valor positivo não inclui custo de abertura.":"Resultado negativo indica custo operacional maior na PJ.");
 const est=ready&&!noRent?E.minViableRent(s,c):null;
 el("minRent").textContent=noRent?"Sem receita":!ready?"ITBI pendente":est===null?"Não encontrado":money(est)+"/mês";
 let sample=null;
 if(ready&&!noRent&&s.assets.length===1)sample=minPatrimonio(s,c);
 let minRow=el("minimumPatrimonyRow");
 if(!minRow){
  const row=document.createElement("div");row.id="minimumPatrimonyRow";row.className="summary-row";row.innerHTML='<span>Patrimônio mínimo no cenário de renda informado <small>Estimativa matemática, não exigência legal</small></span><strong id="minimumPatrimony">—</strong>';
  el("minRent").parentElement.after(row);
 }
 el("minimumPatrimony").textContent=!ready?"ITBI pendente":noRent?"Sem aluguel":s.assets.length!==1?"Calcule por imóvel":sample===null?"Não encontrado até R$ 20 milhões":money(sample);
 const status=el("status"),decision=el("decision"),goal=el("goal").value;
 let statusText,kind,message;
 if(r.totalValue<=0){statusText="Informe o imóvel";kind="warn";message="Informe o valor de pelo menos um imóvel para começar.";}
 else if(!ready){statusText="Falta ITBI";kind="warn";message="Informe a alíquota de ITBI do município antes de usar o VPL ou concluir a viabilidade. O imposto sobre aluguel continua estimado.";}
 else if(noRent){statusText="Sem renda";kind="warn";message="Sem aluguéis, a holding não apresenta economia tributária recorrente nesta simulação. Compare doação direta e outros objetivos sucessórios; não conclua apenas pelo VPL.";}
 else if(r.npvConservative>0){statusText="Potencial econômico";kind="good";message="Nas hipóteses informadas, até o cenário cauteloso apresenta VPL positivo. É um sinal econômico, não uma recomendação automática de constituição.";}
 else if(r.npvOptimistic>0){statusText="Depende do ITBI";kind="warn";message="A holding só apresentou VPL positivo no cenário otimista de ITBI. A confirmação jurídica da operação é decisiva.";}
 else {statusText="Custo supera ganho";kind="no";message="Nas hipóteses atuais, abrir a empresa custa mais do que a economia projetada. Doação direta ou manutenção do imóvel merecem comparação.";}
 if(goal==="sucessao")message+=" Você priorizou sucessão: os valores financeiros de aluguel não resolvem, sozinhos, o planejamento familiar.";
 status.className="badge "+(kind==="good"?"":kind);status.textContent=statusText;
 addWarning(decision,kind==="good"?"":kind,message);
 const inherit=succession(c,r,s,ready);
 breakdown(s,r,c,{minRent:est,minWealth:sample},inherit,ready);
}
function bind(){
 el("assets").addEventListener("input",ev=>{
  const t=ev.target;const i=Number(t.dataset.index),field=t.dataset.field;
  if(!field||!assets[i])return;assets[i][field]=field==="occupancy"?only(num(t.value),0,100):num(t.value);
  update();
 });
 el("assets").addEventListener("click",ev=>{
  const b=ev.target.closest("button[data-remove]");if(!b||assets.length<2)return;
  assets.splice(Number(b.dataset.remove),1);drawAssets();update();
 });
 el("addAsset").addEventListener("click",()=>{if(assets.length>=12)return;assets.push({value:150000,rent:0,expenses:0,occupancy:100});drawAssets();update();});
 document.querySelectorAll("input:not(#assets input),select").forEach(node=>{
  if(node.closest("#assets"))return;
  node.addEventListener("input",update);node.addEventListener("change",update);
 });
 el("municipality").addEventListener("change",()=>{
  const rio=el("municipality").value==="rio";el("itbiRate").value=rio?"3":"";
  el("itbiRate").readOnly=rio;el("itbiRateHelp").textContent=rio?"Rio de Janeiro: alíquota de 3%, conforme Secretaria Municipal de Fazenda.":"Consulte a prefeitura do município e informe a alíquota; até lá o VPL fica pendente.";
  update();
 });
 el("itbiRate").readOnly=true;
 document.querySelectorAll("[data-preset]").forEach(b=>b.addEventListener("click",()=>{
  const examples={semrenda:{value:150000,rent:0},pequeno:{value:150000,rent:900},medio:{value:500000,rent:3000},maior:{value:1500000,rent:10500}};
  const a=examples[b.dataset.preset];assets=[{value:a.value,rent:a.rent,occupancy:100,expenses:0}];
  document.querySelectorAll("[data-preset]").forEach(p=>p.classList.toggle("active",p===b));
  drawAssets();update();
 }));
 el("resetButton").addEventListener("click",()=>{
  if(!window.confirm("Deseja recomeçar a simulação? Os valores atuais serão substituídos pelo exemplo inicial."))return;
  location.reload();
 });
 el("printButton").addEventListener("click",()=>window.print());
}
function boot(){
 drawAssets();bind();update();
 fetch("tax-rules.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error("Fonte indisponível");return r.json();}).then(v=>{
  if(v.schemaVersion!==1||!v.irpf||!v.pj||!v.rj)throw new Error("Estrutura inválida");
  rules=v;confirmed=true;
  el("rulesSource").textContent="Regras de referência: "+v.year+" · revisadas em "+v.reviewedAt+" · atualização manual/versionada; não é uma consulta de alíquota em tempo real.";
  update();
 }).catch(()=>{
  confirmed=false;el("rulesSource").textContent="Atenção: foi usada a base local de contingência de 2026; não foi possível atualizar as regras de referência. Revise as fontes oficiais antes de utilizar os valores.";update();
 });
}
boot();
})();
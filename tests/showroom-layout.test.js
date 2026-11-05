// node tests/showroom-layout.test.js
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const p=require("node:path");
const root=p.resolve(__dirname,"..");
const html=fs.readFileSync(p.join(root,"showroom.html"),"utf8");
const css=fs.readFileSync(p.join(root,"src/showroom.css"),"utf8");
const js=fs.readFileSync(p.join(root,"src/showroom.js"),"utf8");
const stages=[...html.matchAll(/class="stage(?: active)?" data-step="(\d+)"/g)].map(x=>+x[1]);
assert.deepEqual(stages,[0,1,2,3,4,5,6,7,8],"Devem existir nove etapas ordenadas.");
for(const id of ["propertyFormula","rentFormula","propertyCostsFormula","pfFormula","openingFormula","pjFormula","itbiFormula","successionFormula","finalFormula"]){
 assert.ok(html.includes('id="'+id+'"'),"Explicação da etapa ausente: "+id);
 assert.ok(js.includes('"'+id+'"'),"Fórmula não é atualizada ao vivo: "+id);
}
for(const id of ["iptuAnnual","iptuPayer","condoMonthly","condoPayer","municipalFeesAnnual","agencyMonthly","insuranceAnnual","repairsAnnual","costPjDifference"]){assert.ok(html.includes('id="'+id+'"'),"Campo do imóvel ausente: "+id)}
assert.match(css,/aspect-ratio:16\s*\/\s*9/,"O slide precisa ter proporção 16:9.");
assert.match(css,/height:min\(100dvh,56\.25vw\)/,"O slide deve caber na altura da tela.");
assert.match(js,/function fitSlide\(\)/,"Ajuste de conteúdo não encontrado.");
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(ids.length,new Set(ids).size,"IDs duplicados");
console.log("Showroom 16:9: estrutura e nove fórmulas explicadas OK.");

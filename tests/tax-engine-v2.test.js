/* Execute com: node tests/tax-engine-v2.test.js */
"use strict";
const assert=require("node:assert/strict");
const E=require("../src/tax-engine.js");
const rules=require("../tax-rules.json");
function example(value,rent){
  const s=E.defaultState();
  s.assets=[{id:1,name:"Imóvel teste",value,rent,expenses:0,occupancy:100}];
  s.owners=1;s.otherIncomeMonthly=3000;s.legalFees=6000;
  s.corporateRegistry=1800;s.propertyRegistry=2500;
  s.monthlyAccounting=450;s.annualOtherCompany=1200;s.otherTransferTax=0;
  s.itbiTreatment="pendente";s.horizon=10;s.discountRate=5;
  s.successionEnabled=false;return s;
}
const noRent=E.run(example(150000,0),rules);
assert.equal(noRent.totalValue,150000);
assert.equal(noRent.firstYearPf,0);
assert.equal(noRent.firstYearPj,0);
assert.ok(noRent.firstYearNet<0);
const small=E.run(example(150000,900),rules);
assert.equal(small.monthlyGross,900);
assert.equal(small.firstYear.revenue,10800);
assert.equal(small.itbi.fullTax,4500);
assert.equal(small.firstYearPj,1223.64);
assert.equal(small.firstYearPf,0);
assert.equal(small.firstYearNet,-7823.64);
assert.ok(small.npvConservative<0);
assert.ok(small.npvOptimistic<0);
const rentForBreakEven=E.minViableRent(example(150000,900),rules);
assert.ok(rentForBreakEven>900,"Deve haver aluguel de equilíbrio superior ao inicial");
assert.ok(E.run(example(150000,rentForBreakEven+1),rules).npvConservative>=0);
const high=E.run(example(1500000,10500),rules);
assert.ok(high.firstYearPj>0);
assert.ok(high.firstYearPf>0);
const noImmunity=E.run({...example(150000,900),itbiTreatment:"tributavel"},rules);
assert.equal(noImmunity.initConservative,noImmunity.initOptimistic);
const twoBeneficiaries=E.itd(75000,rules);
assert.equal(Math.round(twoBeneficiaries.value*2),6000);
console.log("Holding Studio 2.0: 6 verificações passaram.");

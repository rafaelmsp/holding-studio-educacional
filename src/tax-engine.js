/* Motor determinístico. Sem acesso externo, sem estimativas ocultas. */
(function (root) {
  'use strict';
  const FALLBACK = {
    schemaVersion: 1, year: 2026, state: 'RJ', municipality: 'Rio de Janeiro',
    reviewedAt: '2026-11-04', status: 'snapshot_local',
    irpf: {
      annualBrackets: [
        { upTo: 29145.60, rate: 0, deduction: 0 },
        { upTo: 33919.80, rate: .075, deduction: 2185.92 },
        { upTo: 45012.60, rate: .15, deduction: 4729.91 },
        { upTo: 55976.16, rate: .225, deduction: 8105.85 },
        { upTo: null, rate: .275, deduction: 10904.66 }
      ],
      simplifiedDiscountRate: .2, simplifiedDiscountMax: 17640,
      annualReduction: { exemptGrossMax: 60000, partialGrossMax: 88200, maxCredit: 2694.15, partialIntercept: 8429.73, partialSlope: .095575 },
      highIncomeMinAnnualThreshold: 600000
    },
    pj: {
      presumedIrpj: .32, presumedCsll: .32, irpjRate: .15, csllRate: .09,
      pisRate: .0065, cofinsRate: .03, irpjAdditionalRate: .10,
      irpjAdditionalBaseAnnual: 240000, revenuePresumptionIncreaseThresholdAnnual: 5000000,
      presumptionIncreaseFactor: 1.1, dividendMonthlyThresholdPerBeneficiary: 50000,
      dividendWithholdingRate: .10
    },
    rj: {
      ufir: 4.9604, itbiMunicipalRate: .03,
      itdBands: [
        { upToUfir: 70000, rate: .04 }, { upToUfir: 100000, rate: .045 },
        { upToUfir: 200000, rate: .05 }, { upToUfir: 300000, rate: .06 },
        { upToUfir: 400000, rate: .07 }, { upToUfir: null, rate: .08 }
      ]
    }, sources: []
  };
  const money = value => Number.isFinite(Number(value)) ? Number(value) : 0;
  const nonneg = value => Math.max(0, money(value));
  const clamp = (value, min, max) => Math.max(min, Math.min(max, money(value)));
  const round = value => Math.round((value + Number.EPSILON) * 100) / 100;
  function taxBrackets(base, brackets) {
    const amount = nonneg(base);
    const row = brackets.find(b => b.upTo === null || amount <= b.upTo) || brackets[brackets.length - 1];
    return Math.max(0, amount * row.rate - row.deduction);
  }
  function reductionAnnual(grossTaxable, beforeReduction, config) {
    const gross = nonneg(grossTaxable);
    const c = config.annualReduction;
    if (gross <= c.exemptGrossMax) return Math.min(beforeReduction, c.maxCredit);
    if (gross <= c.partialGrossMax) {
      return Math.min(beforeReduction, Math.max(0, c.partialIntercept - c.partialSlope * gross));
    }
    return 0;
  }
  function irpfTotal(income, legalDeductions, mode, rules) {
    const c = rules.irpf;
    const gross = nonneg(income);
    const simplified = Math.min(gross * c.simplifiedDiscountRate, c.simplifiedDiscountMax);
    const legal = Math.min(gross, nonneg(legalDeductions));
    function calculate(deduction) {
      const base = Math.max(0, gross - deduction);
      const grossTax = taxBrackets(base, c.annualBrackets);
      return Math.max(0, grossTax - reductionAnnual(gross, grossTax, c));
    }
    if (mode === 'legal') return round(calculate(legal));
    if (mode === 'simplificado') return round(calculate(simplified));
    return round(Math.min(calculate(legal), calculate(simplified)));
  }
  function irpfIncrementalRental(annualRent, annualRentalDeductions, otherIncomeMonthly, owners, mode, otherLegalDeductionYear, rules) {
    const count = Math.max(1, Math.min(20, Math.round(money(owners) || 1)));
    const rentPerOwner = nonneg(annualRent) / count;
    const costsPerOwner = Math.min(nonneg(annualRentalDeductions), nonneg(annualRent)) / count;
    const otherAnnual = nonneg(otherIncomeMonthly) * 12;
    const legalOther = nonneg(otherLegalDeductionYear);
    const before = irpfTotal(otherAnnual, legalOther, mode, rules);
    const after = irpfTotal(otherAnnual + rentPerOwner, legalOther + costsPerOwner, mode, rules);
    return { tax: round(Math.max(0, after - before) * count), before: round(before * count), after: round(after * count), incomePerOwner: otherAnnual + rentPerOwner };
  }
  function pjTaxes(annualGross, rules) {
    const c = rules.pj;
    const gross = nonneg(annualGross);
    const threshold = c.revenuePresumptionIncreaseThresholdAnnual;
    const overThreshold = Math.max(0, gross - threshold);
    const irBase = Math.min(gross, threshold) * c.presumedIrpj + overThreshold * c.presumedIrpj * c.presumptionIncreaseFactor;
    const csBase = Math.min(gross, threshold) * c.presumedCsll + overThreshold * c.presumedCsll * c.presumptionIncreaseFactor;
    const irpj = irBase * c.irpjRate;
    const irpjExtra = Math.max(0, irBase - c.irpjAdditionalBaseAnnual) * c.irpjAdditionalRate;
    const csll = csBase * c.csllRate;
    const pis = gross * c.pisRate;
    const cofins = gross * c.cofinsRate;
    return { irpj: round(irpj), additionalIrpj: round(irpjExtra), csll: round(csll), pis: round(pis), cofins: round(cofins), total: round(irpj + irpjExtra + csll + pis + cofins), highRevenue: gross > threshold };
  }
  function itd(value, rules) {
    const base = nonneg(value);
    const units = base / rules.rj.ufir;
    const band = rules.rj.itdBands.find(b => b.upToUfir == null || units <= b.upToUfir) || rules.rj.itdBands.at(-1);
    return { value: round(base * band.rate), rate: band.rate, ufirEquivalent: units };
  }
  function itbiByTreatment(assetValue, capitalPercent, treatment, rules) {
    const value = nonneg(assetValue);
    const protectedAmount = value * clamp(capitalPercent, 0, 100) / 100;
    const rate = rules.rj.itbiMunicipalRate;
    const partialTax = Math.max(0, value - protectedAmount) * rate;
    const fullTax = value * rate;
    return {
      optimistic: round(treatment === 'tributavel' ? fullTax : partialTax),
      conservative: round(treatment === 'reconhecida' ? partialTax : fullTax),
      partialTax: round(partialTax), fullTax: round(fullTax), hasUncertainty: treatment === 'pendente'
    };
  }
  function defaultState() {
    return {
      step: 0,
      assets: [
        { id: 1, name: 'Imóvel A • Zona Sul', value: 1800000, rent: 8000, expenses: 350, occupancy: 95 },
        { id: 2, name: 'Imóvel B • Barra', value: 1300000, rent: 6500, expenses: 300, occupancy: 95 },
        { id: 3, name: 'Imóvel C • Tijuca', value: 1100000, rent: 5500, expenses: 250, occupancy: 95 }
      ],
      owners: 1, otherIncomeMonthly: 0, pfDeductionMode: 'auto', otherLegalDeductionYear: 0,
      legalFees: 22000, corporateRegistry: 2000, propertyRegistry: 4500,
      monthlyAccounting: 800, annualOtherCompany: 1200, otherTransferTax: 0,
      capitalPercent: 100, itbiTreatment: 'pendente',
      horizon: 10, annualRentGrowth: 0, annualCostGrowth: 0, discountRate: 5,
      successionEnabled: false, successionYear: 10, successionCostPF: 0, successionCostPJ: 0,
      successionValue: 0, heirCount: 2, scenarioName: 'Estudo inicial de locação'
    };
  }
  function run(state, rules = FALLBACK) {
    const assets = Array.isArray(state.assets) ? state.assets : [];
    const totalValue = assets.reduce((s, a) => s + nonneg(a.value), 0);
    const monthlyGross = assets.reduce((s, a) => s + nonneg(a.rent) * clamp(a.occupancy, 0, 100) / 100, 0);
    const monthlyPotential = assets.reduce((s, a) => s + nonneg(a.rent), 0);
    const monthlyExpenses = assets.reduce((s, a) => s + nonneg(a.expenses), 0);
    const years = Math.max(1, Math.min(30, Math.round(money(state.horizon) || 10)));
    const rentGrowth = clamp(state.annualRentGrowth, -10, 30) / 100;
    const costGrowth = clamp(state.annualCostGrowth, 0, 30) / 100;
    const discountRate = clamp(state.discountRate, 0, 30) / 100;
    const initialBase = nonneg(state.legalFees) + nonneg(state.corporateRegistry) + nonneg(state.propertyRegistry) + nonneg(state.otherTransferTax);
    const itbi = itbiByTreatment(totalValue, state.capitalPercent, state.itbiTreatment, rules);
    const initConservative = initialBase + itbi.conservative;
    const initOptimistic = initialBase + itbi.optimistic;
    const lines = [];
    let cumulativeCon = -initConservative;
    let cumulativeOpt = -initOptimistic;
    let npvCon = -initConservative;
    let npvOpt = -initOptimistic;
    let paybackCon = null;
    let paybackOpt = null;
    let totalPfTax = 0, totalPjTax = 0, totalMaintenance = 0;
    let firstYear = null;
    for (let year = 1; year <= years; year++) {
      const rent = monthlyGross * 12 * Math.pow(1 + rentGrowth, year - 1);
      const propertyCost = monthlyExpenses * 12 * Math.pow(1 + costGrowth, year - 1);
      const pf = irpfIncrementalRental(rent, Math.min(propertyCost, rent), state.otherIncomeMonthly, state.owners, state.pfDeductionMode, state.otherLegalDeductionYear, rules);
      const pj = pjTaxes(rent, rules);
      const maintenance = (nonneg(state.monthlyAccounting) * 12 + nonneg(state.annualOtherCompany)) * Math.pow(1 + costGrowth, year - 1);
      const succGain = state.successionEnabled && year === Math.round(money(state.successionYear))
        ? (nonneg(state.successionCostPF) - nonneg(state.successionCostPJ)) : 0;
      const annualGain = pf.tax - pj.total - maintenance + succGain;
      const preCon = cumulativeCon;
      const preOpt = cumulativeOpt;
      cumulativeCon += annualGain;
      cumulativeOpt += annualGain;
      const discountedGain = annualGain / Math.pow(1 + discountRate, year);
      npvCon += discountedGain;
      npvOpt += discountedGain;
      if (paybackCon == null && preCon < 0 && cumulativeCon >= 0 && annualGain > 0) paybackCon = year - 1 + (-preCon / annualGain);
      if (paybackOpt == null && preOpt < 0 && cumulativeOpt >= 0 && annualGain > 0) paybackOpt = year - 1 + (-preOpt / annualGain);
      totalPfTax += pf.tax;
      totalPjTax += pj.total;
      totalMaintenance += maintenance;
      const item = { year, revenue: round(rent), pfTax: pf.tax, pjTax: pj.total, pjDetails: pj, maintenance: round(maintenance), propertyCost: round(propertyCost), succGain: round(succGain), annualGain: round(annualGain), cumulativeCon: round(cumulativeCon), cumulativeOpt: round(cumulativeOpt), discountedGain: round(discountedGain) };
      if (year === 1) firstYear = item;
      lines.push(item);
    }
    const firstYearPf = firstYear ? firstYear.pfTax : 0;
    const firstYearPj = firstYear ? firstYear.pjTax : 0;
    const firstYearNet = firstYear ? firstYear.annualGain : 0;
    const wealthMonthlyYield = totalValue > 0 ? monthlyPotential / totalValue : 0;
    const warnings = [];
    if (itbi.hasUncertainty) warnings.push({ level:'high', label:'ITBI em análise', detail:'Os resultados mostram duas hipóteses: tributação integral e imunidade até o capital integralizado. A confirmação depende da operação e do município.' });
    if (state.successionEnabled) warnings.push({ level:'info', label:'Custos sucessórios estimados', detail:'Os valores de inventário, doação e governança são estimativas inseridas pelo usuário. A holding não elimina ITD e não garante ausência de inventário.' });
    if (firstYear && firstYear.pjDetails.highRevenue) warnings.push({ level:'medium', label:'Receita acima de R$ 5 milhões/ano', detail:'Aplicado o adicional de 10% nos percentuais de presunção sobre a parcela excedente à referência anual da LC 224/2025.' });
    if (nonneg(state.otherIncomeMonthly) * 12 + (firstYear ? firstYear.revenue / Math.max(1, money(state.owners)) : 0) > rules.irpf.highIncomeMinAnnualThreshold) warnings.push({ level:'high', label:'Altas rendas', detail:'Tributação mínima anual da pessoa física, quando aplicável, não foi computada. Exige apuração individual.' });
    const dividendMonthlyPerOwner = firstYear ? Math.max(0, (firstYear.revenue - firstYear.pjTax - firstYear.maintenance - firstYear.propertyCost) / (12 * Math.max(1, money(state.owners)))) : 0;
    if (dividendMonthlyPerOwner > rules.pj.dividendMonthlyThresholdPerBeneficiary) warnings.push({ level:'high', label:'Distribuição acima de R$ 50 mil/mês', detail:'Pode incidir IRRF de 10% sobre dividendos pagos a uma mesma pessoa física por uma mesma empresa. O ajuste final e efeitos da tributação mínima não foram modelados.' });
    if (years > 1) warnings.push({ level:'info', label:'Regra tributária congelada em 2026', detail:'Os próximos anos são cenários matemáticos mantendo a legislação-base de 2026. Não são previsão da reforma tributária ou de novas alíquotas.' });
    if (state.pfDeductionMode !== 'simplificado') warnings.push({ level:'info', label:'Deduções da pessoa física', detail:'Confirme a elegibilidade, comprovação e responsabilidade efetiva por IPTU, condomínio e demais despesas declaradas.' });
    if (totalValue <= 0 || monthlyPotential <= 0) warnings.push({ level:'high', label:'Receita insuficiente', detail:'Adicione ao menos um imóvel com valor e receita de aluguel para calcular a viabilidade operacional.' });
    return {
      totalValue: round(totalValue), monthlyGross: round(monthlyGross), monthlyPotential: round(monthlyPotential), monthlyExpenses: round(monthlyExpenses),
      vacancyPercent: monthlyPotential > 0 ? round((1 - monthlyGross / monthlyPotential) * 100) : 0,
      wealthMonthlyYield, initialBase: round(initialBase), itbi, initConservative: round(initConservative), initOptimistic: round(initOptimistic),
      firstYear, firstYearPf, firstYearPj, firstYearNet, lines, years,
      npvConservative: round(npvCon), npvOptimistic: round(npvOpt), accumulatedConservative: round(cumulativeCon), accumulatedOptimistic: round(cumulativeOpt),
      paybackCon, paybackOpt, totalPfTax: round(totalPfTax), totalPjTax: round(totalPjTax), totalMaintenance: round(totalMaintenance),
      itdIllustrative: itd(nonneg(state.successionValue) || totalValue, rules),
      dividendMonthlyPerOwner: round(dividendMonthlyPerOwner), warnings,
      status: npvCon > 0 ? 'favoravel' : (npvOpt > 0 ? 'condicional' : 'desfavoravel'),
      rateSnapshot: rules.year, reviewedAt: rules.reviewedAt
    };
  }
  function minViableRent(state, rules = FALLBACK) {
    const baseRent = (state.assets || []).reduce((sum, a) => sum + nonneg(a.rent), 0);
    if (baseRent <= 0) return null;
    // Mostra faturamento potencial (antes da vacância), para atingir VPL >= 0 no cenário conservador.
    const check = factor => run({ ...state, assets: state.assets.map(a => ({ ...a, rent: nonneg(a.rent) * factor })) }, rules).npvConservative;
    let lower = 0, upper = 1;
    while (check(upper) < 0 && upper < 1000) upper *= 2;
    if (upper >= 1000 && check(upper) < 0) return null;
    for (let i = 0; i < 38; i++) {
      const mid = (lower + upper) / 2;
      if (check(mid) >= 0) upper = mid; else lower = mid;
    }
    return round(baseRent * upper);
  }
  const API = { FALLBACK, defaultState, taxBrackets, reductionAnnual, irpfTotal, irpfIncrementalRental, pjTaxes, itd, itbiByTreatment, run, minViableRent, round };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.HoldingTaxEngine = API;
})(typeof window !== 'undefined' ? window : globalThis);

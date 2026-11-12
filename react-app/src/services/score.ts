/** Contabilização oficial: rodadas sem resposta não são tentativas de acerto. */
const ANSWER_KEYS=['correct','gray','risky','criminal'] as const;
export function answeredAttempts(counters?:Record<string,number>|null):number{
 return ANSWER_KEYS.reduce((sum,key)=>sum+Math.max(0,Number(counters?.[key]||0)||0),0);
}
export function accuracyPercent(counters?:Record<string,number>|null):number{
 const total=answeredAttempts(counters);
 return total?Math.round(100*Math.max(0,Number(counters?.correct||0)||0)/total):0;
}

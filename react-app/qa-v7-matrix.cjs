/* V7 responsive/accessibility smoke: focused controls, images, layout and 1–4 player podium. */
const {chromium}=require('playwright-core');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const BASE=process.env.TC_V7_QA_BASE||'http://127.0.0.1:8148/react-live/';
const OUT=path.resolve(__dirname,'../docs/preview/v7/matrix');
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const matrix=[],errors=[];
 try{
  for(const [w,h] of [[320,800],[360,800],[390,844],[412,915],[640,900],[768,1024],[1280,720],[1672,941],[1920,1080]]){
   const context=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce',locale:'pt-BR'});
   const page=await context.newPage();
   const pageErrors=[];
   page.on('pageerror',error=>pageErrors.push(error.message));
   page.on('response',response=>{if(response.status()>=400&&new URL(response.url()).origin===new URL(BASE).origin)pageErrors.push(response.status()+' '+response.url());});
   await page.goto(BASE+'?view=showroom',{waitUntil:'networkidle'});
   await page.locator('.v7-showroom-host').waitFor();
   for(const [tab,selector] of [['Host','.v7-showroom-host'],['Telão','.v7-showroom-question'],['Jogador','.v7-showroom-phone'],['Pódio','.v7-showroom-podium']]){
    await page.getByRole('navigation',{name:'Prévia de interfaces'}).getByRole('button',{name:tab,exact:true}).click();
    await page.locator(selector).waitFor();
    await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>img.decode().catch(()=>null)));});
    const checked=await page.evaluate(()=>{
     const broken=[...document.querySelectorAll('img')].filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.getAttribute('src'));
     const overflow=document.documentElement.scrollWidth>innerWidth+2;
     const clipped=[...document.querySelectorAll('.v7-showroom-tabs button')].some(b=>{const x=b.getBoundingClientRect();return x.width<35||x.left<0||x.right>innerWidth+2;});
     return {overflow,broken,clipped,document:document.documentElement.scrollWidth};
    });
    matrix.push({viewport:w+'x'+h,tab,...checked});
    if(checked.overflow||checked.broken.length||checked.clipped) errors.push({viewport:w+'x'+h,tab,...checked});
    if((w===360||w===412||w===1920)&&tab==='Jogador')await page.screenshot({path:path.join(OUT,'player-'+w+'x'+h+'.png'),animations:'disabled'});
   }
   if(w===390){
    await page.getByRole('navigation',{name:'Prévia de interfaces'}).getByRole('button',{name:'Jogador'}).click();
    await page.locator('.v7-showroom-phone .answer-row').nth(1).click();
    assert.equal(await page.locator('.v7-showroom-phone .answer-row.selected').count(),1);
    await page.getByRole('button',{name:/CONFIRMAR RESPOSTA DEMO/}).click();
    assert.equal(await page.locator('.v7-showroom-phone .answer-row.correct').count(),1);
    await page.getByRole('button',{name:/PRÓXIMA CENA/}).click();
    assert.equal(await page.locator('.v7-showroom-phone .answer-row.selected').count(),0,'next round resets selection');
    await page.getByRole('navigation',{name:'Prévia de interfaces'}).getByRole('button',{name:'Pódio'}).click();
    await page.screenshot({path:path.join(OUT,'podium-'+w+'x'+h+'.png'),animations:'disabled'});
   }
   if(pageErrors.length)errors.push({viewport:w+'x'+h,pageErrors});
   await context.close();
  }
  fs.writeFileSync(path.join(OUT,'matrix-result.json'),JSON.stringify({pass:errors.length===0,checks:matrix.length,errors,matrix},null,2));
  if(errors.length)throw new Error('MATRIX FAIL: '+JSON.stringify(errors).slice(0,1700));
  console.log('V7_MATRIX_PASS',matrix.length,'states in',new Set(matrix.map(x=>x.viewport)).size,'viewports with no broken images or horizontal overflow');
 }catch(e){console.error(e.stack||String(e));process.exitCode=1;}
 finally{await browser.close();}
})();

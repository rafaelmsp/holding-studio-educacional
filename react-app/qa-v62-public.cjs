const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const BASE='https://rafaelmsp.github.io/holding-studio-educacional/live/';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
 const cases=[['Host','?view=host','.case-gallery',1600,900],['Telão','?view=screen','.projector-no-room',1920,1080],['Jogador','?view=player','.player-no-room',390,844],['Galeria','showroom-v6.html','.gallery .card',1600,900]];
 const errors=[],summary=[];
 try{
  for(const [label,path,selector,width,height] of cases){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
   const page=await context.newPage();
   page.on('pageerror',e=>errors.push(label+' JS '+e.message));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(BASE))errors.push(label+' HTTP '+r.status()+' '+r.url());});
   const res=await page.goto(BASE+path,{waitUntil:'domcontentloaded',timeout:45000});
   assert.equal(res.status(),200,label+' route');
   await page.locator(selector).first().waitFor({timeout:35000});
   const state=await page.evaluate(()=>({
    width:innerWidth,scroll:document.documentElement.scrollWidth,
    broken:[...document.images].filter(el=>el.complete&&!el.naturalWidth).map(el=>el.currentSrc),
    cards:document.querySelectorAll('.gallery .card').length,title:document.title
   }));
   assert.ok(state.scroll<=state.width,label+' has horizontal overflow');
   assert.deepEqual(state.broken,[],label+' broken images');
   if(label==='Galeria'){assert.equal(state.cards,8,'showroom eight captures');assert.match(state.title,/V6\.2/);}
   summary.push({view:label,status:res.status(),...state});
   await context.close();
  }
  const assetCtx=await browser.newContext();const page=await assetCtx.newPage();
  for(const file of ['host.webp','telao.webp','mobile.webp','podio.webp','revelacao.webp','podio-host.webp']){
   const result=await page.request.get('https://rafaelmsp.github.io/holding-studio-educacional/docs/preview/v6/'+file);
   assert.equal(result.status(),200,'Published image '+file);
  }
  await assetCtx.close();
  assert.deepEqual(errors,[],'Runtime errors');
  console.log('PUBLIC_V62_SMOKE_PASSED',JSON.stringify(summary));
 }catch(err){console.error('PUBLIC_V62_SMOKE_FAILED',err.stack||err);process.exitCode=1;}
 finally{await browser.close();}
})();

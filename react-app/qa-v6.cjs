const {chromium}=require('playwright-core');
const fs=require('fs');
const path=require('path');
const OUTPUT=process.env.TC_QA_OUTPUT_DIR||'/tmp';fs.mkdirSync(OUTPUT,{recursive:true});
const BASE=process.env.TC_QA_BASE||'http://127.0.0.1:8126/react-live/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']});
 const results={images:{},stages:[],errors:[],warnings:[]};let host,screen,playerA,playerB;
 const hook=(p,name)=>{
  p.on('pageerror',e=>results.errors.push(name+': '+e.message));
  p.on('console',m=>{if(m.type()==='error')results.errors.push(name+': '+m.text().slice(0,200))});
  p.on('requestfailed',r=>results.warnings.push(name+': '+r.url().slice(0,160)+' '+r.failure()?.errorText));
  p.on('dialog',d=>d.accept());
 };
 const record=async(p,name)=>{
  const r=await p.evaluate(()=>({
   innerWidth,scrollWidth:document.documentElement.scrollWidth,
   images:[...document.images].map(i=>({src:i.src.slice(-90),loaded:i.complete&&i.naturalWidth>0})),
   text:document.body.innerText.slice(0,220),
   buttons:[...document.querySelectorAll('button')].slice(0,25).map(x=>x.textContent.trim().slice(0,35))
  }));
  results.images[name]=r.images;
  results.stages.push({name,overflow:r.scrollWidth>r.innerWidth,badImages:r.images.filter(x=>!x.loaded),text:r.text});
  await p.screenshot({path:path.join(OUTPUT,'react-v6-'+name+'.png'),fullPage:true});
 };
 try{
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  host=await ctx.newPage();hook(host,'host');
  await host.goto(BASE+'?view=host',{waitUntil:'domcontentloaded',timeout:45000});
  await host.waitForSelector('.case-gallery');
  await record(host,'host-setup');
  await host.getByRole('button',{name:/CRIAR SALA ONLINE/}).click();
  await host.waitForSelector('.room-code',{timeout:45000});
  const room=(await host.locator('.room-code').innerText()).trim();results.room=room;
  await record(host,'host-lobby');
  const ctxA=await browser.newContext({viewport:{width:390,height:844}});
  playerA=await ctxA.newPage();hook(playerA,'playerA');
  await playerA.goto(BASE+'?view=player&room='+room,{waitUntil:'domcontentloaded',timeout:45000});
  await playerA.waitForSelector('#nickname',{timeout:35000});
  await playerA.getByRole('button',{name:/Feminino/}).click();
  await playerA.getByRole('button',{name:/Perita/}).click();
  await playerA.locator('#nickname').fill('TESTE REACT A');
  await record(playerA,'player-join');
  await playerA.getByRole('button',{name:/ENTRAR NA PARTIDA/}).click();
  await playerA.waitForSelector('.player-lobby',{timeout:35000});
  results.stages.push({name:'playerA-joined',ok:true});
  const ctxB=await browser.newContext({viewport:{width:412,height:915}});
  playerB=await ctxB.newPage();hook(playerB,'playerB');
  await playerB.goto(BASE+'?view=player&room='+room,{waitUntil:'domcontentloaded'});
  await playerB.waitForSelector('#nickname',{timeout:25000});
  await playerB.locator('#nickname').fill('TESTE REACT B');
  await playerB.getByRole('button',{name:/ENTRAR NA PARTIDA/}).click();
  await playerB.waitForSelector('.player-lobby',{timeout:35000});
  const screenPromise=ctx.waitForEvent('page',{timeout:15000});
  await host.getByRole('button',{name:/ABRIR TELÃO/}).click();
  screen=await screenPromise;hook(screen,'screen');
  await screen.setViewportSize({width:1920,height:1080});
  await screen.waitForSelector('.projector-waiting',{timeout:35000});
  await record(screen,'projector-lobby');
  await host.getByRole('button',{name:/INICIAR PARTIDA/}).last().click();
  await playerA.waitForSelector('.gameplay',{timeout:35000});
  await playerB.waitForSelector('.gameplay',{timeout:35000});
  await screen.waitForSelector('.projector-question',{timeout:35000});
  await record(host,'host-game');
  await record(screen,'projector-game');
  await record(playerA,'player-game');
  await playerA.locator('.player-question .answer-row').first().click();
  await playerA.getByRole('button',{name:/RESPONDER/}).click();
  await playerA.waitForSelector('.answered-notice',{timeout:25000});
  await host.getByRole('button',{name:/REVELAR RESPOSTA/}).click();
  await screen.waitForSelector('.projector-explanation',{timeout:25000});
  await record(screen,'projector-reveal');
  await host.getByRole('button',{name:/PULAR \/ PRÓXIMA/}).click();
  await playerB.waitForFunction(()=>document.body.innerText.includes('RODADA 2 DE 8'),null,{timeout:35000});
  results.stages.push({name:'skip-unanswered-playerB',ok:true});
  await screen.waitForFunction(()=>document.querySelector('.top-stats')?.innerText.includes('2/8'),null,{timeout:35000});
  await screen.getByRole('button',{name:/PULAR \/ PRÓXIMA/}).click();
  await host.waitForFunction(()=>document.body.innerText.includes('RODADA 03/08'),null,{timeout:35000});
  results.stages.push({name:'screen-next-authorized',ok:true});
  await host.getByRole('button',{name:/ENCERRAR PARTIDA/}).click();
  await screen.waitForSelector('.v6-podium',{timeout:35000});
  await playerA.waitForSelector('.player-final',{timeout:35000});
  const podium=await screen.locator('.v6-winner-card').allTextContents();
  if(podium.length!==3||!podium[2]?.includes('SEM PARTICIPANTE'))throw Error('Podium must show 2 real players and an explicitly vacant third place');
  const cards=await screen.locator('.v6-winner-card').count();
  if(cards!==3)throw Error('Podium does not have 3 positioned cards');
  const realPortraits=await screen.locator('.v6-podium-portrait').count();
  if(realPortraits<1)throw Error('No selected character portrait shown on podium');
  results.stages.push({name:'v6-podium-real-data',ok:true,realPortraits});
  await record(screen,'projector-final');
  await record(playerA,'player-final');
  results.success=results.errors.length===0&&results.stages.every(s=>!s.overflow&&(!s.badImages||s.badImages.length===0)); if(!results.success)process.exitCode=1;
  console.log('QA_FINAL',JSON.stringify(results,null,2));
  fs.writeFileSync(path.join(OUTPUT,'react-v6-qa-results.json'),JSON.stringify(results,null,2));
 }catch(e){results.failed=e.stack||e.message;console.log('QA_FAILED',results.failed);fs.writeFileSync(path.join(OUTPUT,'react-v6-qa-results.json'),JSON.stringify(results,null,2));process.exitCode=1;}
 finally{await browser.close();}
})();

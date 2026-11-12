const {chromium}=require('playwright-core');
const fs=require('node:fs');
const path=require('node:path');
const BASE=process.env.TC_V6_QA_BASE||'http://127.0.0.1:8148/react-live/';
const OUT=process.env.TC_V6_QA_OUT||path.resolve(__dirname,'../docs/preview/v6');
fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
 const errors=[];const results=[];let host,screen;
 const log=(page,label)=>{
  page.on('pageerror',e=>errors.push(label+' JS: '+e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(label+' console: '+msg.text().slice(0,240));});
  page.on('response',r=>{if(r.status()>=400 && /the-crimes-v6\/|\/bundles\//.test(r.url()))errors.push(label+' failed '+r.status()+': '+r.url());});
  page.on('dialog',d=>d.accept());
 };
 const snap=async(page,name)=>{
  await page.waitForTimeout(700);
  const meta=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth,images:[...document.querySelectorAll('img')].filter(x=>!x.complete||x.naturalWidth===0).map(x=>x.src.slice(-110))}));
  await page.screenshot({path:path.join(OUT,name+'.png'),fullPage:true});
  results.push({name,overflow:meta.scroll>meta.w,badImages:meta.images});
  console.log('SCREENSHOT',name,JSON.stringify(meta));
 };
 try{
  const ctx=await browser.newContext({viewport:{width:1600,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  host=await ctx.newPage();log(host,'host');
  await host.goto(BASE+'?view=host',{waitUntil:'domcontentloaded',timeout:45000});
  await host.waitForSelector('.case-gallery');
  await snap(host,'01-casos-host');
  await host.locator('.create-room-panel .cinema-button').click();
  await host.waitForSelector('.v6-host-lobby',{timeout:40000});
  const code=(await host.locator('.v6-lobby-hero h1').innerText()).trim();console.log('ROOM',code);
  await snap(host,'02-host-lobby');
  const players=[];
  for(const [i,nick,gender,persona,width] of [[0,'TESTE V6 ANA','Feminino','Perita',390],[1,'TESTE V6 JOAO','Masculino','Advogado',412],[2,'TESTE V6 CARLA','Feminino','Analista',360]]){
   const c=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
   const p=await c.newPage();log(p,'player'+i);
   await p.goto(BASE+'?view=player&room='+code,{waitUntil:'domcontentloaded',timeout:45000});
   await p.waitForSelector('#nickname',{timeout:40000});
   if(i===0)await snap(p,'03-mobile-escolha');
   await p.locator('#nickname').fill(nick);
   await p.getByRole('button',{name:gender}).click();
   await p.getByRole('button',{name:new RegExp(persona)}).first().click();
   await p.getByRole('button',{name:/ENTRAR NA PARTIDA/}).click();
   await p.waitForSelector('.player-lobby',{timeout:45000});
   if(i===0)await snap(p,'04-mobile-lobby');
   players.push(p);
  }
  await host.waitForTimeout(1800);
  await snap(host,'05-host-jogadores');
  screen=await ctx.newPage();log(screen,'screen');await screen.setViewportSize({width:1920,height:1080});
  await screen.goto(BASE+'?view=screen&room='+code,{waitUntil:'domcontentloaded',timeout:45000});
  await screen.waitForSelector('.projector-waiting',{timeout:40000});
  await snap(screen,'06-telao-lobby');
  await host.locator('.host-dock').getByRole('button',{name:/INICIAR PARTIDA/}).click();
  await host.waitForSelector('.host-question',{timeout:35000});
  await players[0].waitForSelector('.gameplay',{timeout:35000});
  await screen.waitForSelector('.projector-question',{timeout:35000});
  await snap(host,'07-host-rodada');
  await snap(screen,'08-telao-rodada');
  await snap(players[0],'09-mobile-pergunta');
  await players[0].locator('.player-question .answer-row').first().click();
  await players[0].locator('.submit-answer').click();
  await players[0].waitForSelector('.answered-notice',{timeout:35000});
  await snap(players[0],'10-mobile-respondeu');
  await host.locator('.host-dock').getByRole('button',{name:/REVELAR RESPOSTA/}).click();
  await host.waitForSelector('.explanation',{timeout:25000}).catch(()=>{});
  await snap(screen,'11-telao-revelacao');
  await host.locator('.host-dock').getByRole('button',{name:/ENCERRAR PARTIDA/}).click();
  await screen.waitForSelector('.v6-final-board',{timeout:45000});
  await snap(screen,'12-podio-final');
  await snap(players[0],'13-mobile-final');
  const image=await screen.locator('.v6-finish-card img').first().getAttribute('src');
  console.log('PODIUM_AVATAR',image);
  const allPodiumImages=await screen.locator('.v6-finish-card img').evaluateAll(items=>items.map(i=>i.getAttribute('src')));
  for(const expected of ['perita','advogado','analista'])if(!allPodiumImages.some(x=>x&&x.includes(expected)))throw Error('Missing chosen avatar in final podium: '+expected);
  await screen.locator('.v6-restart').click();
  await screen.waitForSelector('.projector-waiting',{timeout:40000});
  await host.waitForSelector('.v6-host-lobby',{timeout:40000});
  await players[0].waitForSelector('.player-lobby',{timeout:40000});
  await snap(screen,'14-lobby-apos-reset');
  console.log('RESET_VERIFIED');
  await host.locator('.host-dock').getByRole('button',{name:/INICIAR PARTIDA/}).click();
  for(let n=1;n<=8;n++){
   await host.waitForFunction(round=>document.querySelector('.round-bar strong')?.textContent?.includes('RODADA '+String(round).padStart(2,'0')+'/08'),n,{timeout:30000});
   await host.locator('.host-dock').getByRole('button',{name:/REVELAR RESPOSTA/}).click();
   if(n<8)await host.locator('.host-dock').getByRole('button',{name:/PULAR/}).click();
   else await host.locator('.host-dock').getByRole('button',{name:/ENCERRAR PARTIDA/}).click();
   console.log('ROUND_VERIFIED',n+'/8');
  }
  await screen.waitForSelector('.v6-final-board',{timeout:45000});
  await snap(screen,'15-podio-oito-rodadas');
  console.log('EIGHT_ROUNDS_VERIFIED');
  if(errors.length)throw Error('Browser errors: '+JSON.stringify(errors.slice(0,10)));
  console.log('RESULTS',JSON.stringify(results));
  console.log('ERRORS',JSON.stringify(errors.slice(0,20)));
 }catch(e){console.error('QA_V6_FAILED',e&&e.stack||e);process.exitCode=1;}
 finally{await browser.close();}
})();

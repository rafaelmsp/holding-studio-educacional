/* THE CRIMES LIVE V7 — real Supabase 8-round smoke, responsive viewport & regression screenshots. */
const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const BASE=process.env.TC_V7_QA_BASE||'http://127.0.0.1:8148/react-live/';
const OUT=path.resolve(__dirname,'../docs/preview/v7');
const screenshot=async(page,name)=>page.screenshot({path:path.join(OUT,name+'.png'),fullPage:false,animations:'disabled'});
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']});
 const desktop=await browser.newContext({viewport:{width:1672,height:941},reducedMotion:'reduce'});
 const phone=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
 const publicScreen=await browser.newContext({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
 const host=await desktop.newPage(),player=await phone.newPage(),screen=await publicScreen.newPage();
 for(const pg of [host,player,screen])pg.setDefaultTimeout(45000);
 const errors=[],proof=[],start=Date.now();
 for(const [name,pg] of [['host',host],['player',player],['screen',screen]]){
  pg.on('pageerror',e=>errors.push(name+': '+e.message));
  pg.on('dialog',d=>d.accept());
 }
 async function overflow(page,label){
  const r=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  assert.ok(r.scroll <= r.width + 2 && r.body <= r.width + 2, label+': horizontal overflow '+JSON.stringify(r));
  proof.push({check:label,width:r.width,document:r.scroll});
 }
 try{
  await host.goto(BASE+'?view=host',{waitUntil:'domcontentloaded'});
  await host.locator('.case-tile').first().waitFor();
  assert.equal(await host.locator('.case-tile').count(),6,'six cases');
  await host.locator('.create-room-panel .cinema-button').click();
  await host.locator('.v6-host-lobby').waitFor();
  const code=(await host.locator('.v6-lobby-hero h1').innerText()).trim();
  assert.match(code,/^CRIM-[0-9]{4}$/);
  const roomUrl=BASE+'?view=host&room='+code;
  await screenshot(host,'02_host_lobby_desktop_1672x941');
  await overflow(host,'host-desktop-lobby');

  await host.reload({waitUntil:'domcontentloaded'});
  await host.locator('.v6-host-lobby').waitFor();
  assert.equal((await host.locator('.v6-lobby-hero h1').innerText()).trim(),code,'host token restored on reload');
  proof.push({check:'host-reload-token',ok:true});

  await host.setViewportSize({width:390,height:844});
  await host.locator('.v7-menu-trigger').waitFor();
  assert.equal(await host.locator('.host-sidebar').isVisible(),false,'desktop menu hidden on mobile');
  await overflow(host,'host-mobile-lobby');
  await screenshot(host,'01_host_lobby_mobile_390x844');
  await host.locator('.v7-menu-trigger').click();
  await host.getByRole('navigation',{name:'Menu do Host'}).getByRole('button',{name:/Jogadores/}).waitFor();
  await host.getByRole('navigation',{name:'Menu do Host'}).getByRole('button',{name:/Fechar menu/}).click();
  assert.equal(await host.locator('.v7-menu-overlay').count(),0,'mobile drawer closes');
  await host.setViewportSize({width:1672,height:941});

  await player.goto(BASE+'?view=player&room='+code,{waitUntil:'domcontentloaded'});
  await player.locator('#nickname').waitFor();
  await player.locator('#nickname').fill('V7 Perito QA');
  await player.getByRole('button',{name:/DELEGADO/i}).first().click();
  await player.getByRole('button',{name:/ENTRAR NA PARTIDA/}).click();
  await player.locator('.player-lobby').waitFor();
  await screen.goto(BASE+'?view=screen&room='+code,{waitUntil:'domcontentloaded'});
  await screen.locator('.projector-waiting').waitFor();
  assert.equal(await screen.getByRole('button',{name:/REVELAR RESPOSTA/}).count(),0,'public projector read-only');
  await host.locator('.host-dock').getByRole('button',{name:/INICIAR PARTIDA/}).click();
  for(let round=1;round<=8;round++){
   const label=String(round).padStart(2,'0');
   await host.locator('.round-bar strong').getByText(new RegExp('RODADA\\s+'+label+'\\/08')).waitFor();
   await player.locator('.gameplay').waitFor();
   await player.locator('.mobile-round-label').getByText(new RegExp('RODADA\\s+'+round+'\\s+DE\\s+8')).waitFor();
   await screen.locator('.projector-question h1').waitFor();
   assert.equal(await player.locator('.answered-notice').count(),0,'fresh option state round '+round);
   assert.equal(await player.locator('.player-question .answer-row').count(),4,'four answers round '+round);
   if(round===1){
    await overflow(player,'player-mobile-round');
    await screenshot(player,'04_jogador_mobile_390x844');
    await overflow(screen,'screen-projector-round');
    await screen.setViewportSize({width:1672,height:941});
    await screenshot(screen,'03_rodada_desktop_telao_1672x941');
    await screen.setViewportSize({width:1920,height:1080});
   }
   await player.locator('.player-question .answer-row').first().click();
   await player.locator('.submit-answer').click();
   await player.locator('.answered-notice').waitFor();
   await host.locator('.host-dock').getByRole('button',{name:/REVELAR RESPOSTA/}).click();
   await screen.locator('.projector-question .answer-row.correct').first().waitFor();
   await player.locator('.correction-panel').waitFor();
   proof.push({round,answered:true,revealed:true});
   console.log('V7_ROUND_OK',round);
   if(round<8){
    await host.locator('.host-dock').getByRole('button',{name:/PULAR \/ PRÓXIMA/}).click();
   }else{
    await host.locator('.host-dock').getByRole('button',{name:/CONCLUIR 8ª RODADA/}).click();
   }
  }
  await screen.locator('.v6-final-board').waitFor();
  await player.locator('.player-final').waitFor();
  await host.locator('.host-finale .v6-final-board').waitFor();
  await screen.setViewportSize({width:1672,height:941});
  await screenshot(screen,'05_podio_final_desktop_1672x941');
  await screenshot(player,'06_player_final_mobile');
  assert.match(await screen.locator('.v6-class-summary').innerText(),/8\/8/);
  assert.ok((await screen.locator('.v6-finish-card img').first().getAttribute('src')).includes('delegado.webp'));
  await host.locator('.host-finale').getByRole('button',{name:/JOGAR NOVAMENTE/}).click();
  await host.locator('.v6-host-lobby').waitFor();
  proof.push({check:'reset-to-lobby',ok:true});
  assert.deepEqual(errors,[],'browser runtime errors');
  const result={pass:true,code,elapsedMs:Date.now()-start,proof,errors,artifacts:fs.readdirSync(OUT).filter(x=>x.endsWith('.png'))};
  fs.writeFileSync(path.join(OUT,'qa-v7-result.json'),JSON.stringify(result,null,2));
  console.log('V7_E2E_PASSED',proof.filter(x=>x.round).length+' rounds',result.artifacts.length+' screenshots');
 }catch(e){
  fs.writeFileSync(path.join(OUT,'qa-v7-error.json'),JSON.stringify({pass:false,error:String(e.stack||e),errors,proof},null,2));
  console.error('V7_E2E_FAILED',e.stack||String(e));
  process.exitCode=1;
 }finally{await browser.close();}
})();

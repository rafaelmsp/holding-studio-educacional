const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const BASE=process.env.TC_V6_QA_BASE||'http://127.0.0.1:8148/react-live/';
const RESULT=path.resolve(__dirname,'../docs/preview/v6/qa-eight-rounds.json');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const phoneContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const host=await ctx.newPage(),player=await phoneContext.newPage(),screen=await ctx.newPage();
 const errors=[],stages=[];for(const [name,page] of [['host',host],['player',player],['screen',screen]]){
  page.on('pageerror',e=>errors.push(name+': '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(name+': '+m.text().slice(0,240));});
  page.on('dialog',d=>d.accept());
 }
 try{
  await host.goto(BASE+'?view=host');await host.locator('.case-tile').first().waitFor();
  await host.locator('.create-room-panel .cinema-button').click();
  await host.locator('.v6-host-lobby').waitFor({timeout:40000});
  const code=(await host.locator('.v6-lobby-hero h1').innerText()).trim();
  console.log('EIGHT_ROUND_ROOM',code);
  await player.goto(BASE+'?view=player&room='+code);await player.locator('#nickname').waitFor({timeout:30000});
  await player.locator('#nickname').fill('QA V6 8 RODADAS');
  await player.getByRole('button',{name:/DELEGADO/i}).first().click();
  await player.getByRole('button',{name:/ENTRAR NA PARTIDA/}).click();
  await player.locator('.player-lobby').waitFor({timeout:35000});
  await screen.setViewportSize({width:1920,height:1080});
  await screen.goto(BASE+'?view=screen&room='+code);
  await screen.locator('.projector-waiting').waitFor({timeout:35000});
  await host.locator('.host-dock').getByRole('button',{name:/INICIAR PARTIDA/}).click();
  for(let round=1;round<=8;round++){
   const roundLabel=String(round).padStart(2,'0');
   await host.locator('.round-bar strong').getByText(new RegExp('RODADA\\s+'+roundLabel+'\\/08')).waitFor({timeout:40000});
   await player.locator('.gameplay').waitFor({timeout:40000});
   await player.locator('.mobile-round-label').getByText(new RegExp('RODADA\\s+'+round+'\\s+DE\\s+8')).waitFor({timeout:40000});
   const question=await player.locator('.player-question h1').innerText();
   const answeredInitially=await player.locator('.answered-notice').count();
   assert.equal(answeredInitially,0,'round must reset answer state '+round);
   await player.locator('.player-question .answer-row').first().click();
   await player.locator('.submit-answer').click();
   await player.locator('.answered-notice').waitFor({timeout:45000});
   await host.locator('.host-dock').getByRole('button',{name:/REVELAR RESPOSTA/}).click();
   await host.locator('.host-question .answer-row.correct').first().waitFor({timeout:40000});
   stages.push({round,question:question.slice(0,80),answered:true,revealed:true});
   console.log('ROUND_OK',round,question.slice(0,48));
   if(round<8){
    await host.locator('.host-dock').getByRole('button',{name:/PULAR \/ PRÓXIMA/}).click();
    await host.locator('.round-bar strong').getByText(new RegExp('RODADA\\s+'+String(round+1).padStart(2,'0'))).waitFor({timeout:40000});
   }else{
    await host.locator('.host-dock').getByRole('button',{name:/CONCLUIR 8ª RODADA/}).click();
   }
  }
  await screen.locator('.v6-final-board').waitFor({timeout:40000});
  assert.ok((await screen.locator('.v6-finish-card img').first().getAttribute('src')).includes('delegado.webp'),'server avatar must appear in podium');
  const finished=await screen.locator('.v6-class-summary').innerText();
  assert.match(finished,/8\/8/,'completed game reports 8 rounds');
  await player.locator('.player-final').waitFor({timeout:40000});
  assert.equal(errors.length,0,errors.join(' ; '));
  const result={pass:true,code,rounds:stages,errors};
  fs.mkdirSync(path.dirname(RESULT),{recursive:true});fs.writeFileSync(RESULT,JSON.stringify(result,null,2));
  console.log('EIGHT_ROUNDS_PASSED',stages.length);
 }catch(e){console.error('EIGHT_ROUNDS_FAILED',e.stack||String(e));process.exitCode=1;}
 finally{await browser.close();}
})();
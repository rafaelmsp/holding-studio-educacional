/* Deterministic UI integration checks. All Supabase data is explicitly mocked. */
const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const out=process.env.TC_QA_OUT||'/tmp/the-crimes-v7-qa';
const base=process.env.TC_QA_BASE||'http://127.0.0.1:8148/live/';
const optionTexts=['Integralizar bens com registro regular.','Transferir patrimônio para frustrar credores.','Organizar a sucessão com transparência.','Declarar receitas e manter documentos.'];
const makeQuestion=(round,revealed)=>({id:'q-'+round,round,text:'Qual conduta caracteriza fraude contra credores na constituição de uma holding familiar?',options:optionTexts.map((text,index)=>({index,text,...(revealed?{kind:index===1?'correct':'gray'}:{})})),...(revealed?{correctIndex:1,explanation:'O caso simulado demonstra o esvaziamento patrimonial e o prejuízo a credores. Compare os fatos e a documentação.'}:{})});
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch(process.env.TC_CHROME?{executablePath:process.env.TC_CHROME,headless:true}:{headless:true});
 const results=[];
 try{
 for(const width of [360,390,412,1672,1920]){
  const ctx=await browser.newContext({viewport:{width,height:width>760?(width===1920?1080:941):844},reducedMotion:'reduce'});
  let state='waiting',round=1,revealed=false,answers=[];
  const players=Array.from({length:5},(_,i)=>({player_id:'p'+i,room_id:'qa',nickname:['Teste Ana','Teste João','Teste Carla','Teste Marcos','Teste Rui'][i],score:4000-i*500,rank:i+1,avatar_id:['perita','advogado','analista','detetive','delegado'][i],connected:true,counters:{correct:Math.max(0,round-1),gray:0,risky:0,criminal:0}}));
  const room=()=>({room_id:'qa',code:'CRIM-1234',case_key:'credores',case_title:'Fraude contra credores',status:state,room_revision:round,round_key:'round-'+round,current_round:round,question:state==='waiting'?null:makeQuestion(round,revealed),question_time_sec:60,deadline_at:new Date(Date.now()+45000).toISOString(),locked:false,revealed,responded:answers.length?1:0,players_total:5,players_connected:5,entry_open:true});
  const privateRoom=()=>({...room(),caseKey:'credores',currentRound:round,roundKey:'round-'+round,correctionPolicy:'host_reveal'});
  const actionCalls=[];
  await ctx.addInitScript(()=>{localStorage.setItem('tc-admin-CRIM-1234','qa-admin');Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.qaCopied=text}}});Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.qaShared=data}})});
  await ctx.route('https://*.supabase.co/**',async route=>{
   const request=route.request(),url=request.url();let data;
   if(url.includes('game_room_public'))data=room();
   else if(url.includes('game_player_public'))data=players;
   else if(url.includes('/functions/v1/')){
    const body=request.postDataJSON();actionCalls.push(body);
    if(body.action==='join')data={ok:true,playerId:'p0',sessionToken:'qa-player'};
    else if(body.action==='playerState')data={ok:true,room:privateRoom(),player:{id:'p0',nickname:'Teste Ana',avatar_id:'perita',score:4000,exposure:10,answers,counters:{correct:round-1}}};
    else if(body.action==='answer'){answers=[{question_id:'q-'+round,round_key:'round-'+round,option_index:body.optionIndex}];data={ok:true};}
    else if(body.action==='adminState')data={ok:true,code:'CRIM-1234',adminToken:'qa-admin',room:{...privateRoom(),maxPlayers:30},players};
    else data={ok:true};
   }else data={};
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
  });
  const page=await ctx.newPage(),errors=[],failedAssets=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400&&/\/assets\/|\/bundles\//.test(response.url()))failedAssets.push(response.url());});
  page.on('dialog',dialog=>dialog.accept());
  const capture=async(name)=>{
   await page.locator('.cinema-shell').waitFor();
   await page.evaluate(()=>Promise.all(Array.from(document.images).map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=resolve;img.onerror=resolve}))));
   const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,broken:Array.from(document.images).filter(img=>!img.naturalWidth).map(img=>img.src)}));
   await page.screenshot({path:path.join(out,width+'-'+name+'.png'),fullPage:true});
   assert.ok(dimensions.scroll<=width+1,`${width} ${name}: horizontal overflow ${dimensions.scroll}`);
   assert.deepEqual(dimensions.broken,[],`${name}: broken images`);
   assert.deepEqual(errors,[],`${name}: runtime errors`);
   assert.deepEqual(failedAssets,[],`${name}: failed assets`);
   results.push({width,name,passed:true});
  };
  await page.goto(base+'?view=host&room=CRIM-1234');await page.locator('.v6-host-lobby').waitFor();await capture('host-lobby');
  await page.getByRole('button',{name:'Ver detalhes do caso selecionado'}).click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Fechar',exact:true}).click();
  if(width<760){
   await page.getByRole('button',{name:'Abrir menu do Host'}).click();await page.getByRole('dialog',{name:'Menu do Host'}).waitFor();
   await page.keyboard.press('Escape');assert.equal(await page.locator('.v7-mobile-nav').count(),0);
   await page.getByRole('button',{name:'COMPARTILHAR SALA'}).click();assert.ok((await page.evaluate(()=>window.qaShared.url)).includes('view=player&room=CRIM-1234'));
  }
  state='running';round=3;await page.reload();await page.locator('.host-question').waitFor();await capture('host-round');
  if(width>=1672){const dock=await page.locator('.host-dock').boundingBox();assert.ok(dock.y+dock.height<=(width===1920?1080:941),'Host actions must fit first viewport');}
  revealed=true;await page.reload();await page.locator('.answer-row.correct').waitFor();await capture('host-reveal');
  state='finished';round=8;await page.reload();await page.locator('.v6-final-board').waitFor();await capture('host-podium');
  assert.equal(await page.locator('.v6-finish-card').count(),3);
  if(width>=1672){state='running';round=3;revealed=false;await page.goto(base+'?view=screen&room=CRIM-1234');await page.locator('.projector-question').waitFor();await capture('screen-round');}
  else{
   state='running';round=1;revealed=false;
   await page.goto(base+'?view=player&room=CRIM-1234');await page.locator('#nickname').fill('Teste Ana');await page.getByRole('button',{name:'Feminino',exact:true}).click();await page.getByRole('button',{name:/Perita/}).first().click();await capture('player-join');
   await page.getByRole('button',{name:'ENTRAR NA PARTIDA',exact:true}).click();await page.locator('.gameplay').waitFor();await capture('player-question');
   assert.equal(await page.locator('.submit-answer').isDisabled(),true);
   await page.locator('.answer-row.interactive').nth(1).click();assert.equal(await page.locator('.answer-row.correct').count(),0);
   await page.getByRole('button',{name:'RESPONDER',exact:true}).click();await page.locator('.answered-notice').waitFor();assert.equal(actionCalls.filter(x=>x.action==='answer').length,1);await capture('player-answered');
   for(round=2;round<=8;round++){answers=[];await page.reload();await page.locator('.gameplay').waitFor();await page.locator('.answer-row.interactive').nth(1).click();await page.getByRole('button',{name:'RESPONDER',exact:true}).click();await page.locator('.answered-notice').waitFor();}
   state='finished';round=8;await page.reload();await page.locator('.player-final').waitFor();await capture('player-final');
   assert.equal(actionCalls.filter(x=>x.action==='answer').length,8);
  }
  await ctx.close();
 }
 }finally{await browser.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));}
 console.log('V7 BROWSER PASS',results.length,'captured states; mobile menu/share, 8 mocked answers, podium, asset and overflow checks.');
})().catch(error=>{console.error(error);process.exit(1)});

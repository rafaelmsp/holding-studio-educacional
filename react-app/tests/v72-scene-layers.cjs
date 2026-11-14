/* V7.2 cinematic scene pack regression: real image URLs, live DOM controls. */
const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=process.env.TC_QA_BASE||'http://127.0.0.1:8148/live/';
const out=process.env.TC_QA_OUT||'/tmp/the-crimes-v72-scenes';
const options=['Integralizar patrimônio com registro regular.','Transferir bens para frustrar credores.','Planejar sucessão com transparência.','Declarar receitas regularmente.'];
const question={id:'q-3',round:3,text:'Qual conduta caracteriza fraude contra credores na constituição de uma holding familiar?',options:options.map((text,index)=>({index,text})),correctIndex:1,explanation:'O esvaziamento patrimonial pode prejudicar os credores.'};
const players=Array.from({length:5},(_,i)=>({player_id:'p'+i,room_id:'qa',nickname:['Ana','Bruno','Carla','Diana','Edu'][i],score:4500-i*600,rank:i+1,avatar_id:['perita','advogado','analista','detetive','delegado'][i],connected:true,counters:{correct:6-i,gray:1,risky:1,criminal:0}}));
const tests=[
 {name:'screen-round',view:'screen',status:'running',width:1920,selector:'.projector-question',art:'telao-rodada'},
 {name:'screen-final',view:'screen',status:'finished',width:1920,selector:'.v6-final-board',art:'telao-final'},
 {name:'player-join',view:'player',status:'waiting',width:390,selector:'.join-player',art:'jogador-mobile'},
 {name:'host-final',view:'host',status:'finished',width:1672,selector:'.v6-final-board',art:'podio-desktop'},
];
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch(process.env.TC_CHROME?{executablePath:process.env.TC_CHROME,headless:true}:{headless:true});
 try{
  for(const t of tests){
   const ctx=await browser.newContext({viewport:{width:t.width,height:t.width>760?1080:844},reducedMotion:'reduce'});
   await ctx.addInitScript(()=>localStorage.setItem('tc-admin-CRIM-1234','qa-admin'));
   const room=()=>({room_id:'qa',code:'CRIM-1234',case_key:'credores',case_title:'Fraude contra credores',status:t.status,room_revision:3,current_round:3,round_key:'round-3',
    question:t.status==='running'?question:null,question_time_sec:60,deadline_at:new Date(Date.now()+45000).toISOString(),locked:false,revealed:false,responded:2,players_total:5,players_connected:5,entry_open:true});
   await ctx.route('https://*.supabase.co/**',async route=>{
    const url=route.request().url();let data={};
    if(url.includes('game_room_public'))data=room();
    else if(url.includes('game_player_public'))data=players;
    else if(url.includes('/functions/v1/')){
     const b=route.request().postDataJSON();
     if(b.action==='adminState')data={ok:true,code:'CRIM-1234',adminToken:'qa-admin',room:{...room(),maxPlayers:30},players};
     else data={ok:true};
    }
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
   });
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'?view='+t.view+'&room=CRIM-1234');
   await page.locator(t.selector).waitFor({timeout:15000});
   await page.waitForTimeout(950); // Allow Framer Motion's finale entrance to settle before visual QA.
   await page.evaluate(()=>Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=resolve;img.onerror=resolve}))));
   const metrics=await page.evaluate(()=>{
    const img=getComputedStyle(document.querySelector('.cinema-background')).backgroundImage;
    const urls=[...img.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1].replaceAll('"','').replaceAll("'",''));
    return {background:img,urls,scroll:document.documentElement.scrollWidth,width:innerWidth,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)};
   });
   assert.ok(metrics.background.includes(t.art),t.name+' missing art in background: '+metrics.background);
   assert.ok(metrics.scroll<=t.width+1,t.name+' horizontal overflow '+metrics.scroll);
   assert.deepEqual(metrics.broken,[],t.name+' broken DOM images');
   assert.deepEqual(errors,[],t.name+' browser exceptions');
   assert.ok(metrics.urls.length,'background URL not parsed');
   const art=await page.request.get(metrics.urls[metrics.urls.length-1]);
   assert.equal(art.status(),200,t.name+' backdrop must load');
   console.log('V72 ART TRACE',t.name,JSON.stringify(metrics.urls),art.status(),art.headers()['content-type']);
   const body=await art.body();
   assert.equal(body.toString('ascii',0,4),'RIFF',t.name+' missing WEBP RIFF signature');
   assert.equal(body.toString('ascii',8,12),'WEBP',t.name+' must return actual WEBP bytes, not HTML');
   if(t.view==='screen'&&t.status==='running')assert.equal(await page.locator('.answer-row').count(),4,'four live options');
   if(t.status==='finished')assert.equal(await page.locator('.v6-finish-card').count(),3,'dynamic 2-1-3 podium');
   if(t.name==='screen-final'){
    const layout=await page.evaluate(()=>{
     const b=s=>document.querySelector(s).getBoundingClientRect();
     return {stageWidth:b('.projector-stage').width,mainWidth:b('.projector-main').width,
      podiumBottom:Math.max(...[...document.querySelectorAll('.v6-finish-card')].map(e=>e.getBoundingClientRect().bottom)),
      summaryTop:b('.v6-class-summary').top};
    });
    assert.ok(layout.stageWidth>=t.width*.88,'projector final must use full available width: '+JSON.stringify(layout));
    assert.ok(layout.podiumBottom<=layout.summaryTop+4,'podium cards should not be covered by summary: '+JSON.stringify(layout));
   }
   await page.screenshot({path:path.join(out,t.name+'.png'),fullPage:true});
   console.log('V72 SCENE PASS',t.name,metrics.urls.at(-1));
   await ctx.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});

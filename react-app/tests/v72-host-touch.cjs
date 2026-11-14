/* V7.2 regression: a phone requesting Desktop Site may report 980 CSS pixels. */
const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const out=process.env.TC_QA_OUT||path.join(process.cwd(),'v72-captures');
const base=process.env.TC_QA_BASE||'http://127.0.0.1:8148/live/';
const room={room_id:'qa',code:'CRIM-1234',case_key:'credores',case_title:'Fraude contra credores',status:'waiting',
 room_revision:1,current_round:1,players_total:0,players_connected:0,responded:0,entry_open:true,revealed:false,locked:false,question:null};
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const launch=process.env.TC_CHROME?{executablePath:process.env.TC_CHROME,headless:true}:{headless:true};
 const browser=await chromium.launch(launch);
 try{
  for(const [width,touch] of [[390,true],[980,true],[1672,false]]){
   const ctx=await browser.newContext({viewport:{width,height:900},hasTouch:touch,isMobile:touch,reducedMotion:'reduce'});
   await ctx.addInitScript(()=>localStorage.setItem('tc-admin-CRIM-1234','qa-admin'));
   await ctx.route('https://*.supabase.co/**',async route=>{
    const url=route.request().url();
    let data={};
    if(url.includes('game_room_public'))data=room;
    else if(url.includes('game_player_public'))data=[];
    else if(url.includes('/functions/v1/'))data={ok:true,code:'CRIM-1234',adminToken:'qa-admin',room:{...room,maxPlayers:30},players:[]};
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
   });
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',err=>errors.push(err.message));
   await page.goto(base+'?view=host&room=CRIM-1234');
   await page.locator('.v6-host-lobby').waitFor({timeout:15000});
   const metrics=await page.evaluate(()=>{
    const rect=selector=>document.querySelector(selector)?.getBoundingClientRect();
    const brand=rect('.game-header .brandmark'),state=rect('.game-header .live-state'),qr=rect('.v6-lobby-qr svg');
    const overlap=brand&&state&&brand.left<state.right&&brand.right>state.left&&brand.top<state.bottom&&brand.bottom>state.top;
    return {scroll:document.documentElement.scrollWidth,width:innerWidth,pointer:matchMedia('(pointer:coarse)').matches,
     nav:document.querySelector('.v7-nav-toggle')?getComputedStyle(document.querySelector('.v7-nav-toggle')).display:'missing',
     sidebar:document.querySelector('.host-sidebar')?getComputedStyle(document.querySelector('.host-sidebar')).display:'missing',
     qrSize:qr?.width,overlap,
     art:document.querySelectorAll('.v72-premium-art img').length,
     badImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)};
   });
   await page.screenshot({path:path.join(out,'host-'+width+(touch?'-touch':'-desktop')+'.png'),fullPage:width!==980});
   assert.equal(metrics.art,2,'two independent premium props');
   assert.ok(metrics.scroll<=metrics.width+1,'no horizontal overflow: '+JSON.stringify(metrics));
   assert.deepEqual(metrics.badImages,[],'no broken images');
   assert.deepEqual(errors,[],'no runtime exceptions');
   if(touch){
    assert.equal(metrics.pointer,true,'touch is coarse pointer');
    assert.equal(metrics.sidebar,'none','sidebar hidden on phone, even Desktop Site');
    assert.notEqual(metrics.nav,'none','drawer toggle visible');
    assert.ok(metrics.qrSize>=140,'QR still readable');
    assert.equal(metrics.overlap,false,'header does not overlap');
   }
   console.log('V7.2 HOST PASS',width,touch?'touch':'desktop',JSON.stringify(metrics));
   await ctx.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});

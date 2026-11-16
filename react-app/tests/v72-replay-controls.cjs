/* V7.2 GM-02 — two real, distinct, authorized podium actions.
 * No database writes: all Supabase endpoints mocked per browser context.
 */
const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
const base=process.env.TC_QA_BASE||'http://127.0.0.1:8148/live/';
const question={id:'q1',round:1,text:'Qual ação caracteriza uma irregularidade patrimonial?',options:[
 {index:0,text:'Conduta A'},{index:1,text:'Conduta B'},{index:2,text:'Conduta C'},{index:3,text:'Conduta D'}],correctIndex:0,explanation:'Caso didático'};
const players=Array.from({length:5},(_,i)=>({player_id:'p'+i,room_id:'test-room',nickname:['Ana','Breno','Carla','Davi','Elisa'][i],score:1500-i*150,rank:i+1,avatar_id:'detetive',connected:true,counters:{correct:4,gray:2,risky:1,criminal:1}}));
const main=async()=>{
 const browser=await chromium.launch(process.env.TC_CHROME?{executablePath:process.env.TC_CHROME,headless:true}:{headless:true});
 try{
  for(const view of ['host','screen']){
   for(const intent of ['replay','lobby']){
    const state={status:'finished',revision:14};
    const mutations=[];
    const room=()=>({room_id:'test-room',code:'CRIM-1234',case_key:'credores',case_title:'Fraude contra credores',status:state.status,room_revision:state.revision,
      current_round:state.status==='finished'?8:1,round_key:'round-1',question:state.status==='running'?question:null,
      players_total:5,players_connected:5,responded:state.status==='finished'?5:0,revealed:state.status==='finished',locked:false,entry_open:true});
    const ctx=await browser.newContext({viewport:{width:1672,height:941},reducedMotion:'reduce'});
    await ctx.addInitScript(()=>localStorage.setItem('tc-admin-CRIM-1234','qa-admin'));
    await ctx.route('https://*.supabase.co/**',async route=>{
     const url=route.request().url();
     let data={ok:true};
     if(url.includes('game_room_public'))data=room();
     else if(url.includes('game_player_public'))data=players;
     else if(url.includes('/functions/v1/')){
      const b=route.request().postDataJSON();
      if(b.action==='adminState')data={ok:true,code:'CRIM-1234',adminToken:'qa-admin',room:{...room(),maxPlayers:30},players};
      else if(b.action==='reset'||b.action==='start'){
       if(b.adminToken!=='qa-admin'||Number(b.expectedRevision)!==state.revision){
        await route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({ok:false,error:'stale',stale:true})});return;
       }
       if(b.action==='reset'){
        assert.equal(state.status,'finished','reset only on finished room');
        state.status='waiting';
       }else{
        assert.equal(state.status,'waiting','start must happen after reset');
        state.status='running';
       }
       mutations.push(b.action);
       state.revision++;
       data={ok:true,room:room()};
      }
     }
     await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
    });
    const page=await ctx.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('dialog',dialog=>dialog.accept());
    await page.goto(base+'?view='+view+'&room=CRIM-1234');
    await page.locator('.v72-gm-finale .v6-final-actions').waitFor({timeout:20000});
    const replay=page.getByRole('button',{name:/jogar novamente/i});
    const lobby=page.getByRole('button',{name:/voltar ao lobby/i});
    assert.equal(await replay.count(),1,view+' must offer actual replay');
    assert.equal(await lobby.count(),1,view+' must offer lobby');
    assert.equal(await replay.isDisabled(),false);
    assert.equal(await lobby.isDisabled(),false);
    if(intent==='replay')await replay.click();
    else await lobby.click();
    await page.waitForFunction(expected=>document.querySelector(expected)!=null,
     intent==='replay'?view==='host'?'.host-question':'.projector-question':
     view==='host'?'.v6-host-lobby':'.projector-waiting',{timeout:18000});
    assert.deepEqual(mutations,intent==='replay'?['reset','start']:['reset'],view+' '+intent+' action order');
    assert.equal(state.status,intent==='replay'?'running':'waiting',view+' '+intent+' expected final room status');
    assert.deepEqual(errors,[],view+' '+intent+' console exceptions');
    console.log('V72 PODIUM ACTION PASS',view,intent,mutations.join(' => '));
    await ctx.close();
   }
  }
 }finally{await browser.close()}
};
main().catch(e=>{console.error(e);process.exit(1)});

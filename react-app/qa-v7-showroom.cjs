const {chromium}=require('playwright-core');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const dir=path.resolve(__dirname,'../docs/preview/v7');fs.mkdirSync(dir,{recursive:true});
 const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const p=await b.newPage({viewport:{width:1672,height:941},reducedMotion:'reduce'});
 try{
  await p.goto((process.env.TC_V7_QA_BASE||'http://127.0.0.1:8148/react-live/')+'?view=showroom');
  await p.getByText('SHOWROOM / DEMONSTRAÇÃO').waitFor();
  await p.getByRole('navigation',{name:'Prévia de interfaces'}).getByRole('button',{name:'Host'}).click();
  await p.locator('.v7-showroom-host').waitFor();
  await p.screenshot({path:path.join(dir,'07_showroom_host.png')});
  await p.getByRole('navigation',{name:'Prévia de interfaces'}).getByRole('button',{name:'Telão'}).click();
  await p.locator('.v7-showroom-question').waitFor();
  await p.getByRole('button',{name:/REVELAR CORREÇÃO/}).click();
  assert.equal(await p.locator('.v7-showroom-question .answer-row.correct').count(),1);
  await p.getByRole('navigation',{name:'Prévia de interfaces'}).getByRole('button',{name:'Jogador'}).click();
  await p.locator('.v7-showroom-phone .answer-row').first().click();
  await p.getByRole('button',{name:/CONFIRMAR RESPOSTA DEMO/}).click();
  assert.equal(await p.locator('.v7-showroom-phone .answer-row.correct').count(),1);
  await p.getByRole('navigation',{name:'Prévia de interfaces'}).getByRole('button',{name:'Pódio'}).click();
  await p.locator('.v7-showroom-podium .v6-final-board').waitFor();
  await p.screenshot({path:path.join(dir,'08_showroom_podium.png')});
  const box=await p.locator('.v7-showroom-podium').boundingBox();
  assert.ok(box.width>1200,'showroom podium must be wide');
  await p.setViewportSize({width:390,height:844});
  await p.getByRole('navigation',{name:'Prévia de interfaces'}).getByRole('button',{name:'Host'}).click();
  const scroll=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(scroll.scroll<=scroll.width+2,'mobile showroom overflows');
  console.log('V7_SHOWROOM_PASS: 4 previews, live selection/reveal, responsive and podium');
 }catch(e){console.error(e.stack||e);process.exitCode=1;}finally{await b.close();}
})();

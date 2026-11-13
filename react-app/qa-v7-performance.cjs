/* Local-only lab metrics; not a guarantee of field speed, 60 FPS or CDN conditions. */
const {chromium}=require('playwright-core');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const BASE=process.env.TC_V7_QA_BASE||'http://127.0.0.1:8148/react-live/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const result={environment:'Headless Chrome, local Python HTTP static server; screenshots and metrics are lab estimates only',tested:[],errors:[]};
 for(const [viewport,view] of [[{width:360,height:800},'host'],[{width:360,height:800},'player'],[{width:390,height:844},'showroom'],[{width:1672,height:941},'host'],[{width:1672,height:941},'showroom'],[{width:1920,height:1080},'screen']]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce',serviceWorkers:'block'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.__v7LongTasks=[];
   try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__v7LongTasks.push(Number(e.duration.toFixed(1)));}).observe({type:'longtask',buffered:true})}catch{}
  });
  const wall=Date.now();
  await page.goto(BASE+'?view='+view,{waitUntil:'networkidle'});
  if(view==='showroom')await page.locator('.v7-showroom-host').waitFor();
  if(view==='host')await page.locator('.setup-view').waitFor();
  if(view==='player')await page.locator('.player-no-room').waitFor();
  if(view==='screen')await page.locator('.projector-no-room').waitFor();
  await page.evaluate(async()=>{await Promise.all([...document.images].map(x=>x.decode().catch(()=>null)))});
  const metrics=await page.evaluate(()=>{
   const nav=performance.getEntriesByType('navigation')[0];
   const resource=performance.getEntriesByType('resource');
   const scripts=resource.filter(x=>x.name.includes('/bundles/')&&x.name.endsWith('.js'));
   const images=resource.filter(x=>/\.(webp|png|svg)(?:\?|$)/.test(x.name));
   return {
    navigationDomContentLoadedMs:Math.round(nav.domContentLoadedEventEnd),
    navigationLoadMs:Math.round(nav.loadEventEnd),
    jsRequests:scripts.length,jsTransferredKB:Math.round(scripts.reduce((n,x)=>n+x.transferSize,0)/1024),
    imageRequests:images.length,imageTransferredKB:Math.round(images.reduce((n,x)=>n+x.transferSize,0)/1024),
    totalResourceRequests:resource.length,longTaskCount:(window.__v7LongTasks||[]).length,
    longTaskTotalMs:Math.round((window.__v7LongTasks||[]).reduce((a,b)=>a+b,0)),
    brokenImages:[...document.images].filter(x=>x.naturalWidth===0).length,
    overflow:document.documentElement.scrollWidth>innerWidth+2
   };
  });
  const row={view,viewport,wallMs:Date.now()-wall,...metrics};
  result.tested.push(row);
  if(errors.length||metrics.brokenImages||metrics.overflow)result.errors.push({view,viewport,errors,...metrics});
  await context.close();
 }
 await browser.close();
 const filename=path.resolve(__dirname,'../docs/preview/v7/performance-local.json');
 fs.mkdirSync(path.dirname(filename),{recursive:true});
 fs.writeFileSync(filename,JSON.stringify(result,null,2));
 assert.equal(result.errors.length,0,JSON.stringify(result.errors));
 console.log('V7_LOCAL_PERFORMANCE_AUDIT',result.tested.length,'routes without broken images, overflow or runtime exceptions');
 console.log(result.tested.map(x=>x.view+'@'+x.viewport.width+': '+x.navigationDomContentLoadedMs+' ms DCL, '+x.jsTransferredKB+' KiB JS').join('\n'));
})();

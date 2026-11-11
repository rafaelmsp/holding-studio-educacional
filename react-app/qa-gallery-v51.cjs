const {chromium}=require('playwright-core');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']});
  const report={};
  try{
   for(const width of [1440,390]){
    const page=await browser.newPage({viewport:{width,height:width===1440?900:844}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const response=await page.goto((process.env.TC_GALLERY_URL||'http://127.0.0.1:8126/react-live/showroom.html'),{waitUntil:'domcontentloaded',timeout:25000});
    const tabs=await page.locator('.tab').count(),loaded=[];
    for(const tab of ['host','telao','jogador','entrada','casos','mobile-final','resultado']){
     await page.locator('.tab[data-screen="'+tab+'"]').click();
     await page.waitForFunction(()=>document.getElementById('shot')?.complete&&document.getElementById('shot')?.naturalWidth>0);
     loaded.push(tab);
    }
    await page.locator('.tab[data-screen="host"]').click();
    await page.screenshot({path:'C:/Temp/react-v51-gallery-'+width+'.png',fullPage:true});
    const state=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,backgrounds:document.querySelectorAll('.scenes img').length,buttons:document.querySelectorAll('.tab').length}));
    report[width]={status:response.status(),tabs,loaded,...state,errors};
    await page.close();
   }
   report.ok=Object.values(report).every(v=>typeof v==='object'&&v.status===200&&v.scrollWidth<=v.width&&v.loaded.length===7&&v.errors.length===0);
   console.log('GALLERY_V51',JSON.stringify(report));
  }finally{await browser.close();}
})().catch(e=>{console.error('GALLERY_V51_ERROR',e.message);process.exitCode=1});

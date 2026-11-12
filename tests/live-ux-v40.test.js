const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const app=read('legacy-live/app.js'),css=read('legacy-live/ux-v40.css'),page=read('legacy-live/index.html');
const references=[
 ['uxHostTop','Host room and status'],['uxHostPrimary','Host priority actions'],['uxHostTools','Secondary tools'],
 ['uxHostRank','Live Top 5'],['uxHostSteps','Eight-round progress'],
 ['uxScreenSceneName','Projector case caption'],['ux-player-joining','Desktop join layout'],
 ['uxImageClock','Mobile overlay clock'],['screenClockBottom','Projector bottom timer']
];
for(const [selector,label] of references)assert.ok(app.includes(selector),label);
for(const selector of ['.uxHostPrimary','.uxHostRankRow','.uxHostSteps','.stageCopy','.uxImageClock','.uxJoinLayout','.v3SubmitAnswer']){
 assert.ok(css.includes(selector),selector+' must be styled');
}
assert.ok(page.includes('ux-v40.css'), 'new CSS included');
assert.match(page,/app\.js\?v=20261111-v(?:4|41|42)-prod-\d+/, 'versioned JS to avoid stale cache');
assert.equal((page.match(/ux-v40\.css/g)||[]).length,1);
assert.ok(css.includes('position:relative;bottom:auto'), 'CTA must not obscure answer options');
assert.ok(app.includes("playersDetail.appendChild(document.getElementById('metrics'))"),'Detailed metrics remain available');
assert.ok(app.includes("controls.querySelector('#'+id)"),'Host buttons moved without detaching from selector scope');
for(const file of ['assets/the-crimes-v3/ui/detective-mark.svg','assets/the-crimes-v3/global/investigation-keyart.webp']){
 assert.ok(fs.statSync(file).size>100,'missing visual asset '+file);
}
console.log('THE CRIMES LIVE V4.0: UI contract, asset and regression guards passed.');

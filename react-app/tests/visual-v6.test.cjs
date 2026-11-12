const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const base=path.join(root,'assets/the-crimes-v6');
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const requireFile=(section,name,min=1000)=>{
 const file=path.join(base,section,name);
 assert.ok(fs.existsSync(file),'V6 asset missing: '+file);
 assert.ok(fs.statSync(file).size>=min,'V6 asset seems blank: '+file);
};
for(const n of ['host-control','case-select','lobby-qr','projector','podium'])requireFile('backgrounds',n+'.webp',20000);
for(const n of ['gold','cyan','red','mint','steel']){
 for(const state of ['default','hover','pressed'])requireFile('buttons',n+'-'+state+'.webp',1000);
 requireFile('frames',n==='mint'?'gold.svg':n==='steel'?'silver.svg':n+'.svg',300);
}
for(const n of ['detetive','advogado','delegado','estrategista','perita','advogada','investigadora','analista','especialista','auditor','arquivista','mediador']){
 requireFile('portraits',n+'.webp',4000);
}
requireFile('decor','lady-justice-bronze.webp',4000);
requireFile('.','manifest.json',500);
const catalog=read('react-app/src/services/catalog.ts');
const player=read('react-app/src/features/Player.tsx');
const host=read('react-app/src/features/Host.tsx');
const screen=read('react-app/src/features/Screen.tsx');
const podium=read('react-app/src/components/PodiumBoard.tsx');
const chrome=read('react-app/src/components/Chrome.tsx');
const css=read('react-app/src/styles/v6.css');
const main=read('react-app/src/main.tsx');
assert.ok(main.includes("styles/v6.css"),'V6 CSS must be imported');
assert.ok(player.includes('avatarId:persona'),'selected character must persist on join');
assert.ok(catalog.includes('characterPortrait'),'cinematic cutouts must be mapped');
assert.ok(chrome.includes('p.avatar_id||avatars'),'ranking must use persisted avatar');
assert.ok(podium.includes('[1,0,2]'),'podium must have silver/gold/bronze composition');
assert.ok(podium.includes('player.avatar_id||avatars'),'podium must use server avatar');
const metrics=read('react-app/src/services/score.ts');
assert.ok(podium.includes('answeredAttempts(p.counters)')&&metrics.includes("['correct','gray','risky','criminal']"),'do not count unanswered as answered');
assert.ok(screen.includes('PodiumBoard'),'screen must mount cinematic podium');
assert.ok(host.includes('v6-host-lobby'),'host must have dedicated waiting room');
for(const key of ['v6-final-board','v6-host-lobby','v6-finish-card','v6-lobby-qr','player-question','@media(max-width:650px)'])assert.ok(css.includes(key),'CSS missing '+key);
for(const name of ['gold','cyan','red','mint','steel'])assert.ok(css.includes('buttons/'+name+'-default.webp'),'CSS does not use premium button '+name);
assert.ok(!podium.includes('4.920'),'no fabricated score in final ranking');
assert.ok(host.includes('confirm('),'destructive host commands must remain confirmed');
console.log('V6 CONTRACT PASSED: 5 backgrounds / 15 button states / 12 busts / 5 vector frames / 1 justice prop / responsive gameplay / real avatar and metrics.');

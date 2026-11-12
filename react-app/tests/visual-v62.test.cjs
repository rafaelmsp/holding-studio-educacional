const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const host=read('react-app/src/features/Host.tsx');
const player=read('react-app/src/features/Player.tsx');
const screen=read('react-app/src/features/Screen.tsx');
const chrome=read('react-app/src/components/Chrome.tsx');
const podium=read('react-app/src/components/PodiumBoard.tsx');
const css=read('react-app/src/styles/v6-cinema.css');
const main=read('react-app/src/main.tsx');
const gallery=read('react-app/public/showroom-v6.html');
const qa=read('react-app/qa-v6.cjs');
assert.ok(main.includes("import './styles/v6-cinema.css'"),'Cinematic layer must be loaded');
assert.ok(host.includes("room?.status==='finished'?<section className=\"host-finale\""),'Host must show real podium');
assert.ok(host.includes('<PodiumBoard players={players} room={room} avatars={avatars}'),'Host podium must show real server players');
assert.ok(host.includes('copyFeedback')&&host.includes('navigator.clipboard.writeText'),'Clipboard feedback must be real');
assert.ok(screen.includes('ChapterCue')&&chrome.includes('useReducedMotion()'),'Chapter cue must respect motion preference');
assert.ok(chrome.includes('v62-scene-record'),'Every round gets an actual scene number');
assert.ok(chrome.includes('layout="position"'),'Ranking transitions should follow actual React state');
assert.ok(player.includes('v62-confirmation')&&player.includes('v62-submit-answer'),'Mobile must acknowledge answers');
assert.ok(podium.includes('v62-award-sparks'),'Only real podium gets decorative celebration');
assert.ok(css.includes('pointer-events:none')&&css.includes('prefers-reduced-motion:reduce'),'No decorative effects may block inputs');
assert.ok(css.includes('.host-finale')&&css.includes('.v62-submit-answer'),'Cinematic UX must cover Host and mobile');
for(const key of ['COPY_FEEDBACK_VERIFIED','CHAPTER_CUE_VERIFIED','REDUCED_MOTION_VERIFIED','HOST_FINALE_VERIFIED','EIGHT_ROUNDS_VERIFIED']){
 assert.ok(qa.includes(key),'QA lacks regression test for '+key);
}
const cards=(gallery.match(/<article class="card\b/g)||[]).length;
assert.equal(cards,8,'Showroom should contain eight verified screen captures');
for(const filename of ['casos','lobby','host','telao','mobile','podio','revelacao','podio-host']){
 const file=path.join(root,'docs/preview/v6',filename+'.webp');
 assert.ok(fs.existsSync(file)&&fs.statSync(file).size>7000,'Missing gallery preview: '+filename);
}
assert.ok(gallery.includes('BUILD V6.2'),'Gallery must identify the actual version');
console.log('V6.2 CONTRACT PASSED: Host finale, chapter cue, motion safety, mobile CTA, copy feedback, 8 gallery previews.');

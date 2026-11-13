const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'../..');
const APP=path.resolve(ROOT,'react-app');
const m=JSON.parse(fs.readFileSync(path.join(ROOT,'assets/the-crimes-v7/manifest.json'),'utf8'));
const assets=JSON.parse(fs.readFileSync(path.join(APP,'src/assets.json'),'utf8'));
const read=p=>fs.readFileSync(path.join(APP,p),'utf8');
test('10 clean V7 backgrounds and manifest dimension records',()=>{
 assert.equal(Object.keys(m.backgrounds).length,10);
 for(const [name,b] of Object.entries(m.backgrounds)){
  assert.ok(fs.existsSync(path.join(ROOT,b.path)),name+' missing');
  assert.ok(b.width>=800&&b.height>=1000||b.width>=1700,name+' dimension invalid');
  assert.ok(b.bytes>1000,name+' file too small');
  assert.ok(!/screenshot/i.test(b.path),'never crop screenshots into assets');
 }
});
test('12 persistent portraits and avatars with names stable across platforms',()=>{
 assert.equal(m.characters.portraits.length,12);
 assert.equal(m.characters.avatars.length,12);
 for(const f of m.characters.portraits)assert.ok(fs.existsSync(path.join(ROOT,'assets/the-crimes-v7/characters/portraits',f)));
 for(const f of m.characters.avatars)assert.ok(fs.existsSync(path.join(ROOT,'assets/the-crimes-v7/characters/avatars',f)));
 assert.deepEqual(m.characters.portraits,m.characters.avatars);
});
test('six scenarios have eight separate scene images, not an identical case image',()=>{
 assert.equal(Object.keys(assets.cases).length,6);
 const all=new Set();
 for(const [key,entry] of Object.entries(assets.cases)){
  assert.equal(Object.values(entry.scenes).length,8,key+' has wrong number of scenes');
  for(const rel of Object.values(entry.scenes)){
   const full=path.resolve(APP,rel);
   assert.ok(fs.existsSync(full),key+' '+rel+' missing');
   all.add(rel);
  }
 }
 assert.equal(all.size,48);
});
test('React V7 has independent views, real QR, drawer, scene and responsive rules',()=>{
 const host=read('src/features/Host.tsx'),player=read('src/features/Player.tsx'),screen=read('src/features/Screen.tsx');
 const app=read('src/App.tsx'),v7=read('src/styles/v7.css');
 assert.match(app,/view==='host'|return <Host\/>/);
 assert.match(app,/view==='player'/);
 assert.match(app,/view==='screen'/);
 assert.match(host,/<ShareRoom/);
 assert.match(host,/<MobileHostNav/);
 assert.match(host,/adminStorage\(urlCode\)/);
 assert.match(host,/QRCodeSVG value=\{playerUrl\(code\)\}/);
 assert.match(player,/getSession\(code\)/);
 assert.match(player,/useRoomRealtime\(code,'player',session\)/);
 assert.match(screen,/screenToken\&\&room\?\.status/);
 assert.match(v7,/@media\(max-width:850px\)/);
 assert.match(v7,/\.host-sidebar\{display:none!important\}/);
 assert.match(v7,/position:fixed;left:max\(8px,env\(safe-area-inset-left\)\)/);
 assert.match(v7,/@media\(prefers-reduced-motion:reduce\)/);
});
test('production art uses no screenshots with fake UI or static QR payloads',()=>{
 const mtext=JSON.stringify(m);
 assert.ok(!mtext.includes('00:00'));
 assert.ok(!mtext.includes('sala: CRIM-'));
 assert.ok(m.buttons.length>=15);
 assert.ok(m.frames.length>=5);
});

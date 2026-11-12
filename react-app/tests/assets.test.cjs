const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..','..');
const source=path.resolve(__dirname,'..');
const txt=f=>fs.readFileSync(f,'utf8');
const screen=['host-world','screen-frame','join-noir','final-stage'];
const buttons=['red','gold','cyan','mint','steel'];
const panels=['question','ranking','card'];
for(const name of screen){
 const file=path.join(root,'assets','the-crimes-v5','backgrounds',name+'.webp');
 assert.ok(fs.existsSync(file),file);
 assert.ok(fs.statSync(file).size>20000,'The cinematic background must contain real visual data: '+file);
}
for(const name of buttons){
 const file=path.join(root,'assets','the-crimes-v5','ui','button-'+name+'.webp');
 assert.ok(fs.existsSync(file),'Missing image-backed button '+name);
 assert.ok(fs.statSync(file).size>1500,'Blank button texture '+name);
}
for(const name of panels){
 const file=path.join(root,'assets','the-crimes-v5','ui','panel-'+name+'.webp');
 assert.ok(fs.existsSync(file),'Missing image-backed panel '+name);
}
const css=txt(path.join(source,'src/styles/cinematic.css'));
const catalog=txt(path.join(source,'src/services/catalog.ts'));
for(const name of buttons)assert.ok(css.includes('button-'+name+'.webp'),'CSS does not load '+name);
for(const name of panels)assert.ok(css.includes('panel-'+name+'.webp'),'CSS does not load panel '+name);
for(const name of ['host-control','projector','lobby-qr','podium'])assert.ok(catalog.includes(name+'.webp'),'React V6 must use cinematic background '+name);
for(const name of ['detetive','advogado','delegado','estrategista','perita','advogada','investigadora','analista','especialista','auditor','arquivista','mediador']){
 const file=path.join(root,'assets','the-crimes-v3','avatars',name+'.webp');
 assert.ok(fs.existsSync(file),'Missing existing avatar '+name);
}
const manifest=JSON.parse(txt(path.join(source,'src/assets.json')));
assert.equal(Object.keys(manifest.cases).length,6,'Six case types must be retained');
for(const [key,item] of Object.entries(manifest.cases)){
 assert.equal(Object.keys(item.scenes||{}).length,8,'Each of six cases must have eight scenes: '+key);
 for(const rel of Object.values(item.scenes||{}))assert.ok(fs.existsSync(path.resolve(root,'react-live',rel)),'Scene file missing: '+rel);
}
const build=path.join(root,'react-live');
assert.ok(fs.existsSync(path.join(build,'index.html')),'Vite dist missing');
const html=txt(path.join(build,'index.html'));
assert.match(html,/bundles\/index-[^"]+\.js/);
assert.match(html,/bundles\/index-[^"]+\.css/);
assert.ok(txt(path.join(source,'src/features/Screen.tsx')).includes('screenToken'),'Projector must not have public host actions');
assert.ok(txt(path.join(source,'src/features/Player.tsx')).includes('sessionToken'),'Player must preserve session auth');
console.log('V6 and legacy V5 cinematic assets / 12 avatars / six cases x eight scenes / production build OK');

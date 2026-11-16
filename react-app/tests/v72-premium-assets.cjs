/* THE CRIMES LIVE V7.2 PREMIUM — generated image provenance & build integrity.
 * Run from repo root: node react-app/tests/v72-premium-assets.cjs
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const get=(f)=>fs.readFileSync(path.join(root,f));
const manifest=JSON.parse(get('assets/the-crimes-v72/manifest.json').toString('utf8'));
const newArts=manifest.premium_v72_master?.assets;
assert.ok(newArts&&typeof newArts==='object','Premium Master manifest must exist');
const expected=['lobby-premium.webp','host-live-premium.webp','player-premium.webp',
 'projector-premium.webp','podium-premium.webp','podium-cinematic-generated.webp','podium-spotlights.png'];
assert.deepEqual(Object.keys(newArts).sort(),expected.sort(),'all six Premium WebP photos including original podium plus spotlight PNG');
const assetsDir='assets/the-crimes-v72/premium/';
for(const [name,metadata] of Object.entries(newArts)){
 assert.equal(metadata.dynamic_content,'none',name+' cannot encode QR, stats or legal questions');
 const data=get(assetsDir+name);
 const signature=data.toString('ascii',0,4);
 if(name.endsWith('.webp')){
  assert.equal(signature,'RIFF',name+' must be real WebP');
  assert.equal(data.toString('ascii',8,12),'WEBP',name+' must be real WebP');
 }else{
  assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a',name+' must be real PNG');
 }
 assert.ok(data.length>2000&&data.length<800000,name+' invalid size or too costly to render');
 assert.equal(crypto.createHash('sha256').update(data).digest('hex'),metadata.sha256,name+' is not reproducible');
 for(const src of metadata.source_files||[])assert.ok(fs.existsSync(path.join(root,src)),name+' source missing '+src);
 console.log('V72 MASTER ART PASS',name,(data.length/1024).toFixed(1)+' KiB');
}
const css=get('react-app/src/styles/v72-master.css').toString('utf8');
for(const name of expected.filter(x=>x!=='podium-premium.webp'))assert.ok(css.includes(name),'Premium CSS is not using '+name);
assert.ok(!css.includes("url('../../../assets/the-crimes-v72/premium/podium-premium.webp')"),'Old podium art must not remain active in final background');
const main=get('react-app/src/main.tsx').toString('utf8');
assert.ok(main.includes("import './styles/v72-master.css'"),'master CSS not loaded after V7.2');
assert.ok(main.lastIndexOf('v72-master.css')>main.lastIndexOf('v72-premium.css'),
 'master CSS must override V7.2 legacy selectors');
const original=JSON.parse(get('react-app/src/assets.json').toString('utf8'));
assert.equal(Object.keys(original.cases).length,6,'six legal cases must be preserved');
for(const [key,value] of Object.entries(original.cases)){
 assert.equal(Object.keys(value.scenes).length,8,key+' must still have eight scenes');
}
const catalog=get('react-app/src/services/catalog.ts').toString('utf8');
const ids=['detetive','advogado','delegado','estrategista','perita','advogada','investigadora','analista','especialista','auditor','arquivista','mediador'];
for(const id of ids)assert.ok(catalog.includes("id:'"+id+"'"),id+' persona id missing');
console.log('V72 MASTER ACCEPTED: 6 Premium WebP, 1 transparent spotlight PNG, 48 legal scenes, 12 personas, CSS hierarchy');

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const get=p=>fs.readFileSync(p,'utf8');
const html=get('live/index.html');
const manifest=get('live/v3-assets.js');
const app=get('live/app.js');
const css=get('live/ux-v42.css');
const gallery=get('live/showroom.html');
assert.ok(html.includes('v3-assets.js?v=20261111-9'),'versioned case scene map');
assert.ok(html.includes('app.js?v=20261111-v42-prod-1'),'versioned app');
assert.ok(html.includes('ux-v42.css?v=20261111-1'),'style loaded');
assert.ok(manifest.includes('"version": "4.2.0"'));
for(let i=1;i<=8;i++){
 const file='assets/the-crimes-v3/scenes/credores-v42/'+String(i).padStart(2,'0')+'-scene.webp';
 assert.ok(fs.statSync(file).size>40000,file+' exists and is substantial');
 assert.ok(manifest.includes('../'+file),file+' mapped to runtime');
 assert.ok(gallery.includes('../'+file),file+' available in gallery');
}
assert.ok(app.includes('uxRankPlaceholder'),'clearly unoccupied slots on projector');
assert.ok(app.includes('uxRankGhost'),'clearly unoccupied slots on Host');
assert.ok(app.includes('uxHostGalleryLink'),'real link to project gallery');
assert.ok(css.includes('uxRankPlaceholder'),'projector placeholder styling');
assert.ok(css.includes('uxRankGhost'),'host placeholder styling');
assert.ok(!app.includes('class="rankFake"'),'fake player presentation prohibited');
assert.ok(gallery.includes('V4.2'),'gallery label matches version');
console.log('THE CRIMES LIVE V4.2 — assets, versioned JS, rank placeholders and navigation OK');

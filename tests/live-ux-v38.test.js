const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const js=fs.readFileSync('live/ux-personas.js','utf8');
const window={};
vm.runInNewContext(js,{window,encodeURIComponent}, {timeout:1500});
const {profiles,avatar,find}=window.TC_PERSONAS;
assert.equal(profiles.length,12);
assert.deepEqual(Array.from(new Set(profiles.map(x=>x.gender))).sort(),['feminino','masculino','neutro']);
for(const gender of ['masculino','feminino','neutro']) assert.equal(profiles.filter(x=>x.gender===gender).length,4);
for(const p of profiles) {
 assert.ok(p.id&&p.name&&p.role&&p.style&&p.description);
 assert.ok(avatar(p.id).endsWith('/'+p.id+'.webp'));
 assert.ok(fs.existsSync('assets/the-crimes-v3/avatars/'+p.id+'.webp'));
 assert.ok(fs.statSync('assets/the-crimes-v3/avatars/'+p.id+'.webp').size>4000);
}
assert.equal(find('perita').name,'Perita');
assert.equal(find('__unknown').id,profiles[0].id);
console.log('UX V3.8: catálogo, gêneros e avatares OK');

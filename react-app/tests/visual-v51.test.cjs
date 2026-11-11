const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const gallery=read('react-app/public/showroom.html');
const realtime=read('react-app/src/services/realtime.ts');
const index=read('react-app/index.html');
for(const key of ['host','telao','jogador','entrada','casos','mobile-final','resultado']){
 assert.ok(gallery.includes('data-screen="'+key+'"'),'missing screen '+key);
}
for(const name of ['host','telao','celular','entrada','selecao-casos','resultado','celular-resultado']){
 assert.ok(gallery.includes(name+'.webp'),name+' screenshot absent');
 const snap=path.join(root,'docs/preview/v5',name+'.webp');
 assert.ok(fs.statSync(snap).size>25000,'bad screenshot '+snap);
}
for(const name of ['host-world','screen-frame','join-noir','final-stage']){
 assert.ok(gallery.includes('../assets/the-crimes-v5/backgrounds/'+name+'.webp'),name+' not in gallery');
 const asset=path.join(root,'assets/the-crimes-v5/backgrounds',name+'.webp');
 assert.ok(fs.statSync(asset).size>100000,'missing art '+name);
}
for(const name of ['panel-card','panel-ranking','panel-question','button-gold','button-red','button-cyan','button-steel','button-mint']){
 assert.ok(fs.statSync(path.join(root,'assets/the-crimes-v5/ui',name+'.webp')).size>1500,name+' missing');
}
assert.ok(gallery.includes('THE CRIMES LIVE React'));
assert.ok(gallery.includes('../docs/preview/v5/'));
assert.ok(gallery.includes('href="./?view=host"'));
assert.ok(index.includes('THE CRIMES LIVE'));
assert.ok(realtime.includes("const channel=supabase.channel('react-sync-'+code)"),'Reatime receiver mismatch');
assert.ok(realtime.includes("const c=supabase.channel('react-sync-'+code)"),'Reatime broadcaster mismatch');
assert.ok(realtime.includes('debounceTimer'),'Realtime burst coalescing missing');
assert.ok(realtime.includes("role==='player'?6500:6200"),'aggressive polling restored');
console.log('V5.1 CONTRACT: 7 screenshot tabs, 4 art backgrounds, 8 UI sprites, synced broadcast topic OK.');

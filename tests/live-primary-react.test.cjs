const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=name=>fs.readFileSync(name,'utf8');
const main=read('live/index.html'),dist=read('react-live/index.html'),legacy=read('legacy-live/index.html');
assert.equal(main,dist,'The primary route must be the compiled React build');
assert.ok(main.includes('id="root"')&&main.includes('./bundles/'),'React DOM mount and Vite bundles required');
assert.ok(!main.includes('ux-v42.css')&&!main.includes('id="setup"'),'Old HTML setup must not be mixed into React Host');
assert.ok(legacy.includes('ux-v42.css')&&fs.statSync('legacy-live/app.js').size>50000,'HTML backup must be intact');
assert.ok(read('react-app/src/features/Host.tsx').includes('!code||!token?'),'Host must hide live dashboard before room creation');
assert.ok(fs.existsSync('live/showroom.html'),'React gallery missing');
for(const match of main.matchAll(/(?:src|href)="\.\/(bundles\/[^"]+)"/g)){
 assert.ok(fs.existsSync(path.join('live',match[1])),'Missing bundle '+match[1]);
}
for(const file of ['host-world.webp','screen-frame.webp','join-noir.webp','final-stage.webp']){
 assert.ok(fs.statSync('assets/the-crimes-v5/backgrounds/'+file).size>30000,file+' missing');
}
assert.ok(read('react-app/package.json').includes('publish-primary.mjs'),'Future builds must target /live/');
console.log('Primary /live/ React route and legacy backup: OK');

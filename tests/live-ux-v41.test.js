const assert=require('node:assert/strict');
const fs=require('node:fs');
const p=s=>fs.readFileSync(s,'utf8');
const assets=p('legacy-live/v3-assets.js'),app=p('legacy-live/app.js'),html=p('legacy-live/index.html'),css=p('legacy-live/ux-v41.css');
assert.ok(html.includes('ux-v41.css'), 'new cinema stylesheet must be loaded');
assert.ok(/v(?:41|42)-prod-1/.test(html), 'new app cache must be busted');
assert.ok(assets.includes('"version": "4.2.0"'));
for(let n=1;n<=8;n++){
 const path='assets/the-crimes-v3/scenes/credores-v42/'+String(n).padStart(2,'0')+'-scene.webp';
 assert.ok(fs.existsSync(path),path);
 assert.ok(fs.statSync(path).size>50000,'source is empty/suspicious '+path);
 assert.ok(assets.includes('../'+path),'manifest missing '+path);
}
assert.ok(assets.includes('../assets/the-crimes/scenes/meacao/01_contexto.webp'),'Other cases unchanged');
assert.ok(app.includes('screenCinemaBtn'),'Projector fullscreen control missing');
assert.ok(app.includes('requestFullscreen()'),'Fullscreen must be real, not fake UI');
assert.ok(app.includes('document.exitFullscreen()'),'Fullscreen exit missing');
assert.ok(css.includes('prefers-reduced-motion:reduce'),'Reduced motion opt-out');
assert.ok(css.includes('lady-justice.svg'),'Decorative statue missing');
assert.ok(app.includes('coverEl.style.setProperty'),'Case cover must remain dynamic');
assert.ok(fs.statSync('assets/the-crimes-v3/ui/lady-justice.svg').size>1000);
const showroom=p('legacy-live/showroom.html');
for(const tab of ['host','telao','jogador','entrada','resultado'])assert.ok(showroom.includes('data-screen="'+tab+'"'), 'missing showroom tab '+tab);
for(const file of ['host.webp','telao.webp','jogador.webp','entrada.webp','resultado.webp'])assert.ok(fs.statSync('docs/preview/v41/'+file).size>15000,'missing screenshot '+file);
assert.ok(showroom.includes('showroom')===false || showroom.includes('THE CRIMES'), 'showroom branding');
console.log('THE CRIMES LIVE V4.1 — artistic assets + projector fullscreen guards OK');

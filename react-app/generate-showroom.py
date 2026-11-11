from pathlib import Path
import re
root=Path(r'C:\Temp\the-crimes-ux-model')
src=root/'live/showroom.html'
s=src.read_text(encoding='utf-8')
s=s.replace('V4.2','V5.1')
s=s.replace('V4.1','V5.1')
s=s.replace('v42/','v5/')
s=s.replace('THE_CRIMES_V41_CINEMATIC_ART.md','THE_CRIMES_V5_REACT.md')
s=s.replace('jogador.webp','celular.webp')
# Keep cinematic case scenes from V4.2: only the preview references above change to v5.
s=s.replace('scenes/credores-v5/','scenes/credores-v42/')
s=s.replace('Explore as cinco telas reais','Explore as sete telas reais')
s=s.replace('As capturas são testes do frontend funcional','As capturas são testes do frontend React funcional')
s=s.replace('THE CRIMES LIVE — Showcase cinematográfico V5.1','THE CRIMES LIVE React — Showcase cinematográfico V5.1')
# host brand and CTA still link to React because this file lives at /react-live/showroom.html
s=s.replace('<button class="tab" type="button" data-screen="resultado"', '<button class="tab" type="button" data-screen="casos" aria-pressed="false"><span class="tabIcon">▤</span><span><b>Seleção de casos</b><small>6 cenários jurídicos ilustrados</small></span></button>\n   <button class="tab" type="button" data-screen="mobile-final" aria-pressed="false"><span class="tabIcon">★</span><span><b>Resultado no celular</b><small>Pontuação e situação final</small></span></button>\n   <button class="tab" type="button" data-screen="resultado"')
pos="  {key:'resultado',name:"
assert s.count(pos)==1
s=s.replace(pos,
"  {key:'casos',name:'Seleção de casos',file:'selecao-casos.webp',meta:'1440 × 900 · Tela do Host',description:'Seis investigações e escolha do cenário com ilustrações cinematográficas.'},\n"+
"  {key:'mobile-final',name:'Resultado no celular',file:'celular-resultado.webp',meta:'390 × 844 · Smartphone',description:'Pontuação, exposição, situação e resultado individual.',phone:true},\n"+pos)
# Ensure new art pack can be explored without fake controls
needle=' </section>\n</main>\n<footer class="wrap footerline">'
assert needle in s
art=''' </section>
 <section class="sceneGallery" aria-label="Assets gráficos cinematográficos React V5.1">
  <h2>Peças visuais da interface React</h2>
  <p>Quatro fundos WebP reais, importados por Host, telão, entrada e encerramento. Os botões, perguntas e pontuação são componentes React renderizados sobre essas imagens.</p>
  <div class="scenes">
   <a href="../assets/the-crimes-v5/backgrounds/host-world.webp" target="_blank" rel="noopener"><img loading="lazy" src="../assets/the-crimes-v5/backgrounds/host-world.webp" alt="Cenário gráfico do Host"><span>CENTRAL / HOST</span></a>
   <a href="../assets/the-crimes-v5/backgrounds/screen-frame.webp" target="_blank" rel="noopener"><img loading="lazy" src="../assets/the-crimes-v5/backgrounds/screen-frame.webp" alt="Cenário gráfico do projetor"><span>TELÃO / PROJETOR</span></a>
   <a href="../assets/the-crimes-v5/backgrounds/join-noir.webp" target="_blank" rel="noopener"><img loading="lazy" src="../assets/the-crimes-v5/backgrounds/join-noir.webp" alt="Cenário gráfico de entrada"><span>ENTRADA / PERSONAGENS</span></a>
   <a href="../assets/the-crimes-v5/backgrounds/final-stage.webp" target="_blank" rel="noopener"><img loading="lazy" src="../assets/the-crimes-v5/backgrounds/final-stage.webp" alt="Cenário gráfico do pódio"><span>RESULTADO / PÓDIO</span></a>
  </div>
 </section>
</main>
<footer class="wrap footerline">'''
s=s.replace(needle,art,1)
# Ensure all screens reference V5 screenshot names.
for path in ['host.webp','telao.webp','celular.webp','entrada.webp','resultado.webp','celular-resultado.webp','selecao-casos.webp']:
 assert (root/'docs/preview/v5'/path).is_file(),path
assert '../docs/preview/v5/' in s
assert 'scenes/credores-v42/' in s
dest=root/'react-app/public/showroom.html'
dest.parent.mkdir(parents=True,exist_ok=True)
dest.write_text(s,encoding='utf-8')
print('Generated React V5.1 gallery:',len(s),'characters, 7 QA screens, 4 backgrounds, 8 case scenes')


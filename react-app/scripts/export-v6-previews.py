"""Export tested browser captures as compact visual previews for V6 showroom."""
from pathlib import Path
from PIL import Image,ImageEnhance
root=Path(__file__).resolve().parents[2]
folder=root/'docs'/'preview'/'v6'
screens={
 '01-casos-host':'casos','02-host-lobby':'lobby','07-host-rodada':'host',
 '08-telao-rodada':'telao','09-mobile-pergunta':'mobile',
 '12-podio-final':'podio',
 '11-telao-revelacao':'revelacao',
 '16-host-podio':'podio-host'
}
for source,target in screens.items():
 p=folder/(source+'.png')
 if not p.exists():
  raise SystemExit('Expected verified screenshot not found: '+str(p))
 img=Image.open(p).convert('RGB')
 if img.width>1600:
  img=img.resize((1600,round(img.height*1600/img.width)),Image.Resampling.LANCZOS)
 out=folder/(target+'.webp')
 img.save(out,'WEBP',quality=82,method=6)
 print('PREVIEW_V6',target,round(out.stat().st_size/1024),'KiB')

#!/usr/bin/env python3
"""THE CRIMES LIVE V7: build layered, text-free cinematic backgrounds from the repository's own original assets."""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageDraw, ImageFilter
import json, shutil, hashlib

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets' / 'the-crimes-v7'
V3 = ROOT / 'assets' / 'the-crimes-v3'
V6 = ROOT / 'assets' / 'the-crimes-v6'
(OUT/'backgrounds'/'desktop').mkdir(parents=True,exist_ok=True)
(OUT/'backgrounds'/'mobile').mkdir(parents=True,exist_ok=True)
(OUT/'backgrounds'/'projector').mkdir(parents=True,exist_ok=True)
for child in ('projector','characters/portraits','characters/avatars','props','ui/frames','ui/buttons','fx'):
    (OUT/child).mkdir(parents=True,exist_ok=True)

def crop_fill(img, size, focal=.5):
    w,h=size
    scale=max(w/img.width,h/img.height)
    ww,hh=round(img.width*scale),round(img.height*scale)
    im=img.resize((ww,hh),Image.Resampling.LANCZOS)
    x=max(0,min(ww-w, round((ww-w)*focal)))
    y=max(0,(hh-h)//2)
    return im.crop((x,y,x+w,y+h))

def make(name, src, size, focal, shade, blue=.1, dest='desktop'):
    path=OUT/'backgrounds'/dest/(name+'.webp')
    if path.exists() and path.stat().st_size>1024:
        return {'path':str(path.relative_to(ROOT)).replace('\\','/'),'width':size[0],'height':size[1],'source':str(src.relative_to(ROOT)).replace('\\','/'),'bytes':path.stat().st_size}
    im=Image.open(src).convert('RGB')
    im=crop_fill(im,size,focal)
    # Preserve the photographed scene, clear content area and protect text contrast.
    im=ImageEnhance.Contrast(im).enhance(1.1)
    layer=Image.new('RGBA',size,(0,0,0,0))
    px=layer.load()
    w,h=size
    for x in range(w):
        nx=x/max(1,w-1)
        for y in range(h):
            ny=y/max(1,h-1)
            edges=(abs(nx-.5)*1.1+abs(ny-.45)*.7)
            opacity=min(.89,shade+max(0,1-edges)*.09)
            if dest=='mobile': opacity=min(.9,opacity+.12)
            px[x,y]=(3,9,22,int(255*opacity))
    im=Image.alpha_composite(im.convert('RGBA'),layer)
    grad=Image.new('RGBA',size,(0,0,0,0))
    dr=ImageDraw.Draw(grad)
    dr.ellipse((int(w*.36),-int(h*.32),int(w*1.1),int(h*.65)),fill=(7,63,106,int(20+blue*90)))
    grad=grad.filter(ImageFilter.GaussianBlur(max(w,h)//7))
    im=Image.alpha_composite(im,grad).convert('RGB')
    path=OUT/'backgrounds'/dest/(name+'.webp')
    im.save(path,'WEBP',quality=83,method=5)
    return {'path':str(path.relative_to(ROOT)).replace('\\','/'),'width':w,'height':h,'source':str(src.relative_to(ROOT)).replace('\\','/'),'bytes':path.stat().st_size}

sources={
 'host':V6/'backgrounds'/'host-control.webp',
 'control':V3/'global'/'command-center.webp',
 'investigation':V3/'global'/'investigation-keyart.webp',
 'court':V3/'global'/'courtroom.webp',
 'podium':V6/'backgrounds'/'podium.webp',
}
specs=[
 ('bg-host-lobby-desktop',sources['host'],(1792,1008),.50,.36,.20,'desktop'),
 ('bg-round-desktop',sources['investigation'],(1792,1008),.48,.47,.20,'desktop'),
 ('bg-podium',sources['court'],(1792,1008),.50,.40,.16,'desktop'),
 ('bg-lobby-empty',sources['control'],(1792,1008),.52,.46,.17,'desktop'),
 ('bg-reveal',sources['court'],(1792,1008),.43,.53,.08,'desktop'),
 ('bg-loading',sources['host'],(1792,1008),.55,.53,.09,'desktop'),
 ('bg-host-lobby-mobile',sources['host'],(864,1536),.52,.53,.15,'mobile'),
 ('bg-player-mobile',sources['investigation'],(864,1536),.55,.62,.18,'mobile'),
]
backgrounds={key:make(key,*spec) for key,*spec in specs}
for name,src in [('bg-round-projector',sources['investigation']),('bg-final-projector',sources['court'])]:
    backgrounds[name]=make(name,src,(1920,1080),.50,.41,.18,'projector')
for f in (V6/'portraits').glob('*.webp'):
    shutil.copy2(f,OUT/'characters'/'portraits'/f.name)
for f in (V3/'avatars').glob('*.webp'):
    shutil.copy2(f,OUT/'characters'/'avatars'/f.name)
for f in (V6/'frames').glob('*.svg'):
    shutil.copy2(f,OUT/'ui'/'frames'/('frame-panel-'+f.name))
for f in (V6/'buttons').glob('*.webp'):
    shutil.copy2(f,OUT/'ui'/'buttons'/f.name)
shutil.copy2(V6/'decor'/'lady-justice-bronze.webp',OUT/'props'/'lady-justice-bronze.webp')
shutil.copy2(V3/'ui'/'detective-mark.svg',OUT/'props'/'detective-mark.svg')
# Modular vector reflection & grain; no copy rasterized controls, QR code or text.
fx='''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400"><defs><linearGradient id="a"><stop stop-color="#43d9ff" stop-opacity="0"/><stop offset=".48" stop-color="#43d9ff" stop-opacity=".22"/><stop offset="1" stop-color="#43d9ff" stop-opacity="0"/></linearGradient></defs><path d="M0 280 1200 50" stroke="url(#a)" stroke-width="2" fill="none"/><path d="M0 320 1200 95" stroke="url(#a)" stroke-width="1" fill="none"/></svg>'''
(OUT/'fx'/'light-streaks.svg').write_text(fx,encoding='utf-8')
grain=Image.new('L',(256,256))
# Deterministic noise texture with no animation.
import random
rand=random.Random(707)
grain.putdata([rand.randint(45,205) for _ in range(256*256)])
grain.save(OUT/'fx'/'grain.png',optimize=True)
records={
 'version':'7.0.0','generated_by':'scripts/build-v7-art.py',
 'policy':'Backgrounds have no UI, QR, names, scores, captions or buttons. All functional text and interaction is React.',
 'source_notice':'Derived from existing photographic/vector art already in this repository; preserve and review upstream provenance before redistribution.',
 'backgrounds':backgrounds,
 'characters':{'portraits':sorted(f.name for f in (OUT/'characters'/'portraits').glob('*.webp')),
               'avatars':sorted(f.name for f in (OUT/'characters'/'avatars').glob('*.webp'))},
 'frames':sorted(f.name for f in (OUT/'ui'/'frames').glob('*.svg')),
 'buttons':sorted(f.name for f in (OUT/'ui'/'buttons').glob('*.webp')),
 'fx':['fx/grain.png','fx/light-streaks.svg']
}
(OUT/'manifest.json').write_text(json.dumps(records,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print('THE CRIMES V7 ART: '+str(len(backgrounds))+' clean backgrounds, '+str(len(records['characters']['portraits']))+' portraits, '+str(len(records['characters']['avatars']))+' avatars.')

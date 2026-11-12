"""THE CRIMES LIVE V6: deterministic production of reusable image assets.
Builds only from original photographic artwork owned by the project.
No dynamic UI labels or clickable controls are baked into art.
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageChops
import math, json

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets'/'the-crimes-v6'
SOURCE=ROOT/'assets'/'the-crimes-v5'
AVATARS=ROOT/'assets'/'the-crimes-v3'/'avatars'
for folder in ('backgrounds','buttons','portraits','frames','textures'):
    (OUT/folder).mkdir(parents=True,exist_ok=True)

def clamp(v): return max(0,min(255,int(v)))
def photo(path,w=1920,h=1080, brightness=.84, contrast=1.14, sat=1.22):
    img=Image.open(path).convert('RGB')
    ww,hh=img.size
    crop=(max(0,ww-(hh*w/h)), max(0,hh-(ww*h/w)))
    if crop[0]>0:
        dx=int(crop[0]/2);img=img.crop((dx,0,ww-dx,hh))
    elif crop[1]>0:
        dy=int(crop[1]/2);img=img.crop((0,dy,ww,hh-dy))
    img=img.resize((w,h),Image.Resampling.LANCZOS)
    img=ImageEnhance.Contrast(img).enhance(contrast)
    img=ImageEnhance.Color(img).enhance(sat)
    img=ImageEnhance.Brightness(img).enhance(brightness)
    return img

def cinematic_photo(name,source, tint=(35,70,115), brightness=.90, glow=(.20,.27), red_side=False):
    w,h=1920,1080
    img=photo(SOURCE/'backgrounds'/source,brightness=brightness)
    wash=Image.new('RGB',(w,h),(0,0,0))
    p=wash.load()
    for y in range(h):
        yv=y/h
        for x in range(w):
            xv=x/w
            edge=min(xv,1-xv,yv,1-yv)*2
            vignette=(1-min(.45,edge*.40))**2
            sh=(max(0,abs(xv-.5)*2-.27))*0.43
            a=0.10+0.28*sh+(.10*(yv**2))
            side_light=(max(0,1-abs(xv-glow[0])*3)**3)*max(0,1-abs(yv-glow[1])*2.0)
            beam_color=(146,19,47) if red_side else tint
            col=[clamp(c*min(.26,side_light*.18)) for c in beam_color]
            p[x,y]=(clamp(col[0]),clamp(col[1]),clamp(col[2]))
    img=Image.blend(img,wash,.12)
    v=Image.new('RGBA',(w,h),(0,0,0,0))
    pix=v.load()
    for y in range(h):
        yy=y/h
        for x in range(w):
            xx=x/w
            d=math.sqrt(((xx-.5)/.72)**2+((yy-.47)/.8)**2)
            a=clamp(210*max(0,d-.32)**1.5+.17*yy*100)
            pix[x,y]=(1,3,10,a)
    img=Image.alpha_composite(img.convert('RGBA'),v).convert('RGB')
    img.save(OUT/'backgrounds'/name,format='WEBP',quality=88,method=6)
    return name

backgrounds=[
    ('host-control.webp','host-world.webp',(60,116,140),.91,(.12,.30),True),
    ('case-select.webp','screen-frame.webp',(48,117,164),.89,(.82,.25),True),
    ('lobby-qr.webp','join-noir.webp',(156,98,66),.92,(.17,.25),True),
    ('projector.webp','screen-frame.webp',(41,100,167),.88,(.70,.18),False),
    ('podium.webp','final-stage.webp',(176,120,63),.93,(.48,.36),True),
]
for args in backgrounds:
    cinematic_photo(*args)

palette={
'gold':((255,214,140),(109,60,12)),
'cyan':((84,219,255),(7,70,105)),
'red':((255,98,110),(90,7,26)),
'mint':((114,255,191),(12,89,62)),
'steel':((194,220,241),(22,62,89)),
}
states=('default','hover','pressed')
for kind,colors in palette.items():
    source=Image.open(SOURCE/'ui'/f'button-{kind if kind!="red" else "red"}.webp').convert('RGB').resize((600,116),Image.Resampling.LANCZOS)
    for state in states:
        panel=ImageEnhance.Contrast(source).enhance(1.08)
        panel=ImageEnhance.Color(panel).enhance(1.2)
        panel=ImageEnhance.Brightness(panel).enhance({'default':.96,'hover':1.22,'pressed':.77}[state])
        luminous=Image.new('RGBA',(600,116),(0,0,0,0))
        d=ImageDraw.Draw(luminous,'RGBA')
        upper,lower=colors
        if state=='hover':
            d.line([(14,6),(586,6)],fill=(*upper,190),width=3)
            d.line([(12,109),(588,109)],fill=(*upper,90),width=2)
            d.polygon([(285,5),(402,5),(312,110),(230,110)],fill=(255,255,255,19))
        elif state=='pressed':
            d.line([(15,14),(585,14)],fill=(0,0,0,100),width=4)
        else:
            d.line([(15,5),(585,5)],fill=(*upper,110),width=2)
        d.line([(14,112),(585,112)],fill=(*lower,100),width=2)
        final=Image.alpha_composite(panel.convert('RGBA'),luminous)
        final.save(OUT/'buttons'/f'{kind}-{state}.webp',format='WEBP',quality=90,method=6)

names=['detetive','advogado','delegado','estrategista','perita','advogada','investigadora','analista','especialista','auditor','arquivista','mediador']
for name in names:
    p=Image.open(AVATARS/(name+'.webp')).convert('RGBA')
    w,h=480,544
    p=p.resize((w,h),Image.Resampling.LANCZOS)
    p=ImageEnhance.Contrast(p).enhance(1.12)
    p=ImageEnhance.Color(p).enhance(1.08)
    rim=Image.new('RGBA',(w,h),(0,0,0,0))
    dd=ImageDraw.Draw(rim,'RGBA')
    dd.polygon([(0,0),(30,0),(0,h)],fill=(32,178,241,20))
    dd.polygon([(w-10,0),(w,0),(w,h)],fill=(245,153,83,26))
    p=Image.alpha_composite(p,rim)
    # Fade out lower edge for blending naturally with the medal card gradient.
    alpha=Image.new('L',(w,h),255); px=alpha.load()
    for y in range(h):
        fade=1 if y<h*.69 else max(0,(h-y)/(h*.31))**.62
        for x in range(w): px[x,y]=clamp(255*fade)
    p.putalpha(alpha)
    p.save(OUT/'portraits'/(name+'.webp'),format='WEBP',quality=91,method=6)

# Transparent scalable overlay frames. Content is composed as real DOM behind them.
for name,light in [('gold','#FFC776'),('silver','#DCECF5'),('bronze','#DB9366'),('cyan','#49D9FF'),('red','#F44A62')]:
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 680" preserveAspectRatio="none">
<defs><linearGradient id="st" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{light}" stop-opacity=".82"/><stop offset=".35" stop-color="#07233A" stop-opacity=".2"/><stop offset=".73" stop-color="{light}" stop-opacity=".9"/><stop offset="1" stop-color="#040915" stop-opacity=".4"/></linearGradient>
<filter id="glow"><feGaussianBlur stdDeviation="7"/></filter></defs>
<path d="M32 6 H968 L994 34 V646 L968 674 H32 L6 646 V34 Z" fill="none" stroke="{light}" stroke-opacity=".42" stroke-width="15" filter="url(#glow)"/>
<path d="M32 5 H968 L995 32 V648 L968 675 H32 L5 648 V32 Z" fill="none" stroke="url(#st)" stroke-width="5"/>
<path d="M44 14 H330 M670 14 H956 M44 666 H344 M656 666 H956" fill="none" stroke="{light}" stroke-width="6" stroke-opacity=".68"/>
<path d="M5 90 V34 L34 5 H100 M900 5 H968 L995 34 V90 M5 590 V648 L34 675 H100 M900 675 H968 L995 648 V590" fill="none" stroke="{light}" stroke-width="12" stroke-opacity=".8"/>
</svg>'''
    (OUT/'frames'/(name+'.svg')).write_text(svg,encoding='utf-8')

manifest={
    'version':'6.0.0',
    'source':'approved V5 licensed in-repository artwork, transformed as V6 individual assets',
    'backgrounds':[x[0] for x in backgrounds],
    'buttons':[f'{k}-{state}.webp' for k in palette for state in states],
    'portraits':[n+'.webp' for n in names],
    'frames':[n+'.svg' for n in ['gold','silver','bronze','cyan','red']],
}
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('V6_ART_READY',sum(1 for f in OUT.rglob('*') if f.is_file()),sum(f.stat().st_size for f in OUT.rglob('*') if f.is_file()),'bytes')

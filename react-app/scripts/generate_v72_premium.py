#!/usr/bin/env python3
"""V7.2 Premium: build original, text-free photographic composites from local licensed project art.
Never rasterize QRs, UI, names, answers, score or the legal case pictures.
Pillow deterministic; all sources remain in the repository.
"""
from __future__ import annotations
import hashlib, json, math, random
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/"assets/the-crimes-v72/premium"
OUT.mkdir(parents=True,exist_ok=True)
MANIFEST=ROOT/"assets/the-crimes-v72/manifest.json"
random.seed(72)

SPECS=[
    ("lobby-premium.webp", (1920,1080), [
        ("assets/the-crimes-v6/backgrounds/lobby-qr.webp",.66),
        ("assets/the-crimes-v7/backgrounds/desktop.webp",.26),
        ("assets/the-crimes-v3/global/command-center.webp",.08)
    ],"lobby"),
    ("host-live-premium.webp", (1920,1080), [
        ("assets/the-crimes-v6/backgrounds/host-control.webp",.68),
        ("assets/the-crimes-v7/backgrounds/round.webp",.23),
        ("assets/the-crimes-v3/global/investigation-keyart.webp",.09)
    ],"host"),
    ("player-premium.webp", (864,1536), [
        ("assets/the-crimes-v72/scenes/jogador-mobile.webp",.72),
        ("assets/the-crimes-v7/backgrounds/player.webp",.28)
    ],"player"),
    ("projector-premium.webp",(1920,1080),[
        ("assets/the-crimes-v6/backgrounds/projector.webp",.58),
        ("assets/the-crimes-v72/scenes/telao-rodada.webp",.34),
        ("assets/the-crimes-v7/backgrounds/round.webp",.08)
    ],"screen"),
    ("podium-premium.webp",(1920,1080),[
        ("assets/the-crimes-v6/backgrounds/podium.webp",.52),
        ("assets/the-crimes-v72/scenes/podio-desktop.webp",.40),
        ("assets/the-crimes-v7/backgrounds/podium.webp",.08)
    ],"podium")
]

def cover(p:Path, dims:tuple[int,int])->Image.Image:
    im=Image.open(p).convert("RGB")
    w,h=dims
    ratio=max(w/im.width,h/im.height)
    rw,rh=round(im.width*ratio),round(im.height*ratio)
    im=im.resize((rw,rh),Image.Resampling.LANCZOS)
    return im.crop(((rw-w)//2,(rh-h)//2,(rw+w)//2,(rh+h)//2))

def draw_photo(file:str,size, sources:list,scene:str):
    w,h=size
    source_images=[(cover(ROOT/path,size),weight) for path,weight in sources]
    master=source_images[0][0]
    accumulated=sources[0][1]
    for candidate,weight in source_images[1:]:
        master=Image.blend(master,candidate,weight/(accumulated+weight))
        accumulated+=weight
    master=ImageEnhance.Contrast(master).enhance(1.18)
    master=ImageEnhance.Brightness(master).enhance(1.25)
    master=ImageEnhance.Color(master).enhance(.91 if scene in {"lobby","screen"} else 1.04)
    # Fading central glass leaves the active React UI at high contrast.
    px=master.load()
    for y in range(h):
        vy=y/max(1,h-1)
        for x in range(w):
            ux=x/max(1,w-1)
            vignette=min(1,math.sqrt(((ux-.50)/.88)**2 + ((vy-.45)/.85)**2))
            matte=.99 - .19*(vignette*vignette)
            center=math.exp(-(((ux-.51)/.34)**2+((vy-.43)/.43)**2)*.9)
            matte*=1-.08*center
            r,g,b=px[x,y]
            # Teal on left, restrained bronze on right, subtle case-like intrigue.
            teal=max(0,(.58-ux)/.58)
            bronze=max(0,(ux-.43)/.57)
            px[x,y]=(int(min(255,r*matte+teal*1.8+bronze*3.4)),
                     int(min(255,g*matte+teal*6.2+bronze*2.0)),
                     int(min(255,b*matte+teal*10.0-bronze*1.0)))
    base=master.convert("RGBA")
    glows=Image.new("RGBA",size,(0,0,0,0))
    layer=ImageDraw.Draw(glows,"RGBA")
    for cx,cy,col in [(.06,.13,(32,200,255,35)),(.95,.67,(255,151,58,25)),
                      (.28,.94,(26,208,234,18))]:
        for i in range(8,0,-1):
            radius=int(min(w,h)*(.045+i*.027))
            a=int(col[3]*(.2+.075*(9-i)))
            layer.ellipse((cx*w-radius,cy*h-radius,cx*w+radius,cy*h+radius),fill=(*col[:3],a))
    glows=glows.filter(ImageFilter.GaussianBlur(max(16,w//85)))
    base=Image.alpha_composite(base,glows)
    # Cinematic horizontal falloff, no words or fake interface.
    hdr=Image.new("RGBA",size,(0,0,0,0))
    stripes=ImageDraw.Draw(hdr,"RGBA")
    stripes.rectangle((0,0,w,round(h*.045)),fill=(0,7,18,100))
    stripes.rectangle((0,round(h*.91),w,h),fill=(0,5,15,90))
    base=Image.alpha_composite(base,hdr).convert("RGB")
    return base

def spotlights(size=(1920,1080)):
    w,h=size
    # A lighting layer only; the actual podium/avatars stay in React.
    canvas=Image.new("RGBA",size,(0,0,0,0))
    px=canvas.load()
    centers=[(.25,.60,(105,188,245),.31),(.50,.50,(251,195,89),.38),(.75,.61,(232,128,75),.28)]
    for y in range(h):
        for x in range(w):
            rf=gf=bf=af=0.0
            for cx,cy,(r,g,b),spread in centers:
                dx=(x/w-cx)/spread
                dy=(y/h-cy)/.60
                intensity=max(0,math.exp(-2*(dx*dx+dy*dy))-.02)
                rf+=r*intensity
                gf+=g*intensity
                bf+=b*intensity
                af+=58*intensity
            px[x,y]=(int(min(255,rf)),int(min(255,gf)),int(min(255,bf)),int(min(95,af)))
    return canvas

manifest=json.loads(MANIFEST.read_text(encoding="utf-8"))
entries={}
for name,size,sources,scene in SPECS:
    photo=draw_photo(name,size,sources,scene)
    dest=OUT/name
    photo.save(dest,"WEBP",quality=77,method=5)
    entries[name]={
        "source_files":[s for s,_ in sources],
        "composition":"independent text-free photographic blend, vignettes, teal/bronze lighting",
        "generator":"react-app/scripts/generate_v72_premium.py",
        "size":f"{size[0]}x{size[1]}",
        "sha256":hashlib.sha256(dest.read_bytes()).hexdigest(),
        "dynamic_content":"none",
        "usage":scene
    }
    print(f"V72 PREMIUM {name} {dest.stat().st_size} bytes {size}")
glow_path=OUT/"podium-spotlights.png"
spotlights().save(glow_path,optimize=True)
entries["podium-spotlights.png"]={
    "source_files":[],
    "composition":"original three-color transparent Gaussian spotlights, no person/text/score",
    "generator":"react-app/scripts/generate_v72_premium.py",
    "size":"1920x1080",
    "sha256":hashlib.sha256(glow_path.read_bytes()).hexdigest(),
    "dynamic_content":"none",
    "usage":"podium"
}
manifest["premium_v72_master"]={
    "source_policy":"derived compositions of existing repository art, not newly AI-generated or a Golden Master screenshot",
    "assets":entries
}
MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("V72 PREMIUM MANIFEST",MANIFEST)

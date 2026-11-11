from PIL import Image,ImageEnhance,ImageFilter,ImageDraw,ImageOps
from pathlib import Path
r=Path(__file__).resolve().parent
source=r/'assets/the-crimes/scenes/credores'
dest=r/'assets/the-crimes-v3/scenes/credores-v42'
dest.mkdir(parents=True,exist_ok=True)
house=Image.open(r/'assets/the-crimes-v3/global/holding-estate-unsplash.jpg').convert('RGB')
W,H=1280,720
house=ImageOps.fit(house,(W,H),method=Image.Resampling.LANCZOS)
def grade(im,variant):
    im=ImageEnhance.Contrast(im).enhance(1.16)
    im=ImageEnhance.Color(im).enhance(1.12)
    layer=Image.new('RGB',(W,H),(5,13,27))
    im=Image.blend(im,layer,.14)
    draw=ImageDraw.Draw(im,'RGBA')
    draw.rectangle((0,0,14,H),fill=(232,42,72,110) if variant%2 else (28,180,245,100))
    draw.rectangle((0,H-9,W,H),fill=(5,9,21,125))
    return im
def inset(base,photo,box,side):
    x,y,w,h=box
    # dark soft outer shadow, opaque framed photo without ghost double exposure
    sh=Image.new('RGBA',(w+52,h+52),(0,0,0,0))
    sdraw=ImageDraw.Draw(sh)
    sdraw.rounded_rectangle((17,13,w+35,h+31),radius=9,fill=(0,0,0,210))
    sh=sh.filter(ImageFilter.GaussianBlur(13))
    base.paste(sh,(x-24,y-23),sh)
    photo=ImageOps.fit(photo,(w,h),method=Image.Resampling.LANCZOS,centering=(.50,.45))
    base.paste(photo,(x,y))
    d=ImageDraw.Draw(base)
    d.rectangle((x-2,y-2,x+w+1,y+h+1),outline='#60c7e1' if side%2 else '#f2b15e',width=3)
    d.line((x+8,y+7,x+75,y+7),fill='#f0465e',width=4)
    return base
files=sorted(source.glob('*.webp'))
for idx,f in enumerate(files):
    original=Image.open(f).convert('RGB')
    original=ImageOps.fit(original,(W,H),Image.Resampling.LANCZOS)
    if idx==0:
        im=grade(house.copy(),idx)
        # Clean, legible mansion establishes the location, without competing portraits.
    elif idx==1:
        im=grade(house.copy(),idx)
        # Dossier's investigation scene as a single crisp inset.
        im=inset(im,original,(740,188,500,365),idx)
    else:
        im=grade(original,idx)
        # Context photo is shown as a small, separate piece of evidence.
        # Avoid translucent/ghosted composite of different human faces.
        im=inset(im,house,(39,455,305,185),idx)
    im.save(dest/f'{idx+1:02d}-scene.webp','WEBP',quality=85,method=6)
sheet=Image.new('RGB',(1024,4*310),(3,8,20))
draw=ImageDraw.Draw(sheet)
for idx,f in enumerate(sorted(dest.glob('*.webp'))):
    a=Image.open(f).convert('RGB')
    a.thumbnail((502,283))
    x=(idx%2)*512;y=(idx//2)*310
    sheet.paste(a,(x,y))
    draw.text((x+8,y+285),f'RODADA {idx+1:02d}',fill='#f8d58c')
preview=r/'docs/preview/v42'
preview.mkdir(parents=True,exist_ok=True)
sheet.save(preview/'eight-scenes.jpg',quality=84)
print('Generated',len(list(dest.glob('*.webp'))),'scenes; preview ready')

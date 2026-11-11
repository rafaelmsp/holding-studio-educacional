from PIL import Image,ImageEnhance,ImageFilter,ImageDraw,ImageChops
from pathlib import Path
import math
r=Path(__file__).resolve().parent
source=r/'assets/the-crimes/scenes/credores'
house=Image.open(r/'assets/the-crimes-v3/global/holding-estate-unsplash.jpg').convert('RGB')
house=ImageEnhance.Contrast(house).enhance(1.13)
house=ImageEnhance.Color(house).enhance(1.10)
# Preserve the architecture as the recurring visual identity of the property case.
dest=r/'assets/the-crimes-v3/scenes/credores'
dest.mkdir(parents=True,exist_ok=True)
files=sorted(source.glob('*.webp'))
w,h=1280,720
for idx,f in enumerate(files):
    base=house.resize((w,h),Image.Resampling.LANCZOS)
    original=Image.open(f).convert('RGB').resize((w,h),Image.Resampling.LANCZOS)
    original=ImageEnhance.Contrast(original).enhance(1.14)
    # For the first round establish the property, subsequently emphasize investigation/documentary visuals
    power=1.0
    mask=Image.new('L',(w,h),0)
    px=mask.load()
    for x in range(w):
        ratio=(x/w-.40)/.18
        smooth=max(0.,min(1.,ratio))
        smooth=smooth*smooth*(3-2*smooth)
        # leave mansion visible across the entire composition while blending in case-specific clues
        value=int(255*(power*smooth))
        for y in range(h):px[x,y]=value
    mask=mask.filter(ImageFilter.GaussianBlur(12))
    im=Image.composite(original,base,mask)
    # Cool lower third, cinematic red/cyan lighting (no baked text)
    overlay=Image.new('RGB',(w,h))
    op=overlay.load()
    for y in range(h):
        for x in range(w):
            op[x,y]=(8+int(30*max(0,1-x/w)),11+int(15*(1-y/h)),18+int(18*x/w))
    im=Image.blend(im,overlay,.13)
    # Photo-level vignette keeping all important content legible
    alpha=Image.new('L',(w,h),0);a=alpha.load()
    for y in range(h):
        vy=((y-h/2)/(h/2))**2
        for x in range(w):
            vx=((x-w/2)/(w/2))**2
            a[x,y]=int(115*min(1,(vx+vy)*.59))
    im=Image.composite(Image.new('RGB',(w,h),(1,6,14)),im,alpha)
    filename=f'{idx+1:02d}-cinematic.webp'
    im.save(dest/filename,'WEBP',quality=85,method=6)
    print(filename,(dest/filename).stat().st_size)
# produce an art-direction contact sheet to visually inspect every round
thumbs=list(dest.glob('*.webp'))
sheet=Image.new('RGB',(2*520,4*322),'#060c15')
d=ImageDraw.Draw(sheet)
for idx,p in enumerate(thumbs):
    im=Image.open(p).convert('RGB')
    im.thumbnail((510,289),Image.Resampling.LANCZOS)
    x=(idx%2)*520;y=(idx//2)*322
    sheet.paste(im,(x,y))
    d.text((x+8,y+291),f'RODADA {idx+1:02d}',fill='#f7d995')
preview=r/'docs/preview/v41';preview.mkdir(parents=True,exist_ok=True);sheet.save(preview/'scenes-contact.jpg',quality=79)


from pathlib import Path
from PIL import Image, ImageEnhance
root=Path(__file__).resolve().parents[2]
out=root/'assets'/'the-crimes-v6'/'decor'
out.mkdir(parents=True,exist_ok=True)
img=Image.open(root/'assets'/'the-crimes-v5'/'backgrounds'/'host-world.webp').convert('RGBA')
img=img.crop((0,0,375,630)).resize((400,672),Image.Resampling.LANCZOS)
img=ImageEnhance.Contrast(img).enhance(1.09)
px=img.load()
w,h=img.size
for y in range(h):
    for x in range(w):
        left=min(1,x/24)
        right=min(1,(w-x-1)/85)
        top=min(1,y/25)
        bottom=min(1,(h-y-1)/110)
        a=max(0,min(left,right,top,bottom))
        rr,gg,bb,_=px[x,y];px[x,y]=(rr,gg,bb,int(245*a))
img.save(out/'lady-justice-bronze.webp',format='WEBP',quality=91,method=6)
print("DECOR_READY",img.size)

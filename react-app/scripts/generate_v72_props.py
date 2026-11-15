"""Generate transparent V7.2 photographic props from repository artwork.

Do not rasterize UI text, question, score, QR or buttons.
Sources: V6 Justice photograph and PR #5 podium scene.
"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets/the-crimes-v72/props"
OUT.mkdir(parents=True, exist_ok=True)

justice = Image.open(ROOT/"assets/the-crimes-v6/decor/lady-justice-bronze.webp").convert("RGBA")
a = np.asarray(justice,dtype=np.float32).copy()
height,width = a.shape[:2]
r,g,b = a[:,:,0],a[:,:,1],a[:,:,2]
lum = (0.23*r + 0.67*g + 0.10*b)
warm = np.clip((g-b-8.0)/65,0,1)*np.clip((r-g+10)/65,0,1)
shine = np.clip((lum-28)/145,0,1)
opacity = np.clip(0.90*shine*warm + 0.27*shine,0,0.95)
x=np.arange(width,dtype=np.float32)[None,:]
y=np.arange(height,dtype=np.float32)[:,None]
opacity *= np.clip((width-x)/55,0,1)*np.clip((height-28-y)/95,0,1)*np.clip((x+15)/55,0,1)
a[:,:,3]=np.clip(opacity*255,0,255)
cutout=Image.fromarray(a.astype('uint8'),'RGBA')
cutout.save(OUT/'justice-bronze-cutout.webp','WEBP',quality=88,method=6)

photo=Image.open(ROOT/'assets/the-crimes-v72/scenes/podio-desktop.webp').convert('RGBA')
pw,ph=photo.size
crop=photo.crop((int(pw*.64),int(ph*.45),pw,ph))
p=np.asarray(crop,dtype=np.float32).copy()
h,w=p.shape[:2]
xx=np.arange(w,dtype=np.float32)[None,:]
yy=np.arange(h,dtype=np.float32)[:,None]
edge=np.minimum.reduce(np.broadcast_arrays(
  np.clip(xx/95,0,1),np.clip((w-1-xx)/70,0,1),
  np.clip(yy/100,0,1),np.clip((h-1-yy)/65,0,1)))
p[:,:,3]=np.clip((edge**.80)*235,0,255)
lens=Image.fromarray(p.astype('uint8'),'RGBA')
lens.save(OUT/'evidence-lens-cutout.webp','WEBP',quality=85,method=6)
print('Generated',cutout.size,lens.size)
for f in sorted(OUT.glob('*.webp')): print(f.relative_to(ROOT),f.stat().st_size)

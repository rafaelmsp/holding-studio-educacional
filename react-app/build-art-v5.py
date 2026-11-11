from PIL import Image,ImageOps,ImageEnhance,ImageDraw,ImageFilter
from pathlib import Path
import math,random
root=Path(__file__).resolve().parents[1]
assets=root/'assets/the-crimes-v5'
bg=assets/'backgrounds';ui=assets/'ui'
bg.mkdir(parents=True,exist_ok=True);ui.mkdir(parents=True,exist_ok=True)
source=Image.open(bg/'host-world.webp').convert('RGB')
W,H=1536,864
source=ImageOps.fit(source,(W,H),method=Image.Resampling.LANCZOS)
# Background scenes are remixes of the generated source; no text or interactive elements are baked in.
def darken(im,amount=0.82):
 return ImageEnhance.Brightness(im).enhance(amount)
def overlay(im, color, alpha):
 layer=Image.new('RGB',(W,H),color)
 return Image.blend(im,layer,alpha)
join=overlay(darken(source,0.76),(16,3,11),.19)
join.save(bg/'join-noir.webp','WEBP',quality=81,method=6)
screen=overlay(darken(source,0.86),(10,5,12),.16)
screen.save(bg/'screen-frame.webp','WEBP',quality=81,method=6)
final=overlay(darken(source,0.75),(28,18,3),.18)
final.save(bg/'final-stage.webp','WEBP',quality=81,method=6)
# Transparent metallized button surfaces. Text and icons must remain live React DOM.
random.seed(42)
palette={'red':(126,22,42),'gold':(175,106,20),'cyan':(16,111,156),'mint':(23,116,82),'steel':(20,56,76)}
for key,(R,G,B) in palette.items():
 w,h=512,112
 im=Image.new('RGBA',(w,h));pix=im.load()
 for y in range(h):
  p=y/(h-1)
  ramp=(1.23-(p*.55))+(0.15*math.sin(p*math.pi))
  for x in range(w):
   shine=max(0,1-abs(x/w-.35)*3.2)*.18
   noise=random.randrange(-4,5)
   pix[x,y]=(max(0,min(255,int(R*ramp+R*shine+noise))),max(0,min(255,int(G*ramp+G*shine+noise))),max(0,min(255,int(B*ramp+B*shine+noise))),255)
 d=ImageDraw.Draw(im,'RGBA')
 d.rounded_rectangle((1,1,w-2,h-2),radius=17,outline=(255,238,200,140),width=3)
 d.line((28,7,w-32,7),fill=(255,255,255,100),width=3)
 d.line((20,h-12,w-20,h-12),fill=(1,8,13,160),width=4)
 im.save(ui/f'button-{key}.webp','WEBP',quality=84,method=6)
for key,glow in [('question',(240,142,64)),('ranking',(57,170,215)),('card',(211,60,95))]:
 w,h=740,490
 im=Image.new('RGBA',(w,h),(8,14,27,235))
 dr=ImageDraw.Draw(im,'RGBA')
 for i in range(15):
  dr.rounded_rectangle((i,i,w-i-1,h-i-1),radius=15,outline=(*glow,int(150*(1-i/15))))
 dr.line((25,9,w-27,9),fill=(*glow,150),width=5)
 dr.line((10,25,10,h-25),fill=(*glow,130),width=4)
 im.save(ui/f'panel-{key}.webp','WEBP',quality=88,method=6)
print('V5 images:',[(p.name,p.stat().st_size) for p in sorted(bg.glob('*.webp'))]+[(p.name,p.stat().st_size) for p in sorted(ui.glob('*.webp'))])

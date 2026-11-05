(function () {
  'use strict';
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const gl = canvas.getContext('webgl', {alpha:true, antialias:false, powerPreference:'low-power', preserveDrawingBuffer:false});
  if (!gl) return;
  const vertex = `attribute vec2 aPosition;void main(){gl_Position=vec4(aPosition,0.0,1.0);}`;
  const fragment = `precision mediump float;
  uniform vec2 uResolution;uniform float uTime;uniform vec2 uMouse;
  float glow(vec2 p,vec2 c,float r){return r/(length(p-c)+.18);}
  void main(){vec2 uv=gl_FragCoord.xy/uResolution.xy;vec2 p=(uv-.5)*vec2(uResolution.x/uResolution.y,1.0);
    float wave=sin(p.x*5.0+uTime*.12)*.5+.5;
    float a=glow(p,vec2(.33,.45)+vec2(sin(uTime*.12)*.11,cos(uTime*.07)*.15),.045);
    float b=glow(p,vec2(.58,-.36)+vec2(cos(uTime*.09)*.11,sin(uTime*.08)*.13),.035);
    float c=glow(p,vec2((uMouse.x-.5)*.9,(uMouse.y-.5)*.45),.018);
    vec3 deep=vec3(.020,.06,.10);vec3 blue=vec3(.021,.18,.25);vec3 gold=vec3(.22,.15,.06);
    vec3 col=deep+blue*a*.12+gold*b*.18+blue*c*.075+blue*wave*.018;
    float alpha=clamp((a*.055+b*.04+c*.018),.03,.27);
    gl_FragColor=vec4(col,alpha);
  }`;
  function shader(type, code) {
    const sh=gl.createShader(type);gl.shaderSource(sh,code);gl.compileShader(sh);
    if (!gl.getShaderParameter(sh,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  }
  let program;
  try {
    program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('WebGL link');
  } catch (_) {canvas.style.display='none';return;}
  const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,'aPosition'),res=gl.getUniformLocation(program,'uResolution'),time=gl.getUniformLocation(program,'uTime'),mouse=gl.getUniformLocation(program,'uMouse');
  let mx=.5,my=.5,frame=0,enabled=true;
  function resize(){const scale=Math.min(window.devicePixelRatio||1,1.25);canvas.width=Math.max(1,Math.floor(innerWidth*scale));canvas.height=Math.max(1,Math.floor(innerHeight*scale));gl.viewport(0,0,canvas.width,canvas.height);}
  function draw(t){if(!enabled)return;if(frame++%2===0){gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);gl.uniform2f(res,canvas.width,canvas.height);gl.uniform1f(time,t*.001);gl.uniform2f(mouse,mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}requestAnimationFrame(draw)}
  window.addEventListener('resize',resize,{passive:true});window.addEventListener('pointermove',e=>{mx=e.clientX/Math.max(1,innerWidth);my=1-e.clientY/Math.max(1,innerHeight);},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){enabled=false;}else if(!enabled){enabled=true;requestAnimationFrame(draw);}});
  resize();requestAnimationFrame(draw);
})();

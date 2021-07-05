//NAAN

precision mediump float;

uniform float time;
uniform vec2 resolution;

#define PI  3.14159265359

float cambiarFase(vec2 uv, float fase){
  float fix = resolution.x/resolution.y;
  uv.x *= fix;

  vec2 p = vec2( .5 * fix, .5) - uv;
  float r = length(p);
  float a = atan(p.x, p.y);

  float forma;
  float fondo;

  fondo = sin(ceil((uv.y * PI * 20. + cos(uv.x + time * PI * 2.)* sin(time) * 10. + 4. )*.5 + .5 * PI * 10. * fase))
          + cos(ceil(((uv.x * PI * 20.) * 0.5 + 0.5 * PI * 10. *  fase))- ceil(time*1.9));

  float siz = sin(a * 7. + time * 5.) * sin(time) * .15 + .5;

  forma = smoothstep(siz, siz *1.1, r);
  return  1. - fondo - (forma * 2.5);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  // uv *= .5;

  vec2 p = vec2(0.5, 0.5) - uv;
  float r = length(p);
  float a = atan(p.x, p.y);

  float rojo;
  float verde;
  float azul;

  rojo = 1. - cambiarFase(uv, sin(time * 0.5) * 0.95);
  verde =1. - cambiarFase(uv, sin(time * 0.5) * 0.9);
  azul = 1. -cambiarFase(uv, sin(time * 0.5) * 0.85);

  vec4 color;
  color = vec4(rojo, verde, azul, 1.0);
  gl_FragColor = color;
}

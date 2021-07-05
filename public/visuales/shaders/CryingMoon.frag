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
  float dist = sin(time*0.1) * 6. + 10.;

  fondo = sin(uv.y * PI * dist +
              cos(uv.x * PI * fase * (cos(time * 1.5)*1.25) //mod(time,  40.)
                + time))
          * 0.5 + 0.5;

  float siz = .1 + (dist * 0.025);
  float shape = 1. - sin(time * 0.01) * 0.3 + 1.;
  shape = 1.1;
  forma = 1. - smoothstep(siz, siz * shape, r) - fondo;
  forma /= fondo;

  return forma;
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

  rojo = cambiarFase(uv, 0.1);
  verde = cambiarFase(uv, 0.4);
  azul = cambiarFase(uv, 0.7);

  vec4 color;
  color = vec4(rojo, verde, azul, 1.0);
  gl_FragColor = color;
}

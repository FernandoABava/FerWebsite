//LO-FER

precision mediump float;

uniform float time;
uniform vec2 resolution;

#define PI  3.14159265359

float cambiarFase(vec2 uv, float fase){
  float forma = 0. ;

  float fix = resolution.x/resolution.y;
  uv.x *= fix;
  vec2 p = vec2(.5 * fix, .5) - uv;
  float r = length(p);
  float a = atan(p.x, p.y);
  p = fract(p * 3.);

  fase = ((sin(fase * PI * r + time) * .5 + .5) + a + r) *
          ((cos(fase * PI * r + time) * .5 + .5) - a + r) *
          (cos(3. * PI) -(sin(fase * PI * -r + time) * .75 + .5) - a) *
          (cos(3. * PI) -(cos(fase * PI * -r + time) * .75 + .5) + a)
          + abs(sin(time));
  forma = smoothstep(fase, fase * 1.6, r);
  return forma;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  // uv *= .5;

  float rojo = cambiarFase(uv, .92);
  float verde = cambiarFase(uv, .95);
  float azul = cambiarFase(uv, .98);

  vec4 color;
  color = vec4(rojo, verde, azul, 1.0);
  gl_FragColor = color;
}

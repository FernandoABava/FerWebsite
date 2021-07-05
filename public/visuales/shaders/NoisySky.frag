//NAAN

precision mediump float;

uniform float time;
uniform vec2 resolution;

#define PI  3.14159265359
#define TWO_PI 6.28318530718

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Quintic interpolation curve
    vec2 u = f*f*f*(f*(f*6.-15.)+10.);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float dibujarFigura(vec2  p_, float siz){
  float figura;

  float r = length(p_);
  //float a = atan(p.x, p.y);

  figura = smoothstep(siz * 0.95, siz, r);

  return figura;
}

float dibujarPoligono(vec2  uv, vec2 pos, float siz, float n){
  float figura;
    uv.x -= pos.x;
    uv.y -= pos.y -.5;
    uv = uv * 2.-1.;
    // Angle and radius from the current pixel
    float a = atan(uv.x, uv.y)+PI;
    float r = TWO_PI/float(n);

    // Shaping function that modulate the distance
    float d = cos(floor(.5+a/r)*r-a)*length(uv)- siz;

    figura = 1.0-smoothstep(.4,.41,d);

  return figura;
}

float dibujarPoligono(vec2  uv, float siz, float n){
  float figura = dibujarPoligono(uv, vec2(.0,.0), siz, n);

  return figura;
}

float cambiarFase(vec2 uv, float fase){
  float fix = resolution.x/resolution.y;
  uv.x *= fix;

  vec2 p = vec2( .5 * fix, .5) - uv;
  vec2 p2 = vec2( cos(time * 0.1) * .5 + .5 * fix, sin(time* .1) * .25 + .5) - uv;
  float r = length(p);
  float a = atan(p.x, p.y);

  float f1;
  float f2;
  float fondo;

  vec2 ur = vec2(uv.x + time * .2 + (a + time* .001) * PI, uv.y);
  fondo = noise(ur * 5. * fase + (time * .01)) + sin(cos(uv.x) * sin(uv.y)) * .5;

  vec2 ur2 = vec2(uv.x + cos(time * .1) , uv.y + sin(time * .1))* 5.;
  f1 = dibujarFigura(p, noise(ur2 * sin(time * .15) * 12. + 12. + time * .5 + fase));
  f2 = dibujarPoligono(vec2(p.x + .5, p.y), sin(time + r * 20. + a) * .05 + .05, ceil(sin(time * fase) * 7. + 9.));

  return  (fondo-(mix(f1, f2, sin(fase + time * .5) *fase)));
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

  rojo = cambiarFase(uv, 0.9);
  verde = cambiarFase(uv, 0.6);
  azul = cambiarFase(uv, 0.5);

  vec4 color;
  color = vec4(rojo, verde, azul, 1.0);
  gl_FragColor = color;
}

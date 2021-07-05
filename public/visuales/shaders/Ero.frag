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
  // uv.x *= fix;

  // vec2 p = vec2( .5 * fix, .5) - uv;
  vec2 p = vec2(.5) -uv;
  float r = length(p);
  float a = atan(p.x, p.y);

  float f1;
  float f2;
  float fondo;

  fondo = noise(uv + noise(uv +time * .25 + fase) * 2.) * fase + fase;

  float baile = sin(time * .75 + (sin(time*2.) * .25 + .25)) * .175 + .225;
  //baile = sin(time * 0.75) * .25 + .3;
  //baile = 0.;
  f1 = 1. - dibujarFigura(vec2(p.x + baile, p.y), noise(uv + time * .75 + (sin(time * .1) * .1 + .1) - fase) * .25 + .125);
  f2 = 1. - dibujarFigura( vec2(p.x - baile, p.y), noise(uv + time * .75 + (sin(time * .1) * .1 + .1) - fase) * .25 + .125);

  //f1 = 1. - dibujarFigura(vec2(p.x + baile, p.y), .25);
  //f2 = 1. - dibujarFigura(vec2(p.x - baile, p.y), .25);

  return  fondo - f1 - f2;
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

  rojo = cambiarFase(uv, 0.75);
  verde = cambiarFase(uv, 0.6);
  azul = cambiarFase(uv, 0.65);

  vec4 color;
  color = vec4(rojo, verde, azul, 1.0);
  gl_FragColor = color;
}

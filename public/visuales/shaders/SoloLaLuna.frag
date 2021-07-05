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
     u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float fbm (in vec2 st) {
  // Initial values
  float value = 0.0;
  float amplitude = .5;
  float frequency = 0.;
  //
  // Loop of octaves
  for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st);
      st *= 2.;
      amplitude *= .5;
  }
  return value;
}

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
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
  float figura = dibujarPoligono(uv, vec2(.5,.5), siz, n);

  return figura;
}

float blend(float A, float B, float factor){
  return A * factor + B; // BLEND
  // return (A * factor + B)/2.; // FIXED BLEND
}

float add(float A, float B, float factor){
  return min(A * factor + B, 1.); // ADD
}

float subtract(float A, float B, float factor){
  return  max(B - A * factor, .0); // SUBTRACT
}

float darkest(float A, float B, float factor){
  return  min(A * factor, B); // DARKEST
}

float lightest(float A, float B, float factor){
  return  max(A * factor, B); // LIGHTEST
}

float multiply(float A, float B, float factor){
  return  A * factor * B; // MULTIPLY
}

float screen(float A, float B, float factor){
  return  (1.-A) * factor * (1.-B); // SCREEN
}

vec2 pixelate(vec2 puv, float factor){
  puv *= factor;
  puv = floor(puv);
  return puv;
}

vec2 celdate(vec2 cuv, float factor){
  cuv *= factor;
  cuv = fract(cuv);
  return cuv;
}

float cambiarFase(vec2 uv, float fase){
  float fix = resolution.x/resolution.y;
  uv.x *= fix;

  vec2 puv = pixelate(uv, 8.);
  vec2 cuv = celdate(uv, 3.);

  vec2 p = vec2(.5 * fix, .5) - uv;
  float r = length(p);
  float a = atan(p.x, p.y);

  vec2 ruv = uv;
  ruv.x += cos(time + a+ uv.x);
  ruv.y += sin(time + a+ uv.y);

  float f1;
  float f2;
  float fondo;
  float filtro = 0.;

  fondo = fbm(uv * 20.);
  fondo = fbm(uv * fondo + time * .1);

  // fondo *= fase;


  filtro = 0.;
  //filtro = random(puv+ ceil(time * (puv.x / puv.y - 2.5)) * fase) * .25;
  //filtro = noise(vec2(uv.x + sin( uv.y  + time * .25), 1. + time * .0025) * 250.) * .5;
  //filtro = noise(vec2(uv.x, 1. + time * .0025) * 250.) * .25;
  //filtro = random(vec2(uv.x, 1. + time * .0025) * 250.) * .15;
  //filtro = random(vec2(puv.x + time * .35, uv.y)) * .25;
  //filtro = random(uv * time) * .05;
  // puv = pixelate(vec2(uv.x *(sin(time * .1) * .5 + .5), uv.y * (cos(time * .1)* .5 + .5)), 8.);
  filtro = step(.9, random(puv));
  //fondo += filtro;

  f1 = 1. - dibujarFigura(p, .5);
  f1 = subtract(fondo, f1, .4);

  f2 = dibujarFigura(vec2(.5) - cuv, noise(uv * 4. * noise(cuv * 2.  + time * .5) + time * .25)* .5);

  // f1=0.;

  fondo = fbm(uv * fondo + fase);

  float factor = .8;
  // factor = fase;
  // return fondo;
  return lightest(fondo, f1, factor);
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

  rojo = cambiarFase(uv, .5);
  verde = cambiarFase(uv, .25);
  azul = cambiarFase(uv, .75);

  vec4 color;
  color = vec4(hsb2rgb(vec3(rojo, verde, azul)), 1.0);
  color = vec4(rojo, verde, azul, 1.0);
  gl_FragColor = color;
}

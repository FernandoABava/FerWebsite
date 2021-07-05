//NAAN

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

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

  float descanso = .5; //Para el jueguito

  float f1;
  float f2;
  float fondo;
  float filtro = 0.;

  float v = 0.;
  for (int u = 1; u <= 5; u++){
    float i = float(u);
    v += sin(time * 2.5/i);
    v += cos(time * 2.5/(i * 2.));
  }
  // v += cos(time);
  // v += sin(time * .5);
  // v += cos(time * .25);
  // v += sin(time * .125);
  v *= 0.1;
  // v = -0.;

  fondo = fbm(uv*10. * 2. + v * (fase * 5. * r));
  fondo = fbm(uv * fondo * PI * 3. + time * .5);

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

  float spec = (1.- sin(r * PI * 200.) * .5 + .5) * .25;
  spec -= (cos(r * PI * 200. + ceil(time * 7.) ) * .5 + .5) * .125;
  spec -= (sin(r * PI * 200. + time* 2.) * .5 + .5) * .125;
  // spec -= (1.-r) * .05;
  // spec *= .5;
  spec -= r * .75;
  spec *= 2.5;

  f1 = 1. - dibujarFigura(p, (cos(time* .25) *.125 + .25) * fondo);
  // f1 *= .5;
  f1 = subtract( f1,spec * ( 1.- fase), 1.) * fondo;
  f1 *= (sin(time + ((.5 * cos(time * 10.) + .5)) + r) * .5 + .5)* 2. + .1;
  f1 *= fondo;

  // f2 = dibujarFigura(vec2(.5) - cuv, noise(uv * 4. * noise(cuv * 2.  + time * .5) + time * .25)* .5);

  // f1=0.;

  // fondo = fbm(uv * fondo + fase);

  float factor = .5;
  // factor = fase;
  // return f1;
  return blend(fondo, f1, factor);
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

  rojo = cambiarFase(uv, .15);
  verde = cambiarFase(uv, .5);
  azul = cambiarFase(uv, .95);

  vec4 color;
  color = vec4(hsb2rgb(vec3(rojo, verde, azul)), 1.0);
  color = vec4(rojo, verde, azul, 1.0);
  gl_FragColor = color;
}

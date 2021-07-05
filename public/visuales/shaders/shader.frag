//NAAN

precision highp float;

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
  for (int i = 0; i < 7; i++) {
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

float shape(vec2  p_, float siz){
  float figura;

  float r = length(p_);
  //float a = atan(p.x, p.y);

  figura = smoothstep(siz * 0.95, siz, r);

  return figura;
}

float poli(vec2  uv, vec2 pos, float siz, float n){
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

float poli(vec2  uv, float siz, float n){
  float figura = poli(uv, vec2(.5,.5), siz, n);

  return figura;
}

float blend(float A, float B, float factor){
  return A * factor + B; // BLEND
  // return (A * factor + B)/2.; // FIXED BLEND
}

float add(float A, float B, float factor){
  return min(A * factor + B, 1.); // ADD
}

float sub(float A, float B, float factor){
  return  max(B - A * factor, .0); // SUBTRACT
}

float dark(float A, float B, float factor){
  return  min(A * factor, B); // DARKEST
}

float light(float A, float B, float factor){
  return  max(A * factor, B); // LIGHTEST
}

float mult(float A, float B, float factor){
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

float voronoi(vec2 uv, float n, float m) {
  vec2 puv = pixelate(uv, n);
  vec2 cuv = celdate(uv, n);

  float m_dist = 1.;

  for (int y= -1; y <= 1; y++) {
    for (int x= -1; x <= 1; x++) {
      // Neighbor place in the grid
      vec2 neighbor = vec2(float(x),float(y));

      // Random position from current + neighbor place in the grid
      vec2 point = vec2(random(puv + neighbor));

			// Animate the point
      point = 0.5 + 0.5*sin(time * m + 6.2831 * point);

			// Vector between the pixel and the point
      vec2 diff = neighbor + point - cuv;

      // Distance to the point
      float dist = length(diff);

      // Keep the closer distance
      m_dist = min(m_dist, dist);
    }
  }

  return m_dist;
}

vec2 calei(float a, float r, float n, float v){
  vec2 uv;
  n = 1./(n/2.);
  uv.x = cos(mod(a+time*v, PI*n) - PI*.5)*r + .5;
  uv.y = sin(mod(a+time*v, PI*n) - PI*.5)*r + .5;
  return uv;
}

//ESTA ES MI FUNCION PRINCIPAL
float cambiarFase(vec2 uv, float fase){
  float fix = resolution.x/resolution.y;
  uv.x *= fix;

  vec2 puv = pixelate(uv, 128.);                    //UV pixelado
  vec2 cuv = celdate(uv, 3.);                       //UV dividido en celdas

  vec2 p = vec2(.5 * fix, .5) - uv;                 //PosiciOn
  float r = length(p);                              //Radio
  float a = atan(p.x, p.y);                         //Angulo

  // uv = calei(a, r, 6., .25);

  vec2 ruv = uv;                                    //UV para rotar el canvas completo
  ruv.x = cos(a + time*.5 - PI*.5)*r + .5;
  ruv.y = sin(a + time*.5 - PI*.5)*r + .5;

  float f1;                                         //Primera figura
  float f2;                                         //Segunda figura
  float fondo;

  // FONDO-------------
  float freq = 1.;
  fondo = 0.;
  for(float i = 0.; i<3.; i++){
    fondo = fbm(uv*(freq+fondo) + time * sin(i)*.25);
    freq *= 1.1;
  }
  fondo *= .75+fase;

  //F1-----------------
  f1 = 1. - voronoi(uv, 4., 1.)+.2;
  // f1 = smoothstep(.1, .2,f1);

  //F2-----------------
  f2 = random(uv);

  float factor = 1.;                                 //Factor a através del cual se calcula la transparencia
  factor = fase;

//Cambiando el orden de los diferentes 'return' da diferentes resultados y permite hacer una suerte de Debug
  return sub(fondo, f1, factor);
  return fondo;
  return f1;
  return mix(f1, f2, .5);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  float rojo;
  float verde;
  float azul;

//Cambiando el valor de cada color se construye una paleta diferente.
  rojo = cambiarFase(uv, .75);
  verde = cambiarFase(uv, .65);
  azul = cambiarFase(uv, 1.);

  vec4 color;
  color = vec4(rojo, verde, azul, 1.0);
  // color = vec4(hsb2rgb(vec3(rojo, verde, azul)), 1.); //Esta línea cambia completamente la paleta
  gl_FragColor = color;
}

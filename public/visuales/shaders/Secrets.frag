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

float subtract(float A, float B, float factor){
  return  max(B - A * factor, .0); // SUBTRACT
}

vec2 pixelate(vec2 puv, float factor){
  puv *= factor;
  puv = floor(puv);
  return puv;
}

float cambiarFase(vec2 uv, float fase){
  float fix = resolution.x/resolution.y;
  uv.x *= fix;

  vec2 puv = pixelate(uv, 8.);

  vec2 p = vec2(.5 * fix, .5) - uv;
  float r = length(p);
  float a = atan(p.x, p.y);

  // uv = calei(a, r, 6., .25);

  vec2 ruv = uv;
  ruv.x = cos(a + time*.5 - PI*.5)*r + .5;
  ruv.y = sin(a + time*.5 - PI*.5)*r + .5;

  float f1;
  float f2;
  float fondo;

  fondo = fbm(.05 * time + uv + fase * .1);
  fondo = fbm(uv*20. * fondo + time * .1 + fase);
  // fondo = fbm(uv * fondo + time * .1 + fase);

  f1 = random(pixelate(vec2(uv.x + sin(.025*time * cos(puv.x+time*.001)), uv.y), 8.));
  // f1 = voronoi(uv, 5., 1.);
  // f1 = noise(uv* 2. *
  //   noise(uv*2. + time) + time );
  f1 = smoothstep(.45, .75, f1);
  f1 = 1.-subtract(f1, fondo, 1.);

  return f1;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  // uv *= .5;

  float rojo;
  float verde;
  float azul;

  rojo = cambiarFase(uv, 1.);
  verde = cambiarFase(uv, .55);
  azul = cambiarFase(uv, .5);

  vec4 color;
  color = vec4(rojo, verde, azul, 1.0);
  gl_FragColor = color;
}

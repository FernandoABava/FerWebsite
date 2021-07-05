var sBang = `
float cambiarFase(vec2 uv, float fase){
  float forma = 0. ;

  float fix = resolution.x/resolution.y;

  uv.x *= fix;
//  uv = mat2(cos(PI*.1), -sin(PI*.1), sin(PI*.1), cos(PI*.1)) * (uv - 0.5);
  vec2 p = vec2(0.5 * fix, 0.5) - uv;
  float r = length(p);
  float a = atan(p.x, p.y);

  forma = smoothstep(fase, fase * 1.1, r + sin(time * .5 ) * 0.025 + 0.1);

  return forma;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  vec2 p = vec2(0.5, 0.5) - uv;
  float r = length(p);
  float a = atan(p.x, p.y);

  uv += sin(a);

  float rojo;
  float verde;
  float azul;

  for(float i = 1.; i<=12.; i ++){
    vec2 fuv = vec2(fract(uv.x * i+ cos(time*.1)), fract(uv.y * i + sin(time*.1)));
    rojo += cambiarFase(fuv, .9) * (i * .1);
    verde += cambiarFase(fuv, .97);
    azul += cambiarFase(fuv, .9) * ((12. - i) * .1);
  }

  vec4 color;
  color = vec4(rojo, verde, azul, 1.0);
  gl_FragColor = color;
} `

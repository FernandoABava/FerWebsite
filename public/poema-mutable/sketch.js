let poema;
let p;
let palabras;

var contenedor;
var columna;
var texto;

var body;
var bg;

function preload(){
  //poema = loadStrings('txt/poema.txt');
  p = loadStrings('./txt/palabras.txt');
}

function setup(){
  colorMode(HSB);

  palabras = new Array(p.length);
  for(var i = 0; i<p.length; i++){
    palabras[i] = p[i].split('-');
  }

  contenedor = createDiv();
  contenedor.class('container');

  texto = select('#poema');
  poema = texto.html();

  bg = color(random(255), 15, 255);
  body = select('#body');
  body.style('background', bg);
}

function draw(){

  if(millis()/1000 % 4 < .1){
    mutar();
  }

  var h = (sin(millis() * 0.0001) * 0.5 + 0.5);
  bg = color(h * 255, 15, 255);
  body.style('background', bg);
}

function mutar() {
  var r = random(palabras);
  var hecho = false;

  for (var i = 0; i<r.length; i++){
    if(!hecho){
      if(poema.includes(r[i])){
        poema = poema.replace(r[i], random(r));
        hecho = true;
      }
    }
  }

  texto.html(poema);
}

var colorFinal = 0;
var fondos = [];

function animarFondo(){
  var iLerp = 0;

  if(index < 4){
    iLerp = map(index, 0, 4, 0, 1);
    colorFinal = lerpColor(fondos[0], fondos[1], iLerp);
  } else if(index < 6){
    iLerp = map(index, 4, 6, 0, 1);
    colorFinal = lerpColor(fondos[1], fondos[2], iLerp);
  } else if(index < 9){
    iLerp = map(index, 6, 9, 0, 1);
    colorFinal = lerpColor(fondos[2], fondos[3], iLerp);
  } else if(index < 18){
    iLerp = map(index, 9, 18, 0, 1);
    colorFinal = lerpColor(fondos[3], fondos[4], iLerp);
  } else if(index < 24){
    iLerp = map(index, 18, 24, 0, 1);
    colorFinal = lerpColor(fondos[4], fondos[5], iLerp);
  } else if(index < 25){
    iLerp = map(index, 24, 25, 0, 1);
    colorFinal = lerpColor(fondos[5], fondos[6], iLerp);
  } else if(index < 27){
    iLerp = map(index, 25, 27, 0, 1);
    colorFinal = lerpColor(fondos[6], fondos[7], iLerp);
  } else if(index < 29){
    iLerp = map(index, 27, 29, 0, 1);
    colorFinal = lerpColor(fondos[7], fondos[8], iLerp);
  } else if(index < 33){
    iLerp = map(index, 29, 33, 0, 1);
    colorFinal = lerpColor(fondos[8], fondos[9], iLerp);
  } else if(index < 36){
    iLerp = map(index, 33, 36, 0, 1);
    colorFinal = lerpColor(fondos[9], fondos[10], iLerp);
  } else if(index < 37){
    iLerp = map(index, 36, 37, 0, 1);
    colorFinal = lerpColor(fondos[10], fondos[11], iLerp);
  } else{
    colorFinal = fondos[11];
  }

  //background(colorFinal);
  let body = select('#body');
  body.style('background-color', colorFinal);
}

function colorTexto() {
  var c = 0;
  console.log(brightness(colorFinal));
  if(brightness(colorFinal) > 60)
    c = 10;
  else
    c = 250;

  return color(c);
}

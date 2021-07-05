var index = 0;
var started = false;
function setup() {
  $('#verso').text(txt[index])
  $('button').click(function(event) {
    started = true;
    $('#how-to').hide();
    $('#poema').show();
  });

  fondos.length = 12;
  fondos[0] = color(250);          //0  Libro        10
  fondos[1] = color('#73E873');    //1  Dama         14
  fondos[2] = color('#745BE8');    //2  Sueño        20
  fondos[3] = color('#5BE7E8');    //3  Imperio      38
  fondos[4] = color(128);          //4  Esclave      50
  fondos[5] = color('#FF8B8B');    //5  Todos        52
  fondos[6] = color('#404081');    //6  Dormida      56
  fondos[7] = color('#814040');    //7  Cansada      60
  fondos[8] = color('#FF9831');    //8  Fuego        68
  fondos[9] = color('#4B2CE8');    //9 Sueño         74
  fondos[10] = color(10);          //10 Destrucción  76
  fondos[11] = color(250);         //11 Libertad
}

function draw() {
  animarFondo();
}

function keyPressed() {
  if(started){
    if (key == 'd' || key == 'D') {
      index ++;
      index = index > txt.length ? 0 : index;
    } else if (key == 'a' || key == 'A') {
      index --;
      index = index < 0 ? 0 : index;
    }
    siguienteVerso();
  }
}

function mouseReleased() {
  if(started){
    if(pwinMouseX > winMouseX) {
      index ++;
      index = index > txt.length ? 0 : index;
      siguienteVerso();
    }else if (pwinMouseX < winMouseX) {
      index --;
      index = index < 0 ? 0 : index;
      siguienteVerso();
    }
  }
}

function siguienteVerso(){
  animarFondo();
  $('#verso').text(txt[index]);
  var verso = select('#verso');
  verso.style('color', colorTexto())
  if(index == 0) $('#titulo').show();
  else $('#titulo').hide();
}

var cBg = {
  r: 253,
  g: 208,
  b: 133,
  a: 12
}

var time = 0;

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('#s-holder')
  background(cBg.r, cBg.g, cBg.b);
  smooth();
  colorMode(HSB, 255, 255,255)
}

function draw() {
  push();
  colorMode(RGB)
  background(cBg.r, cBg.g, cBg.b, cBg.a);
  pop();
  time = millis()/1000.0;
  cBg.a = cBg.a > 12 ? cBg.a - 5 : 12;

  if(width> height){
    if(window.location.href.endsWith('#home') || window.location.href.endsWith('/')){
      firstAnim();
    }else{
      secondAnim();
    }
  }
}

function mousePressed() {
  cBg.a = 200;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function firstAnim() {
  noFill()
  for (var i=0; i<10; i++){
    stroke(0 + 20* (10-i), 180, 200)
    var ns = .15;
    var bx = width*.6;
    var by = height*.15 + height*.08 * i;
    beginShape();
    curveVertex(bx, by);
    curveVertex(bx, by);
    for(var j=0; j<5; j++){
      var x = bx/10 + bx + bx/10 * j * (noise(j * ns + time *.09)+.5);
      var y = by * (noise(i*ns +j * ns + time * .06) +.5);
      curveVertex(x, y);
    }
    curveVertex(width, by);
    curveVertex(width, by);
    endShape();
  }

    push()
    fill(0, 180, 190)
    translate(width*.9, height*.7)
    ellipse(0, 0, height* .25)

    noFill()
    colorMode(RGB)
    stroke(cBg.r, cBg.g, cBg.b)
    for(var y = 0; y < 12; y++){
      bezier(0, -height*.125,
        height *.125 * sin(1.5 * time + y), -height *.05125,
        height *.125 * cos(1.25 * time + y), -height *.05125,
        0, height*.125);
    }
    pop()
}

function secondAnim(){
  noFill();
  for(let i = 0; i < 12; i++){
    stroke(100+i*4, 190, 180);
    bezier(0, height,
      width*.2, height-(height * .4 * sin(.5 * time + i )),
      width*.4, height-(height * .4 * cos(.25 * time + i )),
      width*.54, height)
  }
}

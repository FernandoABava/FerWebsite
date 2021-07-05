let shaderOnPlay;
let onFocus = true;
function preload() {
  shaderOnPlay = loadShader('shaders/empty.vert', 'shaders/Rings.frag');
}

function setup() {
    var cnv = createCanvas(windowWidth, windowHeight, WEBGL);
    cnv.parent(select('#canvas-holder'));
    pixelDensity(1);
    noStroke();
    rectMode(CENTER)
}

function draw() {
  if(shaderOnPlay && onFocus){
    shaderOnPlay.setUniform('resolution', [width, height]);
    shaderOnPlay.setUniform('time', millis()/1000.0);

    shader(shaderOnPlay);
    rect(width*.5, height*.5, width, height);
  }
}

function refreshShader(url) {
  var shader = loadShader('shaders/empty.vert', 'shaders/' + url, ()=>{
    shaderOnPlay = shader;
  })

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

$(window).focus(function() {
    onFocus = true;
});

$(window).blur(function() {
    onFocus = false;
});

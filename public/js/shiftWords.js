var saludos = ['Holi', 'Hola', 'Hi', 'Buenas', 'H:)']

$( document ).ready(function() {

  window.setInterval(()=>{ //Saludo que cambia solo
    var r = Math.random();
    r *= saludos.length;
    r = Math.floor(r);
    $('.b-h1').text(saludos[r]);
  }, Math.random() * 4000 + 3000);

  window.setInterval(()=>{ //Palabras que cambian solas
    var arr = $('.rw').data('w').split(',')
    $('.rw').text(randomWords(arr));
  }, Math.random() * 4000 + 1500);

  // $('a[href="#prod"]').click(function(event) { //Comportamiento cuando vamos a la sección de producción
  //   $('#home').hide('slow');
  // });
  //
  // $('a[href="#home"]').click(function(event) { //Comportamiento cuando vamos al inicio
  //   $('#prod').hide('slow');
  //   $('#prod').find('.h').hide('slow');
  // });

});

function randomWords(arr){
  var r = Math.random();
  r *= arr.length;
  r = Math.floor(r);

  return arr[r];
}

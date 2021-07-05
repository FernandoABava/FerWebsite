$(document).ready(function() {
  $('.h').hide(); //Esconder todo lo que no tenga que verse inmediatamente

  $('a').each(function(index, el) {
    var hr = $(el).attr('href');
    if(hr.startsWith('http'))
    $(el).find('li').append('&#x2197;') //Agregar la flechita diagonal a todos los links que nos saquen de la página
  });

});


function aShowHide() {
  $('a').click(function(event) { //Comportamiento cuando se quiere mostrar otra sección de la página
    var hr = $(this).attr('href');
    if(hr.startsWith('#') && hr != '#home' || hr != '#prod'){
      $('.sub-a').hide('fast')
      $(hr).show('slow');
    }
  });
}

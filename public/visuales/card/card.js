function loadAllCards(parent, url) {
  $.getJSON(url, function (j) {
    j.shaders.forEach((data, i) => {
      loadCard(parent, data)
    });
    cardsInit();
  });
}

function loadCard(parent, data) {
  var url = './card/card.html'
  var $card = $('<div>', {class: 'card'})
  $(parent).append($card)
  $card.load(url,
    function( response, status, xhr ) {
      if ( status == "success" || status == "notmodified" ) {
        $(this).find('img').attr('src', data.img);
        $(this).find('.c-title').html(data.title);
        $(this).find('.card-heading').data('fullname', data.name);

        cardsInit(this)
        /*
        ¿¿¿Y el más info???
        Ni idea de cómo manejarlo
        */
      }
    }
  );

}

function cardsInit(th) {
  $(th).find('.c-info').hide();
  $('.c-img').find('img').css('filter', 'brightness(50%) grayscale(100%)');

  $(th).find('.card-heading').click(function(event) {
    var url = $(this).data('fullname');
    refreshShader(url)
    var t = $(this).find('.c-title').text();
    $('.ipb-title').html('► : <strong>' + t + '</strong>');
  });

  $(th).hover(function() {
    $(this).find('.c-info').show('fast');
    $(this).find('img').css('filter', 'brightness(100%) grayscale(0%)');
  }, function() {
    $(this).find('.c-info').hide('fast');
    $(this).find('img').css('filter', 'brightness(50%) grayscale(100%)');
  });
}

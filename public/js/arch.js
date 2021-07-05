var docLoaded = false;
var listCreated = false;
var data;

$.getJSON('../contenido.json', function(json) {
    data = json.prods
    if(docLoaded){
      createMList(data);
      aShowHide();
    }
});

$( document ).ready(function() {
  docLoaded = true;
  if(data && !listCreated){
    createMList(data);
    aShowHide();
  }
  console.log(listCreated, data);
});

function createMList(data) {
  listCreated = true;
  data.forEach((prod, i) => {
    var cl = prod.is ? 'li-sutil' : 'li-not';
    var $li = $('<li>', {"class":cl})
    $li.text(prod.title)

    if(prod.is){
      var $a = $('<a>', {"class":cl, href:'#sub-list'})
      $a.append($li);
      $a.click(function(event) {
        $('#caption').hide('fast');
        $('#sub-list').html('<ul></ul>');
        prod.content.forEach((item, i) => {
          createSubList(item);
        });
      });
      $('#prod-holder').append($a);
    }else {
      $('#prod-holder').append($li);
    }
  });
}

function createSubList(prod) {
  var $li = $('<li>')
  $li.text(prod.title)

  if(prod.is){
    var $a = $('<a>', {href:'#caption'})
    $a.append($li);

    $a.click(function(event) {
      $cap = $('#caption');
      $cap.hide('fast');

      var cap = loadTxt(prod.caption);
      $cap.find('img').attr('src', prod.img)
      $cap.find('img').attr('alt', prod.alt)
      $cap.find('p').html(cap);
      $cap.find('a').attr('href', prod.link);
      $('#caption').show('slow');
    });

    $('#sub-list').find('ul').append($a);
  }else {
    $li.addClass('li-not');
    $('#sub-list').find('ul').append($li);
  }
}

function loadTxt(url) {
  var s = $.ajax({
    url: url,
    async: false
  }).responseText;

  return s;
}

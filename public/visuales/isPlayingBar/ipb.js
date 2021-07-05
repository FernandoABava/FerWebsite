var tpar = 0;
function loadIPB(title){
  $('#is-playing').load('./isPlayingBar/ipb.html',
    function( response, status, xhr ) {
      if ( status == "success" || status == "notmodified" ) {
        $('.ipb-title').html('► : <strong>' + title + '</strong>');
        $('.ipb-toggle').click(function(event) {
          tpar++;
          $('div:not(#is-playing, #canvas-holder, .nh)').fadeToggle('fast');
          var src = tpar%2 >= 1 ? 'isPlayingBar/show.png' : 'isPlayingBar/hide.png';
          $(this).find('img').attr('src', src);
        });
      }
    }
  );

}

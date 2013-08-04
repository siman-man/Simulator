/**
 * The control panel.
 */

 $(document).ready(function(){
   var Panel = {
    init: function() {
      var $algo = $('#algorithm_panel');

      $('.panel').draggable();
      $('.accordion').accordion({
        collapsible: true,
      });
      $('.option_label').click(function() {
        $(this).prev().click();
      });

      $('#play_panel').css({
        top: $algo.offset().top + $algo.outerHeight() + 20
      });
    },
  };

  Panel.init();
});

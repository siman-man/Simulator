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
        heightStyle: "fill",
      });
      $('.server_info').accordion({
        collapsible: true,
        heightStyle: "fill",
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

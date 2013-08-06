// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require turbolinks
//= require jquery.ui.all
//= require_tree .


$(document).ready(function(){
  var WS = Simulator;
  $( "div#master" ).slider({
    value: 0.0,
    min: 0.0,
    max: 1.0,
    step: 0.005,
    range: "min",
    slide: function(event, ui){
      $('span#tx_power').text($('#master').slider('value') + 'mW');
      
      if(Simulator.selected_target != -1){
        var node = WS.server_list[WS.selected_target];
        node.tx_power = $('#master').slider('value');
        Wireless.clearCircle(WS.server_list[node.id]);
        node.communication_range = Wireless.createCommunicationRangeCircle(node.x, node.y, "blue", Wireless.calcRnageSize(node));
        WS.addChild(node.communication_range);
      }
    }
  });

  Simulator.init();
  Human.init();
  canvas.addEventListener('dblclick', Wireless.onmousedown, false);
});

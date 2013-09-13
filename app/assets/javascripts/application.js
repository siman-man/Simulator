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
//= require jquery.remotipart
//= require jquery.iframe-transport.js
//= require_tree .


$(document).ready(function(){
  Panel.init();
  View.drawGrid()
  View.init();
  Network.init();
  Simulator.init();
  Street.init();
  canvas.addEventListener('mousedown', Simulator.onmousedown, false);
  canvas.addEventListener('mousemove', Simulator.onmousemove, false);
  canvas.addEventListener('mouseup', Simulator.onmouseup, false);
});

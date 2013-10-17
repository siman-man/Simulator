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

  canvas.addEventListener("contextmenu", function(e){
    e.preventDefault();
  }, false);
});
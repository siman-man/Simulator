$(document).ready(function(){
  Panel.init();
  View.drawGrid()
  View.init();
  Network.init();
  Simulator.init();
  Street.init();

  Simulator.canvas.addEventListener('mousedown', Simulator.onmousedown, false);
  Simulator.canvas.addEventListener('mousemove', Simulator.onmousemove, false);
  Simulator.canvas.addEventListener('mouseup', Simulator.onmouseup, false);

  Simulator.canvas.addEventListener("contextmenu", function(e){
    e.preventDefault();
  }, false);

  if( Simulator.replay ){
    $("#stage1").click();
  }else{
    $("#stage1").click();
  }
});
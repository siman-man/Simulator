$(document).ready(function(){

  if( Simulator.stage_change === undefined ){
    Panel.init();
    View.drawGrid()
    View.init();
    Network.init();
    Simulator.init();
    Search.init();
    Street.init();
  }

  var route = [{ y: 5, x: 5 }, { y: 5, x: 6 }];
  //View.route_view(route);

  Simulator.canvas.addEventListener('mousedown', Simulator.onmousedown, false);
  Simulator.canvas.addEventListener('mousemove', Simulator.onmousemove, false);
  Simulator.canvas.addEventListener('mouseup', Simulator.onmouseup, false);

  Simulator.canvas.addEventListener("contextmenu", function(e){
    e.preventDefault();
  }, false);

  if( Simulator.stage_change === undefined ){
    console.log('non edit mode =>');
    if( Simulator.edit_mode ){
      Node.create( 10, 10, 'start' );
      Node.create( 20, 10, 'end' );
    }else{
      console.log($("#stage_type option:selected").text());
      $.ajax({
        type: "post",
        url: "/stage_init",
        data: {
          stage_type: $("#stage_type option:selected").text()
        },
      });
    }
  }else{
    $("#filename").val(Simulator.file_name);
  }
});
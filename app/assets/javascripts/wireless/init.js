var Init = {
  init: function(){
    console.log("ready =>");
    if( Simulator.stage_change === undefined ){
      console.log('first init=>');
      Config.init();
      Init.field();
      Simulator.getCanvasInfo();
      Panel.init();
      View.init();
      View.drawGrid();
      Propagation.init();
      Network.init();
      Simulator.init();
      Search.init();
    }

    this.addMouseEvent();

    if( Simulator.stage_change === undefined ){
      console.log('non edit mode =>');
      if( Simulator.edit_mode ){
        Node.create( 10, 10, { type: 'start' });
        Node.create( 20, 10, { type: 'end' });
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
  },

  addMouseEvent: function(){
    Simulator.canvas.addEventListener('mousedown', Simulator.onmousedown, false);
    Simulator.canvas.addEventListener('mousemove', Simulator.onmousemove, false);
    Simulator.canvas.addEventListener('mouseup', Simulator.onmouseup, false);
    Simulator.canvas.addEventListener("mousewheel" , Simulator.onmousewheel, false);

    Simulator.canvas.addEventListener("contextmenu", function(e){
      e.preventDefault();
    }, false);
  },

  field: function(){
    var width = View.width * View.gridSize,
        height = View.height * View.gridSize,
        str = "<canvas id='canvas' width='" + width + "' height='" + height + "'></canvas>";
    
    $("#canvas_field").append(str);
  }
}

$(document).ready(function(){
  Init.init();
});
var Library = {
  mousePressHandler: function(e) {
    console.log("mousePressHandler =>");
    var node = e.target;
    var WS = Simulator;
    
    WS.operation_flag = true;
    node.offsetX = node.x - e.stageX;
    node.offsetY = node.y - e.stageY; 
  
    WS.selected_target = node.id;

    e.onMouseMove = Library.mouseMoveHandler;
    e.onMouseUp = Library.mouseUpHandler;
  },

  mouseMoveHandler: function(e){
    console.log("mouseMoveHandler =>");
    var node = e.target;
    var x = e.stageX + node.offsetX;
    var y = e.stageY + node.offsetY;

    var coord = View.point2coord(x, y);

    node.x = coord.x * View.gridSpan;
    node.y = coord.y * View.gridSpan;
  },

  mouseUpHandler: function(e){
    console.log("mouseUpHandler =>");
    var node = e.target;
    Simulator.operation_flag = false;
  }
};

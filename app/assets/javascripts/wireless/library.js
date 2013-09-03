var Library = {
  mousePressHandler: function(e) {
    var node = e.target;
    var WS = Simulator;
    
    node.drag = true;
    WS.operation_flag = true;
    node.offsetX = node.x - e.stageX;
    node.offsetY = node.y - e.stageY; 
  
    WS.selected_target = node.id;
    if(node.ob_type == 'access_point'){
      $("span#node_id").text(node.id);
      $("div#master").slider('value', WS.server_list[node.id].tx_power);
      $("span#tx_power").text(WS.server_list[node.id].tx_power);
    }
  
    e.onMouseMove = Library.mouseMoveHandler;
    e.onMouseUp = Library.mouseUpHandler;
  },

  mouseMoveHandler: function(e){
    var node = e.target;
    var x = e.stageX + node.offsetX;
    var y = e.stageY + node.offsetY;

    var coord = View.point2coord(x, y);

    node.x = coord.x * View.gridSpan;
    node.y = coord.y * View.gridSpan;
    if(node.ob_type == 'access_point'){
      node.communication_range.x = node.x;
      node.communication_range.y = node.y;
    }
  },

  mouseUpHandler: function(e){
    var node = e.target;
    node.drag = false;
    console.log("Mouseup");
  }
};

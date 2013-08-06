
var Library = {
  mousePressHandler: function(e) {
    var node = e.target;
    var WS = Simulator;
    node.drag = true;
    WS.operation_flag = true;
    node.offsetX = node.x - e.stageX;
    node.offsetY = node.y - e.stageY; 
  
    WS.selected_target = node.id;
    $("span#node_id").text(node.id);
    if(node.ob_type == 'access_point'){
      $("div#master").slider('value', WS.server_list[node.id].tx_power);
      $("span#tx_power").text(WS.server_list[node.id].tx_power);
    }

    console.log(WS.selected_target);
  
    e.onMouseMove = Library.mouseMoveHandler;
    e.onMouseUp = Library.mouseUpHandler;
  },

  mouseMoveHandler: function(e){
    var node = e.target;
    console.log(e.stageX);
    console.log(node.id);

    node.x = e.stageX + node.offsetX;
    node.y = e.stageY + node.offsetY;
    if(node.ob_type == 'access_point'){
      node.communication_range.x = e.stageX + node.offsetX;
      node.communication_range.y = e.stageY + node.offsetY;
    }
  },

  mouseUpHandler: function(e){
    var node = e.target;
    node.drag = false;
    console.log("Mouseup");
  }
};

function mousePressHandler(e) {
  var node = e.target;
  node.drag = true;
  node.offsetX = node.x - e.stageX;
  node.offsetY = node.y - e.stageY; 
  
  simulator.selected_target = node.id;
  
  e.onMouseMove = mouseMoveHandler;
  e.onMouseUp = mouseUpHandler;
}


function mouseMoveHandler(e){
  var node = e.target;
  console.log(e.stageX);
  console.log(node.id);

  node.x = e.stageX + node.offsetX;
  node.y = e.stageY + node.offsetY;
  node.communication_range.x = e.stageX + node.offsetX;
  node.communication_range.y = e.stageY + node.offsetY;
}

function mouseUpHandler(e){
  var node = e.target;
  node.drag = false;
  console.log("Mouseup");
}

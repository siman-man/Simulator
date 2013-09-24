var Library = {
  mousePressHandler: function(e) {
    console.log("mousePressHandler =>");

    var delete_type = $("input[name='delete_object']:checked").val(),
        node = e.target;

    console.log(delete_type);
    if(delete_type != "server"){

      Simulator.operation_flag = true;
      node.offsetX = node.x - e.stageX;
      node.offsetY = node.y - e.stageY; 

      Simulator.selected_target = node.id;

      e.onMouseMove = Library.mouseMoveHandler;
      e.onMouseUp = Library.mouseUpHandler;
    }
  },

  mouseMoveHandler: function(e){
    console.log("mouseMoveHandler =>");

    var node = e.target,
        x = e.stageX + node.offsetX,
        y = e.stageY + node.offsetY,
        coord = View.point2coord(x, y);

    node.x = coord.x * gridSize;
    node.y = coord.y * gridSize;
  },

  mouseUpHandler: function(e){
    console.log("mouseUpHandler =>");
    var node = e.target;

    Simulator.operation_flag = false;
  },

  sample: function(array, num){
    
    if(array.length === 0) return [];

    var new_array = [],
        check_list = {},
        size = array.length,
        i, index;

    for( i = 0; i < num; i++){
      index = Math.random() * size | 0;
      while(check_list[index] !== undefined){
        index = Math.random() * size | 0;
      }
      new_array.push(array[index]);
      check_list[index] = true;
    }

    return new_array;
  },
};

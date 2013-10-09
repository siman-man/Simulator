var Library = {
  mousePressHandler: function(e) {
    console.log("mousePressHandler =>");

    var delete_type = $("input[name='delete_object']:checked").val(),
        node = e.target;

    if(delete_type != "server"){

      Simulator.operation_flag = true;
      node.offsetX = node.x - e.stageX;
      node.offsetY = node.y - e.stageY; 

      Simulator.selected_target = node.id;

      e.onMouseMove = Library.mouseMoveHandler;
      e.onMouseUp = Library.mouseUpHandler;
    }
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

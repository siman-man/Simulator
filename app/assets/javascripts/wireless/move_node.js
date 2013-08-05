
var Move = {
  move_node: function(node){
    var min_rssi = Wireless.error_rssi;
    var min_id = -1;
  
    for(id in node.neighbor_node_list){
      var neighbor = node.neighbor_node_list[id];
    
      var rssi = node.neighbor_rssi_list[neighbor.id];
    
      if(min_rssi < rssi){
        min_rssi = rssi;
        min_id = id;
      }
    }
  
    if(min_id != -1){
      if(min_rssi < -75){
        this.approachNode(node, neighbor);
      }
    }else{
      this.randomWalk(node, 'ap');
   }
  },


  randomWalk: function(node, type){
    var node_speed = Wireless.node_speed;
    var num = Math.random();
    if(num > 0.75){
      node.x += node_speed;
      if(type == 'ap') node.communication_range.x += node_speed;
    }else if(num > 0.5){
      node.y += node_speed;
      if(type == 'ap') node.communication_range.y += node_speed;
    }else if(num > 0.25){
      node.x -= node_speed;
      if(type == 'ap') node.communication_range.x -= node_speed;
    }else{
      node.y -= node_speed;
      if(type == 'ap') node.communication_range.y -= node_speed;
    }
  },

  approachNode: function(my, neighbor){
    var node_speed = Wireless.node_speed;
    if(my.x > neighbor.x){
      my.x -= node_speed;
      my.communication_range.x -= node_speed;
    }else{
      my.x += node_speed;
      my.communication_range.x += node_speed;
    }
  
    if(my.y > neighbor.y){
      my.y -= node_speed;
      my.communication_range.y -= node_speed;
    }else{
      my.y += node_speed;
      my.communication_range.y += node_speed;
    }
  },
};


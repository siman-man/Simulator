var MoveModel = {

  randomWayPoint: function(user){
  	user.way_point = user.way_point || this.directWayPoint(user);

    if(user.way_point) this.moveToWayPoint(user, 5);
    if(this.checkArrive(user)){
      user.way_point = null;
      Simulator.map.removeChild(Search.point);
      Search.point = undefined;
    }
  },

  sampleMove: function(user){
    if(user.state.current == 'move'){
      user.way_point = user.way_point || this.directWayPointServer(user);

      if(user.way_point){ 
        this.moveToWayPoint(user, 5);
        if(this.checkArrive(user)){
          user.way_point = null;
          user.state.rest(user);
          user.stop_count = this.createStopCount();
        }
      }
    }else{
      user.stop_count -= 1;
      if(user.stop_count == 0) user.state.walk();
    }
  },

  directWayPoint: function(user){
    var x = Math.random() * View.width/2 | 0;
    var y = Math.random() * View.height/2 | 0;
    var coord = View.point2coord( user.x, user.y );

    user.route_list = Search.find({ x: coord.x, y: coord.y }, { x: x, y: y});
    return {x: x, y: y};
  },

  shuffle: function(array){
    var t, j = k = 0;
    var size = array.length;
    for(var i = 0; i < size; i++){
      j = Math.random() * size | 0;
      t = array[j];
      array[j] = array[k];
      array[k] = t;
      k = j;
    }
  },

  createCircuit: function(){
    var circuit = [];
    for(var i in Simulator.server_list){
      circuit.push(i);
    }
    this.shuffle(circuit);
    return circuit;
  },

  directWayPointServer: function(user){
    if(user.circuit.length == 0){
      user.circuit = this.createCircuit();
    } 
    if(user.circuit.length == 0) return undefined;

    var id = user.circuit.shift();
    var x = Simulator.server_list[id].x;
    var y = Simulator.server_list[id].y;
    return {x: x, y: y};
  },

  moveToWayPoint: function(user, speed){
    var point = user.route_list[0];
    var dx = point.x - user.x;
    var dy = point.y - user.y;
    var radian = Math.atan2(dy, dx);

    if(dx > 0) user.x += speed;
    if(dy > 0) user.y += speed;
    if(dx < 0) user.x -= speed;
    if(dy < 0) user.y -= speed;

    if(user.x == point.x && user.y == point.y){
      user.route_list.shift();
    }
  },

  checkArrive: function(user){
    var dx = user.x - user.way_point.x * View.gridSpan;
    var dy = user.y - user.way_point.y * View.gridSpan;
    return ( dx == 0 && dy == 0 )? true : false;
  },

  createStopCount: function(){
    var minimum_stop = 20;
    return 20 + Math.random() * 100 | 0;
  }
};
var MoveModel = {

  randomWayPoint: function(user){
    console.log(user.state.current)

  	user.way_point = user.way_point || this.directWayPoint();

    this.moveToWayPoint(user, 5);
    if(this.checkArrive(user)) user.way_point = null;
  },

  sampleMove: function(user){
    if(user.state.current == 'move'){
      user.way_point = user.way_point || this.directWayPointServer(user);
      this.moveToWayPoint(user, 5);
      if(this.checkArrive(user)){
        user.way_point = null;
        user.state.rest(user);
        user.stop_count = this.createStopCount();
      }
    }else{
      user.stop_count -= 1;
      if(user.stop_count == 0) user.state.walk();
    }
  },

  directWayPoint: function(){
    var x = Math.random() * Simulator.canvas_width * 1.1;
    var y = Math.random() * Simulator.canvas_height * 1.1;
    return {x: x, y: y};
  },

  jitter: function(jitter){
    var jitter = jitter || 30;
    var value = Math.random() * jitter;

    return (0.5 < Math.random())? -1 * value : value;
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
    for(var i = 0; i < Simulator.server_list.length; i++){
      circuit.push(i);
    }
    this.shuffle(circuit);
    return circuit;
  },

  directWayPointServer: function(user){
    console.log(user.circuit.length);
    if(user.circuit.length == 0){
      user.circuit = this.createCircuit();
    } 
    
    var id = user.circuit.shift();
    var x = Simulator.server_list[id].x + this.jitter();
    var y = Simulator.server_list[id].y + this.jitter();
    return {x: x, y: y};
  },

  moveToWayPoint: function(user, speed){
    var dx = user.way_point.x - user.x;
    var dy = user.way_point.y - user.y;
    var radian = Math.atan2(dy, dx);

    user.x += Math.cos(radian) * speed;
    user.y += Math.sin(radian) * speed;
  },

  checkArrive: function(user){
    var dx = user.x - user.way_point.x;
    var dy = user.y - user.way_point.y;
    return ( dx * dx + dy * dy <= 16 )? true : false;
  },

  createStopCount: function(){
    var minimum_stop = 20;
    return 20 + Math.random() * 100 | 0;
  }
};
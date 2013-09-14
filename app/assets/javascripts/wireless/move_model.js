var MoveModel = {

  randomWayPoint: function(user){
  	user.way_point = user.way_point || this.directWayPoint(user);

    if(user.way_point){
      this.moveToWayPoint(user, 5);
    }

    if(this.checkArrive(user)){
      user.way_point = undefined;
      Simulator.map.removeChild(Search.point);
      Search.point = undefined;
    }
  },

  home2office: function(user, home, office){
    if(user.state.current != 'travel2work') return undefined;

    user.way_point = { x: office.x, y: office.y };
    user.route_list = Search.find({ x: home.x, y: home.y }, user.way_point);
  },

  office2home: function(user, office, home){
    if(user.state.current != 'go_home') return undefined;

    user.way_point = { x: home.x, y: home.y };
    user.route_list = Search.find({ x: office.x, y: office.y }, user.way_point);
  },

  sampleMove: function(user){
    if(user.state.current == 'move'){
      user.way_point = user.way_point || this.directWayPointServer(user);

      if(user.way_point){ 
        this.moveToWayPoint(user, 5);
        if(this.checkArrive(user)){
          user.way_point = undefined;
          user.state.rest(user);
          user.stop_count = this.createStopCount();
        }
      }
    }else{
      user.stop_count -= 1;
      if(user.stop_count === 0){
        user.state.walk();
      }
    }
  },

  worker: function(user){
    switch(user.state.current){
      case 'home':
        if(user.office !== undefined){
          var coord = View.point2coord(user.office.x, user.office.y);
          this.setRoute(user, coord);
          user.state.go_office();
        }
        break;
      case 'commute':
        this.moveToWayPoint(user, 5);
        if(this.checkArrive(user)){
          user.way_point = undefined;
          Simulator.map.removeChild(Search.point);
          Search.point = undefined;
          user.state.working(user);
        }
        break;
      case 'work':
        console.log('working =>');
        if(user.home !== undefined){
          var coord = View.point2coord(user.home.x, user.home.y);
          this.setRoute(user, coord);
          user.state.go_home();
        }
        break;
      case 'homecoming':
        this.moveToWayPoint(user, 5);
        if(this.checkArrive(user)){
          user.way_point = undefined;
          Simulator.map.removeChild(Search.point);
          Search.point = undefined;
          user.state.rest(user);
        }
        break;
      default:
      console.log('rest');
    }
  },

  setRoute: function(user, to){
    var coord = View.point2coord( user.x, user.y );

    user.way_point = { x: to.x, y: to.y };
    user.route_list = Search.find({ x: coord.x, y: coord.y }, { x: to.x, y: to.y});
  },

  directWayPoint: function(user){
    var x = Math.random() * View.width/2 | 0,
        y = Math.random() * View.height/2 | 0,
        coord = View.point2coord( user.x, user.y );

    user.route_list = Search.find({ x: coord.x, y: coord.y }, { x: x, y: y});

    return {x: x, y: y};
  },

  shuffle: function(array){
    var t, j, k, i, size;
    
    for(i = 0, size = array.length; i < size; i++){
      j = Math.random() * size | 0;
      t = array[j];
      array[j] = array[k];
      array[k] = t;
      k = j;
    }
  },

  createCircuit: function(){
    var circuit = [], i;
    for( i in this.server_list ){
      circuit.push(i);
    }
    this.shuffle(circuit);
    return circuit;
  },

  directWayPointServer: function(user){
    var id, x, y;
    if(user.circuit.length === 0){
      user.circuit = this.createCircuit();
    } 

    if(user.circuit.length === 0) return undefined;

    id = user.circuit.shift(),
    x = this.server_list[id].x,
    y = this.server_list[id].y;
    
    return {x: x, y: y};
  },

  moveToWayPoint: function(user, speed){
    var point = user.route_list[0],
        dx = point.x - user.x,
        dy = point.y - user.y,
        radian = Math.atan2(dy, dx);

    if(dx > 0) user.x += speed;
    if(dy > 0) user.y += speed;
    if(dx < 0) user.x -= speed;
    if(dy < 0) user.y -= speed;

    if(user.x === point.x && user.y === point.y){
      user.route_list.shift();
    }
  },

  checkArrive: function(user){
    var dx = user.x - user.way_point.x * View.gridSpan,
        dy = user.y - user.way_point.y * View.gridSpan;
    
    return ( dx === 0 && dy === 0 )? true : false;
  },

  createStopCount: function(){
    var minimum_stop = 20;
    return 20 + Math.random() * 100 | 0;
  }
};
var MoveModel = {
  user_speed: 1.5,
  randomWayPoint: function(user){
  	user.way_point = user.way_point || this.directWayPoint(user);

    if(user.way_point){
      this.moveToWayPoint(user, this.user_speed);
    }

    if(this.checkArrive(user)){
      user.way_point = undefined;
      Simulator.map.removeChild(Search.point);
      Search.point = undefined;
    }
  },

  randomWalk: function(user){
    user.way_point = user.way_point || this.directRandomWalkPoint(user);

    if(user.way_point){
      this.moveToWayPoint(user, this.user_speed);
    }

    if(this.checkArrive(user)){
      user.way_point = undefined;
      Simulator.map.removeChild(Search.point);
      Search.point = undefined;
    }
  },

  traceMoveModel: function(user){
    if( user.path_length === 1 ) return;

    if( user.way_point === undefined ){
      user.way_point = user.path[user.path_index];
      if( user.close_path ){
        user.path_index = (user.path_index + 1) % user.path_length;
      }else{
        user.path_index = user.path_index + user.step;
        if( user.path_index === user.path_length - 1 ){
          user.step = -1;
        }else if( user.path_index === 0 ){
          user.step = 1;
        }
      }
    }

    if(user.way_point){
      this.moveToNextPoint(user, this.user_speed);
    }
    
    if(this.checkArrive(user)){
      if( user.way_point.wait === user.stop_time ){
        user.way_point = undefined;
        user.stop_time = 0;
      }else{
        user.stop_time++;
      }
    }
  },

  home2office: function(user, home, office){
    if(user.state.current !== 'travel2work') return undefined;

    user.way_point = { x: office.x, y: office.y };
    user.route_list = Search.find({ x: home.x, y: home.y }, user.way_point);
  },

  office2home: function(user, office, home){
    if(user.state.current !== 'go_home') return undefined;

    user.way_point = { x: home.x, y: home.y };
    user.route_list = Search.find({ x: office.x, y: office.y }, user.way_point);
  },

  sampleMove: function(user){
    if(user.state.current === 'move'){
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
    var x,
        y,
        coord = View.point2coord( user.x, user.y );
    while(true){
      x = Simulator.mersenne.random() * View.width * 0.85 | 0;
      y = Simulator.mersenne.random() * View.height * 0.85 | 0;
      if( Simulator.field[y][x].type != 'tree' ) break;
    }

    user.route_list = Search.find({ x: coord.x, y: coord.y }, { x: x, y: y});

    if(user.route_list.length === 0){
      console.log('reload')
      user.route_list.push({x: coord.x * View.gridSize, y: coord.y * View.gridSize});
    }

    return {x: x, y: y};
  },

  directRandomWalkPoint: function(user){
    var x,
        y,
        direct,
        length,
        coord = View.point2coord( user.x, user.y );
    while(true){
      direct = Simulator.mersenne.random() * 4 | 0;
      length = Simulator.mersenne.random() * 20 | 0;
      x = coord.x + View.dx[direct] * length;
      y = coord.y + View.dy[direct] * length;
      if( View.isInside( y, x ) && Simulator.field[y][x].type != 'tree' ) break;
    }

    user.route_list = Search.find({ x: coord.x, y: coord.y }, { x: x, y: y});

    if(user.route_list.length === 0){
      console.log('reload')
      user.route_list.push({x: coord.x * View.gridSize, y: coord.y * View.gridSize});
    }

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

  moveToNextPoint: function( user, speed ){
    var dx = user.way_point.x * gridSize - user.x,
        dy = user.way_point.y * gridSize - user.y;

    if(dx > 0) user.x += user.speed;
    if(dy > 0) user.y += user.speed;
    if(dx < 0) user.x -= user.speed;
    if(dy < 0) user.y -= user.speed;
  },

  moveToWayPoint: function(user, speed){
    var point = user.route_list[0],
        dx = point.x - user.x,
        dy = point.y - user.y;

    if(dx > 0) user.x += user.speed;
    if(dy > 0) user.y += user.speed;
    if(dx < 0) user.x -= user.speed;
    if(dy < 0) user.y -= user.speed;

    if(user.x === point.x && user.y === point.y){
      user.route_list.shift();
    }
  },

  checkArrive: function(user){
    var dx = user.x - user.way_point.x * gridSize,
        dy = user.y - user.way_point.y * gridSize;
    
    return ( dx === 0 && dy === 0 )? true : false;
  },

  createStopCount: function(){
    var minimum_stop = 20;
    return 20 + Math.random() * 100 | 0;
  }
};
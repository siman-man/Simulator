var MoveModel = {
  EPS: 1e-8,

  randomWayPoint: function(user){
  	user.way_point = user.way_point || this.directWayPoint(user);

    if(user.way_point){
      this.moveToWayPoint(user);
    }

    if(this.checkArrive(user)){
      user.way_point = undefined;
    }
  },

  randomWalk: function(user){
    user.way_point = user.way_point || this.directRandomWalkPoint(user);

    if(user.way_point){
      this.moveToWayPoint(user);
    }

    if(this.checkArrive(user)){
      user.way_point = undefined;
    }
  },

  mapRouteMovement: function(user){
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
      this.moveToNextPoint(user);
    }
    
    if(this.checkArrive(user)){
      user.x = user.way_point.x * gridSize;
      user.y = user.way_point.y * gridSize;
      if( user.way_point.wait === user.stop_time ){
        user.way_point = undefined;
        user.stop_time = 0;
      }else{
        user.stop_time++;
      }
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
      x = Simulator.mersenne.random() * View.width * 1.0 | 0;
      y = Simulator.mersenne.random() * View.height * 1.0 | 0;
      if( Simulator.field[y][x].type != 'wall' ) break;
    }

    user.route_list = Search.find({ x: coord.x, y: coord.y }, { x: x, y: y });

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
      if( View.isInside( y, x ) && Simulator.field[y][x].type != 'wall' ) break;
    }

    user.route_list = Search.find({ x: coord.x, y: coord.y }, { x: x, y: y});

    if(user.route_list.length === 0){
      console.log('reload')
      user.route_list.push({x: coord.x * View.gridSize, y: coord.y * View.gridSize});
    }

    return {x: x, y: y};
  },

  moveToNextPoint: function(user){
    var dx = user.way_point.x * gridSize - user.x,
        dy = user.way_point.y * gridSize - user.y;
    if(dx > this.EPS){
      user.x += user.speed;
    }else if(dy > this.EPS){
      user.y += user.speed;
    }else if(dx < -this.EPS){
      user.x -= user.speed;
    }else if(dy < -this.EPS){
      user.y -= user.speed;
    }
  },

  moveToWayPoint: function(user){
    var point = user.route_list[0],
        dx = point.x - user.x,
        dy = point.y - user.y;

    if(dx > this.EPS){
      user.x += user.speed;
    }else if(dy > this.EPS){
      user.y += user.speed;
    }else if(dx < -this.EPS){
      user.x -= user.speed;
    }else if(dy < -this.EPS){
      user.y -= user.speed;
    }

    if( Math.abs(dx) <= this.EPS && Math.abs(dy) <= this.EPS ){
      user.x = point.x;
      user.y = point.y;
      user.route_list.shift();
    }
  },

  checkArrive: function(user){
    var dx = Math.abs(user.x - user.way_point.x * gridSize),
        dy = Math.abs(user.y - user.way_point.y * gridSize);
    
    return ( dx <= this.EPS && dy <= this.EPS )? true : false;
  },
};
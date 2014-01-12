var Node = {
	eid: 0,
	node_list: {},

  init: function(){
    var node,
        from_eid,
        dest_eid;

    console.log('connection init =>');

    for( from_eid in this.node_list ){
      node = this.node_list[from_eid];
      if( node.speed !== 0 ){
        node.speed = gridSize / node.speed;
      }

      if( node.path !== undefined ){
        node.close_path = this.isCloseRoute( node.path );
      }
      for( dest_eid in this.node_list ){
        if( from_eid !== dest_eid ){
          node.contact_list[dest_eid] = new Connection.init();
        }
      }
    }
  },

  node_set_routing_protocol: function(){
    var node, eid;
    for( eid in this.node_list ){
      node = this.node_list[eid];
      node.routing_protocol = this.direct_routing_protocol(node);
    }
  },

  direct_move_model: function(user, type){
    switch(type){
      case 0:
        user.move_model = "RandomWayPoint";
        break;
      case 1:
        user.move_model = "MapRouteMovement";
        break;
      case 2:
        user.move_model = "RandomWalk";
        break;
      default:
        user.move_model = "StationaryMovement";
        break;
    }
  },

  direct_routing_protocol: function(node){
    switch(Simulator.protocol_type){
      case 'epidemic':
        return new Epidemic(node);
        break;
      case 'spray_and_wait':
        return new SprayAndWait(node);
        break;
      case 'pro_phet':
        return new ProPHET(node);
        break;
      default:
        return new Epidemic(node);
        break;
    }
  },

	create: function( x, y, type, opt ){
		switch(type){
			case 'user':
				this.createUser( x, y, opt );
				break;
			case 'server':
				this.createNode( x, y, type );
        break;
			case 'start':
				this.createNode( x, y, type );
				break;
			case 'end':
				this.createNode( x, y, type );
				break;
      case 'car':
        this.createCar( x, y, type );
        break;
		};
	},

  isCloseRoute: function( route ){
    var size = route.length,
        first = route[0],
        last = route[size-1],
        ny, nx;
    if( size <= 1 ) return false;
    for(var i = 0; i < 4; i++){
      ny = last.y + View.dy[i];
      nx = last.x + View.dx[i];
      if( first.y === ny && first.x === nx ) return true;
    }
    return false;
  },

  createCar: function( x, y, type ){
    console.log('create car =>');
    var car = new createjs.Shape(),
        key;
    car.graphics.beginFill('rgba(0,59,255,1.0)').drawCircle(View.gridSize/2, View.gridSize/2, View.gridSize/2);
    
    car.ob_type = 'car';
    car.type = type || 'normal';
    car.eid = this.eid;
    this.eid++;
    car.contact_list = {};
    car.circuit = [];
    car.route_list = [];
    car.path = {};
    car.delivery_predictability = {};
    car.speed = 5;
    car.direct = 0;
    car.buffer_size = 1000;
    
    var ratio_info = {};
    ratio_info[car.eid] = 1.0;
    car.delivery_predictability[car.eid] = ratio_info;

    car.last_connect_time = {};
    car.strage = {};
    car.buffer = [];

    car.routing_protocol = this.direct_routing_protocol(car);

    car.x = x * View.gridSize;
    car.y = y * View.gridSize;

    car.label = new createjs.Text(0, "12px Arial", "white");
    car.label.x = car.x;
    car.label.y = car.y;
    car.label.textBaseline = "top";

    Propagation.calc(x, y);
    //View.update();

    Simulator.map.addChild(car);
    Simulator.map.addChild(car.label);

    key = Simulator.key_map[y][x];
    Simulator.node_map[key][car.eid] = { x: x, y: y, obj: car, type: 'car' };

    this.node_list[car.eid] = car;
  },

	createUser: function( x, y, opt ){
    var user = new createjs.Shape(),
    		key;
    user.graphics.beginFill('rgba(255,59,0,1.0)').drawCircle(View.gridSize/2, View.gridSize/2, View.gridSize/2);
    
    user.ob_type = 'user';
    user.type = 'normal';
    user.eid = opt.eid || this.eid;
    this.eid++;
    user.name = opt.name || "none";
    user.contact_list = {};
    user.circuit = [];
    user.route_list = [];
    user.path = opt.path || [];
    user.step = 1;
    user.stop_time = 0;
    user.buffer_size = 1000;
    if( user.path.length !== 0 ){
      user.path_index = 0;
      user.path_length = user.path.length;
      user.close_path = this.isCloseRoute( user.path );
    }else{
      user.path = []
      user.path_index = 0;
      user.path_length = 1;
      user.path.push({ y: y, x: x, wait: 0 });
    }
    user.delivery_predictability = {};
    user.speed = 10;
    user.move_model = "RandomWayPoint";
    //user.move_model = "RandomWalk";
    //user.move_model = "traceMoveModel";

    var ratio_info = {};
    ratio_info[user.eid] = 1.0;
    user.delivery_predictability[user.eid] = ratio_info;

    user.last_connect_time = {};
    user.strage = {};
    user.buffer = [];

    user.routing_protocol = this.direct_routing_protocol(user);

    user.x = x * View.gridSize;
    user.y = y * View.gridSize;

    user.label = new createjs.Text(0, "12px Arial", "white");
    user.label.x = user.x;
    user.label.y = user.y;
    user.label.textBaseline = "top";

    Propagation.calc(x, y);
    //View.update();

    Simulator.map.addChild(user);
    Simulator.map.addChild(user.label);

    key = Simulator.key_map[y][x];
    Simulator.node_map[key][user.eid] = { x: x, y: y, obj: user, type: 'user' };

    this.node_list[user.eid] = user;
	},

	createNode: function( x, y, type ){
    var node = new createjs.Shape(),
        key;

    node.x = x * View.gridSize;
    node.y = y * View.gridSize;
    node.strage = {};
    node.buffer = [];
    node.path = [];
    node.speed = 0;
    node.last_connect_time = {};
    node.delivery_predictability = {};
    node.routing_protocol = this.direct_routing_protocol(node);

    switch(type){
      case 'start':
        node.name = "start";
      	node.graphics.beginFill('rgba(255,0,0,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);
      	break;
      case 'end':
        node.name = "end";
      	node.graphics.beginFill('rgba(0,0,128,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);
      	break;
      default:
        node.name = "none";
      	node.graphics.beginFill('rgba(255,0,0,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);
    }
    
    node.ob_type = type || 'server';
    node.eid = this.eid;
    node.buffer_size = 1000;
    //node.path = {};
   	this.eid++;

    var ratio_info = {};
    ratio_info[node.eid] = 1.0;
    node.delivery_predictability[node.eid] = ratio_info;

    node.drag = false;

    node.label = new createjs.Text(0, "12px Arial", "white");
    node.label.x = node.x;
    node.label.y = node.y;
    node.label.textBaseline = "top";

   	node.contact_list = {};
    Simulator.map.addChild(node);
    Simulator.map.addChild(node.label);

    node.status = ServerStatus.init();

    this.node_list[node.eid] = node;
    key = Simulator.key_map[y][x];
    Simulator.node_map[key][node.eid] = { x: x, y: y, obj: node, type: 'server' };
    Simulator.field[y][x] = { x: x, y: y, obj: node, type: node.ob_type, cost: 1, pf: 1 };
    Propagation.calc(x, y);
    //View.update();

    console.log("create node" + node.eid + " =>");
	},

	move: function(){
		var node,
				eid,
				key;

		for( eid in this.node_list ){
			node = this.node_list[eid];

			if( node.ob_type === 'user' ){
				coord = View.point2coord( node.x, node.y );
				key = Simulator.key_map[coord.y][coord.x];
				delete Simulator.node_map[key][node.eid];
				this.moveUser(node);
				coord = View.point2coord( node.x, node.y );
				key = Simulator.key_map[coord.y][coord.x];
      	Simulator.node_map[key][node.eid] = { x: coord.x, y: coord.y, obj: node, type: 'user' };
			}else if( node.ob_type === 'car'){
        coord = View.point2coord( node.x, node.y );
        key = Simulator.key_map[coord.y][coord.x];
        delete Simulator.node_map[key][node.eid];
        Car.move(node);
        coord = View.point2coord( node.x, node.y );
        key = Simulator.key_map[coord.y][coord.x];
        Simulator.node_map[key][node.eid] = { x: coord.x, y: coord.y, obj: node, type: 'car' };
      }
      node.label.y = node.y;
      node.label.x = node.x;
		}
	},

	scan: function(){
    var dest_eid,
    		node,
        eid,
        coord,
        i,
        connect_list;

    for( eid in this.node_list ){
      node = this.node_list[eid];
      node.label.text = Object.keys(node.strage).length;

      if(Simulator.map.contains(node)){     
        coord = View.point2coord( node.x, node.y );
        connect_list = Propagation.calc(coord.x, coord.y);

        for( dest_eid in node.contact_list ){
          if( connect_list[dest_eid] !== undefined ){
            if( node.contact_list[dest_eid].current === 'close' ){
              node.contact_list[dest_eid].connect(node, this.node_list[dest_eid]);
            }
            node.last_connect_time[dest_eid] = Simulator.time;
            this.addEdge(node, this.node_list[dest_eid], "orange"); 
          }else if( node.contact_list[dest_eid].current === 'establish' ){
            node.contact_list[dest_eid].shutdown(node, this.node_list[dest_eid]);
          }
        }
      }
    }
  },

  routingUpdate: function(){
    var eid,
        node;

    for( eid in this.node_list ){
      node = this.node_list[eid];

      if(Simulator.map.contains(node)){
        node.routing_protocol.update();
      }
    }
  },

  transmit: function(){
  	var eid,
  			node;

  	for( eid in this.node_list ){
  		node = this.node_list[eid];

  		if(Simulator.map.contains(node)){

  		}
  	}
  },

  receive: function(){
  	var eid,
  			node;

  	for( eid in this.node_list ){
  		node = this.node_list[eid];

  		if(Simulator.map.contains(node)){
  			
  		}
  	}
  },

  isServer: function( type ){
    if( type === 'server' || type === 'start' || type === 'end' ) return true;
    return false;
  },

  isUser: function( type ){
    if( type === 'user' ) return true;
    return false;
  },

 	addEdge: function(node, dest, color_opt){
  	var line = new createjs.Shape(),
        color = color_opt || "orange";
  	
  	line.graphics.setStrokeStyle(3).beginStroke(color);
  	line.graphics.moveTo(node.x + View.gridSize/2, node.y + View.gridSize/2);
  	line.graphics.lineTo(dest.x + View.gridSize/2, dest.y + View.gridSize/2);

    View.connection_line.push(line);
	},

	clearEdge: function(node){
 	},

	moveUser: function(user){
    switch(user.move_model){
      case 'worker':
        MoveModel.worker(user);
        break;
      case 'RandomWayPoint':
        MoveModel.randomWayPoint(user);
        break;
      case 'RandomWalk':
        MoveModel.randomWalk(user);
        break;
      case 'MapRouteMovement':
        MoveModel.mapRouteMovement(user);
        break;
      default:
        MoveModel.randomWayPoint(user);
        break;
    }
  },

	clear: function(){
		this.eid = 0;
    this.node_list = {};
	},

	remove: function(node){
    console.log("remove node" + node.eid + " =>");
    var coord = View.point2coord( node.x, node.y ),
    		key = Simulator.key_map[coord.y][coord.x];

    Simulator.map.removeChild(node);
    delete this.node_list[node.eid];
    delete Simulator.node_map[key][node.eid];
    Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
	  console.log(this.node_list);
  },
}
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

      if( node.type === 'user' && node.path !== undefined ){
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
        user.move_model = "RandomWalk";
        break;
      case 2:
        user.move_model = "MapRouteMovement";
        break;
      case 3:
        user.move_model = "StationaryMovement";
        break;
      case 4:
        user.move_model = "CarMovement";
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
      case 'n_hop_forwarding':
        return new NHopForwarding(node);
        break;
      default:
        return new Epidemic(node);
        break;
    }
  },

	create: function( x, y, opt ){
		switch(opt.type){
			case 'user':
				this.createUser( x, y, opt );
				break;
			case 'server':
				this.createNode( x, y, opt );
        break;
			case 'start':
				this.createNode( x, y, opt );
				break;
			case 'end':
				this.createNode( x, y, opt );
				break;
      case 'car':
        this.createCar( x, y, opt );
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

  createCar: function( x, y, opt ){
    opt.color = 'rgba(0,59,255,1.0)';
    opt.speed = 3;
    console.log('create car =>');
    var car = this.createAgent(x,y,opt),
        key;
    car.graphics.beginFill('rgba(0,59,255,1.0)').drawCircle(View.gridSize/2, View.gridSize/2, View.gridSize/2);
    
    car.direct = 0;

    Propagation.calc(x, y);

    Simulator.map.addChild(car);
    Simulator.map.addChild(car.label);

    key = Simulator.key_map[y][x];
    Simulator.node_map[key][car.eid] = { x: x, y: y, obj: car, type: 'car' };

    this.node_list[car.eid] = car;
  },

  createAgent: function( x, y, opt ){
    var agent = new createjs.Shape();
    if( this.isServer(opt.type)){
      agent.graphics.beginFill(opt.color).drawRect( 0, 0, gridSize, gridSize);
    }else{
      agent.graphics.beginFill(opt.color).drawCircle(gridSize/2, gridSize/2, gridSize/2);
    }
    agent.eid = opt.eid || this.eid;
    this.eid++;
    agent.type = opt.type;
    agent.name = opt.name || "node" + (agent.eid-1);
    agent.contact_list = {};
    agent.buffer_size = opt.buffer_size || 1000;
    agent.speed = opt.speed || 10;
    agent.x = x * gridSize;
    agent.y = y * gridSize;

    agent.label = new createjs.Text(0, "14px Arial", "white");
    agent.label.textAlign = "center";
    agent.label.x = agent.x + gridSize/2|0;
    agent.label.y = agent.y + gridSize/5|0;
    agent.label.textBaseline = "top";

    agent.move_model = opt.move_model || "StationaryMovement";

    agent.route_list = [];
    agent.path = opt.path || [];

    var ratio_info = {};
    ratio_info[agent.eid] = 1.0;
    agent.delivery_predictability = {};
    agent.delivery_predictability[agent.eid] = ratio_info;

    agent.routing_protocol = this.direct_routing_protocol(agent);

    agent.last_connect_time = {};
    agent.strage = {};
    agent.buffer = [];
    return agent;
  },

	createUser: function( x, y, opt ){
    opt.move_model = "RandomWayPoint";
    opt.color = 'rgba(0,0,0,1.0)';
    opt.speed = opt.speed || 10;
    var user = this.createAgent( x, y, opt),
    		key;

    user.step = 1;
    user.stop_time = 0;
    user.path_index = 0;
    if( user.path.length !== 0 ){
      user.path_length = user.path.length;
      user.close_path = this.isCloseRoute( user.path );
    }else{
      user.path = []
      user.path_length = 1;
      user.path.push({ y: y, x: x, wait: 0 });
    }

    Propagation.calc(x, y);

    Simulator.map.addChild(user);
    Simulator.map.addChild(user.label);

    key = Simulator.key_map[y][x];
    Simulator.node_map[key][user.eid] = { x: x, y: y, obj: user, type: 'user' };
    this.node_list[user.eid] = user;
	},

	createNode: function( x, y, opt ){
    switch(opt.type){
      case 'start':
        opt.name = "start";
      	opt.color = 'rgba(218,0,10,1.0)';
      	break;
      case 'end':
        opt.name = "end";
        opt.color = 'rgba(10,0,218,1.0)';
      	break;
      default:
        opt.name = "none";
        opt.color = 'rgba(255,0,0,1.0)';
    }

    var node = this.createAgent(x,y,opt),
        key;
    
    node.drag = false;

    if( opt.type === 'start' ){
      node.label.text = $("#message_num").val()|0;
    }

    Simulator.map.addChild(node);
    Simulator.map.addChild(node.label);

    node.status = ServerStatus.init();

    this.node_list[node.eid] = node;
    key = Simulator.key_map[y][x];
    Simulator.node_map[key][node.eid] = { x: x, y: y, obj: node, type: 'server' };
    Simulator.field[y][x] = { x: x, y: y, obj: node, type: node.type, cost: 1, pf: 1 };
    Propagation.calc(x, y);

    console.log("create node" + node.eid + " =>");
	},

	move: function(){
		var node,
				eid,
				key;

		for( eid in this.node_list ){
			node = this.node_list[eid];

			if( this.isUser(node.type) ){
				coord = View.point2coord( node.x, node.y );
				key = Simulator.key_map[coord.y][coord.x];
				delete Simulator.node_map[key][node.eid];
				this.moveUser(node);
				coord = View.point2coord( node.x, node.y );
				key = Simulator.key_map[coord.y][coord.x];
      	Simulator.node_map[key][node.eid] = { x: coord.x, y: coord.y, obj: node, type: node.type };
			}
      node.label.y = node.y + gridSize/5|0;
      node.label.x = node.x + gridSize/2|0;
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
    
      coord = View.point2coord( node.x, node.y );
      connect_list = Propagation.calc(coord.x, coord.y);

      for( dest_eid in node.contact_list ){
        if( connect_list[dest_eid] !== undefined ){
          if( node.contact_list[dest_eid].current === 'close' ){
            node.contact_list[dest_eid].connect(node, this.node_list[dest_eid]);
          }
          node.last_connect_time[dest_eid] = Simulator.time;
          if( $("#animation").is(":checked") ){
            this.addEdge(node, this.node_list[dest_eid], "orange"); 
          }
        }else if( node.contact_list[dest_eid].current === 'establish' ){
          node.contact_list[dest_eid].shutdown(node, this.node_list[dest_eid]);
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
    if( type === 'user' || type === 'car' ) return true;
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

	moveUser: function(user){
    switch(user.move_model){
      case 'RandomWayPoint':
        MoveModel.randomWayPoint(user);
        break;
      case 'RandomWalk':
        MoveModel.randomWalk(user);
        break;
      case 'MapRouteMovement':
        MoveModel.mapRouteMovement(user);
        break;
      case 'StationaryMovement':
        MoveModel.stationaryMovement(user);
      case 'CarMovement':
        MoveModel.carMovement(user);
        break;
      default:
        MoveModel.randomWayPoint(user);
        break;
    }
  },

  changeSpeed: function( eid, speed ){
    var node = this.node_list[eid];
    if( node === undefined || this.isServer( node.type )) return;
    node.speed = speed;
  },

	clear: function(){
		this.eid = 0;
    this.node_list = {};
	},

	remove: function(node){
    if( node.name === 'start' || node.name === 'end' ) return;
    console.log("remove node" + node.eid + " =>");
    var coord = View.point2coord( node.x, node.y ),
    		key = Simulator.key_map[coord.y][coord.x];

    Simulator.map.removeChild(node);
    Simulator.map.removeChild(node.label);
    delete this.node_list[node.eid];
    delete Simulator.node_map[key][node.eid];
    Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
	  console.log(this.node_list);
  },
}
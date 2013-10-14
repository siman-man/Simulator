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
      for( dest_eid in this.node_list ){
        if( from_eid !== dest_eid ){
          node.contact_list[dest_eid] = new Connection.init();
        }
      }
    }
  },

	create: function( x, y, type, opt ){
		switch(type){
			case 'user':
				this.createUser( x, y, opt.type );
				break;
			case 'server':
				this.createNode( x, y, type );
			case 'start':
				this.createNode( x, y, type );
				break;
			case 'end':
				this.createNode( x, y, type );
				break;
		};
	},

	createUser: function( x, y, type ){
    var user = new createjs.Shape(),
    		key;
    user.graphics.beginFill('rgba(255,59,0,1.0)').drawCircle(View.gridSize/2, View.gridSize/2, View.gridSize/2);
    
    user.ob_type = 'user';
    user.type = type;
    user.eid = this.eid;
    this.eid++;
    user.contact_list = {};
    user.circuit = [];
    user.route_list = [];
    user.last_connect_time = {};
    user.strage = {};
    user.buffer = [];
    user.routing_protocol = new Epidemic();

    user.x = x * View.gridSize;
    user.y = y * View.gridSize;

    if(type == 'worker'){
      user.state = FSM.worker(user);
    }else{
      user.state = FSM.normal(user);
    }

    Propagation.calc(x, y);
    View.update();

    Simulator.map.addChild(user);

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
    node.last_connect_time = {};

    switch(type){
      case 'start':
      	node.graphics.beginFill('rgba(255,0,0,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);
      	Message.init(node);
      	break;
      case 'end':
      	node.graphics.beginFill('rgba(0,0,128,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);
      	break;
      default:
      	node.graphics.beginFill('rgba(255,0,0,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);
    }
    
    node.ob_type = type || 'normal';
    node.eid = this.eid;
   	this.eid++;

    node.drag = false;

   	node.contact_list = [];
    Simulator.map.addChild(node);

    node.status = ServerStatus.init();

    this.node_list[node.eid] = node;
    key = Simulator.key_map[y][x];
    Simulator.node_map[key][node.eid] = { x: x, y: y, obj: node, type: 'server' };
    Propagation.calc(x, y);
    View.update();
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
			}
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
    switch(user.type){
      case 'worker':
        MoveModel.worker(user);
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
    console.log("remove node =>");
    var coord = View.point2coord( node.x, node.y ),
    		key = Simulator.key_map[coord.y][coord.x];

    Simulator.map.removeChild(node);
    delete Simulator.node_map[key][node.eid];
    delete this.node_list[node.eid];
	},
}
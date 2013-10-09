var User = {
  user_id: 0,
  user_list: [],

  create: function( x, y, type ){
    //var user = new createjs.Bitmap('/assets/user.gif');
    var user = new createjs.Shape();
    user.graphics.beginFill('rgba(255,59,0,1.0)').drawCircle(View.gridSize/2, View.gridSize/2, View.gridSize/2);
    
    user.type = type;
    user.id = this.user_id;
    this.user_id++;
    user.contact_list = [];
    user.circuit = [];
    user.route_list = [];

    user.onPress = Library.mousePressHandler;
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
    Simulator.user_map[y][x] = { x: x, y: y, obj: user, type: 'user', cost: 1, pf: 1 };

    this.user_list[user.id] = user;

    return user;
  },

  move: function(){
    var user,
        id;

    for( id in this.user_list ){
      user = this.user_list[id];
      coord = View.point2coord( user.x, user.y );
      Simulator.user_map[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
      this.moveUser(user);
      coord = View.point2coord( user.x, user.y );
      Simulator.user_map[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: user, type: 'user', cost: 1, pf: 1 };
    }
  },

  scan: function(){
    var user,
        id,
        coord;

    for( id in this.user_list ){
      user = this.user_list[id];

      if(Simulator.map.contains(user)){
        User.clear_edge(user);       
        coord = View.point2coord( user.x, user.y );
        contact_list = Propagation.calc(coord.x, coord.y);

        for( i in contact_list ){
          node = contact_list[i].obj;
          this.drawEdge(user, node, "orange");  
        }
        for( i in user.contact_list ){
          Simulator.map.addChild( user.contact_list[i] );
        }
      }
    }
  },

  clear: function(){
    var i, user, coord;
    
    for( i in this.user_list ){
      user = this.user_list[i];
      coord = View.point2coord( user.x, user.y );
      Simulator.user_map[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
      this.remove(user);
    }

    this.user_id = 0;
    this.user_list = {};
  },

  remove: function(user){
    console.log("remove user =>");
    var coord = View.point2coord( user.x, user.y );

    delete this.user_list[user.id];
    Simulator.map.removeChild(user);
  },

  imageUpdate: function(){
    var user, id;
    for( id in this.user_list ){
      user = this.user_list[id];
      Simulator.map.removeChild(user);
      Simulator.map.addChild(user);
    }
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

  findConnectedServer: function(user){
    var connected_list = [],
        rssi, id;

    for( id in Server.server_list ){
      rssi = this.checkConnectionAccessPoint(user, Server.server_list[id])
      
      if(rssi != -200){
        connected_list.push( {id: id, rssi: rssi} );
      }
    }

    return connected_list;
  },

  checkConnectionAccessPoint: function(user, server){
  	var dist = Server.calcDistance(user.x, user.y, server.x, server.y),
  	    rssi1 = Server.calcRssiTwoRay(server, dist);       // 自分から相手に届くRSSIの値

  	return (rssi1 >= -65)? rssi1 : -200;
	},

	drawEdge: function(user, node, color_opt){
  	var line = new createjs.Shape(),
        color = color_opt || "orange";
  	
  	line.graphics.setStrokeStyle(3).beginStroke(color);
  	line.graphics.moveTo(user.x + View.gridSize/2, user.y + View.gridSize/2);
  	line.graphics.lineTo(node.x + View.gridSize/2, node.y + View.gridSize/2);

    user.contact_list.push(line);
	},

	clear_edge: function(user){
    var line, i;
    for( i in user.contact_list){
      line = user.contact_list[i];
      Simulator.map.removeChild(line);
    }
    user.contact_list = [];
	},

  jobless_list: function(){
    var list = [],
        i, user;

    for( i in this.user_list ){
      user = this.user_list[i];
      if(user.type === 'worker' && user.office === undefined){
        list.push(user);
      }
    }

    return list;
  },
};
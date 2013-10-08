var User = {
  user_id: 0,
  user_list: [],

  create: function( x, y, type ){
    //var user = new createjs.Bitmap('/assets/user.gif');
    var user = new createjs.Shape();
    user.graphics.beginFill('rgba(0,0,0,1.0)').drawCircle(View.gridSize/2, View.gridSize/2, View.gridSize/2);
    
    user.type = type;
    user.id = this.user_id;
    this.user_id++;
    user.connection = new createjs.Shape();
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
    

    Simulator.map.addChild(user);
    Simulator.map.addChild(user.connection);
    View.animation(Propagation.calc(x, y));

    this.user_list[user.id] = user;

    return user;
  },

  update: function(){
    var max_rssi, rssi, i, node, id, user;

    for( id in this.user_list ){
      max_rssi = -120;
      user = this.user_list[id];
      
      if(Simulator.map.contains(user)){
        this.moveUser(user);
        
        for( i in Server.server_list ){
          node = Server.server_list[i];
          rssi = this.checkConnectionAccessPoint(user, node)
          
          if(rssi > max_rssi){
            this.drawEdge(user, node, "orange");
            max_rssi = rssi;
          }else if(max_rssi == -120){
            this.clear_edge(user, node)
          }
        }
      }
    }
  },

  clear: function(){
    var i, user;
    
    for( i in this.user_list ){
      user = this.user_list[i];
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
  	var line = user.connection.graphics,
        color = color_opt || "orange";
  	
    line.clear();
  	line.setStrokeStyle(3).beginStroke(color);
  	line.moveTo(user.x + View.gridSize/2, user.y + View.gridSize/2);
  	line.lineTo(node.x + View.gridSize/2, node.y + View.gridSize/2);
	},

	clear_edge: function(user){
  	var line = user.connection.graphics;
  	line.clear();
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
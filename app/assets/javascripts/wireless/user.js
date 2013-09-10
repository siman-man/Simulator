var User = {
  user_size: 6,

  create: function( x, y ){
    var user = new createjs.Bitmap('/assets/user.gif');
    user.ob_type = "user"
    user.id = Simulator.user_id;
    Simulator.user_id++;
    user.connection = new createjs.Shape();
    user.circuit = [];
    user.route_list = [];

    user.onPress = Library.mousePressHandler;
    user.x = x * View.gridSpan;
    user.y = y * View.gridSpan;

    user.state = UserAction.init(user);

    Simulator.map.addChild(user);
    Simulator.map.addChild(user.connection);

    Simulator.user_list[user.id] = user;

    return user;
  },

  update: function(){
 		var max_rssi, rssi;
  	var WS = Simulator;
  	
    this.moveUser();
    for(var id in WS.user_list){
  		max_rssi = -120;
    	var user = WS.user_list[id];
    	for(var i in WS.server_list){
    		var node = WS.server_list[i];
    		rssi = this.checkConnectionAccessPoint(user, node)
    		if(rssi > max_rssi){
      		this.drawEdge(user, node, "orange");
      		max_rssi = rssi;
    		}else if(max_rssi == -120){
      		this.clear_edge(user, node)
    		}
    	}
  	}
  },

  imageUpdate: function(){
    for(var id in Simulator.user_list){
      var user = Simulator.user_list[id];
      Simulator.map.removeChild(user);
      Simulator.map.addChild(user);
    }
  },

  moveUser: function(){
  	for(var id in Simulator.user_list){
  		var user = Simulator.user_list[id];
  		//Move.randomWalk(user, 'user');
      MoveModel.randomWayPoint(user);
      //MoveModel.sampleMove(user);
  	}
  },

  findConnectedServer: function(user){
    var connected_list = [];
    var rssi;
    for(var id in Simulator.server_list){
      rssi = this.checkConnectionAccessPoint(user, Simulator.server_list[id])
      
      if(rssi != -200){
        connected_list.push( {id: id, rssi: rssi} );
      }
    }

    return connected_list;
  },

  checkConnectionAccessPoint: function(user, server){
  	var WS = Simulator;
  	var dist = Server.calcDistance(user.x, user.y, server.x, server.y);
  	var rssi1 = Server.calcRssiTwoRay(server, dist);       // 自分から相手に届くRSSIの値

  	return (rssi1 >= -65)? rssi1 : -200;
	},

	drawEdge: function(user, node, color_opt){
		var WS = Simulator;
  	var line = user.connection.graphics;
  	line.clear();
  	var color = color_opt || "orange";
  	line.setStrokeStyle(3).beginStroke(color);
  	line.moveTo(user.x + 15, user.y + 15);
  	line.lineTo(node.x + 15, node.y + 15);
	},

	clear_edge: function(user){
  	var line = user.connection.graphics;
  	line.clear();
	},
};
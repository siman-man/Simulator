var User = {
  user_size: 6,

  create: function(x, y, color_opt){
    var WS = Simulator;
    var color = color_opt || "blue";
    var user = new createjs.Bitmap('/assets/user.gif');
    user.ob_type = "user"
    user.id = WS.user_id;
    WS.user_id++;
    user.color = color;
    user.connection = new createjs.Shape();
    user.circuit = [];
    user.route_list = {};

    user.drag = false;
    user.onPress = Library.mousePressHandler;
    user.x = x * View.gridSpan;
    user.y = y * View.gridSpan;

    var size = Server.calcRnageSize(user);

    user.state = UserAction.init(user);

    WS.map.addChild(user);
    WS.map.addChild(user.connection);

    WS.user_list[user.id] = user;

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
      		this.draw_edge(user, node, "orange");
      		max_rssi = rssi;
    		}else if(max_rssi == -120){
      		this.clear_edge(user, node)
    		}
    	}
  	}
  	this.draw_users();
  },

  imageUpdate: function(){
    var WS = Simulator;
    for(var id in WS.user_list){
      var user = WS.user_list[id];
      WS.map.removeChild(user);
      WS.map.addChild(user);
    }
  },

  moveUser: function(){
  	var WS = Simulator;
  	var user;
  	for(var id in WS.user_list){
  		user = WS.user_list[id];
  		//Move.randomWalk(user, 'user');
      //MoveModel.randomWayPoint(user);
      MoveModel.sampleMove(user);
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

	draw_edge: function(user, node, color_opt){
		var WS = Simulator;
  	var line = user.connection.graphics;
  	line.clear();
  	var color = color_opt || "orange";
  	line.setStrokeStyle(3).beginStroke(color);
  	line.moveTo(user.x + 20, user.y + 20);
  	line.lineTo(node.x + 20, node.y + 20);
	},

	clear_edge: function(user){
  	var line = user.connection.graphics;
  	line.clear();
	},

	draw_users: function(){
  	var user;
  	var WS = Simulator;

  	for(id in WS.user_list){
    	user = WS.user_list[id];
    	//user.draw;
 	  	//user.graphics.beginFill("blue").drawCircle(0, 0, this.user_size);
  	}
  }
};
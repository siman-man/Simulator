var User = {
  user_size: 6,
  user_id: 0,
  user_list: [],

  create: function( x, y, type ){
    var user = new createjs.Bitmap('/assets/user.gif');
    user.type = type;
    user.id = this.user_id;
    this.user_id++;
    user.connection = new createjs.Shape();
    user.circuit = [];
    user.route_list = [];

    user.onPress = Library.mousePressHandler;
    user.x = x * View.gridSpan;
    user.y = y * View.gridSpan;

    user.state = FSM.worker(user);

    Simulator.map.addChild(user);
    Simulator.map.addChild(user.connection);

    this.user_list[user.id] = user;

    return user;
  },

  update: function(){
    var max_rssi, rssi;

    for(var id in this.user_list){
      max_rssi = -120;
      var user = this.user_list[id];
      if(Simulator.map.contains(user)){
        this.moveUser(user);
        for(var i in Server.server_list){
          var node = Server.server_list[i];
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
    for(var i in this.user_list){
      var user = this.user_list[i];
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
    for(var id in this.user_list){
      var user = this.user_list[id];
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
    var connected_list = [];
    var rssi;
    for(var id in Server.server_list){
      rssi = this.checkConnectionAccessPoint(user, Server.server_list[id])
      
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

  jobless_list: function(){
    var list = [];
    for(var i in this.user_list){
      var user = this.user_list[i];
      if(user.type == 'worker' && user.office === undefined){
        list.push(user);
      }
    }

    return list;
  },
};
var User = {
  user_size: 6,

	init: function() {
		var WS = Simulator;  

  	this.create_user(300, 150);
  	this.create_user(400, 150);
  },

  create_user: function(x, y, color_opt){
    var WS = Simulator;
    var color = color_opt || "blue";
    var user = new createjs.Bitmap('/assets/man.gif');
    user.ob_type = "user"
    user.id = WS.user_id;
    WS.user_id++;
    user.color = color;
    user.connection = new createjs.Shape();
    user.circuit = [];
    //user.graphics.beginFill(user.color).drawCircle(0, 0, this.user_size);
    user.drag = false;
    user.onPress = Library.mousePressHandler;
    user.x = x; user.y = y;
    var size = Wireless.calcRnageSize(user);

    user.state = UserAction.init(user);

    WS.map.addChild(user);
    WS.map.addChild(user.connection);

    WS.user_list[user.id] = user;

    return user;
  },

  update: function(){
 		var max_rssi, rssi;
  	var WS = Simulator;
  	
    this.move_user();
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

  move_user: function(){
  	var WS = Simulator;
  	var user;
  	for(var id in WS.user_list){
  		user = WS.user_list[id];
  		//Move.randomWalk(user, 'user');
      //MoveModel.randomWayPoint(user);
      MoveModel.sampleMove(user);
  	}
  },

  checkConnectionAccessPoint: function(user, node){
  	var WS = Simulator;
  	var dist = Wireless.calcDistance(user.x, user.y, node.x, node.y);
  	var rssi1 = Wireless.calcRssiTwoRay(node, dist);       // 自分から相手に届くRSSIの値

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
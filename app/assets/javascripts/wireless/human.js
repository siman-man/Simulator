var Human = {
	initialize: function() {
		var WS = Wireless.simulator;  
  	//Add Shape instance to stage display list.
  	this.create_human(300, 150);
  	this.create_human(400, 150);
  },
  // ノード作成＆情報の初期化
  create_human: function(x, y, color_opt){
    var WS = Wireless.simulator;
    var color = color_opt || "blue";
    var human = new createjs.Shape();
    human.ob_type = "human"
    human.id = WS.human_list.length + 10000;
    human.color = color;
    human.connection = new createjs.Shape();
    human.graphics.beginFill(human.color).drawCircle(0, 0, 12);
    human.drag = false;
    human.onPress = Library.mousePressHandler;
    human.x = x; human.y = y;
    var size = Wireless.calcRnageSize(human);
    //WS.addChild(human.communication_range);
    //human.neighbor_human_list = {};
    //human.edge_list = {};
    WS.addChild(human);
    WS.addChild(human.connection);

    // 順番が逆になると自分が隣接ノードに登録されてしまう。
    // this.add_neighbor_human(human);
    // this.add_human(human);

    WS.human_list[human.id] = human;

    return human;
  },

  human_update: function(){
 		var max_rssi, rssi;
  	var WS = Wireless.simulator;
  	for(var id in WS.human_list){
  		max_rssi = -120;
    	var human = WS.human_list[id];
    	for(var i in WS.node_list){
    		var node = WS.node_list[i];
    		rssi = this.checkConnectionAccessPoint(human, node)
    		if(rssi > max_rssi){
      		this.draw_edge(human, node, "orange");
      		max_rssi = rssi;
    		}else if(max_rssi == -120){
      		this.clear_edge(human, node)
    		}
    	}
  	}
  	this.move_human();
  	this.draw_humans();
  },

  move_human: function(){
  	var WS = Wireless.simulator;
  	var human;
  	for(var id in WS.human_list){
  		human = WS.human_list[id];
  		Move.randomWalk(human, 'human');
  	}
  },

  checkConnectionAccessPoint: function(human, node){
  	var WS = this.simulator;
  	var dist = Wireless.calcDistance(human.x, human.y, node.x, node.y);
  	var rssi1 = Wireless.calcRssiTwoRay(node, dist);       // 自分から相手に届くRSSIの値

  	return (rssi1 >= -65)? rssi1 : -200;
	},

	draw_edge: function(human, node, color_opt){
		var WS = Wireless.simulator;
  	var line = human.connection.graphics;
  	line.clear();
  	var color = color_opt || "orange";
  	line.setStrokeStyle(3).beginStroke(color);
  	line.moveTo(human.x, human.y);
  	line.lineTo(node.x, node.y);
	},

	clear_edge: function(human){
  	var line = human.connection.graphics;
  	line.clear();
	},

	draw_humans: function(){
  	var human;
  	var WS = Wireless.simulator;

  	for(id in WS.human_list){
    	human = WS.human_list[id];
    	human.graphics.clear();
 	  	human.graphics.beginFill("blue").drawCircle(0, 0, 12);
  	}
  }
};
var Show = {
	stage: undefined,
	press_flag: false,
	target: undefined,
	node_list: [],
	edge_list: [],
	line_list: [],
	r: 8,

	init: function(){
		this.canvas = document.getElementById('my_canvas');
		this.node_list = [];
		this.edge_list = [];
		this.line_list = [];
    this.max_value = Result.getMaxValue(DataList.edge_list);
    console.log(this.max_value);

  	this.canvas.addEventListener('mousemove', this.onmousemove, false);
  	this.canvas.addEventListener('mouseup', this.onmouseup, false);

		this.stage = new createjs.Stage(this.canvas);
		createjs.Ticker.setFPS(30);
    DataList.event_tag = "tick";
    DataList.event_func = function(event){
      Show.clearLine();
      Show.updateEdge();
      Show.updateText();
      Show.stage.update();
    }
    //createjs.Ticker.addEventListener("tick", this.handleTick);
    createjs.Ticker.addEventListener(DataList.event_tag, DataList.event_func);
    console.log('world');
		for( var id in DataList.node_list ){
			this.createNode( id, Math.random()*800|0 + 50, Math.random()*500|0 +50 )
		}
		for( var id in DataList.edge_list ){
			var edge = DataList.edge_list[id];
			this.edge_list.push({ source: edge.source, target: edge.target, value: edge.value });
		}
	},

	handleTick: function(event) {
  	Show.stage.update();
  },

  update: function(){
  	console.log('hello world');
  },

  updateText: function(){
    for( var eid in this.node_list ){
      var node = this.node_list[eid];
      Show.stage.removeChild(node.label);
      Show.stage.addChild(node.label);  
    }
  },

  clearLine: function(){
  	for( var id in this.line_list ){
  		var line = this.line_list[id];
  		Show.stage.removeChild(line);
  	}
  	this.line_list = [];
  },

  updateEdge: function(){
  	var id,
  			edge;
  	for( id in this.edge_list ){
  		edge = this.edge_list[id];
  		this.createEdge( edge.value, edge.source, edge.target );
  	}
  },

 	createNode: function( id, x, y ){
 		var node = new createjs.Shape();
 		node.x = x;
 		node.y = y;
 		node.type = 'node';
 		node.addEventListener('mousedown', this.onmousedown, false);
 		node.name = DataList.user_list[id].name;

 		node.label = new createjs.Text(node.name, "16px Arial", "black");
    node.label.textAlign = "center";
    node.label.x = node.x;
    node.label.y = node.y - this.r*2.5;
    node.label.textBaseline = "top";
 		
 		if( id == 0 ){
			node.graphics.beginFill('rgba(0,255,99,1.0)').drawCircle(0, 0, this.r);
 		}else if( id == 1 ){
			node.graphics.beginFill('rgba(255,59,0,1.0)').drawCircle(0, 0, this.r);
 		}else{
 			node.graphics.beginFill('rgba(0,99,255,1.0)').drawCircle(0, 0, this.r);
 		}
    Show.stage.addChild(node);
    Show.stage.addChild(node.label);
    this.node_list.push(node);
 	},

 	createEdge: function( value, source_id, target_id ){
 		var line = new createjs.Shape(),
 				source = this.node_list[source_id],
 				target = this.node_list[target_id],
 				dx = source.x - target.x,
 				dy = source.y - target.y,
 				dist = Math.sqrt( dx*dx + dy*dy ),
 				cos = dx / dist,
 				sin = dy / dist,
        thin = (value/this.max_value)*5,
        color = this.directEdgeColor(thin) || "black";

		line.graphics.setStrokeStyle(thin).beginStroke(color);
		line.graphics.moveTo( source.x - this.r * cos, source.y - this.r * sin );
		line.graphics.lineTo( target.x + this.r * cos, target.y + this.r * sin );
		this.line_list.push(line);
		Show.stage.addChild(line);
 	},

  directEdgeColor: function(value){
    if( value >= 9 ){
      return "green";
    }else if( value >= 8 ){
      return "rgba(50, 205, 50,1)";
    }else if( value >= 7 ){
      return "rgba(154, 205, 50, 1)";
    }else if( value >= 6 ){
      return "rgba(218, 165, 32,1)";
    }else if( value >= 5 ){
      return "rgba(240, 230, 140,1)";
    }else if( value >= 4 ){
      return "rgba(255, 165, 0, 1)";
    }else if( value >= 3){
      return "rgba(255, 99, 71,1)";
    }else if( value >= 2){
      return "rgba(255, 69, 0, 1)"
    }else{
      return "red";
    }
  },

 	onmousedown: function(e){
 		console.log('onmousedown =>');
    Show.target = e.target;
    Show.press_flag = true;
 	},

 	onmousemove: function(e){
 		if( Show.press_flag ){
 			var rect = Show.canvas.getBoundingClientRect(),
 					x = e.clientX - rect.left,
       		y = e.clientY - rect.top,
       		node = Show.target;

     	node.x = x;
      node.y = y;
      node.label.x = x;
      node.label.y = node.y - Show.r*2.5;
 		}
 	},

 	onmouseup: function(e){
 		console.log('onmouseup =>');
 		Show.target = undefined;
 		Show.press_flag = false;
 	}
}
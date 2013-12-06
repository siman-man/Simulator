$(document).ready( function(){
	//Result.vertical([{ label:"0", value: 10}, { label:"1", value: 5 }]);
	//Result.vertical();
	
	Show.init();
});

var Show = {
	stage: undefined,
	press_flag: false,
	target: undefined,
	node_list: [],
	edge_list: [],
	line_list: [],
	r: 15,

	init: function(){
		this.canvas = document.getElementById('my_canvas');

  	this.canvas.addEventListener('mousemove', this.onmousemove, false);
  	this.canvas.addEventListener('mouseup', this.onmouseup, false);
  	this.canvas.addEventListener("contextmenu", function(e){
    	e.preventDefault();
  	}, false);

		this.stage = new createjs.Stage(document.getElementById('my_canvas'));
		createjs.Ticker.setFPS(30);
    //createjs.Ticker.addEventListener("tick", this.handleTick);
    createjs.Ticker.addEventListener("tick", function(event){
    	Show.clearLine();
    	Show.updateEdge();
			Show.stage.update();
    });
    console.log('world');
		console.log(this.nodes_list);
		for( var id in this.nodes_list ){
			this.createNode( id, Math.random()*800|0 + 50, Math.random()*500|0 +50 )
		}
		for( var id in this.edges_list ){
			var edge = this.edges_list[id];
			console.log(edge);
			this.edge_list.push({ source: edge.source, target: edge.target, value: edge.value });
		}
		console.log(this.edges_list);
	},

	handleTick: function(event) {
  	Show.stage.update();
  },

  update: function(){
  	console.log('hello world');
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
 		if( id == 0 ){
			node.graphics.beginFill('rgba(0,255,59,1.0)').drawCircle(0, 0, this.r);
 		}else if( id == 1 ){
			node.graphics.beginFill('rgba(255,59,0,1.0)').drawCircle(0, 0, this.r);
 		}else{
 			node.graphics.beginFill('rgba(0,59,255,1.0)').drawCircle(0, 0, this.r);
 		}
    Show.stage.addChild(node);
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
 				sin = dy / dist;

		line.graphics.setStrokeStyle(value).beginStroke("rgba(0,0,0,0.9)");
		line.graphics.moveTo( source.x - this.r * cos, source.y - this.r * sin );
		line.graphics.lineTo( target.x + this.r * cos, target.y + this.r * sin );
		this.line_list.push(line);
		Show.stage.addChild(line);
 	},

 	onmousedown: function(e){
 		console.log('onmousedown =>');
    Show.target = e.target;
    Show.press_flag = true;
 	},

 	onmousemove: function(e){
 		if( Show.press_flag ){
 			var x = e.clientX - Show.canvas.offsetLeft + document.body.scrollLeft,
       		y = e.clientY - Show.canvas.offsetTop + document.body.scrollTop,
       		node = Show.target;

     	node.x = x;
      node.y = y;
			console.log('hello');
 		}
 	},

 	onmouseup: function(e){
 		console.log('onmouseup =>');
 		Show.target = undefined;
 		Show.press_flag = false;
 	}
}
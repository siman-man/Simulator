$(document).ready( function(){
	//Result.vertical([{ label:"0", value: 10}, { label:"1", value: 5 }]);
	//Result.vertical();
	Show.init();
});

var Show = {
	canvas: document.getElementById('canvas'),
	field: new createjs.Stage(this.canvas), 

	init: function(){
		createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", this.handleTick);
		console.log('hello');
		this.createNode();
	},

	handleTick: function(event) {
  	Show.field.update();
  },

  update: function(){
  	console.log('hello world');
  },

 	createNode: function(){
 		var node = new createjs.Shape();
 		node.x = 200;
 		node.y = 200;
    node.graphics.beginFill('rgba(255,59,0,1.0)').drawCircle(10, 10, 10);
    Show.field.addChild(node);
 	}
}
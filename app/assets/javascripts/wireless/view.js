var View = {
	packet_color: "yellow",
	packet_size: 2,
	gridSpan: 30,
	width: Simulator.canvas_width/30|0+1,
	height: Simulator.canvas_height/30|0+1,
	propagation: [],

	init: function(){
		console.log(this.width, this.height);
 		for(var y = 0; y < (Simulator.canvas_height/30)+1; y++){
      this.propagation[y] = [];

      for(var x = 0; x < (Simulator.canvas_width/30)+1; x++){
      }
    }
	},

	movePacket: function(packet, speed){
		var dest = packet.dest;

		var dx = (dest.x) - packet.x;
		var dy = (dest.y) - packet.y;
		var radian = Math.atan2(dy, dx);

		packet.x += Math.cos(radian) * speed;
		packet.y += Math.sin(radian) * speed;
	},

	drawGrid: function(){
		var span = this.gridSpan;
		var WS = Simulator;

		for(var i = 0; i <= 1600; i += span){
			var vline = new createjs.Shape();
			var color = "brack";
			vline.graphics.beginStroke(color);
			vline.graphics.moveTo(i, 0);
			vline.graphics.lineTo(i, WS.canvas_height * 2);
			WS.map.addChild(vline);
		}

		for(var i = 0; i <= 800; i += span){
			var hline = new createjs.Shape();
			var color = "brack";
			hline.graphics.beginStroke(color);
			hline.graphics.moveTo(0, i);
			hline.graphics.lineTo(WS.canvas_width*2, i);
			WS.map.addChild(hline);
		}
	},

	point2coord: function( px, py ){
		return { x: px/this.gridSpan|0, y: py/this.gridSpan|0 };
	},

	point2coordCar: function( px, py, direct){
		var rest_x = px%this.gridSpan;
		var rest_y = py%this.gridSpan;

		if(rest_x == 0 && rest_y == 0){
			return { x: px/this.gridSpan|0, y: py/this.gridSpan|0 };
		}

		switch(direct){
			case 2:
				return { x: (px/this.gridSpan|0) + 1, y: py/this.gridSpan|0 };
			case 3:
				return { x: px/this.gridSpan|0, y: (py/this.gridSpan|0) + 1 };
			default:
				return { x: px/this.gridSpan|0, y: py/this.gridSpan|0 };
		}
	},

	animation: function(cell_list){
		while(cell_list.length > 0){
			var cell = cell_list.shift();
			var shape = new createjs.Shape();
			var x = cell.x * this.gridSpan;
			var y = cell.y * this.gridSpan;
      shape.graphics.beginFill('rgba(0,255,0,0.2)').drawRect(x, y, 30, 30);
      Simulator.map.addChild(shape);
      View.propagation[cell.y][cell.x] = shape;
		}
	},

	clean: function(){
		for(var y = 0; y < (Simulator.canvas_height/30)+1; y++){
      for(var x = 0; x < (Simulator.canvas_width/30)+1; x++){
      	if(this.propagation[y][x] !== undefined){
      		var shape = this.propagation[y][x];
      		Simulator.map.removeChild(shape);
      		delete this.propagation[y][x];
      	}
      }
    }
	},
}
var gridSize = 30;

var View = {
	packet_color: "yellow",
	packet_size: 2,
	gridSize: gridSize,
	width: Simulator.canvas_width/gridSize|0+1,
	height: Simulator.canvas_height/gridSize|0+1,
	propagation: [],

	init: function(){
		var x, y;
 		for( y = 0; y < this.height; y++ ){
      this.propagation[y] = [];

      for(x = 0; x < this.width; x++){
      }
    }
	},

	movePacket: function(packet, speed){
		var dest = packet.dest,
				dx = (dest.x) - packet.x,
				dy = (dest.y) - packet.y,
				radian = Math.atan2(dy, dx);

		packet.x += Math.cos(radian) * speed;
		packet.y += Math.sin(radian) * speed;
	},

	drawGrid: function(){
		var span = gridSize, 
				vline,
				hline, 
				color,
				i;

		for(i = 0; i <= Simulator.canvas_height; i += span){
			vline = new createjs.Shape();
			vline.graphics.beginStroke("rgba(0,0,0,0.9)");
			vline.graphics.moveTo(0, i);
			vline.graphics.lineTo(Simulator.canvas_width * 2, i);
			Simulator.map.addChild(vline);
		}

		for(i = 0; i <= Simulator.canvas_width; i += span){
			hline = new createjs.Shape();
			hline.graphics.beginStroke("rgba(0,0,0,0.9)");
			hline.graphics.moveTo(i, 0);
			hline.graphics.lineTo(i, Simulator.canvas_height*2);
			Simulator.map.addChild(hline);
		}
	},

	point2coord: function( px, py ){
		return { x: px/gridSize|0, y: py/gridSize|0 };
	},

	point2coordCar: function( px, py, direct){
		var rest_x = px%gridSize,
		    rest_y = py%gridSize;

		if(rest_x == 0 && rest_y == 0){
			return { x: px/gridSize|0, y: py/gridSize|0 };
		}

		switch(direct){
			case 2:
				return { x: (px/gridSize|0) + 1, y: py/gridSize|0 };
			case 3:
				return { x: px/gridSize|0, y: (py/gridSize|0) + 1 };
			default:
				return { x: px/gridSize|0, y: py/gridSize|0 };
		}
	},

	isInside: function( y, x ){
		return ( 0 <= y && y < View.height && 0 <= x && x < View.width );
	},

	animation: function(cell_list){
		var cell, shape, x, y;
		while(cell_list.length > 0){
			cell = cell_list.shift();
			
			if( View.propagation[cell.y][cell.x] === undefined){
				shape = new createjs.Shape();
				x = cell.x * gridSize;
				y = cell.y * gridSize;
      	shape.graphics.beginFill('rgba(0,255,0,0.2)').drawRect(x, y, gridSize, gridSize);
      	Simulator.map.addChild(shape);
      	View.propagation[cell.y][cell.x] = shape;
    	}
		}
	},

	clean: function(){
		var x, y, shape;
		for(y = 0; y < this.height; y++){
      for(x = 0; x < this.width; x++){
      	if(this.propagation[y][x] !== undefined){
      		shape = this.propagation[y][x];
      		Simulator.map.removeChild(shape);
      		delete this.propagation[y][x];
      	}
      }
    }
	},
}
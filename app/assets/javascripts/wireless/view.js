var gridSize = 15;

var View = {
	packet_color: "yellow",
	packet_size: 2,
	gridSize: gridSize,
	width: Simulator.canvas_width/gridSize|0+1,
	height: Simulator.canvas_height/gridSize|0+1,
	propagation: [],
	grid_lines: [],
	connection_line: [],
	route_grid: [],
	route_list: {},
	selected_cell: undefined,
	route_id: 0,
	route_top: { y: -1, x: -1 },
	dy: [ 0, 1, 0, -1],
	dx: [ 1, 0, -1, 0],

	init: function(){
		var x, y;

 		for( y = 0; y < this.height; y++ ){
      this.propagation[y] = [];
      this.route_grid[y] = [];

      for(x = 0; x < this.width; x++){
      	shape = new createjs.Shape();
      	shape.graphics.beginFill('rgba(0,255,0,0.2)').drawRect(x*gridSize, y*gridSize, gridSize, gridSize);
      	View.propagation[y][x] = { obj: shape, flag: false };
      	this.route_grid[y][x] = { obj: undefined, exist: false };
      }
    }
	},

	check_connect: function( y, x ){
		var ny, nx, i, cnt = 0;
		if( this.route_id === 0 && Simulator.isEmpty( y, x )) return true;
		for( i = 0; i < 4; i++ ){
			ny = y + this.dy[i];
			nx = x + this.dx[i];
			if( this.route_top.y === ny && this.route_top.x === nx ) return true;
		}
		return false;
	},

	route_view: function( route ){
		console.log("route view =>");
		var i, coord, shape;
		for( i in route ){
			coord = route[i];
			shape = new createjs.Shape();
      shape.graphics.beginFill('rgba(255,0,0,0.2)').drawRect(coord.x*gridSize, coord.y*gridSize, gridSize, gridSize);
      shape.label = new createjs.Text( coord.wait, "12px Arial", "black");
    	shape.label.x = coord.x * gridSize;
    	shape.label.y = coord.y * gridSize;
    	shape.label.textBaseline = "top";
      Simulator.map.addChild(shape);
      Simulator.map.addChild(shape.label);
      this.route_list[this.route_id] = { y: coord.y, x: coord.x, obj: shape, id: i };
 	    this.route_grid[coord.y][coord.x] = { path_id: this.route_id, y: y, x: x, obj: shape, exist: true };
    	this.route_id++;
    	this.route_top = { y: coord.y, x: coord.x };
		}
	},

	paint_route: function( y, x ){
		if( !this.check_connect( y, x ) ) return;
		shape = new createjs.Shape();
    shape.graphics.beginFill('rgba(255,0,0,0.2)').drawRect(x*gridSize, y*gridSize, gridSize, gridSize);
    shape.label = new createjs.Text(0, "12px Arial", "black");
   	shape.label.x = x * gridSize;
    shape.label.y = y * gridSize;
    shape.label.textBaseline = "top";
    Simulator.map.addChild(shape);
    Simulator.map.addChild(shape.label);
    this.route_grid[y][x] = { path_id: this.route_id, y: y, x: x, obj: shape, exist: true };
    this.route_list[this.route_id] = { y: y, x: x, obj: shape };
    Simulator.route_user.path[this.route_id] = { y: y, x: x, wait: 0 };
    Simulator.route_user.path_length = Object.keys(Simulator.route_user.path).length;
    this.route_id++;
    this.route_top = { y: y, x: x };
	},

	clear_route: function(){
		console.log("clear route =>");
		var i, cell, coord;
		for( i in this.route_list ){
			cell = this.route_list[i];
			Simulator.map.removeChild(cell.obj);
			Simulator.map.removeChild(cell.obj.label);
			delete this.route_list[i];
			this.route_grid[cell.y][cell.x] = { obj: undefined, exist: false };
		}
		this.route_list = {};
		this.route_id = 0;
	},

	update: function(){
		var x, y, 
				flag, 
				obj, 
				line;

		for( y = 0; y < View.height; y++ ){
			for( x = 0; x < View.width; x++ ){
				flag = View.propagation[y][x].flag;
				obj = View.propagation[y][x].obj;
				if( flag && Simulator.field[y][x].obj === undefined && !Simulator.map.contains( obj )){
					Simulator.map.addChild(obj);
				}else if( !flag && Simulator.state.current != 'stop' && Simulator.map.contains( obj )){
					Simulator.map.removeChild(obj);
				}
				View.propagation[y][x].flag = false;
			}
		}

		View.drawConnectionLine();
	},

	movePacket: function(packet, speed){
		var dest = packet.dest,
				dx = (dest.x) - packet.x,
				dy = (dest.y) - packet.y,
				radian = Math.atan2(dy, dx);

		packet.x += Math.cos(radian) * speed;
		packet.y += Math.sin(radian) * speed;
	},

	drawConnectionLine: function(){
		var i, line;
		for( i in View.connection_line ){
			line = View.connection_line[i];
			Simulator.map.addChild(line);
		}
	},

	clearConnectionLine: function(){
		var i, line;
		for( i in View.connection_line ){
			line = View.connection_line[i];
			Simulator.map.removeChild(line);
		}

		View.connection_line = [];
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
			this.grid_lines.push(vline);
		}

		for(i = 0; i <= Simulator.canvas_width; i += span){
			hline = new createjs.Shape();
			hline.graphics.beginStroke("rgba(0,0,0,0.9)");
			hline.graphics.moveTo(i, 0);
			hline.graphics.lineTo(i, Simulator.canvas_height*2);
			Simulator.map.addChild(hline);
			this.grid_lines.push(hline);
		}
	},

	clear: function(){
		View.clearConnectionLine();
	},

	clearGrid: function(){
		var line, i;
		for( i in View.grid_lines ){
			line = View.lines[i];
			Simulator.map.removeChild(line);
			delete line;
		}
	},

	point2coord: function( px, py ){
		return { x: px/gridSize|0, y: py/gridSize|0 };
	},

	point2coordCar: function( px, py, direct){
		var rest_x = px%gridSize,
		    rest_y = py%gridSize;

		if(rest_x === 0 && rest_y === 0){
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
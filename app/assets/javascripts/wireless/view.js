var gridSize = 30;

var View = {
	packet_color: "yellow",
	packet_size: 2,
	gridSize: gridSize,
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
		this.width = Simulator.canvas_width/gridSize|0+1;
		this.height = Simulator.canvas_height/gridSize|0+1;

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
		console.log(View.route_id);
		console.log(this.route_top);
		if( View.route_id === 0 && Simulator.isEmpty( y, x )){
			console.log("first check clear =>");
			return true;
		}
		for( i = 0; i < 4; i++ ){
			ny = y + this.dy[i];
			nx = x + this.dx[i];
			if( this.route_top.y === ny && this.route_top.x === nx ){
				console.log("second check clear =>");
				return true;
			}
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
      shape.label.textAlign = "center";
    	shape.label.x = coord.x * gridSize + gridSize/2|0;
    	shape.label.y = coord.y * gridSize + gridSize/5|0;
    	shape.label.textBaseline = "top";
      Simulator.map.addChild(shape);
      Simulator.map.addChild(shape.label);
      this.route_list[this.route_id] = { y: coord.y, x: coord.x, obj: shape, id: i };
 	    this.route_grid[coord.y][coord.x] = { path_id: this.route_id, y: coord.y, x: coord.x, obj: shape, exist: true };
    	View.route_id++;
    	this.route_top = { y: coord.y, x: coord.x };
		}
		console.log("route top =>",this.route_top)
	},

	paint_route: function( y, x ){
		if( !this.check_connect( y, x ) ) return;
		shape = new createjs.Shape();
    shape.graphics.beginFill('rgba(255,0,0,0.2)').drawRect(x*gridSize, y*gridSize, gridSize, gridSize);
    shape.label = new createjs.Text(0, "12px Arial", "black");
    shape.label.textAlign = "center";
   	shape.label.x = x * gridSize + gridSize/2|0;
    shape.label.y = y * gridSize + gridSize/5|0;
    shape.label.textBaseline = "top";
    Simulator.map.addChild(shape);
    Simulator.map.addChild(shape.label);
    this.route_grid[y][x] = { path_id: this.route_id, y: y, x: x, obj: shape, exist: true };
    this.route_list[this.route_id] = { y: y, x: x, obj: shape };
    Simulator.route_user.path[this.route_id] = { y: y, x: x, wait: 0 };
    Simulator.route_user.path_length = Object.keys(Simulator.route_user.path).length;
    View.route_id++;
    View.route_top = { y: y, x: x };
    console.log("paint_route: route top =>", View.route_top);
	},

	delete_route: function(){
		View.route_id--;
		var cell = this.route_list[View.route_id];
		Simulator.map.removeChild(cell.obj);
		Simulator.map.removeChild(cell.obj.label);
		delete Simulator.route_user.path[this.route_id]
		delete this.route_list[this.route_id];
		this.route_grid[cell.y][cell.x] = { obj: undefined, exist: false };
		if( this.route_id !== 0 ){
			var ny, nx;
			for(var i = 0; i < 4; ++i){
				ny = cell.y + this.dy[i];
				nx = cell.x + this.dx[i];
				if( this.route_grid[ny][nx].exist ){
					this.route_top = { y: ny, x: nx };
					break;
				}
			}	
		}else{
			this.route_top = { y: -1, x: -1 };
		}
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
		console.log(Simulator.map);
		for(i = 0; i <= Simulator.canvas_height; i += span){
			vline = new createjs.Shape();
			vline.graphics.beginStroke("rgba(0,0,0,0.9)");
			vline.graphics.moveTo(0, i);
			vline.graphics.lineTo(View.width * gridSize, i);
			Simulator.map.addChild(vline);
			this.grid_lines.push(vline);
		}

		for(i = 0; i <= Simulator.canvas_width; i += span){
			hline = new createjs.Shape();
			hline.graphics.beginStroke("rgba(0,0,0,0.9)");
			hline.graphics.moveTo(i, 0);
			hline.graphics.lineTo(i, View.height * gridSize );
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
			line = View.grid_lines[i];
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
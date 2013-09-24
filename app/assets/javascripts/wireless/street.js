var Street = {
	street: [],
	road_id: 0,
	road_list: {},

	init: function(){
		for(var i = 0; i < Simulator.canvas_height; i++){
			this.street[i] = [];
		}
	},

	create: function(x, y){
		console.log("create road =>");

		var type = this.selectRoadType(x, y),
				road = new createjs.Bitmap('/assets/road' + type +'.jpeg');
		
		road.id = this.road_id;
		this.road_id++;
		road.x = x * gridSize;
		road.y = y * gridSize;
		road.type = type;

		Simulator.map.addChild(road);
		Simulator.field[y][x] = { x: x, y: y, obj: road, type: 'road', cost: 100, pf: 2 };

		this.update(x, y+1);
		this.update(x, y-1);
		this.update(x+1, y);
		this.update(x-1, y);

		Car.imageUpdate();
		User.imageUpdate();
	},

	selectRoadType: function(x, y){
		var value = 0;
		value = value | ((x-1 >= 0 && Simulator.field[y][x-1].type == 'road')? 8 : 0);
		value = value | ((x+1 < View.width && Simulator.field[y][x+1].type == 'road')? 4 : 0);
		value = value | ((y+1 < View.height && Simulator.field[y+1][x].type == 'road')? 2 : 0);
		value = value | ((y-1 >= 0 && Simulator.field[y-1][x].type == 'road')? 1 : 0);
		
		return value;
	},

	update: function( x, y ){
		if(this.checkRange(x, y) && Simulator.field[y][x].type == 'road'){
			Simulator.map.removeChild(Simulator.field[y][x].obj);
			delete Simulator.field[y][x];

			var type = this.selectRoadType(x, y),
					road = new createjs.Bitmap('/assets/road' + type + '.jpeg');

			road.x = x * 30;
			road.y = y * 30;

			Simulator.map.addChild(road);
			Simulator.field[y][x] = { x: x, y: y, obj: road, type: 'road', cost: 100, pf: 2 };
		}
	},

	clear: function(){
		var x, y;

		for( y = 0; y < View.height; y++ ){
			for( x = 0; x < View.width; x++ ){
				if(Simulator.field[y][x].type == 'road'){
					Simulator.field[y][x] = { x: x, y: y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
				}
			}
		}
		this.road_id = 0;
		this.road_list = {};
	},

	remove: function( road ){
		var coord = View.point2coord( road.x, road.y );
		Simulator.map.removeChild(road);
		delete this.road_list[road.id];
		Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };

		this.update(coord.x, coord.y+1);
		this.update(coord.x, coord.y-1);
		this.update(coord.x+1, coord.y);
		this.update(coord.x-1, coord.y);

		Car.imageUpdate();
		User.imageUpdate();
	},

	checkRange: function(x, y){
		return (0 <= x && x < View.width && 0 <= y && y < View.height);
	}
}
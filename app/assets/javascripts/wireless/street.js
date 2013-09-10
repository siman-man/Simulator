var Street = {
	street: [],
	road_type: [],

	init: function(){
		for(var i = 0; i < Simulator.canvas_height; i++){
			this.street[i] = [];
			this.road_type[i] = [];
		}
	},

	create: function(x, y, flag){
		console.log("create road =>");

		var type = this.selectRoadType(x, y);
		var road = new createjs.Bitmap('/assets/road' + type +'.jpeg');
		road.x = x * 30;
		road.y = y * 30;
		road.type = type;

		Simulator.map.addChild(road);
		this.street[y][x] = road;
		Simulator.field[y][x] = { x: x, y: y, obj: road, type: 'road', cost: 100, pf: 2 };

		this.update(x, y+1);
		this.update(x, y-1);
		this.update(x+1, y);
		this.update(x-1, y);

		Car.imageUpdate();
		User.imageUpdate();
	},

	selectRoadType: function(x, y){
		var bit = '';
		bit += (x-1 < 0 || this.street[y][x-1] === undefined)? '0' : '1';
		bit += (this.street[y][x+1] === undefined)? '0' : '1';
		bit += (this.street[y+1][x] === undefined)? '0' : '1';
		bit += (y-1 < 0 || this.street[y-1][x] === undefined)? '0' : '1';
		
		return parseInt( bit, 2 );
	},

	update: function( x, y ){
		if(this.checkRange(x, y) && this.street[y][x] !== undefined){
			var remove_road = this.street[y][x];
			Simulator.map.removeChild(remove_road);
			delete this.street[y][x];
			Simulator.field[y][x] = undefined;

			var type = this.selectRoadType(x, y);
			var road = new createjs.Bitmap('/assets/road' + type + '.jpeg');

			road.x = x * 30;
			road.y = y * 30;

			Simulator.map.addChild(road);
			this.street[y][x] = road;
			Simulator.field[y][x] = { x: x, y: y, obj: road, type: 'road', cost: 100, pf: 2 };
		}
	},

	remove: function( x, y ){
		var road = this.street[y][x];
		Simulator.map.removeChild(road);
		delete this.street[y][x];
		Simulator.field[y][x] = { x: x, y: y, obj: undefined, type: 'normal', cost: 1, pf: 1 };

		this.update(x, y+1);
		this.update(x, y-1);
		this.update(x+1, y);
		this.update(x-1, y);

		Car.imageUpdate();
		User.imageUpdate();
	},

	checkRange: function(x, y){
		return (0 <= x && x <= 1600/View.gridSpan && 0 <= y && y <= 800/View.gridSpan);
	}
}
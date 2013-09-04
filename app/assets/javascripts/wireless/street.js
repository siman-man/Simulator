var Street = {
	street: [],
	road_type: [],

	init: function(){
		for(var i = 0; i < Simulator.canvas_height; i++){
			this.street[i] = [];
			this.road_type[i] = [];
		}
	},

	createRoad: function(x, y, flag){
		var coord = View.point2coord(x, y);

		console.log(coord);
		this.updateRoad(coord.x, coord.y, flag);
	},

	selectRoadType: function(x, y){
		var bit = '';
		bit += (this.street[y][x-1] === undefined)? '0' : '1';
		bit += (this.street[y][x+1] === undefined)? '0' : '1';
		bit += (this.street[y+1][x] === undefined)? '0' : '1';
		bit += (this.street[y-1][x] === undefined)? '0' : '1';
		
		return parseInt( bit, 2 );
	},

	updateRoad: function(x, y, flag){
		if(this.street[y][x] === undefined){
			if(this.checkRange(x, y)){
				var type = this.selectRoadType(x, y);
				var road = new createjs.Bitmap('/assets/road' + type +'.jpeg');

				road.x = x * 30;
				road.y = y * 30;

				Simulator.map.addChild(road);
				this.street[y][x] = road;

				this.renewRoad(x, y+1);
				this.renewRoad(x, y-1);
				this.renewRoad(x+1, y);
				this.renewRoad(x-1, y);
			}
		}else if(flag && this.checkRange(x, y)){
			var road = this.street[y][x];
			Simulator.map.removeChild(road);
			delete this.street[y][x];

			this.renewRoad(x, y+1);
			this.renewRoad(x, y-1);
			this.renewRoad(x+1, y);
			this.renewRoad(x-1, y);
		}
	},

	renewRoad: function(x, y){
		if(this.checkRange(x, y) && this.street[y][x] !== undefined){
			var remove_road = this.street[y][x];
			Simulator.map.removeChild(remove_road);
			delete this.street[y][x];

			var type = this.selectRoadType(x, y);
			var road = new createjs.Bitmap('/assets/road' + type + '.jpeg');

			road.x = x * 30;
			road.y = y * 30;

			Simulator.map.addChild(road);
			this.street[y][x] = road;
		}
	},

	checkRange: function(x, y){
		return (0 <= x && x <= 1600/View.gridSpan && 0 <= y && y <= 800/View.gridSpan);
	}
}
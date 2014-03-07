var Street = {
	road_id: 0,
	road_list: {},

	create: function(x, y){
		var road = new createjs.Shape();

		road.graphics.beginFill('rgba(211,211,211,1.0)').drawRect(0, 0, gridSize, gridSize);
		
		road.id = this.road_id;
		this.road_id++;
		road.x = x * gridSize;
		road.y = y * gridSize;
		road.type = 'road';

		Simulator.map.addChild(road);
		Simulator.field[y][x] = { x: x, y: y, obj: road, type: 'road', cost: 20, pf: 2 };
	},

	clear: function(){
		var x, 
				y;

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
	},

	checkRange: function(x, y){
		return (0 <= x && x < View.width && 0 <= y && y < View.height);
	}
}
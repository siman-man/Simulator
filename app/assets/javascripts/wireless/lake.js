var Lake = {
	lake_id: 0,
	lake_list: {},

	create: function(x, y){
		var lake = new createjs.Shape();
		lake.x = x * gridSize; 
		lake.y = y * gridSize;

    lake.graphics.beginFill('rgba(128,255,212,0.98)').drawRect(0, 0, View.gridSize, View.gridSize);

		lake.id = this.lake_id;
		this.lake_id++;
		lake.type = 'lake';

		Simulator.map.addChild(lake);
		Simulator.field[y][x] = { x: x, y: y, obj: lake, type: 'lake', cost: 1000, pf: 3 };

		this.lake_list[lake.id] = lake;
	},

	clear: function(){
		var i, lake;

		for( i in this.lake_list ){
			lake = this.lake_list[i];
			this.remove(lake);
		}
		this.lake_id = 0;
		this.lake_list = {};
	},

	remove: function(lake){
		var coord = View.point2coord( lake.x, lake.y );

		Simulator.map.removeChild(lake);
		delete this.lake_list[lake.id];
		Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
	},
}
var Wall = {
	wall_id: 0,
	wall_list: {},

	create: function(x, y){
		console.log('wall created =>', y, x );
		var wall = new createjs.Shape();
		wall.x = x * gridSize; 
		wall.y = y * gridSize;

    wall.graphics.beginFill('rgba(92,92,92,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);

		wall.id = this.wall_id;
		this.wall_id++;
		wall.type = 'wall';

		Simulator.map.addChild(wall);
		Simulator.field[y][x] = { x: x, y: y, obj: wall, type: 'wall', cost: 100, pf: 3 };

		this.wall_list[wall.id] = wall;
	},

	clear: function(){
		var i, wall;

		for( i in this.wall_list ){
			wall = this.wall_list[i];
			this.remove(wall);
		}
		this.wall_id = 0;
		this.wall_list = {};
	},

	remove: function( wall ){
		var coord = View.point2coord( wall.x, wall.y );
		console.log('wall remove =>', coord.y, coord.x );

		Simulator.map.removeChild(wall);
		delete this.wall_list[wall.id];
		Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
	},
}
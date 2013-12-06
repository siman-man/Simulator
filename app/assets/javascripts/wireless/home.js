var Home = {
	home_id: 0,
	home_list: {},

	create: function(x, y, num){
		console.log('home created');
		var home = new createjs.Shape();

		home.graphics.beginFill('rgba(96,123,139,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);
		home.id = this.home_id;
		this.home_id++;
		home.x = x * gridSize; 
		home.y = y * gridSize;
		home.type = 'home';

		Simulator.map.addChild(home);
		Simulator.field[y][x] = { x: x, y: y, obj: home, type: 'home', cost: 100, pf: 2 };

		this.home_list[home.id] = home;
	},

	clear: function(){
		var i, home;

		for( i in this.home_list ){
			home = this.home_list[i];
			this.remove(home);
		}
		this.home_id = 0;
		this.home_list = {};
	},

	remove: function( home ){
		console.log('home remove');
		var coord = View.point2coord( home.x, home.y );

		Simulator.map.removeChild(home);
		Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
		delete this.home_list[home.id];
	},
}
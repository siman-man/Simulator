var Home = {
	home_id: 0,
	home_list: {},

	create: function(x, y){
		console.log('home created');
		var home = new createjs.Bitmap('/assets/home.gif');
		home.id = this.home_id;
		this.home_id++;
		home.x = x * View.gridSpan; 
		home.y = y * View.gridSpan;
		home.type = 'home';

		Simulator.map.addChild(home);
		Simulator.field[y][x] = { obj: home, type: 'H', id: home.id };

		this.home_list[home.id] = home;
	},

	remove: function(x, y){
		console.log('home remove');
		var home = Simulator.field[y][x].obj;

		Simulator.map.removeChild(home);
		Simulator.field[y][x] = undefined;
		delete this.home_list[home.id];
	},
}
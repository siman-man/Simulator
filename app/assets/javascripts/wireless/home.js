var Home = {
	home_id: 0,
	home_list: {},

	create: function(x, y){
		var home = new createjs.Bitmap('/assets/home.gif');
		home.id = this.home_id;
		this.home_id++;
		var coord = View.point2coord(x, y);
		home.x = coord.x * View.gridSpan; 
		home.y = coord.y * View.gridSpan;

		Simulator.map.addChild(home);

		this.home_list[home.id] = home;
	},

	remove: function(id){
		var home = this.home_list[id];

		Simulator.map.removeChild(home);
		delete this.home_list[id];
	},
}
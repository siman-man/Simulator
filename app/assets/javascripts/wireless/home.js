var Home = {
	home_id: 0,
	home_list: {},

	create: function(x, y, num){
		var user_num = num || 1;
		console.log('home created');
		var home = new createjs.Bitmap('/assets/home.gif');
		home.id = this.home_id;
		this.home_id++;
		home.x = x * View.gridSpan; 
		home.y = y * View.gridSpan;
		home.type = 'home';
		home.residents = [];

		switch(num){
			default:
				home.user_num = 1;
				home.residents.push( User.create( x, y, 'worker') );
				break;
		}

		for(var i in home.residents){
			var resident = home.residents[i];
			resident.home = home;
			Simulator.map.removeChild(resident);
		}

		Simulator.map.addChild(home);
		Simulator.field[y][x] = { x: x, y: y, obj: home, type: 'home', cost: 100, pf: 2 };

		this.home_list[home.id] = home;
	},

	remove: function(x, y){
		console.log('home remove');
		var home = Simulator.field[y][x].obj;

		Simulator.map.removeChild(home);
		Simulator.field[y][x] = { x: x, y: y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
		delete this.home_list[home.id];
	},
}
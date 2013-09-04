var Car = {
	car_id: 0,
	car_list: {},

	create: function(x, y){
		console.log('car created');
		var car = new createjs.Bitmap('/assets/car.gif');
		car.id = this.car_id;
		this.car_id++;
		car.x = x * View.gridSpan; 
		car.y = y * View.gridSpan;
		car.type = 'car';

		Simulator.map.addChild(car);
		Simulator.field[y][x] = { obj: car, type: 'car', id: car.id };

		this.car_list[car.id] = car;
	},

	remove: function(x, y){
		console.log('car remove');
		var car = Simulator.field[y][x].obj;

		Simulator.map.removeChild(car);
		Simulator.field[y][x] = undefined;
		delete this.car_list[car.id];
	},
}
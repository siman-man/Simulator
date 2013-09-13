var Car = {
	car_id: 0,
	car_list: {},
	speed: 7.5,

	create: function(x, y){
		console.log('car created');
		var car = new createjs.Bitmap('/assets/car.gif');
		car.id = this.car_id;
		this.car_id++;
		car.x = x * View.gridSpan; 
		car.y = y * View.gridSpan;
		car.type = 'car';
		car.direct = 0;

		Simulator.map.addChild(car);

		this.car_list[car.id] = car;
	},

	remove: function( car ){
		console.log('car remove');

		Simulator.map.removeChild(car);
		delete this.car_list[car.id];
	},

	update: function(){
		for(var id in this.car_list){
			var car = this.car_list[id];
			this.move(car);
		}
	},

	imageUpdate: function(){
		for(var id in this.car_list){
			var car = this.car_list[id];
			Simulator.map.removeChild(car);
			Simulator.map.addChild(car);
		}
	},

	move: function(car){
		var direct = car.direct;
		var coord = View.point2coordCar(car.x, car.y, car.direct);
		var road;

		switch(direct){
			case 0:
				obj = Simulator.field[coord.y][coord.x+1];
				if(obj && obj.type == 'road'){
					car.x += this.speed;
				}else{
					car.direct = (direct+1)%4;
				}
				break;
			case 1:
				obj = Simulator.field[coord.y+1][coord.x];
				if(obj && obj.type == 'road'){
					car.y += this.speed;
				}else{
					car.direct = (direct+1)%4;
				}
				break;
			case 2:
				obj = Simulator.field[coord.y][coord.x-1];
				if(obj && obj.type == 'road'){
					car.x -= this.speed;
				}else{
					car.direct = (direct+1)%4;
				}
				break;
			case 3:
				obj = (coord.y-1 >= 0)? Simulator.field[coord.y-1][coord.x] : undefined;
				if(obj && obj.type == 'road'){
					car.y -= this.speed;
				}else{
					car.direct = (direct+1)%4;
				}
				break;
		}
	},
}
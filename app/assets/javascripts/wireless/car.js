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

		Simulator.field[coord.y][coord.x] = undefined;

		switch(direct){
			case 0:
				road = Street.street[coord.y][coord.x+1];
				if(road !== undefined){
					car.x += this.speed;
				}else if(Street.street[coord.y+1][coord.x]){
					car.direct = 1;
				}else if(coord.y-1 >= 0 && Street.street[coord.y-1][coord.x]){
					car.direct = 3;
				}else{
					car.direct = (direct+1)%4;
				}
				break;
			case 1:
				road = Street.street[coord.y+1][coord.x];
				if(road){
					car.y += this.speed;
				}else if(Street.street[coord.y][coord.x+1]){
					car.direct = 0;
				}else if(Street.street[coord.y][coord.x-1]){
					car.direct = 2;
				}else{
					car.direct = (direct+1)%4;
				}
				break;
			case 2:
				road = Street.street[coord.y][coord.x-1];
				if(road !== undefined){
					car.x -= this.speed;
				}else if(Street.street[coord.y+1][coord.x]){
					car.direct = 1;
				}else if(coord.y-1 >= 0 && Street.street[coord.y-1][coord.x]){
					car.direct = 3;
				}else{
					car.direct = (direct+1)%4;
				}
				break;
			case 3:
				road = (coord.y-1 >= 0)? Street.street[coord.y-1][coord.x] : undefined;
				if(road !== undefined){
					car.y -= this.speed;
				}else if(Street.street[coord.y][coord.x+1]){
					car.direct = 0;
				}else if(Street.street[coord.y][coord.x-1]){
					car.direct = 2;
				}else{
					car.direct = (direct+1)%4;
				}
				break;
		}

		coord = View.point2coordCar(car.x, car.y, car.direct);
		Simulator.field[coord.y][coord.x] = { obj: car, type: 'car', id: car.id };
	},
}
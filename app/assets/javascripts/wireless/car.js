var Car = {
	car_id: 0,
	car_list: {},

	create: function(x, y){
		console.log('car created');
		var car = new createjs.Shape();
		car.graphics.beginFill('rgba(0,0,255,1.0)').drawCircle(View.gridSize/2, View.gridSize/2, View.gridSize/2);
		car.id = this.car_id;
		this.car_id++;
		car.x = x * gridSize; 
		car.y = y * gridSize;
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
		var id, car;

		for( id in this.car_list ){
			car = this.car_list[id];
			this.move(car);
		}
	},

	moveCar: function( car, dy, dx ){
		car.y += dy;
		car.x += dx;
	},

	isRoad: function( y, x ){
		return Simulator.field[y][x].type === 'road';
	},

	move: function(car){
		var direct = car.direct,
				coord = View.point2coordCar(car.x, car.y, car.direct),
				road;

		switch(direct){
			case 0:
				obj = Simulator.field[coord.y][coord.x+1];
				if(obj && obj.type == 'road'){
					car.x += car.speed;
				}else{
					if( this.isRoad( coord.y+1, coord.x ) ){
						car.direct = 1;
					}else if( this.isRoad( coord.y-1, coord.x )){
						car.direct = 3;
					}else{
						car.direct = 2;
					}
				}
				break;
			case 1:
				obj = Simulator.field[coord.y+1][coord.x];
				if(obj && obj.type == 'road'){
					car.y += car.speed;
				}else{
					if( this.isRoad( coord.y, coord.x+1 ) ){
						car.direct = 0;
					}else if( this.isRoad( coord.y, coord.x-1 )){
						car.direct = 2;
					}else{
						car.direct = 3;
					}
				}
				break;
			case 2:
				obj = Simulator.field[coord.y][coord.x-1];
				if(obj && obj.type == 'road'){
					car.x -= car.speed;
				}else{
					if( this.isRoad( coord.y+1, coord.x ) ){
						car.direct = 1;
					}else if( this.isRoad( coord.y-1, coord.x )){
						car.direct = 3;
					}else{
						car.direct = 0;
					}
				}
				break;
			case 3:
				obj = Simulator.field[coord.y-1][coord.x];
				if(obj && obj.type == 'road'){
					car.y -= car.speed;
				}else{
					if( this.isRoad( coord.y, coord.x+1 ) ){
						car.direct = 0;
					}else if( this.isRoad( coord.y, coord.x-1 )){
						car.direct = 2;
					}else{
						car.direct = 1;
					}
				}
				break;
		}
	},
}
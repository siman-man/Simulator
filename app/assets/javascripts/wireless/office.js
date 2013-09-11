var Office = {
	office_id: 0,
	office_list: {},

	create: function(x, y){
		console.log('office created');
		var office = new createjs.Bitmap('/assets/office.gif');
		office.id = this.office_id;
		this.office_id++;
		office.x = x * View.gridSpan; 
		office.y = y * View.gridSpan;
		office.type = 'office';
		office.worker_list = [];

		Simulator.map.addChild(office);
		Simulator.field[y][x] = { x: x, y: y, obj: office, type: 'office', cost: 100, pf: 3 };

		this.office_list[office.id] = office;
	},

	hire: function(){

	},

	remove: function(x, y){
		console.log('office remove');
		var office = Simulator.field[y][x].obj;

		Simulator.map.removeChild(office);
		Simulator.field[y][x] = { x: x, y: y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
		delete this.office_list[office.id];
	},
}
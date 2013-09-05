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

		Simulator.map.addChild(office);
		Simulator.field[y][x] = { obj: office, type: 'office', id: office.id };

		this.office_list[office.id] = office;
	},

	remove: function(x, y){
		console.log('office remove');
		var office = Simulator.field[y][x].obj;

		Simulator.map.removeChild(office);
		Simulator.field[y][x] = undefined;
		delete this.office_list[office.id];
	},
}
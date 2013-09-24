var Office = {
	office_id: 0,
	office_list: {},

	create: function(x, y){
		console.log('office created');
		var office = new createjs.Shape();
		office.graphics.beginFill('rgba(255,165,0,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);
		
		office.id = this.office_id;
		this.office_id++;
		office.x = x * gridSize; 
		office.y = y * gridSize;
		office.type = 'office';
		office.worker_list = this.hire(office);

		Simulator.map.addChild(office);
		Simulator.field[y][x] = { x: x, y: y, obj: office, type: 'office', cost: 100, pf: 3 };

		this.office_list[office.id] = office;
	},

	clear: function(){
		var i, office;

		for( i in this.office_list ){
      office = this.office_list[i];
      this.remove(office);
    }
    this.office_id = 0;
    this.office_list = {};
	},

	hire: function(office){
		var worker_list = Library.sample(User.jobless_list(), 1),
				i, worker;
	
		for( i in worker_list){
			worker = worker_list[i];
			worker.office = office;
			if(!Simulator.map.contains(worker)){
				Simulator.map.addChild(worker);
			}
		}

		return worker_list;
	},

	remove: function(office){
		console.log('office remove');

		var coord = View.point2coord( office.x, office.y ),
				i, worker;

		for( i in office.worker_list ){
			worker = office.worker_list[i];
			worker.office = undefined;
		}

		Simulator.map.removeChild(office);
		Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
		delete this.office_list[office.id];
	},
}
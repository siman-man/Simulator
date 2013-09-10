var Tree = {
	tree_id: 0,
	tree_list: {},

	create: function(x, y){
		console.log('tree created');
		var tree = new createjs.Bitmap('/assets/tree.gif');
		tree.id = this.tree_id;
		this.tree_id++;
		tree.type = 'tree';
		tree.x = x * View.gridSpan; 
		tree.y = y * View.gridSpan;

		Simulator.map.addChild(tree);
		Simulator.field[y][x] = { x: x, y: y, obj: tree, type: 'tree', cost: 100, pf: 3 };

		this.tree_list[tree.id] = tree;
	},

	remove: function(x, y){
		console.log('tree remove');
		var tree = Simulator.field[y][x].obj;

		Simulator.map.removeChild(tree);
		Simulator.field[y][x] = { x: x, y: y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
		delete this.tree_list[tree.id];
	},
}
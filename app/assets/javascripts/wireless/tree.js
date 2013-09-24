var Tree = {
	tree_id: 0,
	tree_list: {},

	create: function(x, y){
		console.log('tree created');
		var tree = new createjs.Bitmap('/assets/tree.gif');

		tree.id = this.tree_id;
		this.tree_id++;
		tree.type = 'tree';
		tree.x = x * gridSize; 
		tree.y = y * gridSize;

		Simulator.map.addChild(tree);
		Simulator.field[y][x] = { x: x, y: y, obj: tree, type: 'tree', cost: 100, pf: 3 };

		this.tree_list[tree.id] = tree;
	},

	clear: function(){
		var i, tree;

		for( i in this.tree_list ){
			tree = this.tree_list[i];
			this.remove(tree);
		}
		this.tree_id = 0;
		this.tree_list = {};
	},

	remove: function( tree ){
		console.log('tree remove');
		var coord = View.point2coord( tree.x, tree.y );

		Simulator.map.removeChild(tree);
		Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
		delete this.tree_list[tree.id];
	},
}
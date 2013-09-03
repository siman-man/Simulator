var Tree = {
	tree_id: 0,
	tree_list: {},

	create: function(x, y){
		var tree = new createjs.Bitmap('/assets/tree.gif');
		tree.id = this.tree_id;
		this.tree_id++;
		var coord = View.point2coord(x, y);
		tree.x = coord.x * View.gridSpan; 
		tree.y = coord.y * View.gridSpan;

		Simulator.map.addChild(tree);

		this.tree_list[tree.id] = tree;
	},

	remove: function(id){
		var tree = this.tree_list[id];

		Simulator.map.removeChild(tree);
		delete this.tree_list[id];
	},
}
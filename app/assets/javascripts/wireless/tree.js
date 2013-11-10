var Tree = {
	tree_id: 0,
	tree_list: {},

	create: function(x, y){
		console.log('tree created =>', y, x );
		//var tree = new createjs.Bitmap('/assets/tree.gif');
		var tree = new createjs.Shape();
		tree.x = x * gridSize; 
		tree.y = y * gridSize;

    //tree.graphics.beginFill('rgba(46,139,87,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);
    tree.graphics.beginFill('rgba(0,0,0,1.0)').drawRect(0, 0, View.gridSize, View.gridSize);

		tree.id = this.tree_id;
		this.tree_id++;
		tree.ob_type = 'tree';

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
		var coord = View.point2coord( tree.x, tree.y );
		console.log('tree remove =>', coord.y, coord.x );

		Simulator.map.removeChild(tree);
		delete this.tree_list[tree.id];
		Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
	},
}
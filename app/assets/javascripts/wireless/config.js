var Config = {
	output: function(){
		var y, x, key,
			 	node_list,
			 	eid;

		for( y = 0; y < View.height; y++ ){
			for( x = 0; x < View.width; x++ ){
				if(Simulator.field[y][x].type !== 'normal'){
					console.log(Simulator.field[y][x]);
				}
			}
		}

		for( eid in Node.node_list ){
			console.log(Node.node_list[eid].ob_type);
		}
	}
}
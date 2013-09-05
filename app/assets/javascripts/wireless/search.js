var Search = {
	a_star: function(from, to){
		var close_list = [];
		for(var i = 0; i < Simulator.canvas_height; i++){
			close_list[i] = [];
		}

		var open_list = [ { x: from.x, y: from.y, dist: 0 } ];
		
		while(open_list.length > 0){
			var cell = open_list.shift();

			
		}
	},

	getNeighbor: function( x, y ){
		var neighbor_list = [];

		if(x+1 < Simulator.canvas_wdith){
			neighbor_list.push(Simulator.route[y][x+1]);
		}

		if(x-1 >= 0){
			neighbor_list.push(Simulator.route[y][x-1]);
		}

		if(y+1 < Simulator.canvas_height){
			neighbor_list.push(Simulator.route[y+1][x]);
		}

		if(y-1 >= 0){
			neighbor_list.push(Simulator.route[y-1][x]);
		}

		return neighbor_list;
	},
}
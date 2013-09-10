var Search = {
	find: function(from, to){
		var close_list = [];
		var route = [];
		
		for(var i = 0; i < Simulator.canvas_height; i++){
			close_list[i] = [];
		}

		if(from == undefined || to == undefined) return [];

		var open_list = [ { x: from.x, y: from.y, dist: 0 } ];
		
		console.log('start path search');

		while(open_list.length > 0){
			var cell = open_list.shift();

			if(cell.x == to.x && cell.y == to.y){
				var direct = 0;
				var px = cell.x;
				var py = cell.y;

				while(cell.x != from.x || cell.y != from.y){
					route.unshift({ x: cell.x, y: cell.y });
					cell = close_list[cell.coord.y][cell.coord.x];
				}
				break;
			}

			var neighbor_list = this.getNeighbor(cell.x, cell.y);

			for(var i in neighbor_list){
				var neighbor = neighbor_list[i];

				var x = neighbor.x;
				var y = neighbor.y;

				if(close_list[y][x] === undefined){
					var h = Math.abs(x - to.x) + Math.abs(y - to.y);
					var elem = { x: x, y: y, dist: cell.dist+neighbor.cost+h, coord: { x: cell.x, y: cell.y } };
					open_list.push(elem);
				}
			}

			close_list[cell.y][cell.x] = cell;
			open_list.sort(function(a, b){
				return (a.dist > b.dist)? 1 : -1;
			});
		}

		return route;
	},

	getNeighbor: function( x, y ){
		var neighbor_list = [];

		if(x+1 < Simulator.canvas_width){
			neighbor_list.push(Simulator.field[y][x+1]);
		}

		if(x-1 >= 0){
			neighbor_list.push(Simulator.field[y][x-1]);
		}

		if(y+1 < Simulator.canvas_height){
			neighbor_list.push(Simulator.field[y+1][x]);
		}

		if(y-1 >= 0){
			neighbor_list.push(Simulator.field[y-1][x]);
		}

		return neighbor_list;
	},
}
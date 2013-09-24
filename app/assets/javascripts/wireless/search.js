var Search = {
	point: undefined,
	search_list: [],

	find: function(from, to){
		var close_list = [],
				route = [],
				check_list = [],
				shape = new createjs.Shape(),
    		sx = to.x * gridSize,
    		sy = to.y * gridSize,
    		open_list = [ { x: from.x, y: from.y, cost: 0, dist: 0 } ],
    		i, j, px, py,
    		cell, neighbor_list, neighbor,
    		h, s, c, elem;

    shape.graphics.beginFill('rgba(255,0,0,0.3)').drawRect(sx, sy, gridSize, gridSize);
    Simulator.map.addChild(shape);
    this.point = shape;
		
		for( i = 0; i < View.height; i++){
			close_list[i] = [];
			check_list[i] = [];
			for( j = 0; j < View.width; j++){
				close_list[i][j] = false;
				check_list[i][j] = false;
			}
		}

		if(from === undefined || to === undefined) return [];

		console.log('start path search');

		while(open_list.length > 0){
			cell = open_list.shift();
			close_list[cell.y][cell.x] = cell;
			check_list[cell.y][cell.x] = true;

			if(cell.x == to.x && cell.y == to.y){
				px = cell.x;
				py = cell.y;

				while(cell.x != from.x || cell.y != from.y){
					route.unshift({ x: cell.x * gridSize, y: cell.y * gridSize });
					cell = close_list[cell.parent.y][cell.parent.x];
				}
				break;
			}

			neighbor_list = this.getNeighbor(cell.x, cell.y);

			for( i in neighbor_list ){
				neighbor = neighbor_list[i];

				if(!check_list[neighbor.y][neighbor.x]){
					h = Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y);
					c = cell.cost + neighbor.cost;
					s = c+h;
					elem = { x: neighbor.x, y: neighbor.y, cost: c, dist: s, parent: { x: cell.x, y: cell.y } };
					open_list.push(elem);
					check_list[neighbor.y][neighbor.x] = true;
				}
			}
			
			open_list.sort(function(a, b){
				return (a.dist > b.dist)? 1 : -1;
			});
		}

		return route;
	},

	getNeighbor: function( x, y ){
		var neighbor_list = [];

		if(x+1 < View.width){
			neighbor_list.push(Simulator.field[y][x+1]);
		}

		if(x-1 >= 0){
			neighbor_list.push(Simulator.field[y][x-1]);
		}

		if(y+1 < View.height){
			neighbor_list.push(Simulator.field[y+1][x]);
		}

		if(y-1 >= 0){
			neighbor_list.push(Simulator.field[y-1][x]);
		}

		return neighbor_list;
	},
}
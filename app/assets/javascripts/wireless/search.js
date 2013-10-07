var Search = {
	point: undefined,
	search_list: [],
	dx: [ 1, 0,-1, 0, 1, 1,-1,-1],
  dy: [ 0, 1, 0,-1,-1, 1, 1,-1],

	find: function(from, to){
		var close_list = [],
				route = [],
				check_list = [],
				queue = new PriorityQueue(),
				shape = new createjs.Shape(),
    		sx = to.x * View.gridSize,
    		sy = to.y * View.gridSize,
    		i, j, px, py,
    		cell, neighbor_list, neighbor,
    		h, s, c, elem;

    this.point = shape;
		
		for( i = 0; i < View.height; i++){
			close_list[i] = [];
			check_list[i] = [];
			for( j = 0; j < View.width; j++){
				close_list[i][j] = false;
				check_list[i][j] = false;
			}
		}

		if(from === undefined || to === undefined){
			console.log('error');
			return [];
		}

		queue.push( { x: from.x, y: from.y, cost: 0, dist: 0 } );
		console.log('start path search');

		while( queue.size() > 0){
			cell = queue.pop();
			close_list[cell.y][cell.x] = cell;
			check_list[cell.y][cell.x] = true;

			if(cell.x == to.x && cell.y == to.y){
				px = cell.x;
				py = cell.y;

				while(cell.x != from.x || cell.y != from.y){
					route.unshift({ x: cell.x * View.gridSize, y: cell.y * View.gridSize });
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
					queue.push(elem);
					check_list[neighbor.y][neighbor.x] = true;
				}
			}
		}

		return route;
	},

	getNeighbor: function( x, y ){
		var neighbor_list = [],
				nx, ny, i;

		for( i = 0; i < 4; i++){
			ny = y + this.dy[i];
			nx = x + this.dx[i];
			
			if( View.isInside( ny, nx )){
				neighbor_list.push( Simulator.field[ny][nx] );
			}
		}

		return neighbor_list;
	},
}
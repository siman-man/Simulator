var Search = {
	point: undefined,
	search_list: [],
	dx: [ 1, 0,-1, 0, 1, 1,-1,-1],
  dy: [ 0, 1, 0,-1,-1, 1, 1,-1],
  check_list: [],
  close_list: [],
  check_count: 0,

  init: function(){
  	var y, x;
  	for( y = 0; y <= View.height+1; y++ ){
  		this.check_list[y] = [];
  		this.close_list[y] = [];
  		for( x = 0; x <= View.width+1; x++ ){
  			this.check_list[y][x] = 0;
  		}
  	}
  },

	find: function(from, to){
		var route = [],
				queue = new PriorityQueue(),
    		sx = to.x * View.gridSize,
    		sy = to.y * View.gridSize,
    		i, j,
    		cell, neighbor_list, neighbor,
    		h, s, c, elem;

    this.check_count++;
		
		if(from === undefined || to === undefined){
			console.log('error');
			return [];
		}

		queue.push( { x: from.x, y: from.y, cost: 0, dist: 0 } );
		console.log('start path search');

		while( queue.size() > 0){
			cell = queue.pop();
			this.close_list[cell.y][cell.x] = cell;
			this.check_list[cell.y][cell.x] = this.check_count;

			if(cell.x == to.x && cell.y == to.y){
				while(cell.x != from.x || cell.y != from.y){
					route.unshift({ x: cell.x * View.gridSize, y: cell.y * View.gridSize });
					cell = this.close_list[cell.parent.y][cell.parent.x];
				}
				break;
			}

			neighbor_list = this.getNeighbor(cell.x, cell.y);

			for( i in neighbor_list ){
				neighbor = neighbor_list[i];

				if( this.check_list[neighbor.y][neighbor.x] !== this.check_count ){
					h = Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y);
					c = cell.cost + neighbor.cost;
					s = c+h;
					elem = { x: neighbor.x, y: neighbor.y, cost: c, dist: s, parent: { x: cell.x, y: cell.y } };
					queue.push(elem);
					this.check_list[neighbor.y][neighbor.x] = this.check_count;
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
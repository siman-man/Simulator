var Search = {
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
    		i, j, ny, nx,
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

			for( i = 0; i < 4; ++i ){
				ny = cell.y + this.dy[i];
				nx = cell.x + this.dx[i];

				if( View.isInside( ny, nx ) && this.check_list[ny][nx] !== this.check_count ){
					h = Math.abs(nx - to.x) + Math.abs(ny - to.y);
					c = cell.cost + Simulator.field[ny][nx].cost;
					s = c+h;
					elem = { x: nx, y: ny, cost: c, dist: s, parent: { x: cell.x, y: cell.y } };
					queue.push(elem);
					this.check_list[ny][nx] = this.check_count;
				}
			}
		}

		return route;
	}
}
var Propagation = {
	limit: 4,
  dx: [ 1, 0,-1, 0, 1, 1,-1,-1],
  dy: [ 0, 1, 0,-1,-1, 1, 1,-1],

	calc: function(x, y){
		var board = [],
        ypos, xpos,
        field = Simulator.field,
        contact_list = [],
        queue = new PriorityQueue(),
        node, y, x, i;

		for( ypos = 0; ypos < View.height; ypos++ ){
      board[ypos] = [];
      for( xpos = 0; xpos < View.width; xpos++ ){
        board[ypos][xpos] = { check: false, cost: 99999 };
      }
    }

    board[y][x] = { check: true, cost: 0 };
    queue.push( { x: x, y: y, cost: 0 } )
    View.propagation[y][x].flag = true;

    while( queue.size() > 0 ){
      node = queue.pop();

      if( board[node.y][node.x].cost >= this.limit ) continue;

      for(i = 0; i < 8; i++){
        y = node.y + this.dy[i];
        x = node.x + this.dx[i];
        if( View.isInside( y, x ) && node.cost + field[y][x].pf < board[y][x].cost ){
          board[y][x].cost = node.cost + field[y][x].pf;
          
          if( Simulator.field[y][x].type == 'server' ){
            contact_list.push( Simulator.field[y][x] );
          }else if( Simulator.user_map[y][x].type == 'user' ){
            contact_list.push( Simulator.user_map[y][x] );
          }

          if( board[y][x].cost <= this.limit ){
            View.propagation[y][x].flag = true;
            queue.push( { x: x, y: y, cost: board[y][x].cost } )
          }
        } 
      }
    }

    return contact_list;
	},

	clear: function(id){
    var x, y;

		for( y = 0; y < this.canvas_height; y++ ){
      for( x = 0; x < this.canvas_width; x++ ){
        if(Simulator.connection_list[y][x][id] !== undefined){
        	delete Simulator.connection_list[y][x][id];
        }
      }
		}
	},
}
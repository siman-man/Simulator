
var Propagation = {
	limit: 4,
  dx: [ 1, 0,-1, 0, 1, 1,-1,-1],
  dy: [ 0, 1, 0,-1,-1, 1, 1,-1],

	calc: function(x, y){
		var board = [],
        ypos, xpos,
        connect_list = {},
        queue = new PriorityQueue(),
        node, y, x, i, eid, key,
        cost;

		for( ypos = 0; ypos < View.height; ypos++ ){
      board[ypos] = [];
      for( xpos = 0; xpos < View.width; xpos++ ){
        board[ypos][xpos] = { check: false, cost: 999999 };
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

        if( View.isInside( y, x ) ){
          cost = node.cost + Simulator.field[y][x].pf;
          if( cost < board[y][x].cost ){
            board[y][x].cost = cost;
          
            key = Simulator.key_map[y][x];
            if( Object.keys(Simulator.node_map[key]).length !== 0 ){
              for( eid in Simulator.node_map[key] ){
                connect_list[eid] = true;
              }
            }
            if( board[y][x].cost <= this.limit ){
              View.propagation[y][x].flag = true;
              queue.push( { x: x, y: y, cost: board[y][x].cost } )
            }
          } 
        }
      }
    }
    return connect_list;
	}
}
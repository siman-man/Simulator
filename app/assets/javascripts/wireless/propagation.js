var Propagation = {
	limit: 4,
  dx: [ 1, 0,-1, 0, 1, 1,-1,-1],
  dy: [ 0, 1, 0,-1,-1, 1, 1,-1],
  board: [],
  before_check_point: { x: -1, y: -1 },

  init: function(){
    var ypos, xpos;
    this.before_check_point = { x: -1, y: -1 };
    for( ypos = 0; ypos < View.height; ypos++ ){
      this.board[ypos] = [];
      for( xpos = 0; xpos < View.width; xpos++ ){
        this.board[ypos][xpos] = { check: false, cost: 999999 };
      }
    }
  },

  clearBoard: function( y, x ){
    var ny, nx, i;
    this.board[y][x] = { check: false, cost: 999999 };
    for( i = 0; i < 4; i++){
      ny = y + this.dy[i];
      nx = x + this.dx[i];
      if( View.isInside( ny, nx ) && this.board[ny][nx].check ){
        this.clearBoard( ny, nx );
      }
    }
  },

	calc: function( x, y ){
		var ny, nx,
        connect_list = {},
        queue = new PriorityQueue(),
        node, i, eid, key,
        cost;

    if( this.before_check_point.x !== -1 ){
      this.clearBoard( this.before_check_point.y, this.before_check_point.x );
    }

    this.board[y][x] = { check: true, cost: 0 };
    queue.push( { x: x, y: y, cost: 0 } )
    View.propagation[y][x].flag = true;

    while( queue.size() > 0 ){
      node = queue.pop();

      if( this.board[node.y][node.x].cost >= this.limit ) continue;
      this.board[node.y][node.x].check = true;

      for(i = 0; i < 8; ++i){
        ny = node.y + this.dy[i];
        nx = node.x + this.dx[i];

        if( View.isInside( ny, nx ) ){
          cost = node.cost + Simulator.field[ny][nx].pf;
          if( cost < this.board[ny][nx].cost && cost <= this.limit ){
            this.board[ny][nx].cost = cost;
          
            key = Simulator.key_map[ny][nx];
            if( Object.keys(Simulator.node_map[key]).length !== 0 ){
              for( eid in Simulator.node_map[key] ){
                connect_list[eid] = true;
              }
            }
            if( this.board[ny][nx].cost <= this.limit ){
              View.propagation[ny][nx].flag = true;
              queue.push( { x: nx, y: ny, cost: this.board[ny][nx].cost } )
            }
          } 
        }
      }
    }
    this.before_check_point = { x: x, y: y };
    return connect_list;
	}
}
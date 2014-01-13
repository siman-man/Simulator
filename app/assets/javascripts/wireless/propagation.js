
var Propagation = {
	limit: 4,
  dx: [ 1, 0,-1, 0, 1, 1,-1,-1],
  dy: [ 0, 1, 0,-1,-1, 1, 1,-1],
  board: [],

  init: function(){
    var ypos, xpos;
    for( ypos = 0; ypos < View.height; ypos++ ){
      this.board[ypos] = [];
      for( xpos = 0; xpos < View.width; xpos++ ){
        this.board[ypos][xpos] = { check: false, cost: 999999 };
      }
    }
  },

	calc: function(x, y){
		var ypos, xpos,
        connect_list = {},
        queue = new PriorityQueue(),
        node, y, x, i, eid, key,
        cost;

		for( ypos = 0; ypos < View.height; ypos++ ){
      for( xpos = 0; xpos < View.width; xpos++ ){
        if( this.board[ypos][xpos].check ){
          this.board[ypos][xpos] = { check: false, cost: 999999 };
        }
      } 
    }

    this.board[y][x] = { check: true, cost: 0 };
    queue.push( { x: x, y: y, cost: 0 } )
    View.propagation[y][x].flag = true;

    while( queue.size() > 0 ){
      node = queue.pop();

      if( this.board[node.y][node.x].cost >= this.limit ) continue;
      this.board[node.y][node.x].check = true;

      for(i = 0; i < 8; i++){
        y = node.y + this.dy[i];
        x = node.x + this.dx[i];

        if( View.isInside( y, x ) ){
          cost = node.cost + Simulator.field[y][x].pf;
          if( cost < this.board[y][x].cost ){
            this.board[y][x].cost = cost;
          
            key = Simulator.key_map[y][x];
            if( Object.keys(Simulator.node_map[key]).length !== 0 ){
              for( eid in Simulator.node_map[key] ){
                connect_list[eid] = true;
              }
            }
            if( this.board[y][x].cost <= this.limit ){
              View.propagation[y][x].flag = true;
              queue.push( { x: x, y: y, cost: this.board[y][x].cost } )
            }
          } 
        }
      }
    }
    return connect_list;
	}
}
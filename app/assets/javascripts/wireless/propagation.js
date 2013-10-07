var Propagation = {
	limit: 3,
  dx: [ 1, 0,-1, 0, 1, 1,-1,-1],
  dy: [ 0, 1, 0,-1,-1, 1, 1,-1],

	calc: function(x, y){
		var board = [],
		    check_list = [],
        ypos, xpos,
        field = Simulator.field,
        animation = [],
        node;

		for( ypos = 0; ypos < View.height; ypos++ ){
      board[ypos] = [];
      for( xpos = 0; xpos < View.width; xpos++ ){
        board[ypos][xpos] = { check: false, cost: 9999 };
      }
    }

    board[y][x] = { check: true, cost: 0 };
    check_list.push({ x: x, y: y, cost: 0 });

    while( check_list.length > 0 ){
    	node = check_list.shift();
    	animation.push({ x: node.x, y: node.y});

      for(var i = 0; i < 4; i++){
        var y = node.y + this.dy[i];
        var x = node.x + this.dx[i];
        if( View.isInside( y, x ) && node.cost + field[y][x].pf < board[y][x].cost ){
          board[y][x].cost = node.cost + field[y][x].pf;
          if( board[y][x].cost <= this.limit ){
            check_list.push({ x: x, y: y, cost: board[y][x].cost })
          }
        } 
      }

    	check_list.sort(function(a, b){
    		return (a.cost > b.cost)? 1 : -1; 
    	});
    }

    animation.shift();

    return animation;
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
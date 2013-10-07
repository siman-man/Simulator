var Propagation = {
	limit: 6,
  dx: [-1,0,1,-1,1,-1,0,1,],
  dy: [-1,-1,-1,0,0,1,1,1],

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

    	if(node.x+1 < View.width && node.cost + field[node.y][node.x+1].pf < board[node.y][node.x+1].cost ){
    		board[node.y][node.x+1].cost = node.cost + field[node.y][node.x+1].pf;
    		if( board[node.y][node.x+1].cost <= this.limit ){
    			check_list.push({ x: node.x+1, y: node.y, cost: board[node.y][node.x+1].cost});
    		}
    	}

    	if(node.x-1 >= 0 && node.cost + field[node.y][node.x-1].pf < board[node.y][node.x-1].cost ){
    		board[node.y][node.x-1].cost = node.cost + field[node.y][node.x-1].pf;
    		if( board[node.y][node.x-1].cost <= this.limit ){
    			check_list.push({ x: node.x-1, y: node.y, cost: board[node.y][node.x-1].cost});
    		}
    	}

    	if(node.y+1 < View.height && node.cost + field[node.y+1][node.x].pf < board[node.y+1][node.x].cost ){
    		board[node.y+1][node.x].cost = node.cost + field[node.y+1][node.x].pf;
    		if( board[node.y+1][node.x].cost <= this.limit ){
    			check_list.push({ x: node.x, y: node.y+1, cost: board[node.y+1][node.x].cost});
    		}
    	}

    	if(node.y-1 >= 0 && node.cost + field[node.y-1][node.x].pf < board[node.y-1][node.x].cost ){
    		board[node.y-1][node.x].cost = node.cost + field[node.y-1][node.x].pf;
    		if( board[node.y-1][node.x].cost <= this.limit ){
    			check_list.push({ x: node.x, y: node.y-1, cost: board[node.y-1][node.x].cost});
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
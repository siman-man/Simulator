var Propagation = {
	limit: 1,

	calc: function(id, x, y){
		var board = [];
		var check_list = [];
		var width = Simulator.canvas_width/View.gridSpan|0 + 1;
		var height = Simulator.canvas_height/View.gridSpan|0 + 1;

		for(var ypos = 0; ypos < height; ypos++){
      board[ypos] = [];
      for(var xpos = 0; xpos < width; xpos++){
        board[ypos][xpos] = { check: false, cost: 9999 };
      }
    }

    board[y][x] = { check: true, cost: 0 };
    check_list.push({ x: x, y: y, cost: 0 });

    var route = Simulator.route;
    var animation = [];

    while(check_list.length > 0){
    	var node = check_list.shift();
    	animation.push({ x: node.x, y: node.y});

    	if(node.x+1 < width && node.cost + route[node.y][node.x+1].pf < board[node.y][node.x+1].cost ){
    		board[node.y][node.x+1].cost = node.cost + route[node.y][node.x+1].pf;
    		if( board[node.y][node.x+1].cost <= this.limit ){
    			check_list.push({ x: node.x+1, y: node.y, cost: board[node.y][node.x+1].cost});
    		}
    	}

    	if(node.x-1 >= 0 && node.cost + route[node.y][node.x-1].pf < board[node.y][node.x-1].cost ){
    		board[node.y][node.x-1].cost = node.cost + route[node.y][node.x-1].pf;
    		if( board[node.y][node.x-1].cost <= this.limit ){
    			check_list.push({ x: node.x-1, y: node.y, cost: board[node.y][node.x-1].cost});
    		}
    	}

    	if(node.y+1 < height && node.cost + route[node.y+1][node.x].pf < board[node.y+1][node.x].cost ){
    		board[node.y+1][node.x].cost = node.cost + route[node.y+1][node.x].pf;
    		if( board[node.y+1][node.x].cost <= this.limit ){
    			check_list.push({ x: node.x, y: node.y+1, cost: board[node.y+1][node.x].cost});
    		}
    	}

    	if(node.y-1 >= 0 && node.cost + route[node.y-1][node.x].pf < board[node.y-1][node.x].cost ){
    		board[node.y-1][node.x].cost = node.cost + route[node.y-1][node.x].pf;
    		if( board[node.y-1][node.x].cost <= this.limit ){
    			check_list.push({ x: node.x, y: node.y-1, cost: board[node.y-1][node.x].cost});
    		}
    	}

    	check_list.sort(function(a, b){
    		return (a.cost > b.cost)? 1 : -1; 
    	});
    }

    return animation;
	},

	clear: function(id){
		for(var y = 0; y < this.canvas_height; y++){
      for(var x = 0; x < this.canvas_width; x++){
        if(Simulator.connection_list[y][x][id] !== undefined){
        	delete Simulator.connection_list[y][x][id];
        }
      }
		}
	},
}
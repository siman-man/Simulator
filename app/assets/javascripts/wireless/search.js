var Search = {
	point: undefined,
	search_list: [],

	find: function(from, to){
		var close_list = [];
		var route = [];
		var check_list = [];

		var shape = new createjs.Shape();
    var sx = to.x * View.gridSpan;
    var sy = to.y * View.gridSpan;
    shape.graphics.beginFill('rgba(255,0,0,0.3)').drawRect(sx, sy, 30, 30);
    Simulator.map.addChild(shape);
    this.point = shape;
		
		for(var i = 0; i < View.height; i++){
			close_list[i] = [];
			check_list[i] = [];
			for(var j = 0; j < View.width; j++){
				close_list[i][j] = false;
				check_list[i][j] = false;
			}
		}

		if(from == undefined || to == undefined) return [];

		var open_list = [ { x: from.x, y: from.y, cost: 0, dist: 0 } ];
		
		console.log('start path search');

		while(open_list.length > 0){
			var cell = open_list.shift();
			close_list[cell.y][cell.x] = cell;
			check_list[cell.y][cell.x] = true;

			if(cell.x == to.x && cell.y == to.y){
				var direct = 0;
				var px = cell.x;
				var py = cell.y;

				while(cell.x != from.x || cell.y != from.y){
					route.unshift({ x: cell.x * View.gridSpan, y: cell.y * View.gridSpan });
					cell = close_list[cell.parent.y][cell.parent.x];
				}
				break;
			}

			var neighbor_list = this.getNeighbor(cell.x, cell.y);

			for(var i in neighbor_list){
				var neighbor = neighbor_list[i];

				if(!check_list[neighbor.y][neighbor.x]){
					var h = Math.abs(neighbor.x - to.x) + Math.abs(neighbor.y - to.y);
					var c = cell.cost + neighbor.cost;
					var s = c+h;
					var elem = { x: neighbor.x, y: neighbor.y, cost: c, dist: s, parent: { x: cell.x, y: cell.y } };
					open_list.push(elem);
					check_list[neighbor.y][neighbor.x] = true;
				}
			}
			
			open_list.sort(function(a, b){
				return (a.dist > b.dist)? 1 : -1;
			});
		}

		return route;
	},

	getNeighbor: function( x, y ){
		var neighbor_list = [];

		if(x+1 < View.width){
			neighbor_list.push(Simulator.field[y][x+1]);
		}

		if(x-1 >= 0){
			neighbor_list.push(Simulator.field[y][x-1]);
		}

		if(y+1 < View.height){
			neighbor_list.push(Simulator.field[y+1][x]);
		}

		if(y-1 >= 0){
			neighbor_list.push(Simulator.field[y-1][x]);
		}

		return neighbor_list;
	},
}
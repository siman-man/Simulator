var Config = {

	init: function(config){
		if( config !== undefined ){
			View.width = config.field_width || 30;
			View.height = config.field_height || 30;
			View.gridSize = config.grid_size || 30;
		}else{
			View.width = 30;
			View.height = 30;
			View.gridSize = 30;
		}
		gridSize = View.gridSize;

		$("#field_width").val(View.width);
		$("#field_height").val(View.height);
		$("#grid_size").val(View.gridSize);
	},

	field2obj_list: function(){
		var y, x, key,
			 	node_list,
			 	eid, data = [],
			 	type,
			 	node,
			 	coord,
			 	obj;

		for( y = 0; y < View.height; ++y ){
			for( x = 0; x < View.width; ++x ){
				obj = Simulator.field[y][x];
				type = obj.type;
				if( type !== 'normal' && !Node.isServer(type) && !Node.isUser(type) ){
					data.push({ type: type, y: y, x: x });
				}
			}
		}

		for( eid in Node.node_list ){
			node = Node.node_list[eid];
			coord = View.point2coord( node.x, node.y );
			data.push({ type: node.type, y: coord.y, x: coord.x, opt: Node.agent2opt(node)});
		}

		return data;
	},

	output: function(){
		var y, x, key,
			 	node_list,
			 	eid, data = [],
			 	type,
			 	node,
			 	coord,
			 	obj;


		data.push( this.create_data( "stage_data", { 
			field_width: View.width,
			field_height: View.height,
			grid_size: View.gridSize, 
		}));

		for( y = 0; y < View.height; ++y ){
			for( x = 0; x < View.width; ++x ){
				obj = Simulator.field[y][x];
				type = obj.type;
				if( type !== 'normal' && !Node.isServer(type) && !Node.isUser(type) ){
					console.log(Simulator.field[y][x]);
					data.push( this.create_data( type, { y: y, x: x }))
				}
			}
		}

		for( eid in Node.node_list ){
			node = Node.node_list[eid];
			coord = View.point2coord( node.x, node.y );
			console.log(Node.node_list[eid].type);
			data.push( this.create_data( node.type, { 
				y: coord.y, 
				x: coord.x, 
				eid: node.eid, 
				name: node.name,
				speed: node.speed,
				move_model: node.move_model_type,
				life_time: node.life_time || -1,
				apper_time: node.apper_time || 0,
				path: this.path2string(node.path),
			}))
		}

		console.log( data );
		return data;
	},

	send: function( data ){
		$.ajax({
			type: "post",
  		url: "/simulates",
 			data: {
    		time: { tree: 'hello' },
    		edit_mode: Simulator.edit_mode,
    		field_data: data
  		},
  	});
	},

	path2string: function( path ){
		var array = [],
				i, elem;

		for( i in path ){
			elem = path[i];
			array.push(elem.y);
			array.push(elem.x);
			array.push(elem.wait);
		}

		return JSON.stringify(array).replace(/,/g, "*");  
	},

	create_data: function( type, opt ){
		var data = [],
				key;
		data.push("type:" + type);

		for( key in opt ){
			data.push( key + ":" + opt[key] );
		}

		return data.join(" ");
	},

	directObjectColor: function(type){
		switch(type){
			case 'user':
			  return 'rgba(0,0,0,1.0)';
				break;
			case 'start':
				return 'rgba(218,0,10,1.0)';
				break;
			case 'end':
				return 'rgba(10,0,218,1.0)';
				break;
			case 'server':
				return 'rgba(255,0,0,1.0)';
				break;
			case 'car':
				return 'rgba(0,59,255,1.0)';
				break;
			case 'wall':
				return 'rgba(92,92,92,1.0)';
				break;
			case 'lake':
				return 'rgba(128,255,212,0.98)';
				break;
			case 'road':
				return 'rgba(211,211,211,1.0)';
				break;
		}
	},
}
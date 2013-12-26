var Config = {
	output: function(){
		var y, x, key,
			 	node_list,
			 	eid, data = [],
			 	ob_type,
			 	node,
			 	coord,
			 	obj;

		for( y = 0; y < View.height; y++ ){
			for( x = 0; x < View.width; x++ ){
				obj = Simulator.field[y][x];
				ob_type = obj.type;
				if( ob_type !== 'normal' && ob_type !== 'start' && ob_type !== 'end' && ob_type !== 'server'){
					console.log(Simulator.field[y][x]);
					data.push( this.create_data( ob_type, { y: y, x: x }))
				}
			}
		}

		for( eid in Node.node_list ){
			node = Node.node_list[eid];
			coord = View.point2coord( node.x, node.y );
			console.log(Node.node_list[eid].ob_type);
			data.push( this.create_data( node.ob_type, { 
				y: coord.y, 
				x: coord.x, 
				eid: node.eid, 
				name: node.name,
				move_model: node.move_model,
				path: this.path2string(node.path),
			}))
		}

		data.push( this.create_data( "stage_data", { node_num: Object.keys(Node.node_list).length }));

		console.log( data );
		return data;
		//Config.send( data );
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
	}
}
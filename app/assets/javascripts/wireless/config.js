var Config = {
	output: function(){
		var y, x, key,
			 	node_list,
			 	eid, data = [],
			 	ob_type,
			 	node,
			 	coord;

		for( y = 0; y < View.height; y++ ){
			for( x = 0; x < View.width; x++ ){
				ob_type = Simulator.field[y][x].type;
				if( ob_type !== 'normal'){
					console.log(Simulator.field[y][x]);
					data.push( this.create_data( ob_type, { y: y, x: x }))
				}
			}
		}

		for( eid in Node.node_list ){
			node = Node.node_list[eid];
			coord = View.point2coord( node.x, node.y );
			console.log(Node.node_list[eid].ob_type);
			if( Node.node_list[eid].ob_type === 'user' || Node.node_list[eid].ob_type === 'car'){
				data.push( this.create_data( node.ob_type, { y: coord.y, x: coord.x }))
			}
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
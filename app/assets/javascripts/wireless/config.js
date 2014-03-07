/**
 *		シミュレーションの情報を定義する
 *		@class Config
 **/

var Config = {
	/**
	 *		シミュレーションの設定を行う
	 *		@method init
	 *		@param config {Object} 設定情報
	 *		@return 無し
	 **/
	init: function(config){
		console.log("config init =>");
		if( config !== undefined ){
			View.width = config.field_width || 30;
			View.height = config.field_height || 30;
			View.gridSize = config.grid_size || 30;
			Propagation.transmit_range = config.transmit_range || 4;
			Simulator.time_limit = config.time_limit || -1;
			$("#time_limit").val(Simulator.time_limit);
			if( config.routing_protocol !== undefined ){
				$("#protocol").val(Panel.protocol2value(config.routing_protocol));
			}
		}else{
			View.width = 30;
			View.height = 30;
			View.gridSize = 30;
			Propagation.transmit_range = 5;
		}
		gridSize = View.gridSize;

		$("#field_width").val(View.width);
		$("#field_height").val(View.height);
		$("#grid_size").val(View.gridSize);
		$("#transmit_range").val(Propagation.transmit_range);
	},

	/**
	 *		フィールド情報のオブジェクト化を行う
	 *		@method field2obj_list
	 *		@return data {Object} フィルード情報
	 **/
	field2obj_list: function(){
		var y, 
				x, 
				key,
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

		if( Simulator.protocol_type === undefined ){
			Simulator.direct_protocol_type(+$("#protocol").val());
		}

		data.push( this.create_data( "stage_data", { 
			field_width: View.width,
			field_height: View.height,
			grid_size: View.gridSize,
			transmit_range: Propagation.transmit_range,
			routing_protocol: Simulator.protocol_type,
			time_limit: Simulator.time_limit,
		}));

		for( y = 0; y < View.height; ++y ){
			for( x = 0; x < View.width; ++x ){
				obj = Simulator.field[y][x];
				type = obj.type;
				if( type !== 'normal' && !Node.isServer(type) && !Node.isUser(type) ){
					console.log(Simulator.field[y][x]);
					data.push( this.create_data( type, { y: y, x: x }))
				}
				var eid_list = Simulator.keep_out[y][x];
				for( var id in eid_list ){
					if( Simulator.keep_out[y][x][id] ){
						data.push( this.create_data( "ko", {
							x: x,
							y: y,
							eid: id
						}));
					}
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

	/**
	 *		経路情報を文字列へと変換を行う
	 *		@method path2string
	 *		@param path {Array} 経路情報
	 *		@return res {String} 経路情報を文字列に変換したもの
	 **/
	path2string: function( path ){
		var array = [],
				i, 
				elem,
				res;

		for( i in path ){
			elem = path[i];
			array.push(elem.y);
			array.push(elem.x);
			array.push(elem.wait);
		}

		res = JSON.stringify(array).replace(/,/g, "*"); 
		return res;  
	},

	/**
	 *		フィールド情報を文字列に変換
	 *		@method create_data
	 *		@param type {String} 情報のタイプ
	 *		@param opt {Object} 情報の内容
	 **/
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
			case 'start':
				return 'rgba(218,0,10,1.0)';
			case 'end':
				return 'rgba(10,0,218,1.0)';
			case 'server':
				return 'rgba(255,0,0,1.0)';
			case 'car':
				return 'rgba(0,59,255,1.0)';
			case 'wall':
				return 'rgba(92,92,92,1.0)';
			case 'tree':
				return 'rgba(0,88,0,1.0)';
			case 'lake':
				return 'rgba(128,255,212,0.98)';
			case 'road':
				return 'rgba(211,211,211,1.0)';
		}
	},
}
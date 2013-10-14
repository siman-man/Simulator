var Epidemic = function(){
	
};

Epidemic.prototype = {
	update: function(node){
		var dest_eid, 
				message_diff,
				message_id;

		for( dest_eid in node.contact_list ){
			if( node.contact_list[dest_eid].current === 'establish' ){
				message_diff = this.diff( node, Node.node_list[dest_eid] );

				for( message_id in message_diff ){
					node.buffer.push(Message.create( message_id, node.eid, dest_eid ))
				}
			}
		}
	},

	transmit: function(node){
		var dest,
				dest_eid,
				message;

		if( node.buffer.length > 0 ){
			message = node.buffer[0];
			dest_eid = node.buffer[0].dest;
			dest = Node.node_list[dest_eid];
			
			if( node.last_connect_time[dest_eid] != Simulator.time || dest.strage[message.id] !== undefined ){
				node.buffer.shift();
			}else{
				node.buffer[0].size--;
				if( node.buffer[0].size == 0 ){
					dest.strage[message.data.id] = message.data;
					node.buffer.shift();
				}
			}
		}
	},

	diff: function( from, dest ){
		var strageA = from.strage,
				strageB = dest.strage,
				message_id,
				diff= [];

		for( message_id in from.strage ){
			if( dest.strage[message_id] === undefined ){
				diff.push(message_id);
			}
		}

		return diff;
	}
}
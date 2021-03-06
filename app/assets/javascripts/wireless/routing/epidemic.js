var Epidemic = function(node){
	this.node = node;
};

Epidemic.prototype = {
	update: function(){
		this.buffer_update();
		this.transmit();
	},

	connect: function( dest ){
		var message_diff = [],
				message_id,
				i;

		message_diff = this.node.routing_protocol.diff( dest );	

		for( i in message_diff ){
			message_id = message_diff[i];
			this.node.buffer.push(Message.create( message_id, this.node, dest ))
		}
	},

	buffer_update: function(){
		var buffer = this.node.buffer;
		while( buffer[0] !== undefined && this.message_check(buffer[0]) ){
			buffer.shift();
		}
	},

	transmit: function(){
		var dest,
				dest_eid,
				message;

		if( this.node.buffer.length > 0 ){
			message = this.node.buffer[0];
			dest_eid = message.dest_eid;
			dest = Node.node_list[dest_eid];
			
			message.size--;
			if( message.size === 0 ){
				dest.strage[message.id] = message;
				dest.label.text = Object.keys(dest.strage).length;
				this.node.buffer.shift();
				Log.send(Log.transmit_message( this.node, dest, message ));
				Log.send(Log.receive_message( this.node, dest, message ));
			}
		}
	},

	message_check: function( message ){
		if( this.node.contact_list[message.dest_eid].current === 'close' ) return true;
		if( Node.node_list[message.dest_eid].strage[message.id] !== undefined ) return true;
		return false;
	},

	diff: function( dest ){
		var strageA = this.node.strage,
				strageB = dest.strage,
				message_id,
				diff= [];

		for( message_id in strageA ){
			if( strageB[message_id] === undefined ){
				diff.push(message_id);
			}
		}

		return diff;
	}
};
var NHopForwarding = function(node, limit){
	limit = limit || 2;
	this.node = node;
	this.limit = limit-1;
};

NHopForwarding.prototype = {
	update: function(){
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

	transmit: function(){
		var dest,
				dest_eid,
				message;

		if( this.node.buffer.length > 0 ){
			message = this.node.buffer[0];
			dest_eid = message.dest_eid;
			dest = Node.node_list[dest_eid];
			
			if( this.check( dest, message ) ){
				this.node.buffer.shift();
			}else{
				--message.size;
				if( message.size === 0 ){
					dest.strage[message.id] = message;
					dest.label.text = Object.keys(dest.strage).length;
					this.node.buffer.shift();
					Log.send({ 
						time: Simulator.time, 
						type: 'normal', 
						operation: 'transmit',
						from: this.node.eid, 
						dest: dest.eid 
					});
				}
			}
		}
	},

	check: function( dest, message ){

		if( this.node.contact_list[dest.eid].current === 'close' ) return true;
		if( dest.strage[message.id] !== undefined ) return true;

		return false;
	},

	diff: function( dest ){
		var strageA = this.node.strage,
				strageB = dest.strage,
				message_id,
				diff= [];

		for( message_id in strageA ){
			if( strageB[message_id] === undefined && ( dest.eid === 1 || strageA[message_id].hop < this.limit) ){
				diff.push(message_id);
			}
		}

		return diff;
	}
};
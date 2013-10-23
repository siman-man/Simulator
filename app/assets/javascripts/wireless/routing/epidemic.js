var Epidemic = function(node){
	this.node = node;
};

Epidemic.prototype = {
	update: function(){
		this.transmit();
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
				message.size--;
				if( message.size === 0 ){
					dest.strage[message.id] = message.data;
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
};
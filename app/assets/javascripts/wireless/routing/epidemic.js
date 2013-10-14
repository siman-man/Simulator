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
			
			if( this.node.contact_list[dest_eid].current === 'close' || dest.strage[message.id] !== undefined ){
				this.node.buffer.shift();
			}else{
				this.node.buffer[0].size--;
				if( this.node.buffer[0].size == 0 ){
					dest.strage[message.id] = message.data;
					this.node.buffer.shift();
				}
			}
		}
	}
}
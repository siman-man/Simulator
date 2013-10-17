var Message = {
	message_size: 5,
	message_num: 10,

	init: function(node){
		for(var i = 0; i < this.message_num; i++){
			node.strage[i] = { size: this.message_size };
		}
	},

	create: function( id, from_eid, dest_eid ){
		return { id: id, from_eid: from_eid, dest_eid: dest_eid, data: 'hello', size: Message.message_size }
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
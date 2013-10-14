var Message = {
	message_size: 5,
	message_num: 10,

	init: function(node){
		for(var i = 0; i < this.message_num; i++){
			node.strage[i] = { size: this.message_size };
		}
	},

	create: function( id, from_eid, dest_eid ){
		return { id: id, from_eid: from_eid, dest_eid: dest_eid, size: this.message_size }
	}
};
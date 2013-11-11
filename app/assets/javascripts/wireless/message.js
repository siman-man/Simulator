var Message = {
	message_size: 5,
	message_num: 1,

	init: function(node){
		for(var i = 0; i < this.message_num; i++){
			node.strage[i] = { size: this.message_size, ftoken: 4 };
		}
	},

	create: function( id, from, dest ){
		switch(Simulator.protocol_type){
			case 'epidemic':
				return { id: id, from_eid: from.eid, dest_eid: dest.eid, data: 'hello', size: Message.message_size }
				break;
			case 'spray_and_wait':
				return { id: id, from_eid: from.eid, dest_eid: dest.eid, data: 'hello', size: Message.message_size,
								ftoken: from.strage[id].ftoken / 2 }
				break;
			default:
				return { id: id, from_eid: from.eid, dest_eid: dest.eid, data: 'hello', size: Message.message_size }
				break;
		};
	}
};
var Message = {
	message_size: 1,
	message_num: 1,

	init: function(){
		for(var i = 0; i < this.message_num; i++){
			Node.node_list[0].strage[i] = { size: this.message_size, ftoken: 4 };
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
			case 'pro_phet':
				return { id: id, from_eid: from.eid, dest_eid: dest.eid, data: 'hello', size: Message.message_size }
				break;
			default:
				return { id: id, from_eid: from.eid, dest_eid: dest.eid, data: 'hello', size: Message.message_size }
				break;
		};
	}
};
var Message = {
	message_size: 5,
	message_num: 1,

	init: function(){
		for(var i = 0; i < this.message_num; i++){
			Node.node_list[0].strage[i] = { size: this.message_size, ftoken: 4, hop: 0 };
		}
	},

	create: function( id, from, dest ){
		var message = { id: id, from_eid: from.eid, dest_eid: dest.eid, data: 'hello', size: Message.message_size,
								hop: from.strage[id].hop + 1 }
		
		if( from === 0 ){
			message.created_at = Simulator.time;
		}else{
			message.created_at = from.strage[id].created_at;
		}

		switch(Simulator.protocol_type){
			case 'epidemic':
				return message;
				break;
			case 'spray_and_wait':
				message.ftoken = from.strage[id].ftoken / 2 | 0;
				return message;
				break;
			case 'pro_phet':
				return message;
				break;
			case 'n_hop_forwarding':
				return message;
				break;
			default:
				return message;
				break;
		};
	}
};
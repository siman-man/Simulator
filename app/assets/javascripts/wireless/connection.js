var Connection = {
	init: function(node){
		return new StateMachine.create({
			initial: 'close',
			events: [
				{ name: 'connect', from: 'close', to: 'establish' },
				{ name: 'shutdown', from: 'establish', to: 'close' }
			],

			callbacks: {
				onconnect: function(event, from, to, from, dest) {
					console.log(from.eid +' connect => ' + dest.eid );

					var message_diff,
							message_id;

					message_diff = Message.diff( from, Node.node_list[dest.eid] );	

					for( message_id in message_diff ){
						from.buffer.push(Message.create( message_id, from.eid, dest.eid ))
					}
					console.log(from.buffer);
				},

				onshutdown: function(event, from, to, from, dest){
					console.log(from.eid +' close => ' + dest.eid ); 
				}
			}
		});
	},
}
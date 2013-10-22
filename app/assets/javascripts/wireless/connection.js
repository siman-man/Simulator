var Connection = {
	init: function(node){
		return new StateMachine.create({
			initial: 'close',
			events: [
				{ name: 'connect', from: 'close', to: 'establish' },
				{ name: 'shutdown', from: 'establish', to: 'close' }
			],

			callbacks: {
				onconnect: function(event, from_state, to_state, from, dest) {
					console.log(from.eid +' connect => ' + dest.eid );
					Log.send({ 
						time: Simulator.time, 
						type: 'normal', 
						operation: 'establish',
						from: from.eid, 
						dest: dest.eid 
					});

					var message_diff = [],
							message_id,
							i;

					message_diff = from.routing_protocol.diff( from, dest );	

					for( i in message_diff ){
						message_id = message_diff[i];
						from.buffer.push(Message.create( message_id, from.eid, dest.eid ))
					}
				},

				onshutdown: function(event, from_state, to_state, from, dest){
					console.log(from.eid +' close => ' + dest.eid ); 
					Log.send({ 
						time: Simulator.time, 
						type: 'normal', 
						operation: 'close',
						from: from.eid, 
						dest: dest.eid 
					});
				}
			}
		});
	},
}
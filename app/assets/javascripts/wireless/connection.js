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
					//console.log(from.eid +' connect => ' + dest.eid );
					Log.send({ 
						time: Simulator.time, 
						type: 'normal', 
						operation: 'establish',
						from: from.eid, 
						dest: dest.eid 
					});

					from.routing_protocol.connect( dest );
				},

				onshutdown: function(event, from_state, to_state, from, dest){
					//console.log(from.eid +' close => ' + dest.eid ); 
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
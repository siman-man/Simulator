var ServerStatus = { 
	init: function(user){
		return new StateMachine.create({
			initial: 'active',
			events: [
				{ name: 'shutdown',  from: ['active', 'sleep'],  to: 'down' },
				{ name: 'suspend', from: 'active', to: 'sleep'    },
				{ name: 'power',  from: 'down',    to: 'active' },
				{ name: 'restart', from: 'sleep', to: 'active' }
			],

			callbacks: {
				onsleep: function(event, from, to, server) { 
					$("div#articles").append('<p>hello ' + server.id + '</p>');
				}
			},
		});
	},
}
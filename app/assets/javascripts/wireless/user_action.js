var UserAction = { 
	init: function(user){
		return new StateMachine.create({
			initial: 'move',
			events: [
				{ name: 'rest',  from: 'move',  to: 'stop' },
				{ name: 'walk', from: 'stop', to: 'move'    },
				{ name: 'disappear',  from: ['move', 'rest'],    to: 'delete' },
			],

			callbacks: {
				onstop: function(event, from, to, user) { 
					$("div#articles").append('<p>hello ' + user.id + '</p>');
				}
			},
		});
	},
}
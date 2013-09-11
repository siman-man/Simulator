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
					console.log('user stop =>'); 
					var connected_list = User.findConnectedServer(user);

					if(connected_list.length != 0){
						var article = Article.createArticle(user);
						Packet.send(user, Simulator.server_list[connected_list[0].id], article);
					}
				}
			},
		});
	},

	worker: function(user){
		return new StateMachine.create({
			initial: 'home',
			events: [
				{ name: 'go_office',  from: 'home',  to: 'commute' },
				{ name: 'working', from: 'commute', to: 'work'    },
				{ name: 'go_home',  from: 'work',    to: 'homecoming' },
				{ name: 'rest', from: 'homecoming', to: 'home' },
			],

			callbacks: {
				oncommute: function(event, from, to, user) {
					console.log('user go office =>'); 
				},

				onwork: function(event, from, to, user){
					console.log('user working =>');
				},

				ongo_home: function(event, from, to, user){
					console.log('user go home =>');
				}
			},
		});
	},
}
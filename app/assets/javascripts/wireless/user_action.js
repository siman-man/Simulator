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
				{ name: 'go_office',  from: 'home',  to: 'go_office' },
				{ name: 'working', from: 'go_office', to: 'work'    },
				{ name: 'go_home',  from: 'work',    to: 'go_home' },
				{ name: 'rest', from: 'go_home', to: 'home' },
			],

			callbacks: {
				ongo_office: function(event, from, to, user) {
					console.log('user go office =>'); 
				},

				ongo_home: function(event, from, to, user){
					console.log('user go home =>');
				}
			},
		});
	},
}
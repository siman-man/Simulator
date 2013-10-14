var FSM = {
	simulator: function(user){
		return new StateMachine.create({
			initial: 'init',
			events: [
				{ name: 'start',  from: 'init',  to: 'run' },
				{ name: 'pause', from: 'run', to: 'stop'    },
				{ name: 'restart',  from: 'stop',    to: 'run' },
				{ name: 'reset', from: ['stop', 'run'], to: 'init' },
			],

			callbacks: {
				onstart: function(event, from, to, user) {
					Node.init();
					console.log('start simulation =>'); 
				},

				onpause: function(event, from, to, user){
					console.log('pause simulation =>');
				},

				onrestart: function(event, from, to, user){
					console.log('restart simulation =>');
				},

				onreset: function(event, from, to){
					console.log('reset simulation =>');
				},
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

	normal: function(user){
		return new StateMachine.create({
			initial: 'stand',
			events: [
				{ name: 'walking',  from: 'stand',  to: 'walk' },
				{ name: 'stop', from: 'walk', to: 'stand' },
			],

			callbacks: {
				onwalk: function(event, from, to, user) {
					console.log('user working =>'); 
				},

				onstand: function(event, from, to, user){
					console.log('user stand =>');
				}
			},
		});
	},
}
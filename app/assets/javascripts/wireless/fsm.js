var FSM = {
	simulator: function(user){
		return new StateMachine.create({
			initial: 'init',
			events: [
				{ name: 'create_route', from: 'init', to: 'create_path' },
				{ name: 'path_end', from: 'create_path', to: 'init' },
				{ name: 'start',  from: 'init',  to: 'run' },
				{ name: 'pause', from: 'run', to: 'stop'    },
				{ name: 'restart',  from: 'stop',    to: 'run' },
				{ name: 'finish', from: 'run', to: 'end' },
				{ name: 'reset', from: ['stop', 'run'], to: 'init' },
			],

			callbacks: {
				onstart: function(event, from, to, user) {
					Simulator.start_time = new Date();
					Simulator.start_time = Simulator.start_time.getTime();
					Simulator.direct_protocol_type(parseInt($("#protocol").val()));
					Simulator.seed = $("#seed").val();
					Message.message_num = parseInt($("#message_num").val());
					Message.init();
					Node.init();
					Log.send({ 
						time: 0, 
						type: 'init',
						operation: "start",
						msg: 'start'
					});
					Node.node_set_routing_protocol();
					console.log('start simulation =>');
					console.log('seed value => ' + Simulator.seed); 
				},

				onpause: function(event, from, to, user){
					console.log('pause simulation =>');
				},

				onrestart: function(event, from, to, user){
					console.log('restart simulation =>');
				},

				onfinish: function(event, from, to){
					console.log('finish simulation =>');
					if( !Simulator.replay ){
						Log.finish({ 
							time: Simulator.time, 
							type: 'finish', 
							operation: "finish",
							config: { 
								seed: Simulator.seed, 
								stage_type: Simulator.stage_type,
								finish_time: Simulator.time, 
								message_num: Message.message_num,
								total_send_message_num: Simulator.total_send_message_num,
								protocol: Simulator.protocol_type,
								node_num: Object.keys(Node.node_list).length  
							},
							msg: 'end'
						});
					}else{
						window.location = '/history';
					}
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
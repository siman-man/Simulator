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
					Simulator.user_id = Date.now();
					Simulator.start_time = new Date();
					Simulator.start_time = Simulator.start_time.getTime();
					Simulator.direct_protocol_type(parseInt($("#protocol").val()));
					Simulator.seed = $("#seed").val();
					Message.message_num = parseInt($("#message_num").val());
					Message.init();
					Node.init();
					Log.init({ 
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

	randomWayPoint: function(){
		return new StateMachine.create({
			initial: 'wait',
			events: [
				{ name: 'move', from: 'wait', to: 'walk' },
				{ name: 'stop', from: 'walk', to: 'wait' },
			],
			callbacks: {
				onmove: function(event, from, to, user){
					console.log('way point init =>', user);
					user.way_point = MoveModel.directWayPoint(user);
				},
				onstop: function(event, from, to, user){
					user.wait_time = Simulator.mersenne.random() * MoveModel.wait_time | 0;
					user.way_point = undefined;
				},
			}
		});
	},
}
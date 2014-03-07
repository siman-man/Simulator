/**
 *	ノード間の接続の状態管理を行う
 *	@class Connection
 **/

var Connection = {
	/**
	 *		接続状態の初期化を行う
	 *		@method init
	 *		@return 無し
	 **/
	init: function(){
		return new StateMachine.create({
			initial: 'close',
			events: [
				{ name: 'connect', from: 'close', to: 'establish' },
				{ name: 'shutdown', from: 'establish', to: 'close' }
			],

			callbacks: {
				/**
				 *		通信接続時の動作を定義
				 *		@method onconnect
				 *		@param event {String} イベントの名前
				 *		@param from_state {String} どの状態から遷移してきたか
				 *		@param to_state {String} 遷移先の状態
				 *		@param dest {Node} 接続ノード
				 *		@return 無し
				 **/
				onconnect: function(event, from_state, to_state, from, dest) {
					Log.send({ 
						time: Simulator.time, 
						type: 'normal', 
						operation: 'establish',
						from: from.eid, 
						dest: dest.eid 
					});

					from.routing_protocol.connect( dest );
				},

				/**
				 *		通信切断時の動作を定義
				 *		@method onshutdown
				 *		@param event {String} イベントの名前
				 *		@param from_state {String} 遷移元の状態
				 *		@param to_state {String} 遷移先の状態
				 *		@param dest {Node} 切断ノード
				 *		@return 無し
				 **/
				onshutdown: function(event, from_state, to_state, from, dest){
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
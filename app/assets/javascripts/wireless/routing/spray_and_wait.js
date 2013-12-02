/*
 * プロトコル概要
 * BinarySprayAndWaitプロトコルでは2つのフェイズに分かれています。
 *
 * 1. spray phase
 *  送信元はLの指定を行う。これはメッセージのコピー数である。送信元はメッセージをコピーするときに
 *  L/2の値を、宛先と自身のLに設定し直す。
 *  
 * 2. wait phase
 *  宛先がspray phaseで見つからない場合は、宛先に直接メッセージ送信を行う
 */



var SprayAndWait = function(node){
	this.node = node;
};

SprayAndWait.prototype = {
	update: function(){
		this.transmit();
	},

	connect: function( dest ){
		var message_diff = [],
				message_id,
				i;

		message_diff = this.node.routing_protocol.diff( dest );	

		for( i in message_diff ){
			message_id = message_diff[i];
			this.node.buffer.push(Message.create( message_id, this.node, dest ))
		}
	},

	transmit: function(){
		var dest,
				dest_eid,
				message;

		if( this.node.buffer.length > 0 ){
			message = this.node.buffer[0];
			dest_eid = message.dest_eid;
			dest = Node.node_list[dest_eid];
			
			if( this.check( dest, message ) ){
				this.node.buffer.shift();
			}else{
				message.size--;
				if( message.size === 0 ){
					dest.strage[message.id] = message.data;
					dest.strage[message.id].ftoken = message.ftoken;
					this.node.strage[message.id].ftoken = message.ftoken;
					dest.label.text = Object.keys(dest.strage).length;
					this.node.buffer.shift();
					Log.send({ 
						time: Simulator.time, 
						type: 'normal', 
						operation: 'transmit',
						from: this.node.eid, 
						dest: dest.eid 
					});
				}
			}
		}
	},

	check: function( dest, message ){

		if( this.node.contact_list[dest.eid].current === 'close' ) return true;
		if( dest.strage[message.id] !== undefined ) return true;

		return false;
	},

	diff: function( dest ){
		var strageA = this.node.strage,
				strageB = dest.strage,
				message_id,
				diff= [];

		for( message_id in strageA ){
			if( strageB[message_id] === undefined && ( dest.eid === 1 || strageA[message_id].ftoken > 1) ){
				diff.push(message_id);
			}
		}

		return diff;
	}
}
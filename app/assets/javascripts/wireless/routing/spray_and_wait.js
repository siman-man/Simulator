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
		this.buffer_update();
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

	buffer_update: function(){
		var buffer = this.node.buffer;
		while( buffer[0] !== undefined && this.message_check(buffer[0]) ){
			buffer.shift();
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
		
			message.size--;
			
			if( message.size === 0 ){
				if( Simulator.mersenne.random() < Simulator.transmit_success_rate ){
					dest.strage[message.id] = message;
					this.node.strage[message.id].ftoken = message.ftoken;
					dest.label.text = Object.keys(dest.strage).length;
					Log.send(Log.transmit_message( this.node, dest, message ));
					Log.send(Log.receive_message( this.node, dest, message ));
				}
				this.node.buffer.shift();
			}
		}
	},

	message_check: function( message ){
		if( this.node.contact_list[message.dest_eid].current === 'close' ) return true;
		if( Node.node_list[message.dest_eid].strage[message.id] !== undefined ) return true;
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
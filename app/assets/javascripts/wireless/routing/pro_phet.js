/*
 * 宛先への到達確率を求めて、一番高いノードに送信。
 */

var time_unit = 100;

var ProPHET = function(node){
	this.node = node;
	this.gamma = 0.999;
	this.alpha = 0.5;
	this.beta = 0.9;
	this.delta = 0.01;
	this.P_encounter_max = 0.7;
	this.P_encounter_first = 0.5;
	this.P_first_threshold = 0.1;
	this.I_typ = 100;
};

ProPHET.prototype = {
	update: function(){
		this.aging_check();
		this.transmit();
	},

	get_best_eid: function( eid ){
		var from, 
				best_eid = -1, 
				best_value = 0.0, 
				dp;

		for( from in this.node.delivery_predictability ){
			dp = this.node.delivery_predictability[from];
			if( dp[eid] > best_value ){
				best_value = dp[eid];
				best_eid = from;
			}
		}
		return +best_eid;
	},

	aging_check: function(){
		var eid,
				last_time,
				diff_time;

		for( eid in this.node.last_connect_time ){
			last_time = this.node.last_connect_time[eid];
			diff_time = Simulator.time - last_time;
			if( this.node.eid !== +eid && last_time !== 0 && diff_time % time_unit === 0 ){
				this.node.delivery_predictability[this.node.eid][eid] = this.node.delivery_predictability[this.node.eid][eid] * Math.pow( this.gamma, diff_time / time_unit ); 
			}
		}
	},

	deep_copy: function( data ){
		var obj = {},
				key;

		for( key in data ){
			obj[key] = data[key];
		}
		return obj;
	},

	connect: function( to ){
		var dp = this.node.delivery_predictability,
				eid, P_a_b, P_b_c, P_a_c, P_a_c_old,
				my_eid = this.node.eid;

		dp[my_eid][to.eid] = this.first_connection( dp[my_eid][to.eid] );
		console.log("first =>", dp[my_eid][to.eid]);
		dp[to.eid] = this.deep_copy(to.delivery_predictability[to.eid]);
		P_a_b = dp[my_eid][to.eid];
		for( eid in to.delivery_predictability[to.eid] ){
			if( +eid === my_eid || +eid === to.eid ) continue;

			P_a_c_old = dp[my_eid][eid] || 0.0;
			P_b_c = to.delivery_predictability[to.eid][eid] || 0.0;

			P_a_c = this.update_predictability( P_a_b, P_b_c );

			console.log( P_a_b, P_b_c, P_a_c );

			if( P_a_c_old < P_a_c ){
				dp[my_eid][eid] = P_a_c;
			}
		}
	
		var message_diff = [],
				message_id,
				i;

		message_diff = this.diff( to );	

		for( i in message_diff ){
			message_id = message_diff[i];
			this.node.buffer.push(Message.create( message_id, this.node, to ))
		}
	},

	first_connection: function( old ){
		old = old || 0.0;
		return old + ( 1.0 - this.delta - old ) * this.P_encounter( Simulator.time );
	},

	aging: function( old, k ){
		return old * Math.pow( this.gamma, k );
	},

	update_predictability: function( P_a_b, P_b_c ){
		return P_a_b * P_b_c * this.beta;
	},

	P_encounter: function( intvl ){
		if( intvl >= this.I_typ ){
			return this.P_encounter_max;
		}else{
			return this.P_encounter_max * ( intvl / this.I_typ );
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
					dest.label.text = Object.keys(dest.strage).length;
					this.node.buffer.shift();
					Log.send(Log.transmit_message( this.node, dest, message ));
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
				diff= [],
				best_eid = this.get_best_eid( 1 );

		if( this.node.eid === 0 ){
			console.log('best eid = ', best_eid, 'dest.eid = ', dest.eid );
		}

		for( message_id in strageA ){
			if( strageB[message_id] === undefined && best_eid === dest.eid ){
				diff.push(message_id);
			}
		}

		return diff;
	}
};
/*
 * 宛先への到達確率を求めて、一番高いノードに送信。
 */

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

	get_key: function( obj ){
		return ( obj === undefined )? -1 : Object.keys(obj)[0]|0;
	},
	
	get_ratio: function( obj ){
		return ( obj === undefined )? 0.0 : obj[Object.keys(obj)[0]];
	},

	aging_check: function(){
		var eid,
				last_time;

		for( eid in this.node.last_connect_time ){
			last_time = this.node.last_connect_time[eid];
			console.log(eid, last_time);
		}
	},

	connect: function( to ){
		var dp = this.node.delivery_predictability,
				eid, P_a_b, P_b_c, P_a_c, P_a_c_old;

		if( this.node.eid === 0 ) console.log( dp );

		if( dp[to.eid] === undefined ){
			dp[to.eid] = {};
			var ratio_info = {};
			ratio_info[to.eid] = this.first_connection( 0.0 );
			dp[to.eid] = ratio_info;
		}else{
			P_a_b = this.get_ratio(dp[to.eid]);
			for( eid in to.delivery_predictability ){
				P_a_c_old = this.get_ratio(dp[eid]);
				P_b_c = this.get_ratio(to.delivery_predictability[eid]);

				P_a_c = this.update_predictability( P_a_b, P_b_c );

				if( this.node.eid == 0 && eid == 1 ){
					console.log( P_a_c, P_a_b, P_a_c );
				}

				if( P_a_c_old < P_a_c || eid == to.eid ){
					var obj = {};
					obj[to.eid] = P_a_c;
					dp[eid] = obj;
				}
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
		return old + ( 1 - this.delta - old ) * this.P_encounter( Simulator.time );
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
				diff= [],
				dp = this.node.delivery_predictability,
				best_eid = this.get_key( dp[1] );

				if( this.node.eid === 0 ){
					console.log('best eid = ', best_eid, 'dest.eid = ', dest.eid );
				}

		for( message_id in strageA ){
			if( strageB[message_id] === undefined && best_eid == dest.eid ){
				diff.push(message_id);
			}
		}

		return diff;
	}
};
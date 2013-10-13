var Message = {
	packet_color: "yellow",
	packet_size: 3,
	packet_speed: 5,
	message_num: 10,

	init: function(node){
		for(var i = 0; i < this.message_num; i++){
			node.strage[i] = true;
		}
	},

	data: function(text){
		this.text = text;
	},

	send: function(from, dest, data){
		var packet = this.createPacket(from, dest);

		packet.data = data;
		packet.size = 1024
		Simulator.packet_list[packet.id] = packet;
		Simulator.map.addChild(packet);
	},

	generatePacketId: function(packet){
		var id = Simulator.packet_id;

		Simulator.packet_id++;
		return id;
	},

	createPacket: function(from, dest){
		var packet = new createjs.Shape();

		packet.graphics.beginFill(this.packet_color).drawCircle(0, 0, this.packet_size);
		packet.id = this.generatePacketId(packet);
		packet.from = from;
		packet.dest = dest;
		packet.x = from.x;
		packet.y = from.y;

		return packet;
	},

	update: function(){
		var id, packet;

		for( id in Simulator.packet_list ){
			packet = Simulator.packet_list[id];
			View.movePacket(packet, this.packet_speed);
			
			if(this.arriveChecker(packet)){
				Server.recievePacket(packet);
				Simulator.map.removeChild(packet);
				delete Simulator.packet_list[id];
			}
		}
	},

	arriveChecker: function(packet){
		var dx = packet.x - packet.dest.x,
    		dy = packet.y - packet.dest.y;
    		
    return ( dx * dx + dy * dy <= 9 )? true : false;
	}
};
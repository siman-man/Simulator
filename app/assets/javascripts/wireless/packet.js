var Packet = {
	packet_color: "yellow",
	packet_size: 3,
	packet_speed: 5,

	init: function(from, dest){
		this.from = from;
		this.dest = dest;
	},

	data: function(text){
		this.text = text;
	},

	send: function(from, dest, data){
		var packet = this.createPacket(from, dest);
		packet.data = data;
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
		packet.x = from.x + 20;
		packet.y = from.y + 20;

		return packet;
	},

	update: function(){
		var WS = Simulator;
		for(var id in WS.packet_list){
			var packet = WS.packet_list[id];
			View.movePacket(packet, this.packet_speed);
			if(this.arriveChecker(packet)){
				console.log('packet arrived');
				Server.recievePacket(packet);
				packet.graphics.clear();
				delete WS.packet_list[id];
			}
		}
	},

	arriveChecker: function(packet){
		var dx = packet.x - 20 - packet.dest.x;
    var dy = packet.y - 20 - packet.dest.y;
    return ( dx * dx + dy * dy <= 9 )? true : false;
	}
};
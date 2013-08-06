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

	sendPacket: function(from, dest){
		var packet = this.createPacket(from, dest);
		Simulator.packet_list[packet.id] = packet;
		Simulator.map.addChild(packet);
		console.log('set packet ' + packet.id);
	},

	setPacketId: function(packet){
		var id = Simulator.packet_id;
		Simulator.packet_id++;
		return id;
	},

	createPacket: function(from, dest){
		var packet = new createjs.Shape();
		packet.graphics.beginFill(this.packet_color).drawCircle(0, 0, this.packet_size);
		packet.id = this.setPacketId(packet);
		packet.from = from;
		packet.dest = dest;
		packet.x = from.x;
		packet.y = from.y;

		return packet;
	},

	update: function(){
		var WS = Simulator;
		for(var id in WS.packet_list){
			var packet = WS.packet_list[id];
			View.movePacket(packet, this.packet_speed);
			if(this.arriveChecker(packet)){
				console.log('packet delete');
				packet.graphics.clear();
				delete WS.packet_list[id];
			}
		}
	},

	arriveChecker: function(packet){
		var dx = packet.x - packet.dest.x;
    var dy = packet.y - packet.dest.y;
    return ( dx * dx + dy * dy <= 9 )? true : false;
	}
};
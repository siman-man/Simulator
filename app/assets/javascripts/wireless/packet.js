var Packet = {
	init: function(from, dest){
		this.from = from;
		this.dest = dest;
	},

	data: function(text){
		this.text = text;
	},

	createPacket: function(id, from, dest){
		var packet = new createjs.Shape();
		packet.graphics.beginFill(this.packet_color).drawCircle(0, 0, this.packet_size);
		packet.id = id;
		packet.from = from;
		packet.dest = dest;
		packet.x = from.x;
		packet.y = from.y;

		return packet;
	}
};
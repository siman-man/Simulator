var View = {
	packet_color: "yellow",
	packet_size: 2,

	sendPacket: function(from, dest){

	},

	createPacket: function(){
		var packet = new createjs.Shape();
		packet.graphics.beginFill(this.packet_color).drawCircle(0, 0, this.packet_size);

		return packet;
	}
}
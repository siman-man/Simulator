var View = {
	packet_color: "yellow",
	packet_size: 2,

	movePacket: function(packet, speed){
		var dest = packet.dest;

		var dx = dest.x - packet.x;
    var dy = dest.y - packet.y;
    var radian = Math.atan2(dy, dx);

    packet.x += Math.cos(radian) * speed;
    packet.y += Math.sin(radian) * speed;
	},
}
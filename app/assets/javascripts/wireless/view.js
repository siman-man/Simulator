var View = {
	packet_color: "yellow",
	packet_size: 2,
	gridSpan: 30,

	movePacket: function(packet, speed){
		var dest = packet.dest;

		var dx = (dest.x) - packet.x;
		var dy = (dest.y) - packet.y;
		var radian = Math.atan2(dy, dx);

		packet.x += Math.cos(radian) * speed;
		packet.y += Math.sin(radian) * speed;
	},

	drawGrid: function(){
		var span = this.gridSpan;
		var WS = Simulator;

		for(var i = 0; i <= 1600; i += span){
			var vline = new createjs.Shape();
			var color = "brack";
			vline.graphics.beginStroke(color);
			vline.graphics.moveTo(i, 0);
			vline.graphics.lineTo(i, WS.canvas_height * 2);
			WS.map.addChild(vline);
		}

		for(var i = 0; i <= 800; i += span){
			var hline = new createjs.Shape();
			var color = "brack";
			hline.graphics.beginStroke(color);
			hline.graphics.moveTo(0, i);
			hline.graphics.lineTo(WS.canvas_width*2, i);
			WS.map.addChild(hline);
		}
	},

	point2coord: function( px, py ){
		return { x: px/this.gridSpan|0, y: py/this.gridSpan|0 }
	},
}
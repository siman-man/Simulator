var Packet = {
	init: function(from, dest){
		this.from = from;
		this.dest = dest;
	},

	data: function(text){
		this.text = text;
	}
};
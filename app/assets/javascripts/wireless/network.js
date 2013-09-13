var Network = {
	field: [],

	init: function(){
		var y, x;

		for( y = 0; y < View.height; y++){
			this.field[y] = [];

			for( x = 0; x < View.width; x++){
				this.field[y][x] = { list: [] };
			}
		}
	}
}
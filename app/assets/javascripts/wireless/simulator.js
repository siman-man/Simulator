  var Simulator = {
	canvas: document.getElementById('canvas'),
  canvas_width: window.innerWidth,
  canvas_height: window.innerHeight,
	map: new createjs.Stage(canvas), 
	packet_list: [],
	server_list: [],
	user_list: [],
	selected_target: -1,
  operation_flag: false,
  packet_id: 0,
  article_id: 0,
  user_id: 100000,

	init: function(){
    //Add Shape instance to stage display list.
    Wireless.createServer(150, 150);
    Wireless.createServer(250, 150);

    //Update stage will render next frame
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", this.handleTick);
  },

  handleTick: function() {
  	if(Math.random() < 0.01) Packet.sendPacket(Simulator.server_list[0], Simulator.server_list[1]);;
    Wireless.node_update();
    User.update();
    Packet.update();
    Simulator.map.update();
  }
}
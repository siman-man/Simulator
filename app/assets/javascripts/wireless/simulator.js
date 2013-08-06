var Simulator = {
	canvas: document.getElementById('canvas'),
  canvas_width: window.innerWidth,
  canvas_height: window.innerHeight,
	map: new createjs.Stage(canvas), 
	packet_list: [],
	server_list: [],
	human_list: [],
	selected_target: -1,
  operation_flag: false,
  packet_id: 0,
  article_id: 0,

	init: function(){
    //Add Shape instance to stage display list.
    Wireless.create_node(150, 150);
    Wireless.create_node(250, 150);

    //Update stage will render next frame
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", this.handleTick);
  },

  handleTick: function() {
  	if(Math.random() < 0.01) Packet.sendPacket(Simulator.server_list[0], Simulator.server_list[1]);;
    Wireless.node_update();
    Human.human_update();
    Packet.update();
    Simulator.map.update();
  }
}
  var Simulator = {
	canvas: document.getElementById('canvas'),
  canvas_width: window.innerWidth,
  canvas_height: window.innerHeight,
	map: new createjs.Stage(canvas), 
	packet_list: {},
	server_list: {},
	user_list: {},
	selected_target: -1,
  operation_flag: false,
  packet_id: 0,
  article_id: 0,
  server_id: 0,
  user_id: 100000,

	init: function(){
    //Add Shape instance to stage display list.
    Server.createServer(150, 150);
    Server.createServer(550, 150);

    //Update stage will render next frame
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", this.handleTick);
  },

  handleTick: function() {
    Server.node_update();
    User.update();
    Packet.update();
    Graph.update();
    Simulator.map.update();
  },

  onmousedown: function(e) {
    var WS = Simulator;
    console.log(WS.operation_flag)
    if(!WS.operation_flag){
      
      var x = e.clientX - canvas.offsetLeft + document.body.scrollLeft;
      var y = e.clientY - canvas.offsetTop + document.body.scrollTop;

      var draw_type = $("input[name='draw_object']:checked").val();
      switch(draw_type){
        case 'server':
          Server.createServer(x, y);
        break;
        case 'user':
          User.createUser(x, y);
        break;
        case 'road':
          Street.createRoad(x, y, true);
        break;
        case 'tree':
          Tree.create(x, y);
        break;
      }

      WS.selected_target = -1;
      console.log(WS.selected_target);
      console.log('mousedown');
    }
    WS.operation_flag = true;
  },

  onmousemove: function(e) {
    var WS = Simulator;
    if(WS.operation_flag){
      var x = e.clientX - canvas.offsetLeft + document.body.scrollLeft;
      var y = e.clientY - canvas.offsetTop + document.body.scrollTop;

      var draw_type = $("input[name='draw_object']:checked").val();
      if(draw_type == 'road'){
        Street.createRoad(x, y, false);
      }
    }
  },

  onmouseup: function(e){
    var WS = Simulator;
    WS.operation_flag = false;
    console.log('onmouseup' + ' ' + WS.operation_flag);
  },
}
  var Simulator = {
	canvas: document.getElementById('canvas'),
  canvas_width: window.canvas.width,
  canvas_height: window.canvas.height,
	map: new createjs.Stage(canvas), 
	packet_list: {},
	server_list: {},
	user_list: {},
  field: [],
	selected_target: -1,
  operation_flag: false,
  packet_id: 0,
  article_id: 0,
  server_id: 0,
  user_id: 100000,
  time: 0,


	init: function(){
    for(var i = 0; i < this.canvas_height; i++){
      this.field[i] = [];
    }

    //Add Shape instance to stage display list.
    Server.create(150, 150);
    Server.create(550, 150);

    //Update stage will render next frame
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", this.handleTick);
  },

  handleTick: function() {
    Simulator.time++;
    Server.node_update();
    User.update();
    Packet.update();
    Graph.update();
    Simulator.map.update();
  },

  onmousedown: function(e) {
    var WS = Simulator;
    if(!WS.operation_flag){
      
      var x = e.clientX - canvas.offsetLeft + document.body.scrollLeft;
      var y = e.clientY - canvas.offsetTop + document.body.scrollTop;
      var coord = View.point2coord(x, y);

      var draw_type = $("input[name='draw_object']:checked").val();
      if(WS.field[coord.y][coord.x] === undefined){
        switch(draw_type){
          case 'server':
            Server.create(x, y);
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
          case 'home':
            Home.create(coord.x, coord.y);
            break;
          default:
            break;
        }
      }else{
        var type = WS.field[coord.y][coord.x].type;
        switch(type){
          case 'H':
            Home.remove(coord.x, coord.y);
            break;
        }
      }

      WS.selected_target = -1;
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
  },
}
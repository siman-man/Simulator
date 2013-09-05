  var Simulator = {
	canvas: document.getElementById('canvas'),
  canvas_width: window.canvas.width,
  canvas_height: window.canvas.height,
	map: new createjs.Stage(canvas), 
	packet_list: {},
	server_list: {},
	user_list: {},
  field: [],
  route: [],
	selected_target: -1,
  operation_flag: false,
  packet_id: 0,
  article_id: 0,
  server_id: 0,
  user_id: 100000,
  time: 0,


	init: function(){
    for(var y = 0; y < this.canvas_height; y++){
      this.field[y] = [];
      this.route[y] = [];

      for(var x = 0; x < this.canvas_width; x++){
        this.route[y][x] = { x: x, y: y, type: 'normal', cost: 1 };
      }
    }

    //Update stage will render next frame
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", this.handleTick);
  },

  handleTick: function() {
    Simulator.time++;
    Server.node_update();
    User.update();
    Car.update();
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
            User.createUser(coord.x, coord.y);
            break;
          case 'road':
            Street.create(x, y, true);
            break;
          case 'tree':
            Tree.create(coord.x, coord.y);
            break;
          case 'home':
            Home.create(coord.x, coord.y);
            break;
          case 'car':
            Car.create(coord.x, coord.y);
            break;
          case 'office':
            Office.create(coord.x, coord.y);
          default:
            break;
        }
      }else{
        var type = WS.field[coord.y][coord.x].type;
        switch(type){
          case 'home':
            if(draw_type == 'home'){
              Home.remove(coord.x, coord.y);
            }
            break;
          case 'tree':
            if(draw_type == 'tree'){
              Tree.remove(coord.x, coord.y);
            }
          case 'office':
            if(draw_type == 'office'){
              Office.remove(coord.x, coord.y);
            }
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
        Street.create(x, y, false);
      }
    }
  },

  onmouseup: function(e){
    var WS = Simulator;
    WS.operation_flag = false;
  },
}
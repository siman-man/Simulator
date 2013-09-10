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
  connection_list: [],
	selected_target: -1,
  operation_flag: false,
  packet_id: 0,
  article_id: 0,
  server_id: 0,
  user_id: 0,
  time: 0,
  per_frame: 30,
  frame_time: 1000/30,


	init: function(){
    for(var y = 0; y < (this.canvas_height/30)+1; y++){
      this.field[y] = [];
      this.route[y] = [];
      this.connection_list[y] = [];

      for(var x = 0; x < (this.canvas_width/30)+1; x++){
        this.route[y][x] = { x: x, y: y, type: 'normal', cost: 1, pf: 1};
        this.connection_list[y][x] = {};
      }
    }

    //User.create(8, 8);
    //Server.create(5, 5);
    //Server.create(25, 5);

    //console.log(Propagation.calc(0, 5, 5));
    //View.animation(Propagation.calc(0, 5, 5));

    //Update stage will render next frame
    createjs.Ticker.setFPS(this.per_frame);
    createjs.Ticker.addEventListener("tick", this.handleTick);
  },

  handleTick: function() {
    Simulator.time++;
    Server.update();
    User.update();
    Car.update();
    Packet.update();
    Simulator.map.update();
  },

  getTime: function(time){
    var mil = createjs.Ticker.getTime();
    var sec = mil/1000 | 0;
    mil = (mil % 1000) | 0;
    if(mil < 10){
      mil = "00" + mil;
    }else if(mil < 100){
      mil = "0" + mil;
    }

    var hour = sec/3600 | 0;
    if(hour < 10) hour = "0" + hour;
    sec %= 3600;
    var min = sec/60 | 0;
    if(min < 10) min = "0" + min;
    sec %= 60;
    if(sec < 10) sec = "0" + sec;

    return([hour, min, sec, mil].join(':'));
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
            Server.create(coord.x, coord.y);
            break;
          case 'user':
            User.create(coord.x, coord.y);
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
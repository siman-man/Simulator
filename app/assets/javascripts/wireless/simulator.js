var Simulator = {
  canvas: document.getElementById('canvas'),
  canvas_width: window.canvas.width,
  canvas_height: window.canvas.height,
  map: new createjs.Stage(canvas), 
  packet_list: {},
  field: [],
  connection_list: [],
  selected_target: -1,
  operation_flag: false,
  press_flag: false,
  packet_id: 0,
  article_id: 0,
  time: 0,
  per_frame: 30,
  frame_time: 1000/30,

  init: function(){
    for(var y = 0; y < (this.canvas_height/30)+1; y++){
      this.field[y] = [];
      this.connection_list[y] = [];

      for(var x = 0; x < (this.canvas_width/30)+1; x++){
        this.field[y][x] = { x: x, y: y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
        this.connection_list[y][x] = {};
      }
    }

    this.state = FSM.simulator();

    createjs.Ticker.setFPS(this.per_frame);
    createjs.Ticker.addEventListener("tick", this.handleTick);
    Simulator.map.update();
  },

  clear: function(){
    Simulator.time = 0;
    Street.clear();
    Home.clear();
    Tree.clear();
    Office.clear();
    Server.clear();
    User.clear();
    Simulator.map.removeAllChildren();
    createjs.Ticker.removeEventListener("tick", this.handleTick);
    
    Panel.init();
    View.drawGrid()
    View.init();
    Simulator.init();
    Street.init();  
  },

  handleTick: function(event) {
    if(Simulator.state.current == 'run'){
      Simulator.time++;
      Server.update();
      User.update();
      Car.update();
      Packet.update();
    }
    Simulator.map.update();
  },

  getTime: function(time){
    //var mil = createjs.Ticker.getTime();
    var mil = Simulator.time * 1000;
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

  objectCheck: function(x, y, draw_type, delete_type, draw_object){
    if(draw_type !== undefined && draw_object.obj === undefined){
      switch(draw_type){
        case 'server':
        Server.create( x, y );
        View.animation(Propagation.calc(x, y));
        break;
        case 'user':
        User.create( x, y, 'worker' );
        break;
        case 'road':
        Street.create(x, y, true);
        break;
        case 'tree':
        Tree.create( x, y );
        break;
        case 'home':
        Home.create( x, y );
        break;
        case 'car':
        Car.create( x, y );
        break;
        case 'office':
        Office.create( x, y );
        default:
        break;
      }
    }else if(delete_type !== undefined && draw_object.obj !== undefined){
      switch(delete_type){
        case 'server':
        Server.remove( draw_object.obj );
        break;
        case 'user':
        User.remove( draw_object.obj );
        case 'road':
        Street.remove( draw_object.obj );
        break;
        case 'home':
        Home.remove( draw_object.obj );
        break;
        case 'tree':
        Tree.remove( draw_object.obj );
        break;
        case 'office':
        Office.remove( draw_object.obj );
        break;
      }
    }else if(draw_type == 'car' && draw_object.type == 'road'){
      Car.create( x, y );
    }
  },

  onmousedown: function(e) {
    console.log("onmousedown =>");
    var WS = Simulator;

    if(!WS.operation_flag){
      var x = e.clientX - canvas.offsetLeft + document.body.scrollLeft;
      var y = e.clientY - canvas.offsetTop + document.body.scrollTop;
      var coord = View.point2coord(x, y);

      var draw_type = $("input[name='draw_object']:checked").val();
      var delete_type = $("input[name='delete_object']:checked").val();
      var draw_object = WS.field[coord.y][coord.x]; 

      Simulator.objectCheck( coord.x, coord.y, draw_type, delete_type, draw_object);
    }

    WS.press_flag = true;
  },

  onmousemove: function(e) {
    var WS = Simulator;
    if(WS.press_flag && !WS.operation_flag){
      var x = e.clientX - canvas.offsetLeft + document.body.scrollLeft;
      var y = e.clientY - canvas.offsetTop + document.body.scrollTop;
      var coord = View.point2coord(x, y);

      var draw_type = $("input[name='draw_object']:checked").val();
      var delete_type = $("input[name='delete_object']:checked").val();
      var draw_object = WS.field[coord.y][coord.x]; 

      Simulator.objectCheck( coord.x, coord.y, draw_type, delete_type, draw_object);
    }
  },

  onmouseup: function(e){
    Simulator.press_flag = false;
  },
}
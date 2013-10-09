var Simulator = {
  canvas: document.getElementById('canvas'),
  canvas_width: window.canvas.width,
  canvas_height: window.canvas.height,
  map: new createjs.Stage(canvas), 
  packet_list: {},
  field: [],
  user_map: [],
  connection_list: [],
  selected_target: -1,
  target: undefined,
  operation_flag: false,
  press_flag: false,
  packet_id: 0,
  article_id: 0,
  time: 0,
  per_frame: 60,

  init: function(){
    var x, y;

    for( y = 0; y < View.height; y++ ){
      this.field[y] = [];
      this.user_map[y] = [];
      this.connection_list[y] = [];

      for( x = 0; x < View.width; x++ ){
        this.field[y][x] = { x: x, y: y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
        this.user_map[y][x] = { x: x, y: y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
        this.connection_list[y][x] = {};
      }
    }

    this.state = FSM.simulator();

    Server.create( 10, 10, 'start');
    Server.create( 20, 10, 'end');

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
    
    View.drawGrid()
    View.init();
    Simulator.init();
    Street.init();  
  },

  handleTick: function(event) {
    if(Simulator.state.current == 'run'){
      Simulator.time++;
      Simulator.updateTime();
      Server.update();
      Simulator.moveUpdate();
      Simulator.scanUpdate();
      Car.update();
      Packet.update();
      View.update();
    }
    Simulator.map.update();
  },

  moveUpdate: function(){
    User.move();
  },

  scanUpdate: function(){
    User.scan();
  },

  updateTime: function(time){
    var mil = Simulator.time * 1000/30,
        sec = mil/1000 | 0,
        hour, min;

    mil = (mil % 1000) | 0;
    if(mil < 10){
      mil = "00" + mil;
    }else if(mil < 100){
      mil = "0" + mil;
    }

    hour = sec/3600 | 0;
    if(hour < 10) hour = "0" + hour;
    sec %= 3600;
    
    min = sec/60 | 0;
    if(min < 10) min = "0" + min;
    sec %= 60;
    if(sec < 10) sec = "0" + sec;

    $("span#time").html([hour, min, sec, mil].join(':'));
  },

  objectCheck: function(x, y, object_type, operation_type, draw_object){
    if(operation_type == 0 && draw_object.obj === undefined){
      switch(object_type){
        case 'server':
          Server.create( x, y );
          break;
        case 'user':
          if( Simulator.user_map[y][x].type == 'normal'){
            User.create( x, y, 'normal' );
          }
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
    }else if(operation_type == 2 && draw_object.obj !== undefined){
      switch(object_type){
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
    }else if(draw_object.obj !== undefined){
      switch(object_type){
        case 'car':
        Car.create( x, y );
        break;
      }
    }
  },

  onmousedown: function(e) {
    console.log("onmousedown =>");

    if( Simulator.state.current != 'run' ){
      var x = e.clientX - canvas.offsetLeft + document.body.scrollLeft,
          y = e.clientY - canvas.offsetTop + document.body.scrollTop,
          coord = View.point2coord(x, y),
          operation_type = e.button,
          object_type = $("input[name='draw_object']:checked").val(),
          draw_object = Simulator.field[coord.y][coord.x]; 

          console.log(operation_type);

      if( draw_object.obj ){
        Simulator.operation_flag = true;
        Simulator.target = draw_object;
        Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
      }else{
        Simulator.objectCheck( coord.x, coord.y, object_type, operation_type, draw_object);
      }
    }

    Simulator.press_flag = true;
  },

  onmousemove: function(e) {
    if( Simulator.press_flag ){
      var x = e.clientX - canvas.offsetLeft + document.body.scrollLeft,
          y = e.clientY - canvas.offsetTop + document.body.scrollTop,
          coord = View.point2coord(x, y),
          operation_type = e.button,
          object_type = $("input[name='draw_object']:checked").val(),
          draw_object = Simulator.field[coord.y][coord.x]; 

      if( Simulator.operation_flag && draw_object.obj === undefined){
        Simulator.target.obj.x = coord.x * gridSize;
        Simulator.target.obj.y = coord.y * gridSize;
        Simulator.target.x = coord.x;
        Simulator.target.y = coord.y;
        Propagation.calc(coord.x, coord.y);
        View.update();
      }else{
        Simulator.objectCheck( coord.x, coord.y, object_type, operation_type, draw_object);
      }
    }
  },

  onmouseup: function(e){
    if( Simulator.target ){
      var coord = View.point2coord( Simulator.target.obj.x, Simulator.target.obj.y );
      Simulator.field[coord.y][coord.x] = Simulator.target;
      Propagation.calc(coord.x, coord.y);
      View.update();
      Simulator.target = undefined;
    }
    
    Simulator.operation_flag = false;
    Simulator.press_flag = false;
  },
}
var Simulator = {
  canvas: document.getElementById('canvas'),
  canvas_width: window.canvas.width,
  canvas_height: window.canvas.height,
  map: new createjs.Stage(canvas), 
  packet_list: {},
  node_map: {},
  field: [],
  key_map: [],
  seed: 1,
  stage_type: 1,
  selected_target: -1,
  target: undefined,
  operation_flag: false,
  press_flag: false,
  article_id: 0,
  time: 0,
  per_frame: 60,

  init: function(){
    this.protocol_type = 'spray_and_wait';
    //this.protocol_type = 'epidemic';
    this.mersenne = new MersenneTwister(this.seed);
    var x, y, key;

    for( y = 0; y < View.height; y++ ){
      this.field[y] = [];
      this.key_map[y] = [];

      for( x = 0; x < View.width; x++ ){
        this.field[y][x] = { x: x, y: y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
        key = Simulator.point2key( x, y );
        this.key_map[y][x] = key;
        this.node_map[key] = {};
      }
    }

    this.state = FSM.simulator();
    this.end_flag = false;

    Stage.stage1();

    createjs.Ticker.setFPS(this.per_frame);
    createjs.Ticker.addEventListener("tick", this.handleTick);
    Simulator.map.update();
  },

  clear: function(){
    createjs.Ticker.removeEventListener("tick", this.handleTick);
    Simulator.map.removeAllChildren();

    Simulator.time = 0;
    Simulator.node_list = {};
    Street.clear();
    Home.clear();
    Tree.clear();
    Office.clear();
    Node.clear();
    View.clear();
    
    View.drawGrid()
    View.init();
    Simulator.init();
    Node.init();
    Street.init();  
  },

  handleTick: function(event) {
    if(Simulator.state.current == 'run'){
      Simulator.time++;
      Simulator.updateTime();
      View.clear();
      Simulator.moveUpdate();
      Simulator.scanUpdate();
      Simulator.communicationUpdate();
      View.update();
      Simulator.map.update();
      Simulator.finishCheck();
    }else{
      Simulator.map.update();
    }
  },

  moveUpdate: function(){
    Node.move();
    Car.update();
  },

  scanUpdate: function(){
    Node.scan();
  },

  communicationUpdate: function(){
    Node.routingUpdate();
    Node.transmit();
    Node.receive();
  },

  finishCheck: function(){
    if( Object.keys(Node.node_list[1].strage).length === Message.message_num ){
      Simulator.state.finish();
    }
  },

  point2key: function( x, y ){
    return 'x' + String(x) + 'y' + String(y);
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
    var key;
    if(operation_type == 0 && draw_object.obj === undefined){
      switch(object_type){
        case 'server':
          Node.create( x, y, 'server' );
          break;
        case 'user':
          key = Simulator.key_map[y][x];
          if( Object.keys(Simulator.node_map[key]).length === 0 ){
            Node.create( x, y, 'user', { type: 'normal' });
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
          draw_object = Simulator.field[coord.y][coord.x],
          key;

          console.log(operation_type);

      if( draw_object.obj ){
        Simulator.operation_flag = true;
        Simulator.target = draw_object;
        Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };

        if( draw_object.type === 'server' ){
          key = Simulator.key_map[coord.y][coord.x];
          delete Simulator.node_map[key][draw_object.obj.eid];
        }
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
        Simulator.target.obj.y = coord.y * gridSize;
        Simulator.target.obj.x = coord.x * gridSize;
        Simulator.target.obj.label.y = Simulator.target.obj.y;
        Simulator.target.obj.label.x = Simulator.target.obj.x;
        Simulator.target.x = coord.x;
        Simulator.target.y = coord.y;
        Propagation.calc(coord.x, coord.y);
        View.update();
      }else if( draw_object.obj === undefined){
        Simulator.objectCheck( coord.x, coord.y, object_type, operation_type, draw_object);
      }
    }
  },

  onmouseup: function(e){
    if( Simulator.target ){
      var coord = View.point2coord( Simulator.target.obj.x, Simulator.target.obj.y ),
          key, eid;
      Simulator.field[coord.y][coord.x] = Simulator.target;
      if( Simulator.target.type === 'server' ){
        key = Simulator.key_map[coord.y][coord.x];
        eid = Simulator.target.obj.eid;
        Simulator.node_map[key][eid] = { x: coord.x, y: coord.y, obj: Simulator.target.obj, type: 'server' };
      }
      Propagation.calc(coord.x, coord.y);
      View.update();
      Simulator.target = undefined;
    }
    
    Simulator.operation_flag = false;
    Simulator.press_flag = false;
  },
}
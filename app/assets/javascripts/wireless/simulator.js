var Simulator = {
  packet_list: {},
  node_map: {},
  field: [],
  user_id: 0,
  key_map: [],
  keep_out: [],
  start_time: undefined,
  end_time: undefined,
  seed: 1,
  click_point: {},
  release_point: {},
  update_flag: false,
  replay: false,
  stage_type: 1,
  selected_target: -1,
  target: undefined,
  route_user: undefined,
  operation_flag: false,
  press_flag: false,
  create_route_mode: false,
  total_send_message_num: 0,
  article_id: 0,
  time: 0,
  time_limit: -1,
  per_frame: 360,

  getCanvasInfo: function(){
    console.log('get canvas info =>');
    Simulator.canvas = document.getElementById('canvas');
    Simulator.canvas_width = window.canvas.width;
    Simulator.canvas_height = window.canvas.height;
    console.log('width =>', Simulator.canvas_width, 'height =>', Simulator.canvas_height);
    Simulator.map = new createjs.Stage(Simulator.canvas); 
  },

  init: function( config ){
    if( Simulator.replay ){
      $("#seed").val(Simulator.seed);
      console.log('simulator replay =>');
    }else{
      console.log('simulator init =>');
    }

    var x, y, key;

    for( y = 0; y < View.height; ++y ){
      this.field[y] = [];
      this.key_map[y] = [];
      this.keep_out[y] = [];

      for( x = 0; x < View.width; ++x ){
        this.field[y][x] = { x: x, y: y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
        key = Simulator.point2key( x, y );
        this.key_map[y][x] = key;
        this.node_map[key] = {};
        this.keep_out[y][x] = {};
      }
    }

    this.state = FSM.simulator();
    this.end_flag = false;

    createjs.Ticker.setFPS(this.per_frame);
    createjs.Ticker.addEventListener("tick", this.handleTick);
    Simulator.map.update();
    console.log('seed value => ' + Simulator.seed);
  },

  setKeepOut: function( click_point, release_point, eid ){
    var y,
        x,
        sy = Math.min( click_point.y, release_point.y),
        ey = Math.max( click_point.y, release_point.y),
        sx = Math.min( click_point.x, release_point.x),
        ex = Math.max( click_point.x, release_point.x); 
  
    for( y = sy; y <= ey; ++y ){
      for( x = sx; x <= ex; ++x ){
        this.keep_out[y][x][eid] = true;
        View.keep_out_field[y][x].eid = eid;
      }
    }
  },

  direct_protocol_type: function( type ){
    switch(type){
      case 0:
        this.protocol_type = 'epidemic';
        break;
      case 1:
        this.protocol_type = 'spray_and_wait';
        break;
      case 2:
        this.protocol_type = 'pro_phet';
        break;
      case 3:
        this.protocol_type = 'n_hop_forwarding';
        break;
      default:
        this.protocol_type = 'epidemic';
    }
  },

  clear: function( config ){
    console.log("Simulator clear =>");
    createjs.Ticker.removeEventListener("tick", this.handleTick);
    Simulator.map.removeAllChildren();

    Simulator.time = 0;
    Simulator.node_list = {};
    Street.clear();
    Tree.clear();
    Wall.clear();
    Node.clear();
    View.clear();
  },

  handleTick: function(event) {
    if(Simulator.state.current == 'run'){
      Simulator.time++;
      Simulator.updateTime();
      View.clear();
      Simulator.moveUpdate();
      Simulator.scanUpdate();
      Simulator.communicationUpdate();
      if( $("#animation").is(":checked") ){
        View.update();
        Simulator.map.update(); 
      }
      Simulator.finishCheck();
    }else{
      Simulator.map.update();
    }
  },

  moveUpdate: function(){
    Node.move();
    if( Simulator.time % 10 === 0 ){
      Node.sendLocation();
    }
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
    if(Object.keys(Node.node_list[1].strage).length === Message.message_num || Simulator.time === Simulator.time_limit){
    //if(Simulator.time === Simulator.time_limit){
      Simulator.state.finish();
    }
  },

  point2key: function( x, y ){
    return 'x' + String(x) + 'y' + String(y);
  },

  updateTime: function(time){
    var now_time = new Date();
    var mil = (now_time.getTime() - Simulator.start_time),
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
    
    $("span#real_time").html([hour, min, sec, mil].join(':'));
    $("span#time").html(Simulator.time);
  },

  isEmpty: function( y, x ){
    var key = Simulator.key_map[y][x];
    if( Object.keys(Simulator.node_map[key]).length !== 0 ) return false;
    if( Simulator.field[y][x] !== undefined ) return false;
    return true;
  },

  objectCheck: function(x, y, object_type, operation_type, draw_object){
    var key;
    if(operation_type === 0 && draw_object.obj === undefined){
      switch(object_type){
        case 'server':
          console.log("Node create:server =>");
          Node.create( x, y, { type: 'server' });
          break;
        case 'user':
          console.log("Node create:user =>");
          key = Simulator.key_map[y][x];
          if( Object.keys(Simulator.node_map[key]).length === 0 ){
            Node.create( x, y, { type: 'user' });
          }
          break;
        case 'road':
          Street.create(x, y, true);
          break;
        case 'wall':
          Wall.create( x, y );
          break;
        case 'tree':
          Tree.create( x, y );
          break;
        case 'car':
          key = Simulator.key_map[y][x];
          if( Object.keys(Simulator.node_map[key]).length === 0 ){
            console.log("Node create:car =>");
            Node.create( x, y, { type: 'car' });
          }
          break;
        case 'lake':
          Lake.create( x, y );
          break;
        case 'tree':
          Tree.create( x, y );
          break;
        default:
          break;
      }
    }else if(operation_type === 2 && draw_object.obj !== undefined && draw_object.type === object_type ){
      console.log("remove object =>", object_type);
      switch(object_type){
        case 'server':
          Node.remove( draw_object.obj );
          break;
        case 'user':
          Node.remove( draw_object.obj );
          break;
        case 'road':
          Street.remove( draw_object.obj );
          break;
        case 'car':
          Node.remove( draw_object.obj );
          break;
        case 'wall':
          Wall.remove( draw_object.obj );
          break;
        case 'tree':
          Tree.remove( draw_object.obj );
          break;
        case 'lake':
          Lake.remove( draw_object.obj );
          break;
      }
    }else if( operation_type === 0 && draw_object.obj !== undefined){
      switch(object_type){
        case 'car':
        console.log("Node create:user =>");
        key = Simulator.key_map[y][x];
        if( Object.keys(Simulator.node_map[key]).length === 0 ){
          Node.create( x, y, { type: 'car' });
        }
        break;
      }
    }
  },

  onmousedown: function(e) {
    console.log("onmousedown =>");
    Simulator.press_flag = true;
    if( Simulator.state.current === 'run' ) return;

    var rect = Simulator.canvas.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top,
        coord = View.point2coord(x, y),
        operation_type = e.button,
        object_type = $("input[name='draw_object']:checked").val(),
        draw_object = Simulator.field[coord.y][coord.x],
        key = Simulator.key_map[coord.y][coord.x],
        node_num = Object.keys(Simulator.node_map[key]).length,
        node = Simulator.node_map[key],
        obj_data = node[Object.keys(node)[0]];

    Simulator.click_point = { x: coord.x, y: coord.y };
    Simulator.release_point = {};
    
    if($("#create_route").is(":checked") && $("#user_eid").val().length !== 0 ){
      this.create_route_mode = true;
    }

    if( obj_data !== undefined ){
      console.log("obj path", obj_data.obj.path.length);
      if( obj_data.obj.path.length === 0 ){
        View.route_top = { y: coord.y, x: coord.x };
          console.log("mouse down: route top =>", View.route_top);
        }
        Panel.updateNodeData( obj_data.obj );
        draw_object = obj_data;
      }

    console.log("operation type => ", operation_type, 'y:',coord.y,'x:',coord.x);

      switch(Simulator.state.current){
        case 'init':
          if( draw_object.obj ){
            Simulator.operation_flag = true;
            Simulator.target = draw_object;

            if( Node.isServer(draw_object.type) && operation_type === 0 ){
              console.log("server move =>");
              Simulator.field[coord.y][coord.x] = { x: coord.x, y: coord.y, obj: undefined, type: 'normal', cost: 1, pf: 1 };
              key = Simulator.key_map[coord.y][coord.x];
              delete Simulator.node_map[key][draw_object.obj.eid];
            }else if( operation_type === 2 ){
              console.log("before => ", Simulator.field[coord.y][coord.x] );
              console.log("object check =>", coord.y, coord.x, draw_object.type, operation_type );
              Simulator.objectCheck( coord.x, coord.y, object_type, operation_type, draw_object);
              console.log("after => ", Simulator.field[coord.y][coord.x] );
            }else if( node_num === 0 && draw_object.type === 'road' && object_type === 'car' ){
              Simulator.objectCheck( coord.x, coord.y, object_type, operation_type, draw_object);
            }
          }else if( node_num === 0 ){
            console.log("nothing object =>");
            Simulator.objectCheck( coord.x, coord.y, object_type, operation_type, draw_object);
          }else if( obj_data !== undefined ){
            if( operation_type === 2 ){
              Node.remove( obj_data.obj );
            }else if( operation_type === 0 ){
              console.log("user move =>");
              Simulator.operation_flag = true;
              Simulator.target = obj_data;
              key = Simulator.key_map[coord.y][coord.x];
              delete Simulator.node_map[key][obj_data.obj.eid];
            }
          }
          break;
        case 'createRouteMode':
          if( !View.route_grid[coord.y][coord.x].exist && operation_type === 0 ){
            console.log("paint route=>");
            View.paint_route( coord.y, coord.x );
          }else if( operation_type === 0 ){
            if( View.selected_cell ){
              console.log(View.selected_cell);
              var before = View.selected_cell;
              View.selected_cell.obj.graphics.clear().beginFill('rgba(255,0,0,0.2)').drawRect(before.x*gridSize, before.y*gridSize, gridSize, gridSize);
            }
            console.log("cell selected =>");
            View.selected_cell = View.route_grid[coord.y][coord.x];
            $("#wait_time").val(View.selected_cell.obj.label.text);
            View.selected_cell.obj.graphics.clear().beginFill('rgba(0,0,255,0.2)').drawRect(coord.x*gridSize, coord.y*gridSize, gridSize, gridSize);
          }else if( operation_type === 2 ){
            if( View.route_top.y === coord.y && View.route_top.x === coord.x ){
              View.delete_route();
            }
          }
          break;
        case 'createPathMode':
          break;
      }
    },

  onmousemove: function(e) {
    if( Simulator.press_flag ){
      var rect = Simulator.canvas.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top,
          coord = View.point2coord(x, y),
          operation_type = e.button,
          object_type = $("input[name='draw_object']:checked").val(),
          draw_object = Simulator.field[coord.y][coord.x],
          target = Simulator.target;

      switch(Simulator.state.current){
        case 'init':
          if( target && ( Node.isServer(target.type) || target.type === 'user' ) && Simulator.operation_flag && draw_object.obj === undefined){
            target.obj.y = coord.y * gridSize;
            target.obj.x = coord.x * gridSize;
            target.obj.label.y = target.obj.y + gridSize/5|0;
            target.obj.label.x = target.obj.x + gridSize/2|0;
            target.x = coord.x;
            target.y = coord.y;
            Propagation.calc(coord.x, coord.y);
          }else if( draw_object.obj === undefined && !Node.isUser(object_type) && !Node.isServer(object_type) ){
            console.log("mousemove - objectCheck =>");
            Simulator.objectCheck( coord.x, coord.y, object_type, operation_type, draw_object);
          }else if( draw_object.obj !== undefined && operation_type === 2 ){
            Simulator.objectCheck( coord.x, coord.y, object_type, operation_type, draw_object);
          }
          break;
        case 'createRouteMode':
          if( !View.route_grid[coord.y][coord.x].exist && operation_type === 0 ){
            View.paint_route( coord.y, coord.x );
          }else if( operation_type === 2 ){
            if( View.route_top.y === coord.y && View.route_top.x === coord.x ){
              View.delete_route();
            }
          }
          break;
        case 'keepOutMode':
          var eid = +$("#user_eid").val();
        
          if( operation_type === 0 ){
            View.gridCleanUp( Simulator.click_point, Simulator.release_point, -1 );
            Simulator.release_point = { x: coord.x, y: coord.y };
            View.gridPaintOut( Simulator.click_point, Simulator.release_point, -1 );
          }else if( operation_type === 2 ){
            Simulator.release_point = { x: coord.x, y: coord.y };
            View.gridCleanUp( Simulator.click_point, Simulator.release_point, eid );
          }
          break;
      }
    }
  },
  
  onmouseup: function(e){
    var rect = Simulator.canvas.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top,
        coord = View.point2coord(x, y);

    Simulator.release_point = { x: coord.x, y: coord.y };
    console.log("onmouseup =>", ' y: ', coord.y, ' x: ', coord.x );
    switch(Simulator.state.current){
      case 'init':
        var target = Simulator.target;
        if( target && e.button !== 2 ){
          var coord = View.point2coord( target.obj.x, target.obj.y ),
              key, 
              eid;
          if( Node.isServer(target.type) ){
            Simulator.field[coord.y][coord.x] = target;
            key = Simulator.key_map[coord.y][coord.x];
            eid = target.obj.eid;
            Simulator.node_map[key][eid] = { x: coord.x, y: coord.y, obj: target.obj, type: target.type };
            Propagation.calc(coord.x, coord.y);
          }else if( target.type === 'user' ){
            var user = target.obj;
            key = Simulator.key_map[coord.y][coord.x];
            eid = user.eid;
            if( user.path[0].y !== coord.y || user.path[0].x !== coord.x ){
              user.path= [{ y: coord.y, x: coord.x, wait: 0 }];
            }
            Simulator.node_map[key][eid] = { x: coord.x, y: coord.y, obj: user, type: user.type };
            Propagation.calc(coord.x, coord.y);
          }
        }
        break;
      case 'keepOutMode':
        Simulator.setKeepOut( Simulator.click_point, Simulator.release_point, +$("#user_eid").val() );
        break;
    }

    Simulator.target = undefined;
    Simulator.operation_flag = false;
    Simulator.press_flag = false;
    Simulator.create_route_mode = false;
  },

  onmousewheel: function(e){
    var ngs;
    if( e.wheelDelta < 0 ){
      ngs = Math.max( 1, View.gridSize - 1);
    }else{
      ngs = Math.min( 100, View.gridSize + 1 );
    }
    $("#grid_size").val(ngs);
    if( Simulator.state.current !== 'run' ){
      Simulator.field_update();
    }
  },

  stage_update: function(){
    $("#canvas_field").empty();
    var obj_list = Config.field2obj_list();
    gridSize = +$("#grid_size").val();
    var width = +$("#field_width").val() * gridSize,
        height = +$("#field_height").val() * gridSize;
    console.log('width =>', width, 'height =>', height);
    var str = "<canvas id='canvas' width='" + width + "' height='" + height + "'></canvas>";
    $("#canvas_field").append(str);
    return obj_list;
  },

  field_update: function(){
    var obj_list = Simulator.stage_update();
    Simulator.clear(true);
    View.gridSize = gridSize;
    Simulator.getCanvasInfo();
    View.init();
    View.drawGrid()
    Propagation.init();
    Simulator.init();
    Init.addMouseEvent();
    $.each( obj_list, function( index, obj ) {
      switch(obj.type){
        case 'road':
          Street.create( obj.x, obj.y );
          break;
        case 'lake':
          Lake.create( obj.x, obj.y );
          break;
        case 'wall':
          Wall.create( obj.x, obj.y );
          break;
        case 'tree':
          Tree.create( obj.x, obj.y );
          break;
        default:
          Node.create( obj.x, obj.y, obj.opt );
          break;
      }
    });
  }
}
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
  per_frame: 360,

  init: function( config ){
    if( Simulator.replay ){
      $("#seed").val(Simulator.seed);
      console.log('simulator replay =>');
    }else{
      console.log('simulator init =>');
    }

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

    /*
    if( config === undefined && !Simulator.replay ){
      Node.create( 10, 10, 'start' );
      Node.create( 20, 10, 'end' );
    }
    */

    createjs.Ticker.setFPS(this.per_frame);
    createjs.Ticker.addEventListener("tick", this.handleTick);
    Simulator.map.update();
    console.log('seed value => ' + Simulator.seed);
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
      default:
      this.protocol_type = 'epidemic';
    }
  },

  clear: function( config ){
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
    Simulator.init( config );
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
      if( $("#animation").is(":checked") ) Simulator.map.update(); 
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
    /*
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
    */
    //$("span#time").html([hour, min, sec, mil].join(':'));
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
        Node.create( x, y, 'server' );
        break;
        case 'user':
        console.log("Node create:user =>");
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
        key = Simulator.key_map[y][x];
        if( Object.keys(Simulator.node_map[key]).length === 0 ){
          console.log("Node create:car =>");
          Node.create( x, y, 'car', { type: 'normal' });
        }
          //Car.create( x, y );
          break;
          case 'office':
          Office.create( x, y );
          case 'lake':
          Lake.create( x, y );
          default:
          break;
        }
      }else if(operation_type === 2 && draw_object.obj !== undefined){
        console.log("remove object =>");
        switch(object_type){
          case 'server':
          Node.remove( draw_object.obj );
          break;
          case 'user':
          Node.remove( draw_object.obj );
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
          case 'lake':
          Lake.remove( draw_object );
          break;
        }
      }else if(draw_object.obj !== undefined){
        switch(object_type){
          case 'car':
          console.log("Node create:user =>");
          key = Simulator.key_map[y][x];
          if( Object.keys(Simulator.node_map[key]).length === 0 ){
            Node.create( x, y, 'car', { type: 'normal' });
          }
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
        key = Simulator.key_map[coord.y][coord.x],
        node_num = Object.keys(Simulator.node_map[key]).length,
        node = Simulator.node_map[key],
        obj_data = node[Object.keys(node)[0]];

        if($("#create_route").is(":checked") && $("#user_eid").val().length !== 0 ){
          this.create_route_mode = true;
        }

        if( obj_data !== undefined ){
          if( Object.keys(obj_data.obj.path).length === 0 ){
            View.route_top = { y: coord.y, x: coord.x };
          }
          Panel.updateNodeData( obj_data.obj );
        }

        console.log("operation type => ", operation_type);

        if( !this.create_route_mode ){
          if( draw_object.obj ){
            Simulator.operation_flag = true;
            Simulator.target = draw_object;
            console.log( draw_object );

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
        }else if( this.create_route_mode ){
          if( !View.route_grid[coord.y][coord.x].exist && operation_type === 0 ){
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

        if( !this.create_route_mode ){
          if( Simulator.target && ( Node.isServer(Simulator.target.type) || Simulator.target.type === 'user' ) && Simulator.operation_flag && draw_object.obj === undefined){
          //console.log("server pos update =>");
          Simulator.target.obj.y = coord.y * gridSize;
          Simulator.target.obj.x = coord.x * gridSize;
          Simulator.target.obj.label.y = Simulator.target.obj.y;
          Simulator.target.obj.label.x = Simulator.target.obj.x;
          Simulator.target.x = coord.x;
          Simulator.target.y = coord.y;
          Propagation.calc(coord.x, coord.y);
          //View.update();
        }else if( draw_object.obj === undefined && object_type !== 'user' ){
          console.log("mousemove - objectCheck =>");
          Simulator.objectCheck( coord.x, coord.y, object_type, operation_type, draw_object);
        }
      }else{
        if( !View.route_grid[coord.y][coord.x].exist && operation_type === 0 ){
          View.paint_route( coord.y, coord.x );
        }else if( operation_type === 2 ){
          if( View.route_top.y === coord.y && View.route_top.x === coord.x ){
            View.delete_route();
          }
        }
      }
    }
  },
  
  onmouseup: function(e){
    console.log("onmouseup =>");
    if( !Simulator.create_route_mode ){
      if( Simulator.target && e.button !== 2 ){
        var coord = View.point2coord( Simulator.target.obj.x, Simulator.target.obj.y ),
        key, eid;
        if( Node.isServer(Simulator.target.type) ){
          Simulator.field[coord.y][coord.x] = Simulator.target;
          key = Simulator.key_map[coord.y][coord.x];
          eid = Simulator.target.obj.eid;
          Simulator.node_map[key][eid] = { x: coord.x, y: coord.y, obj: Simulator.target.obj, type: 'server' };
          Propagation.calc(coord.x, coord.y);
          //View.update();
        }else if( Simulator.target.type === 'user' ){
          key = Simulator.key_map[coord.y][coord.x];
          eid = Simulator.target.obj.eid;
          Simulator.node_map[key][eid] = { x: coord.x, y: coord.y, obj: Simulator.target.obj, type: 'user' };
          Propagation.calc(coord.x, coord.y);
        }
      }
    }else{

    }
      Simulator.target = undefined;
      Simulator.operation_flag = false;
      Simulator.press_flag = false;
      Simulator.create_route_mode = false;
  },
}
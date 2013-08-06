var MoveModel = {

  /*
   * ランダムウェイポイントの実装。
   * 1. ランダムな座標を指定する
   * 2. その座標に向かって移動する
   * 3. 移動が完了したらまた新たな座標を決定する。
   */
  randomWayPoint: function(human){
    console.log(human.state.current)

  	human.way_point = human.way_point || this.directWayPoint();

    this.moveToWayPoint(human, 5);
    if(this.checkArrive(human)) human.way_point = null;
  },

  sampleMove: function(human){
    if(human.state.current == 'move'){
      human.way_point = human.way_point || this.directWayPoint();
      this.moveToWayPoint(human, 5);
      if(this.checkArrive(human)){
        human.way_point = null;
        human.state.rest();
        human.stop_count = this.createStopCount();
      }
    }else{
      human.stop_count -= 1;
      if(human.stop_count == 0) human.state.walk();
    }
  },

  directWayPoint: function(){
    var x = Math.random() * Simulator.canvas_width * 1.1;
    var y = Math.random() * Simulator.canvas_height * 1.1;
    return {x: x, y: y};
  },

  /*
   * WayPointに向かって進む処理
   */
  moveToWayPoint: function(human, speed){
    var dx = human.way_point.x - human.x;
    var dy = human.way_point.y - human.y;
    var radian = Math.atan2(dy, dx);

    human.x += Math.cos(radian) * speed;
    human.y += Math.sin(radian) * speed;
  },

  checkArrive: function(human){
    var dx = human.x - human.way_point.x;
    var dy = human.y - human.way_point.y;
    return ( dx * dx + dy * dy <= 16 )? true : false;
  },

  createStopCount: function(){
    var minimum_stop = 20;
    return 20 + Math.random() * 100 | 0;
  }
};
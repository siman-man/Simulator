var MoveModel = {

  /*
   * ランダムウェイポイントの実装。
   * 1. ランダムな座標を指定する
   * 2. その座標に向かって移動する
   * 3. 移動が完了したらまた新たな座標を決定する。
   */
  randomWayPoint: function(user){
    console.log(user.state.current)

  	user.way_point = user.way_point || this.directWayPoint();

    this.moveToWayPoint(user, 5);
    if(this.checkArrive(user)) user.way_point = null;
  },

  sampleMove: function(user){
    if(user.state.current == 'move'){
      user.way_point = user.way_point || this.directWayPoint();
      this.moveToWayPoint(user, 5);
      if(this.checkArrive(user)){
        user.way_point = null;
        user.state.rest(user);
        console.log(user.state.current);
        user.stop_count = this.createStopCount();
      }
    }else{
      user.stop_count -= 1;
      if(user.stop_count == 0) user.state.walk();
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
  moveToWayPoint: function(user, speed){
    var dx = user.way_point.x - user.x;
    var dy = user.way_point.y - user.y;
    var radian = Math.atan2(dy, dx);

    user.x += Math.cos(radian) * speed;
    user.y += Math.sin(radian) * speed;
  },

  checkArrive: function(user){
    var dx = user.x - user.way_point.x;
    var dy = user.y - user.way_point.y;
    return ( dx * dx + dy * dy <= 16 )? true : false;
  },

  createStopCount: function(){
    var minimum_stop = 20;
    return 20 + Math.random() * 100 | 0;
  }
};
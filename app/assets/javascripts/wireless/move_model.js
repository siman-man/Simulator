var MoveModel = {
  randomWayPoint: function(human){
  	human.way_point = human.way_point || this.directWayPoint();

    this.moveToWayPoint(human, 5);
    if(this.checkArrive(human)) human.way_point = null;
  },

  directWayPoint: function(){
  	var x = Math.random() * Wireless.canvas_width * 0.7;
  	var y = Math.random() * Wireless.canvas_height * 0.7;
  	return {x: x, y: y};
  },

  checkArrive: function(human){
  	var dx = human.x - human.way_point.x;
  	var dy = human.y - human.way_point.y;
  	return ( dx * dx + dy * dy <= 16 )? true : false;
  },

  moveToWayPoint: function(human, speed){
  	var dx = human.way_point.x - human.x;
  	var dy = human.way_point.y - human.y;
  	var radian = Math.atan2(dy, dx);

  	human.x += Math.cos(radian) * speed;
  	human.y += Math.sin(radian) * speed;
  },
};
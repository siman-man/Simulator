var canvas = document.getElementById('canvas');
var canvas_width = window.innerWidth;
var canvas_height = window.innerHeight;
var simulator = new createjs.Stage(canvas); 
simulator.node_list = [];

function initialize(){   
  //Add Shape instance to stage display list.
  create_node(50, 50);
  create_node(300, 40);
  create_node(500, 30);
  create_node(500, 300);
  create_node(400, 400);
  
  //Update stage will render next frame
  
  //Update stage will render next frame
  createjs.Ticker.setFPS(30);
  createjs.Ticker.addEventListener("tick", handleTick);
}

function handleTick() {
  node_update();
  simulator.update();
}

function create_node(x, y, color_opt){
  var color = color_opt || "black";
  var node = new createjs.Shape();
  node.id = simulator.node_list.length;
  node.graphics.beginFill(color).drawCircle(0, 0, 15);
  node.drag = false;
  node.onPress = mousePressHandler;
  node.x = x; node.y = y;
  node.neighbor_node_list = {};
  node.edge_list = {};
  simulator.addChild(node);
  
  // 順番が逆になると自分が隣接ノードに登録されてしまう。
  add_neighbor_node(node);
  add_node(node);
  
  simulator.node_list[node.id] = node;
   
  return node;
}

// 全体のnode_listに格納されているnodeのneighborに新しいnodeを追加する
function add_node(node){
  for(id in simulator.node_list){
    simulator.node_list[id].neighbor_node_list[node.id] = node;
    var line = new createjs.Shape();
    simulator.node_list[id].edge_list[node.id] = line;
    simulator.addChild(line);
  }
}

// nodeのneighborをnode_listから取得して追加を行う
function add_neighbor_node(node){
  for(id in simulator.node_list){
    node.neighbor_node_list[id] = simulator.node_list[id];
    var line = new createjs.Shape();
    node.edge_list[id] = line;
    simulator.addChild(line);
  }
}

function checkConnectionNeighbor(my, neighbor){
  var dist = calcDistance(my.x, my.y, neighbor.x, neighbor.y);
  if(dist < 400){
    return true; 
  }else{
    return false;
  }
}

function update(node){
  for(id in node.neighbor_node_list){
    var neighbor = node.neighbor_node_list[id];
    if(checkConnectionNeighbor(node, neighbor)){
      draw_edge(node, neighbor)
    }else{
      clear_edge(node, neighbor)
    }
  }
}

function draw_edge(node, neighbor, color_opt){
  var line = node.edge_list[neighbor.id].graphics;
  line.clear();
  var color = color_opt || "green";
  line.beginStroke(color);
  line.moveTo(node.x, node.y);
  line.lineTo(neighbor.x, neighbor.y);
}

function clear_edge(node, neighbor){
  var line = node.edge_list[neighbor.id].graphics;
  line.clear();
}

function node_update(){
  for(id in simulator.node_list){
    update(simulator.node_list[id]);
  }  
}

function calcDistance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

function mousePressHandler(e) {
  var node = e.target;
  node.drag = true;
  node.offsetX = node.x - e.stageX;
  node.offsetY = node.y - e.stageY; 
  
  e.onMouseMove = mouseMoveHandler;
  e.onMouseUp = mouseUpHandler;
  console.log(this.x);
}


function mouseMoveHandler(e){
  var node = e.target;
  console.log(e.stageX);
  console.log(node.id);

  node.x = e.stageX + node.offsetX;
  node.y = e.stageY + node.offsetY;
}

function mouseUpHandler(e){
  var node = e.target;
  node.drag = false;
  console.log("Mouseup");
}

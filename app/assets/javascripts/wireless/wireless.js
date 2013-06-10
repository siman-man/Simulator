var canvas = document.getElementById('canvas');
var canvas_width = window.innerWidth;
var canvas_height = window.innerHeight;
var simulator = new createjs.Stage(canvas); 
var node_size = 12;
var error_rssi = -150;
var node_speed = 5;
simulator.node_list = [];
simulator.selected_target = -1;

function initialize(){   
  //Add Shape instance to stage display list.
  create_node(150, 150);
  create_node(250, 150);

  //Update stage will render next frame

  //Update stage will render next frame
  createjs.Ticker.setFPS(30);
  createjs.Ticker.addEventListener("tick", handleTick);
}

function handleTick() {
  node_update();
  simulator.update();
}

function createCommunicationRangeCircle(x, y, color_opt, size_opt){
  var range = new createjs.Shape();
  var color = color_opt || "blue";
  var size  = size_opt || "180";
  range.x = x;
  range.y = y;
  range.alpha = 0.05;
  range.graphics.beginFill(color).drawCircle(0, 0, size);
  return range;
}

// ノード作成＆情報の初期化
function create_node(x, y, color_opt){
  var color = color_opt || "black";
  var node = new createjs.Shape();
  node.id = simulator.node_list.length;
  node.color = color;
  node.graphics.beginFill(node.color).drawCircle(0, 0, 12);
  node.drag = false;
  node.onPress = mousePressHandler;
  node.x = x; node.y = y;
  node.tx_power = 0.280;
  var size = calcRnageSize(node);
  node.communication_range = createCommunicationRangeCircle(x, y, "blue", size);
  simulator.addChild(node.communication_range);
  node.neighbor_node_list = {};
  node.neighbor_rssi_list = {};
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
    line.color = "green";
    line.text = new createjs.Text("test", "14px Arial", "#ff7700");
    line.text.x = (simulator.node_list[id].x + node.x) * 0.5;
    line.text.y = (simulator.node_list[id].y + node.y) * 0.5;
    line.textAlign = "left";
    line.text.textBaseLine = "middle";
    simulator.addChild(line.text);
    simulator.node_list[id].edge_list[node.id] = line;
    simulator.addChild(line);
  }
}

// nodeのneighborをnode_listから取得して追加を行う
function add_neighbor_node(node){
  for(id in simulator.node_list){
    node.neighbor_node_list[id] = simulator.node_list[id];
    var line = new createjs.Shape();
    line.text = new createjs.Text("", "14px Arial", "#ff7700");
    line.textAlign = "left";
    line.text.x = (simulator.node_list[id].x + node.x) * 0.5;
    line.text.y = (simulator.node_list[id].y + node.y) * 0.5;
    line.text.textBaseLine = "middle";
    simulator.addChild(line.text);
    node.edge_list[id] = line;
    simulator.addChild(line);
  }
}

function checkConnectionNeighbor(my, neighbor){
  var dist = calcDistance(my.x, my.y, neighbor.x, neighbor.y);
  var rssi1 = calcRssiTwoRay(my, dist);       // 自分から相手に届くRSSIの値
  //var rssi2 = calcRssiTwoRay(neighbor, dist); // 相手から自分に届くRSSIの値
  var rssi2 = neighbor.neighbor_rssi_list[my.id];
  
  if(rssi1 >= -90){
    my.neighbor_rssi_list[neighbor.id] = rssi1;
  }else{
    my.neighbor_rssi_list[neighbor.id] = error_rssi;  // 取得出来なかった際の値
  }
  
  // 選択したノード周辺のdBmを閲覧できるようにする。
  if(my.id == simulator.selected_target){
    my.edge_list[neighbor.id].text.text = rssi1 + "dBm";
  }else{
    my.edge_list[neighbor.id].text.text = "";
  }
  if(rssi1 >= -65 && rssi2 >= -65 ){
    my.edge_list[neighbor.id].color = "green";
    return true; 
  }else if(rssi1 >= -80 && rssi2 >= -80){
    my.edge_list[neighbor.id].color = "yellow";
    return true;
  }else if(rssi1 >= -90 && rssi2 >= -90){
    my.edge_list[neighbor.id].color = "red";
    return true;
  }else{
    return false;
  }
}

function modeChange(){
  if($("#auto_move").attr("checked")){
    $("#auto_move").attr("checked", false)
  }else{
    $("#auto_move").attr("checked", true)
  }
}

function update(node){
  for(id in node.neighbor_node_list){
    var neighbor = node.neighbor_node_list[id];
    if(checkConnectionNeighbor(node, neighbor)){
      draw_edge(node, neighbor, node.edge_list[neighbor.id].color)
    }else{
      clear_edge(node, neighbor)
    }
  }
  if( $("#auto_move").attr("checked") ){
    move_node(node);
  }
  draw_nodes();
  console.log($("input#auto_move").attr("checked"));
}

function updateNavBar(){
  $('span#tx_power').text($('#master').slider('value') + 'mW');
}

function draw_nodes(){
  var node;
  var target_num = simulator.selected_target;

  for(id in simulator.node_list){
    if(target_num == id){
      node = simulator.node_list[id];
      node.graphics.clear();
      node.graphics.beginFill("red").drawCircle(0, 0, node_size);
    }else{
      node = simulator.node_list[id];
      node.graphics.clear();
      node.graphics.beginFill(node.color).drawCircle(0, 0, node_size);
    }
  }
}


function remove_node(){
  if( simulator.selected_target != -1){
    var node = simulator.node_list[simulator.selected_target];
    remove_neighbor_node(simulator.selected_target);
    delete simulator.node_list[simulator.selected_target];
    simulator.removeChild(node.communication_range);
    simulator.removeChild(node);
    simulator.selected_target = -1;
  }
}

function remove_neighbor_node(remove_id){
  console.log(remove_id)
    for(id in simulator.node_list){
      if(id != remove_id){
        simulator.removeChild(simulator.node_list[remove_id].edge_list[id].text);
        simulator.removeChild(simulator.node_list[remove_id].edge_list[id]);
        simulator.removeChild(simulator.node_list[id].edge_list[remove_id].text);
        simulator.removeChild(simulator.node_list[id].edge_list[remove_id]);
        delete simulator.node_list[id].edge_list[remove_id];
        delete simulator.node_list[remove_id].edge_list[id];
        delete simulator.node_list[id].neighbor_node_list[remove_id];
      }
    }
}

function draw_edge(node, neighbor, color_opt){
  var line = node.edge_list[neighbor.id].graphics;
  line.clear();
  var text = node.edge_list[neighbor.id].text;
  text.x = (simulator.node_list[neighbor.id].x + node.x) * 0.5 - 10;
  text.y = (simulator.node_list[neighbor.id].y + node.y) * 0.5;
  var color = color_opt || "green";
  line.beginStroke(color);
  line.moveTo(node.x, node.y);
  line.lineTo(neighbor.x, neighbor.y);
}

function clear_edge(node, neighbor){
  var line = node.edge_list[neighbor.id].graphics;
  line.clear();
  node.edge_list[neighbor.id].text.text = "";
}

function clearCircle(node){
  var range = node.communication_range.graphics;
  range.clear();
}

function node_update(){
  for(id in simulator.node_list){
    update(simulator.node_list[id]);
  }  
}

function calcDistance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

// FreeSpaceモデル
function calcRssiFreeSpace(node, d){
  var Pt = 0.281; // ノード構成時に指定した物理層による(WirelessPhyならば初期値0.281)
  var Gt = 1.0;   // 送信アンテナのゲイン
  var Gr = 1.0;   // 受信アンテナのゲイン
  var lambda = 300/2485.0; // 波長
  var L = 1.0; // システムロス

  var Pr = (Pt*Gt*Gr*Math.pow(lambda, 2))/(Math.pow(4*Math.PI, 2.0)*Math.pow(d, 2.0)*L);
  var rssi = 10 * log10(Pr/0.001) * 100;
  return Math.round(rssi)/100;
}


// Tow-Rayモデル
function calcRssiTwoRay(node, d){
  var Pt = node.tx_power;
  var Gt = 1.0;   // 送信アンテナのゲイン
  var Gr = 1.0;   // 受信アンテナのゲイン
  var ht = 1.0;   // 送信アンテナの地面からの高さ
  var hr = 1.0;   // 受信アンテナの地面からの高さ
  var L = 1.0;    // システムロス

  var Pr = (Pt*Gt*Gr*(ht*ht)*(hr*hr))/Math.pow(d, 4)*L;
  var rssi = 10 * log10(Pr/0.001) * 100;
  return Math.round(rssi)/100;
}

function calcRnageSize(node){
  var Pt = node.tx_power;
  var Gt = 1.0;
  var Gr = 1.0;
  var ht = 1.0;
  var hr = 1.0;
  var L = 1.0;
  
  var Pr = 3.162277660168379e-10; // -65dBmを指定
  //var Pr = 1e-12;
  var d = Math.sqrt(Math.sqrt((Pt*Gt*Gr*(ht*ht)*(hr*hr))/(Pr*L)));
  return d;
}

function log10(x){
  return(Math.log(x) / Math.log(10));
}

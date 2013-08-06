var Wireless = {
  node_size: 12,
  error_rssi: -150,
  node_speed: 5,

  onmousedown: function(e) {
    var WS = Simulator;
    console.log(WS.operation_flag)
    if(!WS.operation_flag){
      var x = e.clientX - canvas.offsetLeft;
      var y = e.clientY - canvas.offsetTop;

      var draw_type = $("input[name='draw_object']:checked").val();
      if(draw_type == 'access_point'){
        Wireless.create_node(x, y);
      }else if(draw_type == 'human'){
        Human.create_human(x, y);
      }
      console.log(draw_type);
    }
    WS.operation_flag = false;
  },

  createCommunicationRangeCircle: function(x, y, color_opt, size_opt){
    var range = new createjs.Shape();
    var color = color_opt || "blue";
    var size  = size_opt || "180";
    range.x = x;
    range.y = y;
    range.alpha = 0.05;
    range.graphics.beginFill(color).drawCircle(0, 0, size);
    return range;
  },

  // ノード作成＆情報の初期化
  create_node: function(x, y, color_opt){
    var WS = Simulator;
    var color = color_opt || "black";
    var node = new createjs.Shape();
    node.ob_type = "access_point"
    node.id = WS.server_list.length;
    node.color = color;
    node.graphics.beginFill(node.color).drawCircle(0, 0, 12);
    node.drag = false;
    node.onPress = Library.mousePressHandler;
    node.x = x; node.y = y;
    node.tx_power = 0.280;
    var size = this.calcRnageSize(node);
    node.communication_range = this.createCommunicationRangeCircle(x, y, "blue", size);
    WS.map.addChild(node.communication_range);
    node.neighbor_server_list = {};
    node.neighbor_rssi_list = {};
    node.edge_list = {};
    WS.map.addChild(node);

    // 順番が逆になると自分が隣接ノードに登録されてしまう。
    this.add_neighbor_node(node);
    this.add_node(node);

    WS.server_list[node.id] = node;

    return node;
  },

// 全体のserver_listに格納されているnodeのneighborに新しいnodeを追加する
add_node: function(node){
  var WS = Simulator;
  for(id in WS.server_list){
    WS.server_list[id].neighbor_server_list[node.id] = node;
    var line = new createjs.Shape();
    line.color = "green";
    line.text = new createjs.Text("test", "14px Arial", "#ff7700");
    line.text.x = (WS.server_list[id].x + node.x) * 0.5;
    line.text.y = (WS.server_list[id].y + node.y) * 0.5;
    line.textAlign = "left";
    line.text.textBaseLine = "middle";
    WS.map.addChild(line.text);
    WS.server_list[id].edge_list[node.id] = line;
    WS.map.addChild(line);
  }
},

// nodeのneighborをserver_listから取得して追加を行う
add_neighbor_node: function(node){
  var WS = Simulator;
  for(id in WS.server_list){
    node.neighbor_server_list[id] = WS.server_list[id];
    var line = new createjs.Shape();
    line.text = new createjs.Text("", "14px Arial", "#ff7700");
    line.textAlign = "left";
    line.text.x = (WS.server_list[id].x + node.x) * 0.5;
    line.text.y = (WS.server_list[id].y + node.y) * 0.5;
    line.text.textBaseLine = "middle";
    WS.map.addChild(line.text);
    node.edge_list[id] = line;
    WS.map.addChild(line);
  }
},

checkConnectionNeighbor: function(my, neighbor){
  var WS = Simulator;
  var dist = this.calcDistance(my.x, my.y, neighbor.x, neighbor.y);
  var rssi1 = this.calcRssiTwoRay(my, dist);       // 自分から相手に届くRSSIの値
  //var rssi2 = calcRssiTwoRay(neighbor, dist); // 相手から自分に届くRSSIの値
  var rssi2 = neighbor.neighbor_rssi_list[my.id];
  
  if(rssi1 >= -90){
    my.neighbor_rssi_list[neighbor.id] = rssi1;
  }else{
    my.neighbor_rssi_list[neighbor.id] = this.error_rssi;  // 取得出来なかった際の値
  }
  
  // 選択したノード周辺のdBmを閲覧できるようにする。
  if(my.id == WS.selected_target){
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
},

modeChange: function(){
  if($("#auto_move").attr("checked")){
    $("#auto_move").attr("checked", false)
  }else{
    $("#auto_move").attr("checked", true)
  }
},

update: function(node){
  var WS = Simulator;
  for(id in node.neighbor_server_list){
    var neighbor = node.neighbor_server_list[id];
    if(this.checkConnectionNeighbor(node, neighbor)){
      this.draw_edge(node, neighbor, node.edge_list[neighbor.id].color)
    }else{
      this.clear_edge(node, neighbor)
    }
  }
  if( $("#auto_move").attr("checked") ){
    Move.move_node(node);
  }
  this.draw_nodes();
},

updateNavBar: function(){
  $('span#tx_power').text($('#master').slider('value') + 'mW');
},

draw_nodes: function(){
  var node;
  var WS = Simulator;
  var target_num = WS.selected_target;

  for(id in WS.server_list){
    if(target_num == id){
      node = WS.server_list[id];
      node.graphics.clear();
      node.graphics.beginFill("red").drawCircle(0, 0, this.node_size);
    }else{
      node = WS.server_list[id];
      node.graphics.clear();
      node.graphics.beginFill(node.color).drawCircle(0, 0, this.node_size);
    }
  }
},


remove_node: function(){
  var WS = Simulator;

  if( WS.selected_target != -1){
    var node = WS.server_list[WS.selected_target];
    this.remove_neighbor_node(WS.selected_target);
    delete WS.server_list[WS.selected_target];
    WS.removeChild(node.communication_range);
    WS.removeChild(node);
    WS.selected_target = -1;
  }
},

remove_neighbor_node: function(remove_id){
  var WS = Simulator;
  console.log(remove_id)

  for(id in WS.server_list){
    if(id != remove_id){
      WS.removeChild(WS.server_list[remove_id].edge_list[id].text);
      WS.removeChild(WS.server_list[remove_id].edge_list[id]);
      WS.removeChild(WS.server_list[id].edge_list[remove_id].text);
      WS.removeChild(WS.server_list[id].edge_list[remove_id]);
      delete WS.server_list[id].edge_list[remove_id];
      delete WS.server_list[remove_id].edge_list[id];
      delete WS.server_list[id].neighbor_server_list[remove_id];
    }
  }
},

draw_edge: function(node, neighbor, color_opt){
  var WS = Simulator;
  var line = node.edge_list[neighbor.id].graphics;
  line.clear();
  var text = node.edge_list[neighbor.id].text;
  text.x = (WS.server_list[neighbor.id].x + node.x) * 0.5 - 10;
  text.y = (WS.server_list[neighbor.id].y + node.y) * 0.5;
  var color = color_opt || "green";
  line.beginStroke(color);
  line.moveTo(node.x, node.y);
  line.lineTo(neighbor.x, neighbor.y);
},

clear_edge: function(node, neighbor){
  var line = node.edge_list[neighbor.id].graphics;
  line.clear();
  node.edge_list[neighbor.id].text.text = "";
},

clearCircle: function(node){
  var range = node.communication_range.graphics;
  range.clear();
},

node_update: function(){
  var WS = Simulator;
  for(id in WS.server_list){
    this.update(WS.server_list[id]);
  }  
},

calcDistance: function(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
},

// FreeSpaceモデル
calcRssiFreeSpace: function(node, d){
  var Pt = 0.281; // ノード構成時に指定した物理層による(WirelessPhyならば初期値0.281)
  var Gt = 1.0;   // 送信アンテナのゲイン
  var Gr = 1.0;   // 受信アンテナのゲイン
  var lambda = 300/2485.0; // 波長
  var L = 1.0; // システムロス

  var Pr = (Pt*Gt*Gr*Math.pow(lambda, 2))/(Math.pow(4*Math.PI, 2.0)*Math.pow(d, 2.0)*L);
  var rssi = 10 * log10(Pr/0.001) * 100;
  return Math.round(rssi)/100;
},


// Tow-Rayモデル
calcRssiTwoRay: function(node, d){
  var Pt = node.tx_power;
  var Gt = 1.0;   // 送信アンテナのゲイン
  var Gr = 1.0;   // 受信アンテナのゲイン
  var ht = 1.0;   // 送信アンテナの地面からの高さ
  var hr = 1.0;   // 受信アンテナの地面からの高さ
  var L = 1.0;    // システムロス

  var Pr = (Pt*Gt*Gr*(ht*ht)*(hr*hr))/Math.pow(d, 4)*L;
  var rssi = 10 * this.log10(Pr/0.001) * 100;
  return Math.round(rssi)/100;
},

  calcRnageSize: function(node){
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
  },

  log10: function(x){
    return(Math.log(x) / Math.log(10));
  }
};

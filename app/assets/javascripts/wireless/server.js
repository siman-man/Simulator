var Server = {
  node_size: 12,
  error_rssi: -150,
  node_speed: 5,

  createCommunicationRangeCircle: function(x, y, color_opt, size_opt){
    var range = new createjs.Shape();
    var color = color_opt || "blue";
    var size  = size_opt || "180";
    range.x = x;
    range.y = y;
    range.alpha = 0.05;
    range.graphics.beginFill(color).drawCircle(0, 0, size);
    Simulator.map.addChild(range);

    return range;
  },

  create: function(x, y){
    var WS = Simulator;
    var server = new createjs.Bitmap('/assets/server.jpeg');
    server.ob_type = "access_point"
    server.id = WS.server_id;
    WS.server_id++;

    server.drag = false;
    server.onPress = Library.mousePressHandler;
    var coord = View.point2coord(x, y);
    server.x = coord.x * View.gridSpan; server.y = coord.y * View.gridSpan;
    server.tx_power = 0.280;
    var size = this.calcRnageSize(server);
    server.communication_range = this.createCommunicationRangeCircle(server.x, server.y, "blue", size);
    server.neighbor_server_list = {};
    server.neighbor_rssi_list = {};
    server.edge_list = {};
    server.article_list = {};
    server.article_count = 0;
    WS.map.addChild(server);

    server.status = ServerStatus.init();

    // 順番が逆になると自分が隣接ノードに登録されてしまう。
    this.addNeighborServer(server);
    this.addServer(server);

    WS.server_list[server.id] = server;

    return server;
  },

  recievePacket: function(packet){
    var server = Simulator.server_list[packet.dest.id];
    var article = packet.data;

    server.article_list[article.id] = article;
    server.article_count++;

    console.log(server.article_count);
  },

  addServer: function(node){
    var WS = Simulator;
    for(id in WS.server_list){
      WS.server_list[id].neighbor_server_list[node.id] = node;
      var line = new createjs.Shape();
      line.color = "green";
      line.text = new createjs.Text("", "14px Arial", "#ff7700");
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
  addNeighborServer: function(node){
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
  
    my.neighbor_rssi_list[neighbor.id] = (rssi1 >= -90)? rssi1 : this.error_rssi;
  
    // 選択したノード周辺のdBmを閲覧できるようにする。
    my.edge_list[neighbor.id].text.text = (my.id == WS.selected_target)? rssi1 + "dBm" : "";
  
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
      var s1 = node.status.current;
      var s2 = neighbor.status.current;
      if(false && this.checkConnectionNeighbor(node, neighbor) && s1 == 'active' && s2 == 'active'){
        this.draw_edge(node, neighbor, node.edge_list[neighbor.id].color)
      }else{
        this.clear_edge(node, neighbor)
      }
    }
    if( $("#auto_move").attr("checked") ){
      Move.move_node(node);
    }
    this.drawNodes();
  },

  updateNavBar: function(){
    $('span#tx_power').text($('#master').slider('value') + 'mW');
  },

  drawNodes: function(){
    var node;
    var WS = Simulator;
    var target_num = WS.selected_target;

    for(id in WS.server_list){
      if(target_num == id){
        node = WS.server_list[id];
        node.communication_range.graphics.clear();
        if(node.status.current == 'active'){
          node.communication_range = this.createCommunicationRangeCircle(node.x, node.y, "blue", 180);
        }
      }else{
        node = WS.server_list[id];
      }
    }
  },

  remove_node: function(){
    var WS = Simulator;

    if( WS.selected_target != -1){
      var node = WS.server_list[WS.selected_target];
      this.remove_neighbor_node(WS.selected_target);
      delete WS.server_list[WS.selected_target];
      WS.map.removeChild(node.communication_range);
      WS.map.removeChild(node);
      WS.selected_target = -1;
    }
  },

  remove_neighbor_node: function(remove_id){
    var WS = Simulator;
    console.log(remove_id)

    for(id in WS.server_list){
      if(id != remove_id){
        WS.map.removeChild(WS.server_list[remove_id].edge_list[id].text);
        WS.map.removeChild(WS.server_list[remove_id].edge_list[id]);
        WS.map.removeChild(WS.server_list[id].edge_list[remove_id].text);
        WS.map.removeChild(WS.server_list[id].edge_list[remove_id]);
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

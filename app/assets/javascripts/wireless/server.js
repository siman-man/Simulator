var Server = {
  error_rssi: -150,
  server_id: 0,
  server_list: {},

  createCommunicationRangeCircle: function(x, y, color_opt, size_opt){
    var range = new createjs.Shape(),
        color = color_opt || "blue",
        size  = size_opt || "180";

    range.x = x;
    range.y = y;
    range.alpha = 0.05;
    range.graphics.beginFill(color).drawCircle(0, 0, size);
    Simulator.map.addChild(range);

    return range;
  },

  clear: function(){
    var i, server;
    
    for( i in this.server_list ){
      server = this.server_list[i];
      this.remove(server);
    }
    this.server_id = 0;
    this.server_list = {};
  },

  create: function(x, y){
    var server = new createjs.Bitmap('/assets/server.jpeg');
    server.ob_type = "access_point"
    server.id = this.server_id;
    this.server_id++;

    server.drag = false;
    server.onPress = Library.mousePressHandler;

    server.x = x * View.gridSpan; server.y = y * View.gridSpan;
    server.tx_power = 0.280;

    server.neighbor_list = {};
    server.neighbor_rssi_list = {};
    server.edge_list = {};
    server.article_list = {};
    server.article_count = 0;
    Simulator.map.addChild(server);

    server.status = ServerStatus.init();

    // 順番が逆になると自分が隣接ノードに登録されてしまう。
    this.addNeighborServer(server);
    this.addServer(server);

    this.server_list[server.id] = server;
    Simulator.field[y][x] = { x: x, y: y, obj: server, type: 'server', cost: 9999, pf: 2 };
    View.animation(Propagation.calc(x, y));

    return server;
  },

  recievePacket: function(packet){
    var server = Server.server_list[packet.dest.id],
        article = packet.data;

    server.article_list[article.id] = article;
    server.article_count++;
    //Log.create(Simulator.getTime(), packet.from.id, "server"+packet.dest.id, "POST", packet.size)
  },

  addServer: function(node){
    var id, line;
    for( id in this.server_list ){
      this.server_list[id].neighbor_list[node.id] = node;
      line = new createjs.Shape();
      line.color = "green";
      line.text = new createjs.Text("", "14px Arial", "#ff7700");
      line.text.x = (this.server_list[id].x + node.x) * 0.5;
      line.text.y = (this.server_list[id].y + node.y) * 0.5;
      line.textAlign = "left";
      line.text.textBaseLine = "middle";
      Simulator.map.addChild(line.text);
      this.server_list[id].edge_list[node.id] = line;
      Simulator.map.addChild(line);
    }
  },

  addNeighborServer: function(node){
    var id, line;

    for( id in this.server_list ){
      node.neighbor_list[id] = this.server_list[id];
      line = new createjs.Shape();
      line.text = new createjs.Text("", "14px Arial", "#ff7700");
      line.textAlign = "left";
      line.text.x = (this.server_list[id].x + node.x) * 0.5;
      line.text.y = (this.server_list[id].y + node.y) * 0.5;
      line.text.textBaseLine = "middle";
      Simulator.map.addChild(line.text);
      node.edge_list[id] = line;
      Simulator.map.addChild(line);
    }
  },

  checkConnectionNeighbor: function(my, neighbor){
    var dist = this.calcDistance(my.x, my.y, neighbor.x, neighbor.y),
        rssi1 = this.calcRssiTwoRay(my, dist),       // 自分から相手に届くRSSIの値
        rssi2 = neighbor.neighbor_rssi_list[my.id];
  
    my.neighbor_rssi_list[neighbor.id] = (rssi1 >= -90)? rssi1 : this.error_rssi;
  
    // 選択したノード周辺のdBmを閲覧できるようにする。
    my.edge_list[neighbor.id].text.text = (my.id == Simulator.selected_target)? rssi1 + "dBm" : "";
  
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

  update: function(node){
    var id1, id2, node, neighbor, s1, s2;

    for( id1 in this.server_list ){
      node = this.server_list[id1];
  
      for( id2 in node.neighbor_list ){
        neighbor = node.neighbor_list[id2];
        s1 = node.status.current;
        s2 = neighbor.status.current;
        if(false && this.checkConnectionNeighbor(node, neighbor) && s1 == 'active' && s2 == 'active'){
          this.draw_edge(node, neighbor, node.edge_list[neighbor.id].color)
        }else{
          this.clear_edge(node, neighbor)
        }
      }
    }
  },

  remove: function(server){
    console.log("remove server =>");
    var coord = View.point2coord(server.x, server.y);
    
    this.removeNeighborNode(server.id);
    delete this.server_list[server.id];
    delete Simulator.field[coord.y][coord.x];
    Simulator.map.removeChild(server);
  },

  removeNeighborNode: function(remove_id){
    var id;

    for( id in this.server_list ){
      if(id != remove_id){
        Simulator.map.removeChild(this.server_list[remove_id].edge_list[id].text);
        Simulator.map.removeChild(this.server_list[remove_id].edge_list[id]);
        Simulator.map.removeChild(this.server_list[id].edge_list[remove_id].text);
        Simulator.map.removeChild(this.server_list[id].edge_list[remove_id]);
        delete this.server_list[id].edge_list[remove_id];
        delete this.server_list[remove_id].edge_list[id];
        delete this.server_list[id].neighbor_list[remove_id];
      }
    }
  },

  draw_edge: function(node, neighbor, color_opt){
    var line = node.edge_list[neighbor.id].graphics,
        text = node.edge_list[neighbor.id].text,
        color = color_opt || "green";

    line.clear();
    text.x = (this.server_list[neighbor.id].x + node.x) * 0.5 - 10;
    text.y = (this.server_list[neighbor.id].y + node.y) * 0.5;
    line.beginStroke(color);
    line.moveTo(node.x, node.y);
    line.lineTo(neighbor.x, neighbor.y);
  },

  clear_edge: function(node, neighbor){
    var line = node.edge_list[neighbor.id].graphics;

    line.clear();
    node.edge_list[neighbor.id].text.text = "";
  },

  calcDistance: function(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
  },

  // FreeSpaceモデル
  calcRssiFreeSpace: function(node, d){
    var Pt = 0.281,          // ノード構成時に指定した物理層による(WirelessPhyならば初期値0.281)
        Gt = 1.0,            // 送信アンテナのゲイン
        Gr = 1.0,            // 受信アンテナのゲイン
        lambda = 300/2485.0, // 波長
        L = 1.0,             // システムロス
        Pr = (Pt*Gt*Gr*Math.pow(lambda, 2))/(Math.pow(4*Math.PI, 2.0)*Math.pow(d, 2.0)*L),
        rssi = 10 * log10(Pr/0.001) * 100;

    return Math.round(rssi)/100;
  },


  // Tow-Rayモデル
  calcRssiTwoRay: function(node, d){
    var Pt = node.tx_power,
        Gt = 1.0,   // 送信アンテナのゲイン
        Gr = 1.0,   // 受信アンテナのゲイン
        ht = 1.0,   // 送信アンテナの地面からの高さ
        hr = 1.0,   // 受信アンテナの地面からの高さ
        L = 1.0,    // システムロス
        Pr = (Pt*Gt*Gr*(ht*ht)*(hr*hr))/Math.pow(d, 4)*L,
        rssi = 10 * this.log10(Pr/0.001) * 100;

    return Math.round(rssi)/100;
  },

  log10: function(x){
    return(Math.log(x) / Math.log(10));
  }
};

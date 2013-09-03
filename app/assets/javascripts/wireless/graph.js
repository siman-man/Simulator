var Graph = {
  article: [],

  init: function(){
    var WS = Simulator;
    for(var id in WS.server_list){
      var server = WS.server_list[id];
      this.article[id] = { label: "server" + id, y: server.article_count };
    }

    this.article_chart = new CanvasJS.Chart("chartContainer", {
      title:{
        text: "Airticle Count"              
      },
      axisY: {
        minimum: 0,
      },
      legend: {
        verticalAlign: 'bottom',
      },
      data: [  
        { 
          type: "column",
          dataPoints: this.article,
        }
      ]
    });

    this.article_chart.render();
  },

  update: function(){
    var WS = Simulator;
    
    for(var id in WS.server_list){
      var server = WS.server_list[id];
      //console.log(server);

      this.article[id] = { label: "server" + id, y: server.article_count };
    }

    //console.log(this.article_chart.options.data);

    this.article_chart.render();
  },

  clear: function(){
    delete this.article_chart;
    this.article = [];

    console.log('graph clear')
    var WS = Simulator;
    for(var id in WS.server_list){
      var server = WS.server_list[id];
      this.article[id] = { label: "server" + id, y: server.article_count };
    }

    this.article_chart = new CanvasJS.Chart("chartContainer", {
      title:{
        text: "Airticle Count"              
      },
      axisY: {
        minimum: 0,
      },
      legend: {
        verticalAlign: 'bottom',
      },
      data: [  
        { 
          type: "column",
          dataPoints: this.article,
        }
      ]
    });

    this.article_chart.render();
  },
}
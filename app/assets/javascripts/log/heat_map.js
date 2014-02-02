var HeatMap = {
	draw: function(data){
		console.log(data);
		var margin = { top: 100, right: 100, bottom: 100, left: 100 },
				col_number = DataList.width,
				row_number = DataList.height,
        cellSize = 800/Math.max(col_number,row_number),
  			width = cellSize*col_number+100, // - margin.left - margin.right,
  			height = cellSize*row_number, // - margin.top - margin.bottom,
  			legendElementWidth = Math.max(cellSize*2.0, width/30),
  			colorBuckets = 20,
  			colors = ["#FFFFFF", "#f8eff3", "#f1dfe7", "#eacfdb", "#e6c7d5", 
                  "#dfb7c9", "#dcafc3",  "#d59fb7", "#ce8fab", "#c87f9f", 
                  "#c47799", "#bd678d", "#b65781", "#af4775", "#ac3f6f", 
                  "#a52f63", "#a1275d", "#9e1f57", "#970f4b", "#91003F"];
  			hcrow = [], // change to gene name or probe id
  			hccol = [], // change to gene name or probe id
  			rowLabel = [], // change to gene name or probe id
  			colLabel = [], // change to contrast name
        max_messege = DataList.message_num*0.05;
  	for(var i = 0 ; i < DataList.height; i++){
  		hcrow[i] = i;
  		rowLabel[i] = i+"";
  	}
    for(var i = 0;  i < DataList.width; i++){
      hccol[i] = i;
      colLabel[i] = i+"";
    }

  	var colorScale = d3.scale.quantile()
  			.domain([0, max_messege])
  			.range(colors);

  	var svg = d3.select("#show_result").append("svg")
  		.attr("width", width + margin.left + margin.right)
  		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
  		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  	var rowLabels = svg.append("g")
  				.selectAll(".rowLabelg")
  				.data(rowLabel)
  				.enter()
  				.append("text")
  				.text(function (d) { return d; })
          .attr("style","font-size:10px;")
  				.attr("x", 0)
  				.attr("y", function (d, i) { return hcrow.indexOf(i) * cellSize + cellSize/4; })
  				.style("text-anchor", "end")
  				.attr("transform", "translate(-6," + cellSize / 1.5 + ")")
  				.attr("class", function (d,i) { return "rowLabel mono r"+i;}); 

  	var colLabels = svg.append("g")
  				.selectAll(".colLabelg")
  				.data(colLabel)
  				.enter()
  				.append("text")
  				.text(function (d) { return d; })
          .attr("style","font-size:10px;")
  				.attr("x", 0)
  				.attr("y", function (d, i) { return hccol.indexOf(i) * cellSize + cellSize/4; })
  				.style("text-anchor", "left")
  				.attr("transform", "translate("+cellSize/2 + ",-6) rotate (-90)")
  				.attr("class",  function (d,i) { return "colLabel mono c"+i;});

  	var heatMap = svg.append("g").attr("class","g3")
  		.selectAll(".cellg")
  		.data(data,function(d){return +d.ypos+":"+(+d.xpos);})
  		.enter()
  		.append("rect")
  		.attr("x", function(d) { return hccol.indexOf(+d.xpos) * cellSize; })
  		.attr("y", function(d) { return hcrow.indexOf(+d.ypos) * cellSize; })
  		.attr("class", function(d){return "cell cell-border cr"+(+d.ypos-1)+" cc"+(+d.xpos-1);})
  		.attr("width", cellSize)
  		.attr("height", cellSize)
  		.style("fill", function(d) { return colorScale(+d.count); });

    var label_list = [];
    for(var i = 0; i < 20; i++){
      label_list.push( max_messege/20 * i | 0 )
    }

  	var legend = svg.selectAll(".legend")
  		.data(label_list)
  		.enter().append("g")
  		.attr("class", "legend");

  	legend.append("rect")
  		.attr("x", function(d, i) { return legendElementWidth * i; })
  		.attr("y", height+(cellSize*2))
  		.attr("width", legendElementWidth)
 			.attr("height", cellSize)
  		.style("fill", function(d, i) { return colors[i]; });

  	legend.append("text")
  		.attr("class", "mono")
  		.text(function(d) { return d; })
  		.attr("width", legendElementWidth)
 			.attr("x", function(d, i) { return legendElementWidth * i; })
  		.attr("y", height + (cellSize*4));
  },

  user_field: function(data){
    var margin = { top: 100, right: 100, bottom: 100, left: 100 },
        col_number = DataList.width,
        row_number = DataList.height,
        cellSize = 800/Math.max(col_number,row_number),
        width = cellSize*col_number+100, // - margin.left - margin.right,
        height = cellSize*row_number, // - margin.top - margin.bottom,
        legendElementWidth = Math.max(cellSize*2.0, width/30),
        colorBuckets = 20,
        colors = ["#FFFFFF", "#f8eff3", "#f1dfe7", "#eacfdb", "#e6c7d5", 
                  "#dfb7c9", "#dcafc3",  "#d59fb7", "#ce8fab", "#c87f9f", 
                  "#c47799", "#bd678d", "#b65781", "#af4775", "#ac3f6f", 
                  "#a52f63", "#a1275d", "#9e1f57", "#970f4b", "#91003F"];
        hcrow = [], // change to gene name or probe id
        hccol = [], // change to gene name or probe id
        rowLabel = [], // change to gene name or probe id
        colLabel = [], // change to contrast name
        time_unit = 10,
        time_max = DataList.finish_time / 25;

    for(var i = 0 ; i < DataList.height; i++){
      hcrow[i] = i;
      rowLabel[i] = i+"";
    }
    for(var i = 0;  i < DataList.width; i++){
      hccol[i] = i;
      colLabel[i] = i+"";
    }

    var colorScale = d3.scale.quantile()
        .domain([0, time_max])
        .range(colors);

    var svg = d3.select("#show_result").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var rowLabels = svg.append("g")
          .selectAll(".rowLabelg")
          .data(rowLabel)
          .enter()
          .append("text")
          .text(function (d) { return d; })
          .attr("style","font-size:10px;")
          .attr("x", 0)
          .attr("y", function (d, i) { return hcrow.indexOf(i) * cellSize + cellSize/4; })
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + cellSize / 1.5 + ")")
          .attr("class", function (d,i) { return "rowLabel mono r"+i;}); 

    var colLabels = svg.append("g")
          .selectAll(".colLabelg")
          .data(colLabel)
          .enter()
          .append("text")
          .text(function (d) { return d; })
          .attr("style","font-size:10px;")
          .attr("x", 0)
          .attr("y", function (d, i) { return hccol.indexOf(i) * cellSize + cellSize/4; })
          .style("text-anchor", "left")
          .attr("transform", "translate("+cellSize/2 + ",-6) rotate (-90)")
          .attr("class",  function (d,i) { return "colLabel mono c"+i;});

    var heatMap = svg.append("g").attr("class","g3")
      .selectAll(".cellg")
      .data(data,function(d){return +d.ypos+":"+(+d.xpos);})
      .enter()
      .append("rect")
      .attr("x", function(d) { return hccol.indexOf(+d.xpos) * cellSize; })
      .attr("y", function(d) { return hcrow.indexOf(+d.ypos) * cellSize; })
      .attr("class", function(d){return "cell cell-border cr"+(+d.ypos-1)+" cc"+(+d.xpos-1);})
      .attr("width", cellSize)
      .attr("height", cellSize)
      .style("fill", function(d) { return colorScale(+d.count * time_unit); });

    var label_list = [];
    for(var i = 0; i < 20; i++){
      label_list.push( time_max/20 * i | 0 )
    }
    console.log(DataList.finish_time);
    console.log(label_list);

    var legend = svg.selectAll(".legend")
      .data(label_list)
      .enter().append("g")
      .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height+(cellSize*2))
      .attr("width", legendElementWidth)
      .attr("height", cellSize)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return d; })
      .attr("width", legendElementWidth)
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + (cellSize*4));
  },
}
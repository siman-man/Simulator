var HeatMap = {
	draw: function(data){
		console.log(data);
		var margin = { top: 150, right: 100, bottom: 100, left: 100 },
				cellSize=12,
				col_number = 50,
				row_number = 50,
  			width = cellSize*col_number, // - margin.left - margin.right,
  			height = cellSize*row_number, // - margin.top - margin.bottom,
  			legendElementWidth = cellSize*2.5,
  			colorBuckets = 21,
  			colors = ['#005824','#1A693B','#347B53','#4F8D6B','#699F83','#83B09B','#9EC2B3','#B8D4CB','#D2E6E3','#EDF8FB','#FFFFFF','#F1EEF6','#E6D3E1','#DBB9CD','#D19EB9','#C684A4','#BB6990','#B14F7C','#A63467','#9B1A53','#91003F'];
  			hcrow = [], // change to gene name or probe id
  			hccol = [], // change to gene name or probe id
  			rowLabel = ['0','1','2','3','4'], // change to gene name or probe id
  			colLabel = ['0','1','2','3','4']; // change to contrast name

  	for(var i = 0 ; i < 50; i++){
  		hcrow[i] = i;
  		hccol[i] = i;
  		rowLabel[i] = i+"";
  		colLabel[i] = i+"";
  	}

  	var colorScale = d3.scale.quantile()
  			.domain([ -10 , 0, 10])
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
  				.attr("x", 0)
  				.attr("y", function (d, i) { return hcrow.indexOf(i) * cellSize; })
  				.style("text-anchor", "end")
  				.attr("transform", "translate(-6," + cellSize / 1.5 + ")")
  				.attr("class", function (d,i) { return "rowLabel mono r"+i;}); 

  	var colLabels = svg.append("g")
  				.selectAll(".colLabelg")
  				.data(colLabel)
  				.enter()
  				.append("text")
  				.text(function (d) { return d; })
  				.attr("x", 0)
  				.attr("y", function (d, i) { return hccol.indexOf(i) * cellSize; })
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

  	var legend = svg.selectAll(".legend")
  		.data([-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10])
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
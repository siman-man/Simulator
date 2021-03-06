var Result = {
	horizontal: function(){
		var data = [{"label":"1990", "value":16}, 
		{"label":"1991", "value":56}, 
		{"label":"1992", "value":7},
		{"label":"1993", "value":77},
		{"label":"1994", "value":22},
		{"label":"1995", "value":16},
		];

    //maximum of data you want to use
    var data_max = 80,

    //number of tickmarks to use
    num_ticks = 5,

    //margins
    left_margin = 60,
    right_margin = 60,
    top_margin = 30,
    bottom_margin = 0;


    var w = 800,                        //width
        h = 500,                        //height
        color = function(id) { return '#00b3dc' };

        var x = d3.scale.linear()
        .domain([0, data_max])
        .range([0, w - ( left_margin + right_margin ) ]),
        y = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeBands([bottom_margin, h - top_margin], .5);


        var chart_top = h - y.rangeBand()/2 - top_margin;
        var chart_bottom = bottom_margin + y.rangeBand()/2;
        var chart_left = left_margin;
        var chart_right = w - right_margin;

    /*
     *  Setup the SVG element and position it
     */
     var vis = d3.select("body")
     .append("svg:svg")
     .attr("width", w)
     .attr("height", h)
     .append("svg:g")
     .attr("id", "barchart")
     .attr("class", "barchart")


    //Ticks
    var rules = vis.selectAll("g.rule")
    .data(x.ticks(num_ticks))
    .enter()
    .append("svg:g")
    .attr("transform", function(d){
    	return "translate(" + (chart_left + x(d)) + ")";
    });
    
    rules.append("svg:line")
    .attr("class", "tick")
    .attr("y1", chart_top)
    .attr("y2", chart_top + 4)
    .attr("stroke", "black");

    rules.append("svg:text")
    .attr("class", "tick_label")
    .attr("text-anchor", "middle")
    .attr("y", chart_top)
    .text(function(d){
    	return d;
    });

    var bbox = vis.selectAll(".tick_label").node().getBBox();
    vis.selectAll(".tick_label")
    .attr("transform", function(d)
    {
    	return "translate(0," + (bbox.height) + ")";
    });

    var bars = vis.selectAll("g.bar")
    .data(data)
    .enter()
    .append("svg:g")
    .attr("class", "bar")
    .attr("transform", function(d, i) { 
    	return "translate(0, " + y(i) + ")"; 
    });

    bars.append("svg:rect")
    .attr("x", right_margin)
    .attr("width", function(d) {
    	return (x(d.value));
    })
    .attr("height", y.rangeBand())
    .attr("fill", color(0))
    .attr("stroke", color(0));

    //Labels
    var labels = vis.selectAll("g.bar")
    .append("svg:text")
    .attr("class", "label")
    .attr("x", 0)
    .attr("text-anchor", "right")
    .text(function(d) {
    	return d.label;
    });

    var bbox = labels.node().getBBox();
    vis.selectAll(".label")
    .attr("transform", function(d) {
    	return "translate(0, " + (y.rangeBand()/2 + bbox.height/4) + ")";
    });


    labels = vis.selectAll("g.bar")
    .append("svg:text")
    .attr("class", "value")
    .attr("x", function(d)
    {
    	return x(d.value) + right_margin + 10;
    })
    .attr("text-anchor", "left")
    .text(function(d)
    {
    	return "" + d.value + "%";
    });

    bbox = labels.node().getBBox();
    vis.selectAll(".value")
    .attr("transform", function(d)
    {
    	return "translate(0, " + (y.rangeBand()/2 + bbox.height/4) + ")";
    });

    //Axes
    vis.append("svg:line")
    .attr("class", "axes")
    .attr("x1", chart_left)
    .attr("x2", chart_left)
    .attr("y1", chart_bottom)
    .attr("y2", chart_top)
    .attr("stroke", "black");
    vis.append("svg:line")
    .attr("class", "axes")
    .attr("x1", chart_left)
    .attr("x2", chart_right)
    .attr("y1", chart_top)
    .attr("y2", chart_top)
    .attr("stroke", "black");
  },

  vertical: function(dataset, opt){
  	var margin = {top: 20, right: 20, bottom: 50, left: 70},
  	    width = Math.max( 600, dataset.length*50 ) - margin.left - margin.right,
  	    height = 500 - margin.top - margin.bottom;

  	var formatPercent = d3.format("");
    var max_value = this.getMaxValue(dataset);

  	var x = d3.scale.ordinal()
  	.rangeRoundBands([0, width], .1)
  	.domain(dataset.map(function(d){
  		return d.label;
  	}));

    var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d){ return max_value * 1.1 | 0; })])
    .nice()
    .range([height, 0]);

  	var xAxis = d3.svg.axis()
  	.scale(x)
  	.orient("bottom")

  	var yAxis = d3.svg.axis()
  	.scale(y)
  	.orient("left")
  	.tickFormat(formatPercent);

  	var svg = d3.select("#show_result").append("svg")
  	.attr("width", width + margin.left + margin.right)
  	.attr("height", height + margin.top + margin.bottom)
  	.append("g")
  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  	 svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("style","font-size:16px;")
        .attr("y", 30)
        .attr("x", width * 0.6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(opt.xlabel)

      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
        .text(opt.ylabel)

    svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d){ return x(d.label) })
        .attr("width", x.rangeBand())
        .attr("y", function(d){ return y(d.value) })
        .attr("height", function(d){ return height - y(d.value) })
        .style("fill", "teal") 
  },

  lineChart: function(dataset, opt){
    console.log("line chart=>");
    console.log(dataset);
    //dataset = [{ time: 0, value: 3},{ time: 1, value: 2},{ time:2, value: 10}];
    var margin = {top: 20, right: 20, bottom: 50, left: 70},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var max_value = this.getMaxValue(dataset);

    var x = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d.time; })])
    .range([0, width]);

    var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d){ return d.value+5 })])
    .nice()
    .range([height, 0]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var line = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.value); });

    var svg = d3.select("#show_result").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("y", 30)
      .attr("x", width * 0.5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(opt.xlabel);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(opt.ylabel);

    svg.append("path")
      .attr("class", "line")
      .attr("d", line(dataset));
  },

  getMaxValue: function(dataset){
    var i, data, max_value = 0;
    for( i in dataset ){
      data = dataset[i];
      max_value = Math.max( max_value, +data.value );
    }
    return max_value;
  },
}
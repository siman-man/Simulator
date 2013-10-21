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


    var w = 500,                        //width
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

  vertical: function(dataset){
  	var dataset = dataset || [{ label:"1990", value:16}, 
  	{ label:"1991", value:56}, 
  	{ label:"1992", value:7},
  	{ label:"1993", value:77},
  	{ label:"1994", value:22},
  	{ label:"1995", value:16},
  	];

  	var margin = {top: 20, right: 20, bottom: 40, left: 40},
  	width = 400 - margin.left - margin.right,
  	height = 400 - margin.top - margin.bottom;

  	var formatPercent = d3.format("");

  	var x = d3.scale.ordinal()
  	.rangeRoundBands([0, width], .1)
  	.domain(dataset.map(function(d){
  		return d.label;
  	}));

  	var y = d3.scale.linear()
  	.domain([0, d3.max(dataset, function(d){ return d.value; })])
  	.nice()
  	.range([height, 0]);

  	var xAxis = d3.svg.axis()
  	.scale(x)
  	.orient("bottom")
  	.tickFormat(formatPercent);

  	var yAxis = d3.svg.axis()
  	.scale(y)
  	.orient("left")
  	.tickFormat(formatPercent);

  	var svg = d3.select("body").append("svg")
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
        .attr("x", width / 2)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Node number")

      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

    svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i){ return x(d.label) })
        .attr("width", x.rangeBand())
        .attr("y", function(d){ return y(d.value) })
        .attr("height", function(d){ return height - y(d.value) })
        .style("fill", "teal") 
  },
}
var AreaChart = {
	single: function(){
		var data = DataList.graph_data,
				margin = {top: 20, right: 20, bottom: 50, left: 70},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

		var x = d3.scale.linear()
		.range([0, width]);

		var y = d3.scale.linear()
		.range([height, 0]);

		var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

		var area = d3.svg.area()
		.x(function(d) { return x(+d.message_id); })
		.y0(height)
		.y1(function(d) { return y(+d.time); });

		var svg = d3.select("#area_chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		x.domain([0, d3.max(data, function(d) { return +d.message_id+1; })]);
		y.domain([0, d3.max(data, function(d) { return +d.time; })]);

		svg.append("path")
			.datum(data)
			.attr("class", "area")
			.attr("d", area);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(DataList.ylabel);
	},

	hop_count: function(){
		var data = DataList.graph_data,
				margin = {top: 20, right: 20, bottom: 50, left: 70},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

		console.log(data);
		var x = d3.scale.linear()
		.range([0, width]);

		var y = d3.scale.linear()
		.range([height, 0]);

		var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

		var area = d3.svg.area()
		.x(function(d) { return x(+d.message_id); })
		.y0(height)
		.y1(function(d) { return y(+d.hop_count); });

		var svg = d3.select("#area_chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		x.domain([0, d3.max(data, function(d) { return +d.message_id+1; })]);
		y.domain([0, d3.max(data, function(d) { return +d.hop_count+2; })]);

		svg.append("path")
			.datum(data)
			.attr("class", "area")
			.attr("d", area);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(DataList.ylabel);
	},
}
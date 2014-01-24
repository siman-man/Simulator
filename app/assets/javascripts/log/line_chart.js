var LineChart = {
	multi: function( data, opt ){
		console.log(DataList.finish_time);
		var margin = {top: 20, right: 80, bottom: 50, left: 70},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

		var x = d3.scale.linear()
		.domain(d3.extent(data, function(d) { return +d.time; }))
		.range([0, width]);

		var y = d3.scale.linear()
		.range([height, 0]);

		var color = d3.scale.category10();

		var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

		var line = d3.svg.line()
		.interpolate("basis")
		.x(function(d) { return x(d.time); })
		.y(function(d) { return y(d.count); });

		var svg = d3.select("#show_result").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		color.domain(d3.keys(data[0]).filter(function(key) { console.log(key);return key !== "time"; }));

		var cities = color.domain().map(function(name) {
			console.log("name =>", name);
			return {
				name: name,
				values: data.map(function(d) {
					console.log("data =>", d);
					var key = name+"";
					console.log("count =>", d[key]||0);
					return {time: +d.time, count: +d[key]||0};
				})
			};
		});

		y.domain([
			d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.count; }); }),
			d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.count+5; }); })
		]);

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

		var city = svg.selectAll(".city")
			.data(cities)
			.enter().append("g")
			.attr("class", "city");

		city.append("path")
			.attr("class", "line")
			.attr("d", function(d) { console.log(d);return line(d.values); })
			.style("stroke", function(d) { return color(d.name); });

		city.append("text")
			.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.count) + ")"; })
			.attr("x", 3)
			.attr("dy", ".35em")
			.text(function(d) { return d.name; });
	}
}
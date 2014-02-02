var Epidemic = {
  vertical: function(dataset){
    var margin = {top: 20, right: 20, bottom: 50, left: 70},
        width = Math.max( 600, dataset.length*50 ) - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var formatPercent = d3.format("");

    var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)
    .domain(dataset.map(function(d){
      return d.user_count;
    }));

    var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d){ return +d.count; })])
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
      .attr("y", 30)
      .attr("x", width * 0.55)
      .attr("dy", ".71em")
      .attr("style","font-size:16px;")
      .style("text-anchor", "end")
      .text(DataList.xlabel)

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", -120)
      .attr("y", 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .attr("style","font-size:16px;")
      .text(DataList.ylabel)

    svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d){ return x(d.user_count) })
        .attr("width", x.rangeBand())
        .attr("y", function(d){ return y(+d.count) })
        .attr("height", function(d){ return height - y(+d.count) })
        .style("fill", "teal") 
  },
}
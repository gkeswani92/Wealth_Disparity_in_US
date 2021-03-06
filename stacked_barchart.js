var margin = { top: 20, right: 100, bottom: 100, left: 100 };
var width = 900 - margin.left - margin.right;
var height = 400;
var gridSize = Math.floor(width / 44);
var c = ["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"];
var legend_names = ["1st Quintile","2nd Quintile","3rd Quintile","4th Quintile","5th Quintile"]
var colors = d3.scale.ordinal().range(c);
var yearScale = Array(3);
var netWorth = Array(130);

for(var i=0; i<yearScale.length; i++){
    yearScale[i] = 2000 + i * 5
}
for(var j=-1; j<netWorth.length-1; j++){
    netWorth[j+1] = 13000 * j;
}

var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
var y = d3.scale.linear().rangeRound([height, 0]);

var svg = d3.select("#mean_quantile_yearwise").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//create axis labels
var xLabel = svg.append("text")
                  .attr("class", "label")
                  .text("Year")
                  .attr("x", yearScale.length * gridSize * 8)
                  .attr("y", height + 40)
                  .style("text-anchor", "middle")
                  .style("dominant-baseline", "middle")
                  .style("font-size", "20")
                  .attr("transform", "translate(0,20)");

var yLabel = svg.append("text")
                 .attr("class", "label")
                 .text("Mean Net Worth")
                 .attr("x", -width/7)
                 .attr("y", netWorth.length * gridSize / 12)
                 .style("text-anchor", "middle")
                 .style("dominant-baseline", "middle")
                 .style("font-size", "20")
                 .attr("transform", "rotate(-90, -50," + netWorth.length/10 * gridSize +" )");

//create x and y axis
var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

//Loading the data from the csv file
d3.csv("quantile_data.csv",
   function(error, data) {

      // Map our columns to our colors
      colors.domain(d3.keys(data[0]).filter(function (key) {
          return key !== "year";
      }));

      data.forEach(function (d) {
          var y0 = 0;
          d.types = colors.domain().map(function (name) {
              return {
                  name: name,
                  y0: y0,
                  y1: y0 += +d[name]
              };
          });
          d.total = d.types[d.types.length - 1].y1;
      });

      // Our X domain is our set of years while our Y domain is from min value to our highest total
      x.domain(data.map(function (d) { return d.year;}));
      y.domain([d3.min(data, function (d) { return d.low; }), d3.max(data, function (d) { return d.total;})]);

      var year = svg.selectAll(".year")
                        .data(data)
                        .enter().append("g")
                        .attr("class", "g")
                        .attr("transform", function (d) {
                                                return "translate(" + x(d.year) + ",0)";
                                            });

      year.selectAll("rect")
            .data(function (d) { return d.types; })
            .enter().append("rect")
            .attr("width", 100)
            .attr("y", function (d) { return y(d.y1); })
            .attr("height", function (d) {
                        return Math.abs(y(d.y0) - y(d.y1));
                    })
            .style("fill", function (d) {
                        return colors(d.name);
                    });

        var regionQuintileLegend = svg.append("g")
        regionQuintileLegend.selectAll("squareLegend")
            				.data(c)
            				.enter().append("rect")
            				.attr("x", width - 15)
            				.attr("y", function(d, i) {
            					return i * 30 + 65;
            				})
            				.attr("width", 30)
            				.attr("height", 30)
            				.style("fill", function(d) { return d; });

        regionQuintileLegend.selectAll("squareLegend")
            				.data(legend_names)
            				.enter().append("text")
            				.attr("x", width + 20)
            				.attr("y", function(d, i) {
            					return i * 30 + 85;
            				})
            				.text(function(d, i) {
                                console.log(d);
            					return d;
            				});


    });

svg.append("g")
   .attr("class", "x axis")
   .attr("font-family", "Verdana")
   .attr("font-size", "14")
   .attr("transform", "translate(0," + height + ")")
   .call(xAxis);

svg.append("g")
   .attr("font-family", "Verdana")
   .attr("class", "y axis")
   .call(yAxis);

svg.append("text")
         .attr("class", "label")
         .text("74.046% of the wealth")
         .attr("x", width/4 - 90)
         .attr("y", 150)
         .style("text-anchor", "middle")
         .style("alignment-baseline", "central")
         .style("font-size", "15");

 svg.append("text")
          .attr("class", "label")
          .text("72.9% of the wealth")
          .attr("x", width - 390)
          .attr("y", 30)
          .style("text-anchor", "middle")
          .style("alignment-baseline", "central")
          .style("font-size", "15");

 svg.append("text")
          .attr("class", "label")
          .text("79.509% of the wealth")
          .attr("x", width - 170)
          .attr("y", -13)
          .style("text-anchor", "middle")
          .style("alignment-baseline", "central")
          .style("font-size", "15");

svg.append("text")
    .attr("class", "label")
    .text("2000")
    .attr("x", width/4 - 100)
    .attr("y", height + 25)
    .style("text-anchor", "middle")
    .style("alignment-baseline", "central")
    .style("font-size", "15");

svg.append("text")
    .attr("class", "label")
    .text("2005")
    .attr("x",  width - 400)
    .attr("y", height + 25)
    .style("text-anchor", "middle")
    .style("alignment-baseline", "central")
    .style("font-size", "15");

svg.append("text")
     .attr("class", "label")
     .text("2011")
     .attr("x", width - 175)
     .attr("y", height + 25)
     .style("text-anchor", "middle")
     .style("alignment-baseline", "central")
     .style("font-size", "15");

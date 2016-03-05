/******Age-Quintile-Wealth-2011 Heat Map*****/
var heatmap_padding = {
	top: 0,
	right: 120,
	left: 320,
	bottom: 100
};
var heatmap_width = 1150
	heatmap_height = 300
	graticuleSize = 50
	colors = ["#d7191c", "#fdae61", "#a6d96a", "#1a9641"];

var ageArray = ["<35", "35-44", "45-54", "55-64",">65"];
var quinArray = [1, 2, 3, 4, 5];

var heatmap_svg = d3.select("#heatMap").append("svg")
		  .attr("width", heatmap_width)
		  .attr("height", heatmap_height)
		  ;

// Age Group label
var yearLabel2000 = heatmap_svg.append("text")
					.attr("class", "label")
					.text("2000")
					.attr("x", heatmap_padding.left + ageArray.length * graticuleSize / 2)
					.attr("y", quinArray.length * graticuleSize + 30)
					.style("text-anchor","middle")
					.style("alignment-baseline", "central")
					.style("font-size", "20")
					;

var yearLabel2005 = heatmap_svg.append("text")
					.attr("class", "label")
					.text("2005")
					.attr("x", heatmap_padding.left + 1.5 * ageArray.length * graticuleSize + graticuleSize / 2)
					.attr("y", quinArray.length * graticuleSize + 30)
					.style("text-anchor","middle")
					.style("alignment-baseline", "central")
					.style("font-size", "20")
					;

var yearLabel2011 = heatmap_svg.append("text")
					.attr("class", "label")
					.text("2011")
					.attr("x", heatmap_padding.left + 2.5 * ageArray.length * graticuleSize + graticuleSize)
					.attr("y", quinArray.length * graticuleSize + 30)
					.style("text-anchor","middle")
					.style("alignment-baseline", "central")
					.style("font-size", "20")
					;

var ageGroups2000 = heatmap_svg.selectAll("ageGroup")
				.data(ageArray)
				.enter()
				.append("text")
				.text(function(a) { return a; })
				.attr("x", function(a, i) { return i * graticuleSize; })
				.attr("y", heatmap_height - heatmap_padding.top)
				.style("text-anchor","middle")
				.style("alignment-baseline", "central")
				.style("font-size", "12")
				.attr("transform", "translate("+ (heatmap_padding.left + graticuleSize / 2) +", -40)");

var ageGroups2005 = heatmap_svg.selectAll("ageGroup")
				.data(ageArray)
				.enter()
				.append("text")
				.text(function(a) { return a; })
				.attr("x", function(a, i) { return i * graticuleSize; })
				.attr("y", heatmap_height - heatmap_padding.top)
				.style("text-anchor","middle")
				.style("alignment-baseline", "central")
				.style("font-size", "12")
				.attr("transform", "translate("+ (heatmap_padding.left + graticuleSize + ageArray.length * graticuleSize) +", -40)");

var ageGroups2011 = heatmap_svg.selectAll("ageGroup")
				.data(ageArray)
				.enter()
				.append("text")
				.text(function(a) { return a; })
				.attr("x", function(a, i) { return i * graticuleSize; })
				.attr("y", heatmap_height - heatmap_padding.top)
				.style("text-anchor","middle")
				.style("alignment-baseline", "central")
				.style("font-size", "12")
				.attr("transform", "translate("+ (heatmap_padding.left + graticuleSize * 1.5 + ageArray.length * graticuleSize * 2) +", -40)");

var quintileGroups = heatmap_svg.selectAll("quintileGroups")
					 .data(quinArray)
					 .enter()
					 .append("text")
					 .text(function(q) { return "Quintile " + q; })
					 .attr("x", heatmap_padding.left)
					 .attr("y", function(q, i) { return 250 - i * graticuleSize; })
					 .style("text-anchor","end")
					 .style("alignment-baseline", "central")
					 .style("font-size", "12")
					 .attr("transform", "translate(-5, " + -graticuleSize / 2 + ")");


// Heat Map
d3.csv("age_quintile_wealth.csv", 
function(error, data) {
	if (error) {
		console.log("Error: " + error);
	}

	ageWealthViz(data);
});

function ageWealthViz(incomingData) {
	// console.log(incomingData);
	var wealthRange2000 = d3.extent(incomingData, function(d) {
		return Number(d.yearwealth2000);
	});

	var wealthRange2005 = d3.extent(incomingData, function(d) {
		return Number(d.yearwealth2005);
	});

	var wealthRange2011 = d3.extent(incomingData, function(d) {
		return Number(d.yearwealth2011);
	});

	var wealthRange = [Math.min(Math.min(wealthRange2000[0], wealthRange2005[0]), wealthRange2011[0]),
					   Math.max(Math.max(wealthRange2000[1], wealthRange2005[1]), wealthRange2011[1])];
	// console.log(wealthRange);
	var colorScale = d3.scale.linear().domain([wealthRange[0], 0, wealthRange[0] + (wealthRange[1] - wealthRange[0]) * 1 / 3, wealthRange[1]]).range(colors);

	// Legend for color scale
	var legend = heatmap_svg.selectAll(".legend")
      .data(colors)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate("+ 80 +"," + (20 + i * 20) + ")"; });

	legend.append("rect")
	  .attr("width", 20)
	  .attr("height", 20)
	  .style("fill", function(d) { return d; });

	legend.append("text")
	  .data([wealthRange[0], 0, wealthRange[0] + (wealthRange[1] - wealthRange[0]) * 1 / 3, wealthRange[1]])
	  .text(function(d) { return "$" + d; })
	  .attr("x", 30)
	  .attr("y", function(d, i) { return 8 + i * 1.5; })
	  .attr("text-anchor", "start")
	  .style("font-size", "10px")
	  .style("alignment-baseline", "central");

	// Heap map
	var heatMap2000 = heatmap_svg.selectAll("wealth2000")
	.data(incomingData)
	.enter()
	.append("rect")
	.attr("x", function(d) {
		// console.log(d);
		var index = 0;
		switch(d.age) {
			case "<35":
				index = 0; break;
			case "35-44":
				index = 1; break;
			case "45-54":
				index = 2; break;
			case "55-64":
				index = 3; break;
			case ">65":
				index = 4; break;
		}
		// console.log(index);
		return index * graticuleSize;
	})
	.attr("y", function(d) {
		var index = d.quintile;
		return 250 - index * graticuleSize;
	})
	.attr("width", graticuleSize)
	.attr("height", graticuleSize)
	.attr("stroke", "#E6E6E6")
	.attr("transform", "translate("+ heatmap_padding.left +", 0)")
	.style("fill", function(d) { return colorScale(d.yearwealth2000); });

	var heatMap2005 = heatmap_svg.selectAll("wealth2005")
	.data(incomingData)
	.enter()
	.append("rect")
	.attr("x", function(d) {
		// console.log(d);
		var index = 0;
		switch(d.age) {
			case "<35":
				index = 0; break;
			case "35-44":
				index = 1; break;
			case "45-54":
				index = 2; break;
			case "55-64":
				index = 3; break;
			case ">65":
				index = 4; break;
		}
		// console.log(index);
		return index * graticuleSize;
	})
	.attr("y", function(d) {
		var index = d.quintile;
		return 250 - index * graticuleSize;
	})
	.attr("width", graticuleSize)
	.attr("height", graticuleSize)
	.attr("stroke", "#E6E6E6")
	.attr("transform", "translate("+ (heatmap_padding.left + graticuleSize / 2 + ageArray.length * graticuleSize) +", 0)")
	.style("fill", function(d) { return colorScale(d.yearwealth2005); });

	var heatMap2011 = heatmap_svg.selectAll("wealth2011")
	.data(incomingData)
	.enter()
	.append("rect")
	.attr("x", function(d) {
		// console.log(d);
		var index = 0;
		switch(d.age) {
			case "<35":
				index = 0; break;
			case "35-44":
				index = 1; break;
			case "45-54":
				index = 2; break;
			case "55-64":
				index = 3; break;
			case ">65":
				index = 4; break;
		}
		// console.log(index);
		return index * graticuleSize;
	})
	.attr("y", function(d) {
		var index = d.quintile;
		return 250 - index * graticuleSize;
	})
	.attr("width", graticuleSize)
	.attr("height", graticuleSize)
	.attr("stroke", "#E6E6E6")
	.attr("transform", "translate("+ (heatmap_padding.left + graticuleSize + ageArray.length * graticuleSize * 2) +", 0)")
	.style("fill", function(d) { return colorScale(d.yearwealth2011); });



	// wealth scale & axis & gradient
	var wealthScale = d3.scale.linear().domain(colorScale.domain()).range([quinArray.length * graticuleSize, 0]);
	var wealthAxis = d3.heatmap_svg.axis().scale(wealthScale).orient("right");

	heatmap_svg.append("g")
	.attr("class", "axis")
	.attr("font-size", "14")
	.attr("transform", "translate("+ (heatmap_width + heatmap_padding.left + 20) +", 0)")
	.call(wealthAxis);

};
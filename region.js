var region_width = 1200,
	region_height = 500
	region_padding = 100
	region_axis_padding = 55;

var colors = [];

var region_svg = d3.select("#region").append("svg")
.attr("width", region_width + 2 * region_padding).attr("height", region_height + 100);

var regionsLabel = ["Northeast", "Midwest", "South", "West"];

// Scale
var regionBands = d3.scale.ordinal()
.domain(regionsLabel)
.rangeRoundBands([50, region_height - 50], 0.3, 0.15);

var regionPoints = d3.scale.ordinal()
.domain(regionsLabel)
.rangePoints([50, region_height - 50], 1.0);

var wealthRange = [0, 2600];

var wealthScaleForMedian = d3.scale.linear()
.domain(wealthRange)
.range([region_padding, region_width / 2 + region_padding]);

var wealthScaleForMean = d3.scale.linear()
.domain(wealthRange)
.range([region_width / 2 + region_padding, region_width + region_padding]);

var colors = ["#d7191c", "#fdae61", "#a6d96a", "#1a9641"];

var colorScale = d3.scale.linear()
.domain(d3.range(2, 6))
.range(colors);

// Label & Axis
// Region
var regionAxis = d3.svg.axis().scale(regionPoints).orient("left");

region_svg.append("g")
.attr("class", "axis")
.attr("transform", "translate("+ (region_width / 2 + region_padding) +",0)")
.call(regionAxis);

var regionLabel = region_svg.append("text")
					// .attr("x", region_width / 2 + region_padding)
					// .attr("y", 50)
					.text("Region")
					.attr("class", "text")
					.style("dominant-baseline", "text-before-edge")
					.attr("transform", "translate(" + (region_width / 2 + region_padding) + ", " + region_height / 2 + ") rotate(-90)");

// Wealth
var networthLabelForMedian = region_svg.append("text")
					.attr("x", region_padding / 2 - 5)
					.attr("y", region_height - region_axis_padding * 0.4)
					.attr("class", "text")
					.style("text-anchor","start")
					.style("alignment-baseline", "central")
					.text("Net worth / $1,000")
region_svg.append("text")
.attr("x", 300)
.attr("y", region_height)
.text("Median");

var networthLabelForMean = region_svg.append("text")
					.attr("x", region_width + region_padding * 1.55)
					.attr("y", region_height - region_axis_padding * 0.4)
					.attr("class", "text")
					.style("text-anchor","end")
					.style("alignment-baseline", "central")
					.text("Net worth / $1,000")
region_svg.append("text")
.attr("x", 1060)
.attr("y", region_height)
.text("Mean");

var medianScale = d3.scale.linear()
.domain([wealthRange[1], wealthRange[0]])
.range([region_padding, region_width / 2 + region_padding]);

var medianAxis = d3.svg.axis().scale(medianScale).orient("bottom");
	
region_svg.append("g")
.attr("class", "axis")
.attr("transform", "translate("+ (-region_axis_padding) +"," + (region_height - 50) + ")")
.call(medianAxis);

var meanAxis = d3.svg.axis().scale(wealthScaleForMean).orient("bottom");
	
region_svg.append("g")
.attr("class", "axis")
.attr("transform", "translate("+ region_axis_padding +"," +  (region_height - 50)+ ")")
.call(meanAxis);

// Legend
var regionQuintileLegend = region_svg.append("g")
regionQuintileLegend.selectAll("squareLegend")
				.data(colors)
				.enter()
				.append("rect")
				.attr("x", region_padding / 2)
				.attr("y", function(d, i) {
					return i * 30 + 70;
				})
				.attr("width", 30)
				.attr("height", 10)
				.style("fill", function(d) { return d; });

regionQuintileLegend.selectAll("quintileLegend")
				.data(d3.range(2, 6))
				.enter()
				.append("text")
				.text(function(d) {
					return "Quintile " + d
							+ (d == 5 ? ": top " : ": ")
							+ (100 - d * 20) + "~"
							+ (100 - (d - 1) * 20) + "%";
				})
				.attr("x", region_padding)
				.attr("y", function(d, i) {
					return i * 30 + 75;
				})
				.style("text-anchor","start")
				.style("alignment-baseline", "central")
				.style("font-size", "10")
				;

// Data
var regionsData;
d3.csv("region.csv", function(error, data) {
	if (error) { console.log("Loading Error: " + error); }
	regionViz(data);
});

function regionViz(data) {
	regionsData = data;

	regionsData.forEach(function(d) {
// console.log(wealthScaleForMean(d.mean / 1000) - wealthScaleForMean(0));
		region_svg.append("rect")
		.attr("x", wealthScaleForMean(wealthRange[0]) + region_axis_padding)
		.attr("y", regionBands(d.region))
		.attr("width", wealthScaleForMean(d.mean / 1000) - wealthScaleForMean(0))
		.attr("height", regionBands.rangeBand())
		.style("fill", colorScale(d.quintile));
	});

	regionsData.forEach(function(d) {
// console.log(wealthScaleForMean(d.median / 1000) - wealthScaleForMean(0));
		region_svg.append("rect")
		.attr("x", wealthScaleForMedian(wealthRange[1] - wealthRange[0] - d.median / 1000) - region_axis_padding)
		.attr("y", regionBands(d.region))
		.attr("width", wealthScaleForMedian(d.median / 1000) - wealthScaleForMedian(0))
		.attr("height", regionBands.rangeBand())
		.style("fill", colorScale(d.quintile));
	});

	region_svg.append("text")
	.attr("x", region_width / 2 + 300)
	.attr("y", region_height - 400)
	.text("1.5X of Median value")
	.style("text-anchor","middle")
	.style("alignment-baseline", "central")
	.style("font-size", "15")
	.attr("fill", "MintCream")
	.attr("opacity", "0.5");

	region_svg.append("text")
	.attr("x", region_width / 2 + 300)
	.attr("y", region_height - 300)
	.text("2X of Median value")
	.style("text-anchor","middle")
	.style("alignment-baseline", "central")
	.style("font-size", "15")
	.attr("fill", "MintCream")
	.attr("opacity", "0.8");

	region_svg.append("text")
	.attr("x", region_width / 2 + 300)
	.attr("y", region_height - 200)
	.text("2X of Median value")
	.style("text-anchor","middle")
	.style("alignment-baseline", "central")
	.style("font-size", "15")
	.attr("fill", "MintCream")
	.attr("opacity", "0.8");

	region_svg.append("text")
	.attr("x", region_width / 2 + 450)
	.attr("y", region_height - 100)
	.text("3.5X of Median value")
	.style("text-anchor","middle")
	.style("alignment-baseline", "central")
	.style("font-size", "15")
	.attr("fill", "MintCream");


}
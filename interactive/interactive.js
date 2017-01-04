var timeline = d3.select("#timeline");
var divWidth = parseInt(timeline.style("width"), 10);
var divHeight = parseInt(timeline.style("height"), 10);

var detail = d3.select("#detail");
var detailWidth = parseInt(detail.style("width"), 10);
var detailHeight = parseInt(detail.style("height"), 10);

var selected = 23;

var margin = {top: 25, right: 50, bottom: 10, left: 100};

var width = divWidth - margin.left - margin.right;
var height = divHeight - margin.top - margin.bottom;

var svg = d3.select("#timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var desGroup = d3.select("#detail").append("svg")
	.attr("width",detailWidth)
	.attr("height",detailHeight)
	.attr("opacity",1);

var desDiv = desGroup.append("foreignObject")
	.attr("x",0)
	.attr("y",0)
	.attr("width",detailWidth)
	.attr("height",detailHeight)
  	.append("xhtml:div");

var parseDate = d3.time.format("%d-%b-%y").parse

var x = d3.time.scale()
    .range([0, width]);

var bumper = 12;

var y = d3.scale.ordinal()
	.domain(["a","b", "c", "d", "e","f","g", "h", "i", "j", "k"])
	.range([0,
		15,
		30,
		45,
		60,
		75,
		90,
		105,
		120,
		135,
		150]);

var axisPoints = [
	{year:"2014", date:"1-Jan-14"},
	{year:"15", date:"1-Jan-15"},
	{year:"16", date:"1-Jan-16"}
];

var textBumper = 5,
	lineBumper = 25;

svg.append("line")
	.attr("x1",-margin.left)
	.attr("x2",width)
	.attr("y1",y("f"))
	.attr("y2",y("f"))
	.attr("stroke", "#B3B3B3")
	.attr("stroke-width", 1);

svg.append("text")
	.attr("class","categoryLabels")
	.text("school")
	.attr("x",-margin.left + 32)
	.attr("y", (height/2) - bumper - 2);

svg.append("text")
	.attr("class","categoryLabels")
	.text("work")
	.attr("x",-margin.left + 32)
	.attr("y", (height/2) + bumper);

d3.csv("interactive/timeline.csv", function (error, data){

	data.forEach(function (d){
		d.beg = parseDate(d.beg)
		d.end = parseDate(d.end)
	});

	x.domain([
		d3.min(data, function (d) { return d.beg; }),
		d3.max(data, function (d) { return d.end; })
	]);

	svg.selectAll(".axis")
		.data(axisPoints)
	  	.enter().append("line")
	  	.attr("x1", function (d) { return x(parseDate(d.date)); })
		.attr("x2", function (d) { return x(parseDate(d.date)); })
		.attr("y1", -10)
		.attr("y2", height+10)
		.attr("stroke", "#E6E6E6")
		.attr("stroke-width", 1);

	svg.selectAll(".axisLabels")
		.data(axisPoints)
	  	.enter().append("text")
	  	.attr("class","axisLabels")
	  	.attr("x", function (d) { return x(parseDate(d.date)); })
	  	.attr("y", function (d, i) { return -15; })
	  	.attr("text-anchor","middle")
	  	.text(function (d) { return d.year; });

	svg.append("text")
		.attr("class","axisLabels")
		.text("pool")
		.attr("x", x(parseDate("31-May-14")))
		.attr("y", y("j") - 3);

	svg.append("text")
		.attr("class","axisLabels")
		.text("fall 14")
		.attr("x", x(parseDate("23-Aug-14")))
		.attr("y", y("engineering") - 3);

	svg.append("text")
		.attr("class","axisLabels")
		.text("spring 15")
		.attr("x", x(parseDate("23-Jan-15")))
		.attr("y", y("engineering") - 3);

	svg.append("text")
		.attr("class","axisLabels")
		.text("startfast")
		.attr("x", x(parseDate("31-May-15")))
		.attr("y", y("h") -3);

	svg.append("text")
		.attr("class","axisLabels")
		.text("pool")
		.attr("x", x(parseDate("31-May-15")))
		.attr("y", y("j") -3);

	svg.append("text")
		.attr("class","axisLabels")
		.text("fall 15")
		.attr("x", x(parseDate("23-Aug-15")))
		.attr("y", y("engineering") - 3);

	svg.append("text")
		.attr("class","axisLabels")
		.text("belle apps")
		.attr("x", x(parseDate("23-Dec-15")) + 6)
		.attr("y", y("i") - 3);

	svg.append("text")
		.attr("class","axisLabels")
		.text("spring 16")
		.attr("x", x(parseDate("25-Jan-16")))
		.attr("y", y("engineering") - 3);

	svg.append("text")
		.attr("class","axisLabels")
		.text("src")
		.attr("x", x(parseDate("31-May-16")))
		.attr("y", y("g") + 15);

	svg.append("text")
		.attr("class","axisLabels")
		.text("fall 16")
		.attr("x", x(parseDate("23-Aug-16")))
		.attr("y", y("engineering") - 3);


	var lines = svg.selectAll(".rect")
		.data(data)
	  	.enter().append("rect")
	  	.attr("class","rect")
	    .attr("x", function(d) { return x(d.beg); })
	    .attr("width", function(d) { return x(d.end)-x(d.beg); })
	    .attr("y", function(d) { return y(d.cat); })
	    .attr("height", 7 )
	    .attr("fill", function(d, i) {
	    	if (i==selected) {
	    		return "#000000";
	    	}
	    	else {
	    		return "" + d.color + "";
	    	}
		})
	    .attr("stroke", "white")
	    .on("click", function(d, i) {
	    	selected = i;
	    	update();
	    });

	var des = desDiv.selectAll(".div")
		.data(data)
	  	.enter().append("div")
	  	.html(function(d) { return d.des; })
	  	.attr("class", function(d, i) {
	  		if (i == selected) {
	  			return "shown";
	  		}
	  		else {
	  			return "hidden";
	  		}
	  	});

	var update = function() {
		lines.transition()
			.duration(400)
			.attr("fill",function(d,i){
				if (i === selected){
					return "#000000";
				}
				else{
					return "" + d.color + "";
				}
			});

		desGroup.transition()
			.duration(200)
			.attr("opacity",0)

		des.transition()
			.delay(200)
			.attr("class",function(d, i) {
				if (i==selected) {
					return "shown";
				}
				else {
					return "hidden";
				}
		});

		desGroup.transition()
			.delay(200)
			.duration(200)
			.attr("opacity",1);
	}
});

// legend stuff
var legend = d3.select("#legend");
var legWidth = parseInt(legend.style("width"), 10);
var legHeight = parseInt(legend.style("height"), 10);

var svg2 = d3.select("#legend").append("svg")
	.attr("width", legWidth)
    .attr("height", legHeight)
    .append("g");

var legendXScale = d3.scale.ordinal()
	.domain(["CS","ECE", "intro engineering", "liberal studies", "math","science","work"])
	.range([5,
		(legWidth/7)+5,
		((2*legWidth)/7)+5,
		((3*legWidth)/7)+5,
		((4*legWidth)/7)+5,
		((5*legWidth)/7)+5,
		((6*legWidth)/7)+5]);

d3.csv("interactive/legend.csv", function (error, data){

	var legItems = svg2.selectAll(".rect")
		.data(data)
	  	.enter().append("rect")
	  	.attr("class","rect")
	    .attr("x", function(d) { return legendXScale(d.label); })
	    .attr("width", function(d) { return (legWidth/7)-10; })
	    .attr("y", function(d) { return 25; })
	    .attr("height", 7)
	    .attr("fill", function(d) { return "" + d.color + ""; })
	    .attr("stroke", "white");

	var legLabels = svg2.selectAll(".axisLabels")
		.data(data)
	  	.enter().append("text")
	  	.attr("class","axisLabels")
	  	.attr("x", function (d) { return legendXScale(d.label); })
	  	.attr("y", function(d) { return 20; })
	  	.attr("text-anchor","left")
	  	.text(function (d) { return d.label; });

});
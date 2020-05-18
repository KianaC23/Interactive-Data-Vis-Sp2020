const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline = d3.line()
.x(function(d) { return x(d.Year); })
.y(function(d) { return y(d.Female); });

// define the 2nd line
var valueline2 = d3.line()
.x(function(d) { return x(d.Year); })
.y(function(d) { return y(d.Male); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("percentsByYear.csv", function(error, data) {
if (error) throw error;

// format the data
data.forEach(function(d) {
  d.date = parseTime(d.Year);
  d.fem = +d.Female;
  d.male = +d.Male;
});

// Scale the range of the data
x.domain(d3.extent(data, function(d) { return d.date; }));
y.domain([0, d3.max(data, function(d) {
  return Math.max(d.fem, d.male); })]);

const container = d3.select("#d3-container").style("position", "relative");
svg.append("svg")
  .attr("width", width)
  .attr("height", height);
// Add the valueline path.
svg.append("path")
  .data([data])
  .attr("class", "line")
  .attr("d", valueline);

// Add the valueline2 path.
svg.append("path")
  .data([data])
  .attr("class", "line")
  .style("stroke", "red")
  .attr("d", valueline2);

// Add the X Axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add the Y Axis
svg.append("g")
  .call(d3.axisLeft(y));

});
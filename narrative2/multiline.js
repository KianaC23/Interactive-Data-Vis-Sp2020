export function Linechart(){

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // parse the Year / time
  //var parseTime = d3.timeFormat("%Y");

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the 1st line
  var valueline = d3.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Male); });

  // define the 2nd line
  var valueline2 = d3.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Female); });

  // define the 3rd line
  var valueline3 = d3.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.White); });

  // define the 4th line
  var valueline4 = d3.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.POC); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("#linechart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv("../data/demographics.csv", d3.autoType).then(data =>{
    console.log(data);
    // format the data
    data.forEach(d => {
        //d.Year = parseTime(d.Year);
        d.Year = +d.Year;
        d.Male = +d.Male;
        d.Female = +d.Female;
        d.White = +d.White;
        d.POC = +d.POC;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.Year; }));
    y.domain([0, d3.max(data, function(d) {
      return Math.max(d.Male, d.Female); })]);

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

// Add the valueline3 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "yellow")
        .attr("d", valueline3);

// Add the valueline4 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", valueline4);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));



  });

}

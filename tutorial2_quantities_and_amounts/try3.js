// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
d3.csv("../data/squirrelActivities.csv", d3.autoType).then(data => {
  console.log(data);

  /** CONSTANTS */
  // constants help us reference the same values throughout our code
  const 
    paddingInner = 0.2,
    margin = { top: 10, bottom: 10, left: 60, right: 40 };
    width = 1050- margin.left - margin.right,
    height =525 - margin.top - margin.bottom;


  var svg = d3.select("#graphic").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
    .range([20, width])
    .domain([20, d3.max(data, d => d.count)]);

  var y = d3.scaleBand()
    .range([height, 0])
    .domain(data.map(d => d.activity))
    .paddingInner(paddingInner);


  //make y axis to show bar names
  var yAxis = d3.axisLeft()
    .scale(y)
    //no tick marks
    .tickSize(0);
    // make  axis to show numbers
  //var xAxis = d3.axisBottom(y).ticks(data.length);

  var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  //var gx = svg.append("g")
    //.attr("class", "x axis")
    //.attr("transform",`translate(0, ${height- margin.left})`)
   // .call(xAxis)

  var bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g")

  //append rects
  bars.append("rect")
    .attr("class", "bar")
    .attr("y", d => y(d.activity))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", d => x(d.count));

        //add a value label to the right of each bar
  bars.append("text")
    .attr("class", "label")
            //y position of the label is halfway down the bar
    .attr("y", d =>  y(d.activity) + y.bandwidth() / 2 + 4)
            //x position is 3 pixels to the right of the bar
    .attr("x", d => x(d.count) + 20)
   .text(d => d.count);
});

  
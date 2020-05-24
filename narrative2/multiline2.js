export function Linechart(){

  
     var data = [
    {
      name: "Male",
      values: [
        {date: "2007", percent: "97.3"},
        {date: "2008", percent: "92"},
        {date: "2009", percent: "96.4"},
        {date: "2010", percent: "97.2"},
        {date: "2011", percent: "96.3"},
        {date: "2012", percent: "95.9"},
        {date: "2013", percent: "98.1"},
        {date: "2014", percent: "98.1"},
        {date: "2015", percent: "92.5"},
        {date: "2016", percent: "95.8"},
        {date: "2017", percent: "92.7"},
        {date: "2018", percent: "95.5"},
        {date: "2019", percent: "89.4"}
      ]
    },
    {
      name: "Female",
      values: [

        {date: "2007", percent: "2.7"},
        {date: "2008", percent: "8"},
        {date: "2009", percent: "3.6"},
        {date: "2010", percent: "2.8"},
        {date: "2011", percent: "3.7"},
        {date: "2012", percent: "4.1"},
        {date: "2013", percent: "1.9"},
        {date: "2014", percent: "1.9"},
        {date: "2015", percent: "7.5"},
        {date: "2016", percent: "4.2"},
        {date: "2017", percent: "7.3"},
        {date: "2018", percent: "4.5"},
        {date: "2019", percent: "10.6"}
      ]
    },
    {
      name: "POC",
      values: [
        {date: "2007", percent: "12.5"},
        {date: "2008", percent: "11.6"},
        {date: "2009", percent: "13.5"},
        {date: "2010", percent: "10.1"},
        {date: "2011", percent: "8.3"},
        {date: "2012", percent: "9.1"},
        {date: "2013", percent: "16.8"},
        {date: "2014", percent: "12.2"},
        {date: "2015", percent: "12.2"},
        {date: "2016", percent: "13.3"},
        {date: "2017", percent: "18.3"},
        {date: "2018", percent: "21.4"},
        {date: "2019", percent: "16.8"}
      ]
    },

    {
      name: "White",
      values: [
        {date: "2007", percent: "87.5"},
        {date: "2008", percent: "88.4"},
        {date: "2009", percent: "86.4"},
        {date: "2010", percent: "89.9"},
        {date: "2011", percent: "91.7"},
        {date: "2012", percent: "90.9"},
        {date: "2013", percent: "83.2"},
        {date: "2014", percent: "87.9"},
        {date: "2015", percent: "87.9"},
        {date: "2016", percent: "86.7"},
        {date: "2017", percent: "81.7"},
        {date: "2018", percent: "78.6"},
        {date: "2019", percent: "83.2"}
      ]
    }
  ];

  var width = 500;
  var height = 300;
  var margin = 50;
  var duration = 250;

  var lineOpacity = "0.25";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "1.5px";
  var lineStrokeHover = "2.5px";

  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 3;
  var circleRadiusHover = 6;


  /* Format Data */
  var parseDate = d3.timeParse("%Y");
  data.forEach(function(d) { 
    d.values.forEach(function(d) {
      d.date = parseDate(d.date);
      d.percent = +d.percent;    
    });
  });


  /* Scale */
  var xScale = d3.scaleTime()
    .domain(d3.extent(data[0].values, d => d.date))
    .range([0, width-margin]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data[0].values, d => d.percent)])
    .range([height-margin, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  /* Add SVG */
  var svg = d3.select("#linechart").append("svg")
    .attr("width", (width+margin)+"px")
    .attr("height", (height+margin)+"px")
    .append('g')
    .attr("transform", `translate(${margin}, ${margin})`);


  /* Add line into SVG */
  var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.percent));

  let lines = svg.append('g')
    .attr('class', 'lines');

  lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', 'line-group')  
    .on("mouseover", function(d, i) {
        svg.append("text")
          .attr("class", "title-text")
          .style("fill", color(i))        
          .text(d.name)
          .attr("text-anchor", "middle")
          .attr("x", (width-margin)/2)
          .attr("y", (height-margin)/2);
      })
    .on("mouseout", function(d) {
        svg.select(".title-text").remove();
      })
    .append('path')
    .attr('class', 'line')  
    .attr('d', d => line(d.values))
    .style('stroke', (d, i) => color(i))
    .style('opacity', lineOpacity)
    .on("mouseover", function(d) {
        d3.selectAll('.line')
            .style('opacity', otherLinesOpacityHover);
        d3.selectAll('.circle')
            .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style("stroke-width", lineStrokeHover)
          .style("cursor", "pointer");
      })
    .on("mouseout", function(d) {
        d3.selectAll(".line")
            .style('opacity', lineOpacity);
        d3.selectAll('.circle')
            .style('opacity', circleOpacity);
        d3.select(this)
          .style("stroke-width", lineStroke)
          .style("cursor", "none");
      });


  /* Add circles in the line */
  lines.selectAll("circle-group")
    .data(data).enter()
    .append("g")
    .style("fill", (d, i) => color(i))
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "circle")  
    .on("mouseover", function(d) {
        d3.select(this)     
          .style("cursor", "pointer")
          .append("text")
          .attr("class", "text")
          .text(`${d.percent}`)
          .attr("x", d => xScale(d.date) + 5)
          .attr("y", d => yScale(d.percent) - 10);
      })
    .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")  
          .transition()
          .duration(duration)
          .selectAll(".text").remove();
      })
    .append("circle")
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.percent))
    .attr("r", circleRadius)
    .style('opacity', circleOpacity)
    .on("mouseover", function(d) {
          d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadiusHover);
        })
      .on("mouseout", function(d) {
          d3.select(this) 
            .transition()
            .duration(duration)
            .attr("r", circleRadius);  
        });


  /* Add Axis into SVG */
  var xAxis = d3.axisBottom(xScale).ticks(5);
  var yAxis = d3.axisLeft(yScale).ticks(5);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height-margin})`)
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("Percent of Directors");

}

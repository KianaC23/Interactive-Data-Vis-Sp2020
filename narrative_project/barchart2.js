export function barchart() {

  // data load
  // reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
  d3.csv("../data/top10films2018.csv", d3.autoType).then(data => {
      console.log(data);
    
      /** CONSTANTS */
      // constants help us reference the same values throughout our code
      const paddingInner = 0.2;
      const margin = { top: 10, bottom: 10, left: 200, right: 40 };
      const width = 1500- margin.left - margin.right;
      const height =1000 - margin.top - margin.bottom;
    
    
      var svg = d3.select("#barchart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
      var x = d3.scaleLinear()
        .range([20, width])
        .domain([20, d3.max(data, d => d.Total_Gross)])
        //.descending(data,d => d.Total_Gross[0],d.Total_Gross[1]);
    
      var y = d3.scaleBand()
        .range([height, 0])
        .domain(data.map(d => d.Title))
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
    
      var gx = svg.append("g")
        .attr("class", "x axis")
        .attr("transform",`translate(0, ${height- margin.left})`)
       // .call(xAxis)
    
      var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
    
      //append rects
      bars.append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.Title))
        .attr("height", y.bandwidth())
        .attr("x",0)
        .attr("fill", "blue")
        .attr("width", d => x(d.Total_Gross));
    
            //add a value label to the right of each bar
      bars.append("text")
        .attr("class", "label")
                //y position of the label is halfway down the bar
        .attr("y", d =>  y(d.Title) + y.bandwidth() / 2 + 4)
                //x position is 3 pixels to the right of the bar
        .attr("x", d => x(d.Total_Gross) + 40)
      .text(d => d.Total_Gross);
    });
 }   

// export{Barchart}
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

 let svg;

 let state = {
  geojson: null,
  independence: null,
  hover: {
    colonizer: null,
    year: null,
    country: null,
  },
};

 Promise.all([
    d3.json("../../data/africa.json"),
    d3.csv("../../data/independence.csv", d3.autoType),
  ]).then(([geojson, independence]) => {
      state.geojson = geojson;
      state.independence = independence;
       console.log("state: ", state);
       //update(json)
      init();
  });
  

function init(){

   const projection = d3.geoMercator()
      .fitSize([width,height], state.geojson)
      .scale(400)
      .translate([200, 280])
      .center([0, 5]);

   const path = d3.geoPath().projection(projection);

  svg = d3
    .select('#africa-map')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  svg 
  .selectAll('.country')
  .data(state.geojson.features)
  .join('path')
  .attr('d', path)
  .attr("class",".country")
  .attr('fill','yellow')
  //.attr('fill', d =>color(data.get(d.id)) )
  .attr('stroke','black')
  .on('mouseover', d =>{
    state.hover['.country'] = d.properties.name;
    draw();
  })

  // svg 
  // .selectAll('.country')
  // .data(state.independence)
  // .attr('fill', d =>{
  //     if (d.Colonial_power === "France") return "blue";
  //       else if (d.Colonial_power === "United Kingdom") return "red";
  //       else if (d.Colonial_power === "Spain") return "orange";
  //       else if (d.Colonial_power === "Portugal") return "green";
  //       else if (d.Colonial_power === "Belgium") return "purple";
  //       else return "grey";
  //       draw();
  // });

  draw();
}


function draw (){
  hoverData = Object.entries(state.hover);

  d3.select("#hover-content")
    .selectAll("div.row")
    .data(hoverData)
    .join("div")
    .attr("class", "row")
    .html(
      d =>
        // each d is [key, value] pair
        d[1] // check if value exist
          ? `${d[0]}: ${d[1]}` // if they do, fill them in
          : null // otherwise, show nothing
    );

}
  // const handleMouseover = d => {
  //   const pixelArea = geoGenerator.area(d);
  //   const bounds = geoGenerator.bounds(d);
  //   const centroid = geoGenerator.centroid(d);
  //   const measure = geoGenerator.measure(d);

  //   d3.select('#content .info')
  //     .text(d.properties.name +
  //       ' (path.area = ' + pixelArea.toFixed(1) +
  //       ' path.measure = ' + measure.toFixed(1) + ')');

  //   d3.select('#content .bounding-box rect')
  //     .attr('x', bounds[0][0])
  //     .attr('y', bounds[0][1])
  //     .attr('width', bounds[1][0] - bounds[0][0])
  //     .attr('height', bounds[1][1] - bounds[0][1]);

  //   d3.select('#content .centroid')
  //     .style('display', 'inline')
  //     .attr('transform', `translate(${centroid})`);

    // d3.select("#content g.map")  
    //   .attr("fill", json =>{
    //     if (d.Colonial_power === "France") return "blue";
    //     else if (d.Colonial_power === "United Kingdom") return "red";
    //     else if (d.Colonial_power === "Spain") return "orange";
    //     else if (d.Colonial_power === "Portugal") return "green";
    //     else if (d.Colonial_power === "Belgium") return "brown";
    //     else return "grey";
    // });


//   };
// }
    const update = geojson => {
      const u = d3.select('#content g.map')
        .selectAll('path')
        .data(geojson.features)

      u.enter()
        .append('path')
        .attr('d', geoGenerator)
        .on('mouseover', handleMouseover);
    };

//    // Fetch data
//     // d3.json('../../data/africa.json', function(err, json) {
//     //   //update(json)
//     // });

    






  
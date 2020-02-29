/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;
  default_selection = "DC Character Gender"

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let yAxis;

const formatAppearances = (num) => d3.format(" ")
/* APPLICATION STATE */
let state = {
  data: [],
  selectedName: null, // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv("../data/dc-wikia-data.csv", d =>({
  year: new Date(d.Year,0,1),
  name: d.SEX,
  appearances: +d.APPEARANCES,
})).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
  xScale = d3
    .scaleTime()
    .domain(d3.extent(state.data, d => d.year))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain([0,d3.max(state.data, d => d.appearances)])
    .range([height - margin.bottom, margin.top]);

  // + AXES
  const xAxis = d3.axisBottom(xScale);
  yAxis = d3.axisLeft(yScale).ticks(10);

  // + UI ELEMENT SETUP

  const selectElement = d3.select("#dropdown").on("change", function() {
    // `this` === the selectElement
    // 'this.value' holds the dropdown value a user just selected
    state.selectedName = this.value; // + UPDATE STATE WITH YOUR SELECTED VALUE
    console.log("new value is", this.value);
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data([...Array.from(new Set(state.data.map(d => d.name))),
      default_selection,]) // + ADD DATA VALUES FOR DROPDOWN
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // + SET SELECT ELEMENT'S DEFAULT VALUE (optional)
  selectElement.property("value",default_selection);
  // + CREATE SVG ELEMENT
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height",height);

  // add xAxis
  svg
    .append("g")
    .attr("class","axis x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Year of First Appearance");


  svg
    .append("g")
    .attr("class","axis y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("y", "50%")
    .attr("dx", "-3em")
    .attr("writing-mode", "vertical-rl")
    .text("Number of Appearances");

  // + CALL AXES

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  // + FILTER DATA BASED ON STATE
  let filteredData = [];
  if(state.selectedName !== null) {
    filteredData = state.data.filter( d => d.name === state.selectedName);
  }
//update y scale for each new entry
  yScale.domain([0, d3.max(filteredData, d => d.appearances)]);

  d3.select("g.y-axis")
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale));
  
  const lineFunc = d3
    .line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.appearances));

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.year)
    .join(
      enter =>
    //enter selections
        enter
          .append("circle")
          .attr("class","dot") //create dot class
          .attr("r", radius)
          .attr("cy", height - margin.bottom)
          .attr("cx", d => xScale(d.year))
          .attr("fill", d => {
            if(d.name === "Transgender Characters") return "purple";
            else if (d.name === "Male Characters") return "blue";
            else if (d.name === "Female Characters") return "red";
            else if (d.name === "Genderless Characters") return "green";
            else return "gray";
          }),
      update => update,
      exit =>
        exit.call(exit =>
          exit
            .transition()
            .delay(d => d.year)
            .duration(500)
            .attr("cy", height - margin.bottom)
            .remove()  
        )
    )

    .call(
      selection =>
        selection
          .transition()
          .duration(1000)
          .attr("cy", d => yScale(d.appearances))

    );
  
  const line = svg
    .selectAll("path.trend")
    .data([filteredData])
    .join(
      enter =>
        enter
          .append("path")
          .attr("class","trend")
          .attr("opacity", 0),
      update => update,
      exit => exit.remove()
    )
    .call(selection =>
      selection
        .transition() // sets the transition on the 'Enter' + 'Update' selections together.
        .duration(1000)
        .attr("opacity", 1)
        .attr("d", d => lineFunc(d))
    );

     

//   // + UPDATE SCALE(S), if needed
//   //
//   // + UPDATE AXIS/AXES, if needed
//   //
//   // + DRAW CIRCLES, if you decide to
//   // const dot = svg
//   //   .selectAll("circle")
//   //   .data(filteredData, d => d.name)
//   //   .join(
//   //     enter => enter, // + HANDLE ENTER SELECTION
//   //     update => update, // + HANDLE UPDATE SELECTION
//   //     exit => exit // + HANDLE EXIT SELECTION
//   //   );
//   //
//   // + DRAW LINE AND AREA
 }

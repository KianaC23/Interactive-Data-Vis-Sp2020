// import our components
import { treemap } from "./treemap.js"
import { barchart } from "./barchart.js";
import { linechart } from "./linechart.js";


 treemap();
 linechart();
 barchart();
// let treemap, barchart, linechart;

// // global state
// // let state = {
// //   data: [],
// //   //domain: [],
// //   selectedState: null,
// // };


// function init() {
//   treemap = new Treemap(state, setGlobalState);
//   barchart = new Barchart(state, setGlobalState);
//   linechart = new Linechart(state, setGlobalState);
//   draw();
// }

// function draw() {
//   treemap.draw(state);
//   barchart.draw(state, setGlobalState);
//   linechart.draw(state, setGlobalState);
// }

// // UTILITY FUNCTION: state updating function that we pass to our components so that they are able to update our global state object
// function setGlobalState(nextState) {
//   state = { ...state, ...nextState };
//   console.log("new state:", state);
//   draw();
// }
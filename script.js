import Playback from "./src/playback.js";
import PathFindingVisualizer from "./src/pathfindingVisualizer.js";

var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");

var CVS_WIDTH = 900;
var CVS_HEIGHT = 600;

canvas.width = CVS_WIDTH;
canvas.height = CVS_HEIGHT;


var visualizer = new PathFindingVisualizer(20, 20, ctx);
var playback = new Playback(visualizer);

window.playback = playback;






// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

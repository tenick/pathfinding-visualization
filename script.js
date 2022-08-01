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

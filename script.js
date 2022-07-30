import Playback from "./playback.js";
import PathFindingVisualizer from "./pathfindingVisualizer.js";

var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");

var CVS_WIDTH = 700;
var CVS_HEIGHT = 700;

canvas.width = CVS_WIDTH;
canvas.height = CVS_HEIGHT;


var visualizer = new PathFindingVisualizer(30, 30, ctx);
var playback = new Playback(visualizer);

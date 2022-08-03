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
  modal.style.display = "flex";
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



// When the user selects a new algorithm, change displayed algorithm information
var algorithmDefinitionDiv = document.getElementById('algorithmDefinitionDiv');
var algorithmDropdown = document.getElementById('algorithmDropdown');
algorithmDropdown.addEventListener('change', e => {
    switch(algorithmDropdown.value){
        case 'dfs':
            algorithmDefinitionDiv.innerHTML = 'DFS uses a stack data structure to traverse the grid. The starting node will the only node in the stack at the beginning. Peek the stack and check if it is the ending node, if not it will arbitrarily get the next unvisited neighbor node and push it to the stack. If all neighbors are already visited it will pop the current node in the stack to backtrack. Repeat operation until end node is found or stack is empty.';
            break;
        case 'bfs':
            algorithmDefinitionDiv.innerHTML = 'BFS uses a queue data structure to traverse the grid. The starting node will be the only node in the queue at the beginning. Dequeue the queue and check if it is the ending node, if not it will queue all of its unvisited and unqueued neighbors. Repeat operation until end node is found or queue is empty. ';
            break;
        case 'dijkstra':
            algorithmDefinitionDiv.innerHTML = 'Dijkstra\'s algorithm uses a priority queue to traverse the grid. The next neighbor node to be chosen should have the least currently known distance from the starting node, but since the grid used here can be represented as an unweighted graph, Dijkstra\'s algorithm will effictively work like a BFS, since all edge weights are equal a priority queue will work exactly like a queue.';
            break;
        case 'astar':
            algorithmDefinitionDiv.innerHTML = 'A* algorithm uses an priority queue (the openList) and either a hashtable or a 2d array (the closed list). g(n), h(n), and f(n) will be calculated for all nodes on visit, where n = current node, g(n) = distance from start node to n, h(n) = estimated distance from n to end node (in this case I used manhattan distance to calculate h(n)), and f(n) = g(n) + h(n). The starting node will be the only node in the openList at the beginning. Dequeue the openList, returning the node with the least f(n), calculate g(n), h(n), and f(n) of all its neighbors and queue them to the openList. If neighbor is already in openList, check if new g(n) is lower than its last calculated g(n), if lower then update its g(n) and parent node. Repeat operation until end node is found or openList is empty.';
            break;
    }
})
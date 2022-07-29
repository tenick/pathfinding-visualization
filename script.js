var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");

var CVS_WIDTH = 700;
var CVS_HEIGHT = 700;

canvas.width = CVS_WIDTH;
canvas.height = CVS_HEIGHT;


var visualizer = new PathFindingVisualizer(50, 50, ctx);
visualizer.draw();

var algorithm = document.getElementById("algorithm");
function execute(){
    let algo = null;
    switch (algorithm.value){
        case "dfs":
            algo = new DFS(visualizer, visualizer.grid, visualizer.startNode, visualizer.endNode);
            break;
        case "bfs":
            algo = new BFS(visualizer, visualizer.grid, visualizer.startNode, visualizer.endNode);
            break;
        case "astar":
            algo = new AStar(visualizer, visualizer.grid, visualizer.startNode, visualizer.endNode);
            break;
    }

    visualizer.algorithm = algo;
    visualizer.execute();
}
function update(){
    let newGridSize = parseInt(document.querySelector("input[type='number']").value);
    visualizer = new PathFindingVisualizer(newGridSize, newGridSize, ctx);
    visualizer.draw();
}


var playbackRange = document.getElementById('playbackRange');
function rangeInput(){
    let frameIndex = playbackRange.value;
    if (visualizer.algorithm.frames.length == 0)
        return;

    playbackRange.min = 0;
    playbackRange.max = visualizer.algorithm.frames.length - 1;

    let grid = visualizer.algorithm.grid;
    visualizer.draw(grid);
    
    let currVisited = visualizer.algorithm.frames[frameIndex];


    let CELL_WIDTH =  700 / grid[0].length; // IMPORTANTTTT CHANGE DA 500  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
    let CELL_HEIGHT = 700 / grid.length;

    visualizer.ctx.fillStyle = "#1111FF";
    visualizer.ctx.globalAlpha = 0.5;

    for (let i = 0; i < currVisited.length; i++){
        for (let j = 0; j < currVisited[i].length; j++){
            let cell = currVisited[i][j];
            if (cell)
                this.ctx.fillRect(i * CELL_WIDTH, j * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
        }
    }
    visualizer.ctx.globalAlpha = 1;
    

}

// add canvas events
var editMode = false;
var editType = document.querySelector('input[type="radio"]:checked').value;

window.addEventListener("mousedown", function(e) {
    editMode = true;
    editType = document.querySelector('input[type="radio"]:checked').value;
}, true);

window.addEventListener("mouseup", function(e) {
    editMode = false;
}, true);

canvas.addEventListener("mousemove", function(e) {
    if (editMode) editGrid(e);
}, true);
canvas.addEventListener("mousedown", function(e) {
    if (editMode) editGrid(e);
}, true);

function editGrid(e){
    let x = e.offsetX;
    let y = e.offsetY;

    let CELL_WIDTH =  CVS_WIDTH / visualizer.grid.length;
    let CELL_HEIGHT = CVS_HEIGHT / visualizer.grid[0].length;

    let r = Math.floor(y / CELL_HEIGHT);
    let c = Math.floor(x / CELL_WIDTH); 

    let newCellVal = GridObject.EMPTY;
    switch(editType){
        case "Start Node":
            if (visualizer.grid[r][c] != GridObject.EMPTY)
                return;

            // remove previous start node
            visualizer.grid[visualizer.startNode[0]][visualizer.startNode[1]] = GridObject.EMPTY;
            visualizer.startNode = [r, c];

            newCellVal = GridObject.START;
            break;
        case "End Node":
            if (visualizer.grid[r][c] != GridObject.EMPTY)
                return;

            // remove previous end node
            visualizer.grid[visualizer.endNode[0]][visualizer.endNode[1]] = GridObject.EMPTY;
            visualizer.endNode = [r, c];

            newCellVal = GridObject.END;
            break;
        case "Draw Wall":
            if (visualizer.grid[r][c] != GridObject.EMPTY)
                return;

            newCellVal = GridObject.WALL;
            break;
        case "Erase Wall":
            if (visualizer.grid[r][c] != GridObject.WALL)
                return;

            newCellVal = GridObject.EMPTY;
            break;
    }

    visualizer.grid[r][c] = newCellVal;
    visualizer.draw();
}
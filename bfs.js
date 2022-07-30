import {GridObject} from "./pathfindingVisualizer.js";

// BFS playback data structure:
/* { 
    grid: grid (required), 
    startNode: startNode (required), 
    endNode: endNode (required), 
    pathFromStartToEnd: [coords1, coords2, ...], // (nullable, null = !reached_end) 
    frames: [{ // the actual frames, drawn over the grid, this.length = no. of frames
        visitedArray: [[true/false, ...], [true/false, ...], ...], // current status of the visited array
        operation: string, // name of the operation
        operation_description: string, // description of the operation
        coordinates: [], // the coordinates affected currently in the grid
        color: [] // color of each coordinate, coordinates.length == color.length
    }, {...}, ...]
} 
*/
export class BFSFrame {
    constructor(visitedArray, queue, operation, operationDescription, coordinates, color, path){
        this.visitedArray = visitedArray;
        this.queue = queue;
        this.operation = operation;
        this.operationDescription = operationDescription;
        this.coordinates = coordinates;
        this.color = color;
        this.path = path;
    }
}

export default class BFS {
    constructor(visualizer){
        this.visualizer = visualizer;
        this.ctx = visualizer.ctx;
        this.grid = visualizer.grid;
        this.startNode = visualizer.startNode;
        this.endNode = visualizer.endNode;
        this.pathFromStartToEnd = null;
        this.frames = [];
    }
    async execute(){
        let ctx = this.visualizer.ctx;

        let reached_end = false;
        let dr = [-1, 1, 0, 0];
        let dc = [0, 0, 1, -1];

        // initialize queue
        let queue = [this.startNode];

        // false-initialized visited grid, then add start node as visited
        let visited = new Array(this.grid.length);
        for (let i = 0; i < visited.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = false;
            visited[i] = a;
        }

        this.frames.push(new BFSFrame(
            JSON.parse(JSON.stringify(visited)),
            JSON.parse(JSON.stringify(queue)),
            "Initialization",
            "Initializing empty queue"
        ));
        visited[this.startNode[0]][this.startNode[1]] = true;
        this.frames.push(new BFSFrame(
            JSON.parse(JSON.stringify(visited)),
            JSON.parse(JSON.stringify(queue)),
            "Initialization",
            "Add start node to queue",
            [this.startNode],
            ["#1F1"]
        ));


        // null-initialized prevNode grid, then add start node as its own parent
        let prevNode = new Array(this.grid.length);
        for (let i = 0; i < prevNode.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = null;
            prevNode[i] = a;
        }
        prevNode[this.startNode[0]][this.startNode[1]] = this.startNode;
        
        
        this.frames.push(new BFSFrame(
            JSON.parse(JSON.stringify(visited)),
            [],
            "Start",
            "Run BFS"
        ));

        // BFS
        while (queue.length > 0) {
            let currentNode = queue.shift();

            this.frames.push(new BFSFrame(
                JSON.parse(JSON.stringify(visited)),
                JSON.parse(JSON.stringify(queue)),
                "Pop queue",
                "Gets next element in queue",
                [currentNode],
                ["#FF1"]
            ));
            
            visited[currentNode[0]][currentNode[1]] = true;

            this.frames.push(new BFSFrame(
                JSON.parse(JSON.stringify(visited)),
                JSON.parse(JSON.stringify(queue)),
                "Visit",
                "Set popped element to visited",
                [currentNode],
                ["#11F"]
            ));

            let CELL_WIDTH =  this.ctx.canvas.width / this.grid[0].length;
            let CELL_HEIGHT = this.ctx.canvas.height / this.grid.length;

            ctx.strokeStyle = "#AAAAFF";

            ctx.fillStyle = "#11F";

            ctx.strokeRect(currentNode[1] * CELL_WIDTH, currentNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            ctx.fillRect(currentNode[1] * CELL_WIDTH, currentNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);



            // check if current node reached end
            if (currentNode[0] == this.endNode[0] && currentNode[1] == this.endNode[1]){
                this.frames.push(new BFSFrame(
                    JSON.parse(JSON.stringify(visited)),
                    JSON.parse(JSON.stringify(queue)),
                    "End",
                    "End is found!",
                    [this.endNode],
                    ["#1F1"]
                ));
                reached_end = true;
                break;
            }
            

            // enqueue neighbors
            for (let i = 0; i < 4; i++){
                let rr = currentNode[0] + dr[i];
                let cc = currentNode[1] + dc[i];

                let neighborNode = [rr, cc];

                // out of bounds check
                if (rr < 0 || cc < 0) continue;
                if (rr >= this.grid.length || cc >= this.grid[0].length) continue;

                this.frames.push(new BFSFrame(
                    JSON.parse(JSON.stringify(visited)),
                    JSON.parse(JSON.stringify(queue)),
                    "Enqueue neighbors",
                    "Adds neighboring cells in queue",
                    [neighborNode],
                    ["#F1F"]
                ));

                // visited / queued / wall check
                if (visited[rr][cc]){
                    this.frames.push(new BFSFrame(
                        JSON.parse(JSON.stringify(visited)),
                        JSON.parse(JSON.stringify(queue)),
                        "Queueing... Can't queue!",
                        "Cell is already visited!",
                        [neighborNode],
                        ["#F11"]
                    ));
                    continue;
                }

                if (this.isQueued(queue, neighborNode)){
                    this.frames.push(new BFSFrame(
                        JSON.parse(JSON.stringify(visited)),
                        JSON.parse(JSON.stringify(queue)),
                        "Queueing... Can't queue!",
                        "Cell is already queued!",
                        [neighborNode],
                        ["#F11"]
                    ));
                    continue;
                }

                if (this.grid[rr][cc] == GridObject.WALL) {
                    this.frames.push(new BFSFrame(
                        JSON.parse(JSON.stringify(visited)),
                        JSON.parse(JSON.stringify(queue)),
                        "Queueing... Can't queue!",
                        "Cell is a wall!",
                        [neighborNode],
                        ["#F11"]
                    ));
                    continue;
                }

                queue.push(neighborNode);
                prevNode[rr][cc] = currentNode;
            }

            await new Promise(r => setTimeout(r, 1));
        }

        if (reached_end){
            let currNode = this.endNode;
            while (currNode != this.startNode){
                let CELL_WIDTH =  this.ctx.canvas.width / this.grid[0].length;
                let CELL_HEIGHT = this.ctx.canvas.height / this.grid.length;

                ctx.strokeStyle = "#AAAAFF";

                ctx.fillStyle = "#1F1";

                ctx.strokeRect(currNode[1] * CELL_WIDTH, currNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillRect(currNode[1] * CELL_WIDTH, currNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

                currNode = prevNode[currNode[0]][currNode[1]];

                await new Promise(r => setTimeout(r, 1));
            }
            alert("ending found!");
        }
        else {
            this.frames.push(new BFSFrame(
                JSON.parse(JSON.stringify(visited)),
                JSON.parse(JSON.stringify(queue)),
                "End",
                "No end was found."
            ));
        }
    }
    
    isQueued(queue, node){
        for (let i = 0; i < queue.length; i++){
            let nodeQueue = queue[i];
            if (node[0] == nodeQueue[0] && node[1] == nodeQueue[1])
                return true;
        }
        return false;
    }

    drawFrame(frameIndex){
        if (this.frames.length == 0)
            return;

        this.visualizer.draw(this.grid);
        
        let currFrame = this.frames[frameIndex];

        let CELL_WIDTH =  this.ctx.canvas.width / this.grid[0].length;
        let CELL_HEIGHT = this.ctx.canvas.height / this.grid.length;

        // draw visited grid
        this.ctx.fillStyle = "#11F";
        this.ctx.globalAlpha = 0.8;

        for (let r = 0; r < currFrame.visitedArray.length; r++){
            for (let c = 0; c < currFrame.visitedArray[r].length; c++){
                let cell = currFrame.visitedArray[r][c];
                if (cell)
                    this.ctx.fillRect(c * CELL_WIDTH, r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            }
        }

        // draw queue
        this.ctx.globalAlpha = 0.5;
        for (let i = 0; i < currFrame.queue.length; i++){
            let queuedNode = currFrame.queue[i];
            this.ctx.fillRect(queuedNode[1] * CELL_WIDTH, queuedNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
        }

        // draw current operation
        if (currFrame.operation != null){

            if (currFrame.coordinates != null){
                // draw the coordinates with the corresponding colors
                for (let i = 0; i < currFrame.coordinates.length; i++){
                    let coord = currFrame.coordinates[i];
                    let coordColor = currFrame.color[i];

                    this.ctx.fillStyle = coordColor;
                    this.ctx.fillRect(coord[1] * CELL_WIDTH, coord[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                }
            }
            

            // write to UI
            let frameInfoDiv = document.getElementById('frameInfoDiv');
            frameInfoDiv.innerHTML = '<p><b>Iteration: </b>'+ frameIndex + '/' + (this.frames.length - 1) +'</p>';
            if (currFrame.coordinates != null)
                frameInfoDiv.innerHTML += '<p><b>Cell/s: </b>'+ currFrame.coordinates +'</p>';
            frameInfoDiv.innerHTML += '<p><b>Operation: </b>'+ currFrame.operation +'</p>';
            frameInfoDiv.innerHTML += '<p><b>Description: </b>'+ currFrame.operationDescription +'</p>';
        }

        this.ctx.globalAlpha = 1;


        
    }
}
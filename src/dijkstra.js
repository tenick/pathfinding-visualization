import { GridObject } from "./pathfindingVisualizer.js";
import { drawPath } from "./utils.js";

export class DijkstraNode {
    constructor(r, c, distance=Infinity, visited=false, parent=null){
        this.r = r;
        this.c = c;
        this.distance = distance;
        this.visited = visited;
        this.parent = parent;
    }

    static DrawNode(djikstraNode, grid, ctx, distSize=.8){
        let CELL_WIDTH =  ctx.canvas.width / grid[0].length;
        let CELL_HEIGHT = ctx.canvas.height / grid.length;

        // draw the bg
        if (djikstraNode.visited){
            ctx.globalAlpha = .8;
            ctx.fillStyle = "#222";
            ctx.fillRect(djikstraNode.c * CELL_WIDTH, djikstraNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
        }

        // draw distance text
        ctx.globalAlpha = 1;
        if (djikstraNode.distance == null)
            ctx.fillStyle = "#222";
        else
            ctx.fillStyle = "#EEE";

        let distPixelSize = Math.floor(distSize * CELL_HEIGHT);

        ctx.font = distPixelSize + "px Monospace";

        let distText = djikstraNode.distance;
        if (djikstraNode.distance == null)
            distText = '∞';
        ctx.fillText(distText, djikstraNode.c * CELL_WIDTH, djikstraNode.r * CELL_HEIGHT + distPixelSize);
    }
}

export class DijkstraFrame {
    constructor(dijkstraGrid, queue, operation, operationDescription, coordinates, color, path){
        this.dijkstraGrid = dijkstraGrid;
        this.queue = queue;
        this.operation = operation;
        this.operationDescription = operationDescription;
        this.coordinates = coordinates;
        this.color = color;
        this.path = path;
    }
}

export default class Dijkstra {
    constructor(visualizer){
        this.visualizer = visualizer;
        this.ctx = visualizer.ctx;
        this.grid = JSON.parse(JSON.stringify(visualizer.grid));
        this.startNode = JSON.parse(JSON.stringify(visualizer.startNode));
        this.endNode = JSON.parse(JSON.stringify(visualizer.endNode));
        this.pathFromStartToEnd = null;
        this.frames = [];
    }
    async execute(){
        let ctx = this.visualizer.ctx;

        let reached_end = false;
        let dr = [-1, 1, 0, 0];
        let dc = [0, 0, 1, -1];

        // infinity-initialized dijkstra grid
        let dijkstraGrid = new Array(this.grid.length);
        for (let i = 0; i < dijkstraGrid.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) {
                if (this.grid[i][j] != GridObject.WALL)
                    a[j] = new DijkstraNode(i, j);
            }
            dijkstraGrid[i] = a;
        }
        
        // initialize queue
        let queue = [];

        this.frames.push(new DijkstraFrame(
            JSON.parse(JSON.stringify(dijkstraGrid)),
            JSON.parse(JSON.stringify(queue)),
            "Initialization",
            "Initializing empty queue"
        ));
        
        queue.push(new DijkstraNode(this.startNode[0], this.startNode[1], 0, false, null));
        dijkstraGrid[this.startNode[0]][this.startNode[1]] = queue[0];

        this.frames.push(new DijkstraFrame(
            JSON.parse(JSON.stringify(dijkstraGrid)),
            JSON.parse(JSON.stringify(queue)),
            "Initialization",
            "Enqueue start node to queue and add to Dijkstra Grid with 0 distance"
        ));

        this.frames.push(new DijkstraFrame(
            JSON.parse(JSON.stringify(dijkstraGrid)),
            JSON.parse(JSON.stringify(queue)),
            "Start",
            "Run Dijkstra's Algorithm"
        ));

        // Djikstra's algorithm
        while (queue.length > 0) {
            let currentNode = queue.shift();

            this.frames.push(new DijkstraFrame(
                JSON.parse(JSON.stringify(dijkstraGrid)),
                JSON.parse(JSON.stringify(queue)),
                "Pop queue",
                "Gets next element in queue",
                [currentNode],
                ["#FF1"]
            ));
            
            currentNode.visited = true;

            this.frames.push(new DijkstraFrame(
                JSON.parse(JSON.stringify(dijkstraGrid)),
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

            ctx.strokeRect(currentNode.c * CELL_WIDTH, currentNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            ctx.fillRect(currentNode.c * CELL_WIDTH, currentNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);



            // check if current node reached end
            if (currentNode.r == this.endNode[0] && currentNode.c == this.endNode[1]){
                this.frames.push(new DijkstraFrame(
                    JSON.parse(JSON.stringify(dijkstraGrid)),
                    JSON.parse(JSON.stringify(queue)),
                    "End",
                    "End is found!",
                    [currentNode],
                    ["#1F1"]
                ));
                reached_end = true;
                break;
            }
            

            // enqueue neighbors
            for (let i = 0; i < 4; i++){
                let rr = currentNode.r + dr[i];
                let cc = currentNode.c + dc[i];

                let neighborNode = new DijkstraNode(rr, cc, currentNode.distance + 1, false, currentNode);
                // out of bounds check
                if (rr < 0 || cc < 0) continue;
                if (rr >= this.grid.length || cc >= this.grid[0].length) continue;

                this.frames.push(new DijkstraFrame(
                    JSON.parse(JSON.stringify(dijkstraGrid)),
                    JSON.parse(JSON.stringify(queue)),
                    "Enqueue neighbors",
                    "Adds neighboring cells in queue",
                    [neighborNode],
                    ["#F1F"]
                ));

                // wall check / visited / queued 
                if (this.grid[rr][cc] == GridObject.WALL) {
                    this.frames.push(new DijkstraFrame(
                        JSON.parse(JSON.stringify(dijkstraGrid)),
                        JSON.parse(JSON.stringify(queue)),
                        "Queueing... Can't queue!",
                        "Cell is a wall!",
                        [neighborNode],
                        ["#F11"]
                    ));
                    continue;
                }

                if (dijkstraGrid[rr][cc].visited){
                    this.frames.push(new DijkstraFrame(
                        JSON.parse(JSON.stringify(dijkstraGrid)),
                        JSON.parse(JSON.stringify(queue)),
                        "Queueing... Can't queue!",
                        "Cell is already visited!",
                        [neighborNode],
                        ["#F11"]
                    ));
                    continue;
                }

                if (this.isQueued(queue, neighborNode)){
                    this.frames.push(new DijkstraFrame(
                        JSON.parse(JSON.stringify(dijkstraGrid)),
                        JSON.parse(JSON.stringify(queue)),
                        "Queueing... Can't queue!",
                        "Cell is already queued!",
                        [neighborNode],
                        ["#F11"]
                    ));
                    continue;
                }


                queue.push(neighborNode);
                dijkstraGrid[rr][cc] = neighborNode;
            }

            await new Promise(r => setTimeout(r, 1));
        }

        if (reached_end){
            let currNode = dijkstraGrid[this.endNode[0]][this.endNode[1]];
            let path = [[currNode.r, currNode.c]];

            while (currNode.parent != null){
                let CELL_WIDTH =  this.ctx.canvas.width / this.grid[0].length;
                let CELL_HEIGHT = this.ctx.canvas.height / this.grid.length;

                ctx.strokeStyle = "#AAAAFF";
                ctx.fillStyle = "#1F1";

                ctx.strokeRect(currNode.c * CELL_WIDTH, currNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillRect(currNode.c * CELL_WIDTH, currNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

                currNode = currNode.parent;
                path.push([currNode.r, currNode.c]);

                await new Promise(r => setTimeout(r, 1));
            }

            this.frames.push(new DijkstraFrame(
                JSON.parse(JSON.stringify(dijkstraGrid)),
                JSON.parse(JSON.stringify(queue)),
                "Draw Path",
                "Drawing path from start to end.",
                null,
                null,
                path
            ));

            alert("ending found!");
        }
        else {
            this.frames.push(new DijkstraFrame(
                JSON.parse(JSON.stringify(dijkstraGrid)),
                JSON.parse(JSON.stringify(queue)),
                "End",
                "No end was found."
            ));
        }
    }
    
    isQueued(queue, node){
        for (let i = 0; i < queue.length; i++){
            let nodeQueue = queue[i];
            if (node.r == nodeQueue.r && node.c == nodeQueue.c)
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

        // draw djikstra grid
        for (let r = 0; r < currFrame.dijkstraGrid.length; r++){
            for (let c = 0; c < currFrame.dijkstraGrid[r].length; c++){
                if (this.grid[r][c] != GridObject.WALL){
                    let cell = currFrame.dijkstraGrid[r][c];
                    DijkstraNode.DrawNode(cell, this.grid, this.ctx);
                }
                
            }
        }

        // draw queue
        for (let i = 0; i < currFrame.queue.length; i++){
            let queuedNode = currFrame.queue[i];
            this.ctx.globalAlpha = 0.8;
            this.ctx.fillStyle = "#11F"
            this.ctx.fillRect(queuedNode.c * CELL_WIDTH, queuedNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

            DijkstraNode.DrawNode(queuedNode, this.grid, this.ctx);

        }

        // draw current operation
        if (currFrame.operation != null){
            this.ctx.globalAlpha = 0.6;

            if (currFrame.coordinates != null){
                // draw the coordinates with the corresponding colors
                for (let i = 0; i < currFrame.coordinates.length; i++){
                    let coord = currFrame.coordinates[i];
                    let coordColor = currFrame.color[i];

                    this.ctx.fillStyle = coordColor;
                    this.ctx.fillRect(coord.c * CELL_WIDTH, coord.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                }
            }
            

            // write to UI
            let frameInfoDiv = document.getElementById('frameInfoDiv');
            frameInfoDiv.innerHTML = '<p><b>Iteration: </b>'+ frameIndex + '/' + (this.frames.length - 1) +'</p>';
            if (currFrame.coordinates != null){
                let newCoords = [];
                for (let i = 0; i < currFrame.coordinates.length; i++){
                    let coord = currFrame.coordinates[i];
                    newCoords.push([coord.r, coord.c]);
                }
                frameInfoDiv.innerHTML += '<p><b>Cell/s: </b>'+ newCoords +'</p>';
            }
            frameInfoDiv.innerHTML += '<p><b>Operation: </b>'+ currFrame.operation +'</p>';
            frameInfoDiv.innerHTML += '<p><b>Description: </b>'+ currFrame.operationDescription +'</p>';
        }
        
        this.ctx.globalAlpha = 1;

        if (currFrame.path != null){
            drawPath(this.grid, currFrame.path, this.ctx);
        }
    }
}
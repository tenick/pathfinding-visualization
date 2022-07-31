import {GridObject} from "./pathfindingVisualizer.js";
import { drawPath } from "./utils.js";

export class DFSFrame {
    constructor(visitedArray, backtrackArray, operation, operationDescription, coordinates, color, path){
        this.visitedArray = visitedArray;
        this.backtrackArray = backtrackArray;
        this.operation = operation;
        this.operationDescription = operationDescription;
        this.coordinates = coordinates;
        this.color = color;
        this.path = path;
    }
}

export default class DFS {
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
        let dr = [0, -1, 0, 1];
        let dc = [1, 0, -1, 0];

        // false-initialized visited grid, then add start node as visited
        let visited = new Array(this.grid.length);
        for (let i = 0; i < visited.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = false;
            visited[i] = a;
        }
        
        // false-initialized backtrack grid
        let backtracked = new Array(this.grid.length);
        for (let i = 0; i < backtracked.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = false;
            backtracked[i] = a;
        }
        
        // null-initialized prevNode grid, then add start node as its own parent
        let prevNode = new Array(this.grid.length);
        for (let i = 0; i < prevNode.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = null;
            prevNode[i] = a;
        }
        prevNode[this.startNode[0]][this.startNode[1]] = this.startNode;
        
        // initialize stack
        let stack = [];
        
        this.frames.push(new DFSFrame(
            JSON.parse(JSON.stringify(visited)),
            JSON.parse(JSON.stringify(backtracked)),
            "Initialization",
            "Initializing empty stack"
        ));
            
        stack.push(this.startNode);
        visited[this.startNode[0]][this.startNode[1]] = true;

        this.frames.push(new DFSFrame(
            JSON.parse(JSON.stringify(visited)),
            JSON.parse(JSON.stringify(backtracked)),
            "Initialization",
            "Push start node to stack, and mark it as visited",
            [this.startNode],
            ["#F1F"]
        ));

        while (stack.length > 0) {
            let currentNode = stack[stack.length - 1];

            let CELL_WIDTH =  this.ctx.canvas.width / this.grid[0].length;
            let CELL_HEIGHT = this.ctx.canvas.height / this.grid.length;

            ctx.strokeStyle = "#AAAAFF";
            ctx.fillStyle = "#11F";

            ctx.strokeRect(currentNode[1] * CELL_WIDTH, currentNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            ctx.fillRect(currentNode[1] * CELL_WIDTH, currentNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);


            // check if current node reached end
            if (currentNode[0] == this.endNode[0] && currentNode[1] == this.endNode[1]){
                this.frames.push(new DFSFrame(
                    JSON.parse(JSON.stringify(visited)),
                    JSON.parse(JSON.stringify(backtracked)),
                    "End",
                    "End is found!",
                    [this.endNode],
                    ["#1F1"]
                ));
                reached_end = true;
                break;
            }

            let foundNeighbor = false;
            for (let i = 0; i < 4; i++){
                let rr = currentNode[0] + dr[i];
                let cc = currentNode[1] + dc[i];
                let neighborCell = [rr, cc];

                // out of bounds check
                if (rr < 0 || cc < 0) continue;
                if (rr >= this.grid.length || cc >= this.grid[0].length) continue;


                this.frames.push(new DFSFrame(
                    JSON.parse(JSON.stringify(visited)),
                    JSON.parse(JSON.stringify(backtracked)),
                    "Push",
                    "Checking if there are neighbors we can visit",
                    [neighborCell],
                    ["#F1F"]
                ));

                // visited / wall check
                if (visited[rr][cc]) {
                    this.frames.push(new DFSFrame(
                        JSON.parse(JSON.stringify(visited)),
                        JSON.parse(JSON.stringify(backtracked)),
                        "Pushing... Can't push to stack!",
                        "Neighbor cell is already visited!",
                        [neighborCell],
                        ["#F11"]
                    ));
                    continue;
                }
                if (this.grid[rr][cc] == GridObject.WALL) {
                    this.frames.push(new DFSFrame(
                        JSON.parse(JSON.stringify(visited)),
                        JSON.parse(JSON.stringify(backtracked)),
                        "Pushing... Can't push to stack!",
                        "Neighbor cell is a wall!",
                        [neighborCell],
                        ["#F11"]
                    ));
                    continue;
                }

                foundNeighbor = true;
                stack.push(neighborCell);
                visited[rr][cc] = true;
                prevNode[rr][cc] = currentNode;
                break;
            }

            if (!foundNeighbor){
                let backtrackedCell = stack.pop();
                backtracked[backtrackedCell[0]][backtrackedCell[1]] = true;

                this.frames.push(new DFSFrame(
                    JSON.parse(JSON.stringify(visited)),
                    JSON.parse(JSON.stringify(backtracked)),
                    "Backtrack",
                    "No neighbor was found in this cell, need to pop stack and backtrack.",
                    [currentNode],
                    ["#111"]
                ));
            }

            await new Promise(r => setTimeout(r, 1));
        }


        if (reached_end){
            let currNode = this.endNode;
            let path = [currNode];

            while (currNode != this.startNode){
                let CELL_WIDTH =  this.ctx.canvas.width / this.grid[0].length;
                let CELL_HEIGHT = this.ctx.canvas.height / this.grid.length;

                ctx.strokeStyle = "#AAAAFF";
                ctx.fillStyle = "#1F1";

                ctx.strokeRect(currNode[1] * CELL_WIDTH, currNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillRect(currNode[1] * CELL_WIDTH, currNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

                currNode = prevNode[currNode[0]][currNode[1]];
                path.push(currNode);

                await new Promise(r => setTimeout(r, 1));
            }

            this.frames.push(new DFSFrame(
                JSON.parse(JSON.stringify(visited)),
                JSON.parse(JSON.stringify(backtracked)),
                "Draw Path",
                "Drawing path from start to end.",
                null,
                null,
                path
            ));

            alert("ending found!");
        }
        else {
            this.frames.push(new DFSFrame(
                JSON.parse(JSON.stringify(visited)),
                JSON.parse(JSON.stringify(backtracked)),
                "End",
                "No end was found."
            ));
        }
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
        this.ctx.globalAlpha = 0.5;

        for (let r = 0; r < currFrame.visitedArray.length; r++){
            for (let c = 0; c < currFrame.visitedArray[r].length; c++){
                let cell = currFrame.visitedArray[r][c];
                if (cell)
                    this.ctx.fillRect(c * CELL_WIDTH, r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            }
        }


        // draw backtracked grid
        this.ctx.fillStyle = "#222";
        this.ctx.globalAlpha = 0.8;

        for (let r = 0; r < currFrame.backtrackArray.length; r++){
            for (let c = 0; c < currFrame.backtrackArray[r].length; c++){
                let cell = currFrame.backtrackArray[r][c];
                if (cell)
                    this.ctx.fillRect(c * CELL_WIDTH, r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            }
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

        if (currFrame.path != null){
            drawPath(this.grid, currFrame.path, this.ctx);
        }
    }
}

import { GridObject } from "./pathfindingVisualizer.js";
import { drawPath, drawAStarNode } from "./utils.js";

export class AStarFrame{
    constructor(closedList, openList, operation, operationDescription, aStarNodes, color, path){
        this.closedList = closedList    ;
        this.openList = openList;
        this.operation = operation;
        this.operationDescription = operationDescription;
        this.aStarNodes = aStarNodes;
        this.color = color;
        this.path = path;
    }
}

export class AStarNode{
    constructor(r, c, g, h, parent){
        this.r = r;
        this.c = c;
        this.g = g;
        this.h = h;
        this.parent = parent;
    }
    f(){
        return this.g + this.h;
    }
}

export default class AStar{
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

        // null-initialized closedList grid (non-null cell means visited)
        let closedList = new Array(this.grid.length);
        for (let i = 0; i < closedList.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = null;
            closedList[i] = a;
        }
        

        // initalize open list
        let openList = [new AStarNode(this.startNode[0], this.startNode[1], 0, this.manhattanDist(this.startNode, this.endNode), null)];


        while (openList.length > 0){
            let currentNode = this.getBestPathNode(openList);

            this.frames.push(new AStarFrame(
                JSON.parse(JSON.stringify(closedList)),
                JSON.parse(JSON.stringify(openList)),
                "Getting best next path node.",
                "Best next path is chosen by minimizing f(n) and h(n)",
                [currentNode],
                ["#F11"]
            ));

            closedList[currentNode.r][currentNode.c] = currentNode;

            this.frames.push(new AStarFrame(
                JSON.parse(JSON.stringify(closedList)),
                JSON.parse(JSON.stringify(openList)),
                "Visit",
                "Mark chosen best next path node as closed.",
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
                this.frames.push(new AStarFrame(
                    JSON.parse(JSON.stringify(closedList)),
                    JSON.parse(JSON.stringify(openList)),
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

                let newNeighborAStarNode = new AStarNode(rr, cc, currentNode.parent ? currentNode.g + 1 : 1, this.manhattanDist([rr, cc], this.endNode), currentNode);

                // out of bounds check
                if (rr < 0 || cc < 0) continue;
                if (rr >= this.grid.length || cc >= this.grid[0].length) continue;

                this.frames.push(new AStarFrame(
                    JSON.parse(JSON.stringify(closedList)),
                    JSON.parse(JSON.stringify(openList)),
                    "Push to Open List",
                    "Adding neighbors to Open List",
                    [newNeighborAStarNode],
                    ["#F1F"]
                ));

                // visited / wall check
                if (closedList[rr][cc]) {
                    this.frames.push(new AStarFrame(
                        JSON.parse(JSON.stringify(closedList)),
                        JSON.parse(JSON.stringify(openList)),
                        "Pushing to Open List... Can't push to open list!",
                        "Node is already in Closed List!",
                        [newNeighborAStarNode],
                        ["#F11"]
                    ));
                    continue;
                }
                if (this.grid[rr][cc] == GridObject.WALL) {
                    this.frames.push(new AStarFrame(
                        JSON.parse(JSON.stringify(closedList)),
                        JSON.parse(JSON.stringify(openList)),
                        "Pushing to Open List... Can't push to open list!",
                        "Node is a wall!",
                        [newNeighborAStarNode],
                        ["#F11"]
                    ));
                    continue;
                }
                
                // check first if already in openList, if yes, check if you can update with better g(n)
                let openNode = this.isNodeInOpenList(newNeighborAStarNode, openList);
                if (openNode){
                    this.frames.push(new AStarFrame(
                        JSON.parse(JSON.stringify(closedList)),
                        JSON.parse(JSON.stringify(openList)),
                        "Pushing to Open List... Can't push to open list!",
                        "Node is already in open list, must check if we can instead update it.",
                        [openNode],
                        ["#F11"]
                    ));

                    if (newNeighborAStarNode.g < openNode.g ){
                        openNode.g = newNeighborAStarNode.g;
                        openNode.h = newNeighborAStarNode.h;
                        openNode.parent = newNeighborAStarNode.parent;

                        this.frames.push(new AStarFrame(
                            JSON.parse(JSON.stringify(closedList)),
                            JSON.parse(JSON.stringify(openList)),
                            "Updating... Success",
                            "Following this path minimizes g(n)",
                            [openNode],
                            ["#1F1"]
                        ));
                    }
                    else {
                        this.frames.push(new AStarFrame(
                            JSON.parse(JSON.stringify(closedList)),
                            JSON.parse(JSON.stringify(openList)),
                            "Updating... Can't update!",
                            "Following this path results to a bigger g(n)!",
                            [openNode],
                            ["#F11"]
                        ));
                    }
                }
                else{ // if not, add to open list new node
                    
                    openList.push(newNeighborAStarNode);

                    this.frames.push(new AStarFrame(
                        JSON.parse(JSON.stringify(closedList)),
                        JSON.parse(JSON.stringify(openList)),
                        "Pushed new found node",
                        "Found new node",
                        [newNeighborAStarNode],
                        ["#FF1"]
                    ));
                }
                
            }

            await new Promise(r => setTimeout(r, 1));
        }


        if (reached_end){
            let currNode = closedList[this.endNode[0]][this.endNode[1]];
            let path = [[currNode.r, currNode.c]];

            while (currNode.parent != null){
                let parentNode = currNode.parent;

                let CELL_WIDTH =  this.ctx.canvas.width / this.grid[0].length;
                let CELL_HEIGHT = this.ctx.canvas.height / this.grid.length;

                ctx.strokeStyle = "#AAAAFF";
                ctx.fillStyle = "#1F1";

                ctx.strokeRect(parentNode.c * CELL_WIDTH, currNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillRect(currNode.c * CELL_WIDTH, currNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

                currNode = parentNode;
                path.push([currNode.r, currNode.c]);

                await new Promise(r => setTimeout(r, 1));
            }

            this.frames.push(new AStarFrame(
                JSON.parse(JSON.stringify(closedList)),
                JSON.parse(JSON.stringify(openList)),
                "Draw Path",
                "Drawing path from start to end.",
                null,
                null,
                path
            ));

            alert("ending found!");
        }
    }

    isNodeInOpenList(node, openList){
        for (let i = 0; i < openList.length; i++){
            let val = openList[i];
            if (val.r == node.r && val.c == node.c)
                return val;
        }
        return false;
    }

    manhattanDist(node1, node2){
        return Math.abs(node1[0] - node2[0]) + Math.abs(node1[1] - node2[1]);
    }

    getBestPathNode(openList){
        let pathDecision = openList[0];
        let index = 0;
        for (let i = 1; i < openList.length; i++){
            let val = openList[i];
            if (val.f() < pathDecision.f() || (val.f() == pathDecision.f() && val.h < pathDecision.h)){
                pathDecision = val;
                index = i;
            }
        }
        openList.splice(index, 1);

        return pathDecision;
    }
    
    drawFrame(frameIndex){
        if (this.frames.length == 0)
            return;

        this.visualizer.draw(this.grid);
        
        let currFrame = this.frames[frameIndex];

        let CELL_WIDTH =  this.ctx.canvas.width / this.grid[0].length;
        let CELL_HEIGHT = this.ctx.canvas.height / this.grid.length;

        // draw openList
        for (let i = 0; i < currFrame.openList.length; i++){
            this.ctx.globalAlpha = .5;
            this.ctx.fillStyle = "#FF1";
            let bestPathNode = currFrame.openList[i];
            this.ctx.fillRect(bestPathNode.c * CELL_WIDTH, bestPathNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

            drawAStarNode(bestPathNode, this.grid, this.ctx);
        }

        // draw closed list
        this.ctx.globalAlpha = .5;
        this.ctx.fillStyle = "#222";

        for (let r = 0; r < currFrame.closedList.length; r++){
            for (let c = 0; c < currFrame.closedList[r].length; c++){
                let cell = currFrame.closedList[r][c];
                if (cell){
                    this.ctx.fillRect(c * CELL_WIDTH, r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                    drawAStarNode(cell, this.grid, this.ctx, "#EEE");
                    this.ctx.globalAlpha = .5;
                    this.ctx.fillStyle = "#222";
                }
            }
        }

        // draw current operation
        this.ctx.globalAlpha = .5;
        if (currFrame.operation != null){

            if (currFrame.aStarNodes != null){
                // draw the coordinates with the corresponding colors
                for (let i = 0; i < currFrame.aStarNodes.length; i++){
                    let aStarNode = currFrame.aStarNodes[i];
                    let aStarNodeColor = currFrame.color[i];

                    this.ctx.fillStyle = aStarNodeColor;
                    this.ctx.fillRect(aStarNode.c * CELL_WIDTH, aStarNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

                    if (currFrame.operation == "Getting best next path node.")
                        drawAStarNode(aStarNode, this.grid, this.ctx);
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
class AStarNode{
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

class AStar{
    constructor(visualizer, grid, startNode, endNode){
        this.visualizer = visualizer;
        this.ctx = this.visualizer.ctx;
        this.grid = grid;
        this.startNode = startNode;
        this.endNode = endNode;
        this.pathFromStartToEnd = null;
        this.frames = [];
    }

    async execute(){
        let ctx = this.visualizer.ctx;

        let reached_end = false;
        let dr = [0, -1, 0, 1];
        let dc = [1, 0, -1, 0];

        // false-initialized visited grid
        let visited = new Array(this.grid.length);
        for (let i = 0; i < visited.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = false;
            visited[i] = a;
        }

        // null-initialized visited grid, then add start node as AStarNode (non-null cell means visited)
        let aStarGrid = new Array(this.grid.length);
        for (let i = 0; i < aStarGrid.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = null;
            aStarGrid[i] = a;
        }
        aStarGrid[this.startNode[0]][this.startNode[1]] = new AStarNode(this.startNode[0], this.startNode[1], 0, this.manhattanDist(this.startNode, this.endNode), null);

        // initalize open list
        let openList = [aStarGrid[this.startNode[0]][this.startNode[1]]];


        while (openList.length > 0){
            let currentNode = this.getBestPathNode(openList);

            if (visited[currentNode.r][currentNode.c])
                continue;

            visited[currentNode.r][currentNode.c] = true;

            let CELL_WIDTH =  700 / this.grid[0].length; // IMPORTANTTTT CHANGE DA 500  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
            let CELL_HEIGHT = 700 / this.grid.length;

            ctx.strokeStyle = "#AAAAFF";

            ctx.fillStyle = "#11F";

            ctx.strokeRect(currentNode.c * CELL_WIDTH, currentNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            ctx.fillRect(currentNode.c * CELL_WIDTH, currentNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);



            // check if current node reached end
            if (currentNode.r == this.endNode[0] && currentNode.c == this.endNode[1]){
                console.log(currentNode);
                reached_end = true;
                break;
            }


            // enqueue neighbors
            for (let i = 0; i < 4; i++){
                let rr = currentNode.r + dr[i];
                let cc = currentNode.c + dc[i];

                // out of bounds check
                if (rr < 0 || cc < 0) continue;
                if (rr >= this.grid.length || cc >= this.grid[0].length) continue;

                // visited / wall check
                if (visited[rr][cc]) continue;
                if (this.grid[rr][cc] == GridObject.WALL) continue;
                

                let newAStarNode = new AStarNode(rr, cc, currentNode.parent ? currentNode.g + 1 : 1, this.manhattanDist([rr, cc], this.endNode), currentNode);
                console.log(newAStarNode);
                openList.push(newAStarNode);
                aStarGrid[newAStarNode.r][newAStarNode.c] = newAStarNode;
            }

            await new Promise(r => setTimeout(r, 1));
        }


        if (reached_end){
            let currNode = aStarGrid[this.endNode[0]][this.endNode[1]];
            console.log(currNode);
            while (currNode.parent != null){
                let parentNode = currNode.parent;

                let CELL_WIDTH =  700 / this.grid[0].length; // IMPORTANTTTT CHANGE DA 1000  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
                let CELL_HEIGHT = 700 / this.grid.length;

                ctx.strokeStyle = "#AAAAFF";

                ctx.fillStyle = "#1F1";

                ctx.strokeRect(parentNode.c * CELL_WIDTH, currNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillRect(currNode.c * CELL_WIDTH, currNode.r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

                currNode = parentNode;

                await new Promise(r => setTimeout(r, 1));
            }
            alert("ending found!");
        }
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
}
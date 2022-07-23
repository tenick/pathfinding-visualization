// pathfinding operations:
// start
// enqueue neighbors (blue)
// check if neighbor is visited/queued (yellow)
// visited, skip (pink)
// visit neighbor (purple)
// draw shortest path (saturated green)
// end

// grid objects:
// 0 : empty space (gray-white)
// 1 : wall (black)
// 2 : start (green)
// 3 : end (red)
const GridObject = {
    EMPTY: 0,
    WALL: 1,
    START: 2,
    END: 3
 };


class PathFindingVisualizer {
    constructor(row, column, ctx){
        this.row = row;
        this.column = column;

        // canvas 2d context
        this.ctx = ctx;

        // initialize start/end nodes
        this.startNode = [0, 0];
        this.endNode = [row - 1, column - 1];

        // zero-initialize rowxcolumn grid, then add start and end node in grid
        this.grid = new Array(this.row);
        for (let i = 0; i < this.grid.length; i++){
            let a = new Array(column);
            for (let j=0; j<a.length; ++j) a[j] = 0;
            this.grid[i] = a;
        }
        this.grid[0][0] = 2;
        this.grid[row - 1][column - 1] = 3;

        this.algorithm = new DFS();
        this.result = [];
    }
    
    execute(){
        this.result = this.algorithm.execute(this.grid, this.startNode, this.endNode, this.ctx);
    }

    draw(){
        let CELL_WIDTH =  700 / this.grid[0].length; // IMPORTANTTTT CHANGE DA 500  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
        let CELL_HEIGHT = 700 / this.grid.length;

        this.ctx.strokeStyle = "#AAAAFF";


        for (let i = 0; i < this.grid.length; i++){
            for (let j = 0; j < this.grid[i].length; j++){
                let cell = this.grid[i][j];

                if (cell == GridObject.EMPTY) // empty
                    this.ctx.fillStyle = "#eee";
                else if (cell == GridObject.WALL) // wall
                    this.ctx.fillStyle = "#111";
                else if (cell == GridObject.START) // start node
                    this.ctx.fillStyle = "#1F1";
                else if (cell == GridObject.END) // end node
                    this.ctx.fillStyle = "#F11";

                this.ctx.strokeRect(i * CELL_WIDTH, j * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                this.ctx.fillRect(i * CELL_WIDTH, j * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            }
        }
    }

}

class DFS {
    execute(grid, startNode, endNode, ctx){
        let reached_end = false;
        let dr = [-1, 1, 0, 0];
        let dc = [0, 0, 1, -1];

        // false-initialized visited grid, then add start node as visited
        let visited = new Array(grid.length);
        for (let i = 0; i < visited.length; i++){
            let a = new Array(grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = false;
            visited[i] = a;
        }
        visited[startNode[0]][startNode[1]] = true;


        // null-initialized prevNode grid, then add start node as its own parent
        let prevNode = new Array(grid.length);
        for (let i = 0; i < prevNode.length; i++){
            let a = new Array(grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = null;
            prevNode[i] = a;
        }
        prevNode[startNode[0]][startNode[1]] = startNode;

        // initialize stack
        let stack = [startNode];

        while (stack.length > 0) {
            let currentNode = stack.pop();

            let CELL_WIDTH =  700 / grid[0].length; // IMPORTANTTTT CHANGE DA 500  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
            let CELL_HEIGHT = 700 / grid.length;

            ctx.strokeStyle = "#AAAAFF";

            ctx.fillStyle = "#11F";

            ctx.strokeRect(currentNode[0] * CELL_WIDTH, currentNode[1] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            ctx.fillRect(currentNode[0] * CELL_WIDTH, currentNode[1] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);



            // check if current node reached end
            if (currentNode[0] == endNode[0] && currentNode[1] == endNode[1]){
                reached_end = true;
                break;
            }


            for (let i = 0; i < 4; i++){
                let rr = currentNode[0] + dr[i];
                let cc = currentNode[1] + dc[i];

                // out of bounds check
                if (rr < 0 || cc < 0) continue;
                if (rr >= grid.length || cc >= grid[0].length) continue;

                // visited / wall check
                if (visited[rr][cc]) continue;
                if (grid[rr][cc] == GridObject.WALL) continue;

                stack.push([rr, cc]);
                visited[rr][cc] = true;
                prevNode[rr][cc] = currentNode;
            }
        }


        if (reached_end){
            let currNode = endNode;
            while (currNode != startNode){
                let CELL_WIDTH =  700 / grid[0].length; // IMPORTANTTTT CHANGE DA 1000  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
                let CELL_HEIGHT = 700 / grid.length;

                ctx.strokeStyle = "#AAAAFF";

                ctx.fillStyle = "#1F1";

                ctx.strokeRect(currNode[0] * CELL_WIDTH, currNode[1] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillRect(currNode[0] * CELL_WIDTH, currNode[1] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

                currNode = prevNode[currNode[0]][currNode[1]];
            }
            alert("ending found!");
        }
    }
}

class BFS {
    execute(grid, startNode, endNode, ctx){
        let reached_end = false;
        let dr = [-1, 1, 0, 0];
        let dc = [0, 0, 1, -1];

        // false-initialized visited grid, then add start node as visited
        let visited = new Array(grid.length);
        for (let i = 0; i < visited.length; i++){
            let a = new Array(grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = false;
            visited[i] = a;
        }
        visited[startNode[0]][startNode[1]] = true;


        // null-initialized prevNode grid, then add start node as its own parent
        let prevNode = new Array(grid.length);
        for (let i = 0; i < prevNode.length; i++){
            let a = new Array(grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = null;
            prevNode[i] = a;
        }
        prevNode[startNode[0]][startNode[1]] = startNode;
        

        // initialize queue
        let queue = [startNode];
        
        ctx.globalAlpha = 0.5;

        // BFS
        while (queue.length > 0) {
            let currentNode = queue.shift();


            let CELL_WIDTH =  700 / grid[0].length; // IMPORTANTTTT CHANGE DA 500  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
            let CELL_HEIGHT = 700 / grid.length;

            ctx.strokeStyle = "#AAAAFF";

            ctx.fillStyle = "#11F";

            ctx.strokeRect(currentNode[0] * CELL_WIDTH, currentNode[1] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            ctx.fillRect(currentNode[0] * CELL_WIDTH, currentNode[1] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);



            // check if current node reached end
            if (currentNode[0] == endNode[0] && currentNode[1] == endNode[1]){
                reached_end = true;
                break;
            }
            

            // enqueue neighbors
            for (let i = 0; i < 4; i++){
                let rr = currentNode[0] + dr[i];
                let cc = currentNode[1] + dc[i];

                // out of bounds check
                if (rr < 0 || cc < 0) continue;
                if (rr >= grid.length || cc >= grid[0].length) continue;

                // visited / wall check
                if (visited[rr][cc]) continue;
                if (grid[rr][cc] == GridObject.WALL) continue;

                queue.push([rr, cc]);
                visited[rr][cc] = true;
                prevNode[rr][cc] = currentNode;
            }
        }

        if (reached_end){
            let currNode = endNode;
            while (currNode != startNode){
                let CELL_WIDTH =  700 / grid[0].length; // IMPORTANTTTT CHANGE DA 1000  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
                let CELL_HEIGHT = 700 / grid.length;

                ctx.strokeStyle = "#AAAAFF";

                ctx.fillStyle = "#1F1";

                ctx.strokeRect(currNode[0] * CELL_WIDTH, currNode[1] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillRect(currNode[0] * CELL_WIDTH, currNode[1] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

                currNode = prevNode[currNode[0]][currNode[1]];
            }
            alert("ending found!");
        }
    }
}
class DFS {
    constructor(visualizer, grid, startNode, endNode){
        this.visualizer = visualizer;
        this.ctx = visualizer.ctx;
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

        // false-initialized visited grid, then add start node as visited
        let visited = new Array(this.grid.length);
        for (let i = 0; i < visited.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = false;
            visited[i] = a;
        }
        visited[this.startNode[0]][this.startNode[1]] = true;


        // null-initialized prevNode grid, then add start node as its own parent
        let prevNode = new Array(this.grid.length);
        for (let i = 0; i < prevNode.length; i++){
            let a = new Array(this.grid[0].length);
            for (let j=0; j<a.length; ++j) a[j] = null;
            prevNode[i] = a;
        }
        prevNode[this.startNode[0]][this.startNode[1]] = this.startNode;

        // initialize stack
        let stack = [this.startNode];

        while (stack.length > 0) {
            let currentNode = stack[stack.length - 1];

            let CELL_WIDTH =  700 / this.grid[0].length; // IMPORTANTTTT CHANGE DA 500  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
            let CELL_HEIGHT = 700 / this.grid.length;

            ctx.strokeStyle = "#AAAAFF";

            ctx.fillStyle = "#11F";

            ctx.strokeRect(currentNode[1] * CELL_WIDTH, currentNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            ctx.fillRect(currentNode[1] * CELL_WIDTH, currentNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);



            // check if current node reached end
            if (currentNode[0] == this.endNode[0] && currentNode[1] == this.endNode[1]){
                reached_end = true;
                break;
            }

            let found = false;
            for (let i = 0; i < 4; i++){
                let rr = currentNode[0] + dr[i];
                let cc = currentNode[1] + dc[i];


                // out of bounds check
                if (rr < 0 || cc < 0) continue;
                if (rr >= this.grid.length || cc >= this.grid[0].length) continue;

                // visited / wall check
                if (visited[rr][cc]) continue;
                if (this.grid[rr][cc] == GridObject.WALL) continue;

                found = true;
                stack.push([rr, cc]);
                visited[rr][cc] = true;
                prevNode[rr][cc] = currentNode;
                break;
            }

            if (!found)
                stack.pop();

            await new Promise(r => setTimeout(r, 1));
        }


        if (reached_end){
            let currNode = this.endNode;
            while (currNode != this.startNode){
                let CELL_WIDTH =  700 / this.grid[0].length; // IMPORTANTTTT CHANGE DA 1000  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
                let CELL_HEIGHT = 700 / this.grid.length;

                ctx.strokeStyle = "#AAAAFF";

                ctx.fillStyle = "#1F1";

                ctx.strokeRect(currNode[1] * CELL_WIDTH, currNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                ctx.fillRect(currNode[1] * CELL_WIDTH, currNode[0] * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

                currNode = prevNode[currNode[0]][currNode[1]];

                await new Promise(r => setTimeout(r, 1));
            }
            alert("ending found!");
        }
    }
}

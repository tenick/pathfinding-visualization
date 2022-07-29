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

        this.algorithm = new DFS(this, this.startNode, this.endNode, this.grid);
    }
    
    async execute(){
        await this.algorithm.execute();
    }

    draw(grid=this.grid){
        let CELL_WIDTH =  700 / grid[0].length; // IMPORTANTTTT CHANGE DA 500  0SDAFASFASDFSADGASDFSADFSAFSADFSADFSADFASDFSADF0000000000000000000
        let CELL_HEIGHT = 700 / grid.length;

        this.ctx.strokeStyle = "#AAAAFF";


        for (let r = 0; r < grid.length; r++){
            for (let c = 0; c < grid[r].length; c++){
                let cell = grid[r][c];

                if (cell == GridObject.EMPTY) // empty
                    this.ctx.fillStyle = "#eee";
                else if (cell == GridObject.WALL) // wall
                    this.ctx.fillStyle = "#111";
                else if (cell == GridObject.START) // start node
                    this.ctx.fillStyle = "#1F1";
                else if (cell == GridObject.END) // end node
                    this.ctx.fillStyle = "#F11";

                this.ctx.strokeRect(c * CELL_WIDTH, r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                this.ctx.fillRect(c * CELL_WIDTH, r * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
            }
        }
    }

}


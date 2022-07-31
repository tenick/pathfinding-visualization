import DFS from "./dfs.js";
import BFS from "./bfs.js";
import AStar from "./astar.js";


export const GridObject = {
    EMPTY: 0,
    WALL: 1,
    START: 2,
    END: 3
 };


 export default class PathFindingVisualizer {
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

        this.isAlgorithmRunning = false;

        // UI elements/events
        this.algorithm = new DFS(this, this.startNode, this.endNode, this.grid);
        
        this.algorithmDropdown = document.getElementById("algorithmDropdown");
        
        this.updateGridSizeBtn = document.getElementById('updateGridSizeBtn');
        this.updateGridSizeBtn.addEventListener('click', this.updateGridSize.bind(this));

        this.executeBtn = document.getElementById('executeBtn');
        this.executeBtn.addEventListener('click', this.execute.bind(this));


        // user drawing events
        this.editMode = false;
        window.addEventListener("mousedown", function(e) {
            this.editMode = true;
        }.bind(this));
        
        window.addEventListener("mouseup", function(e) {
            this.editMode = false;
        }.bind(this));
        
        this.ctx.canvas.addEventListener("mousemove", function(e) {
            if (this.editMode) this.editGrid(e);
        }.bind(this));

        this.ctx.canvas.addEventListener("mousedown", function(e) {
            this.editMode = true;
            if (this.editMode) this.editGrid(e);
        }.bind(this));


        // initial drawing
        this.draw();
    }
    
    editGrid(e){
        let x = e.offsetX;
        let y = e.offsetY;
        
        let editType = document.querySelector('input[type="radio"]:checked').value;

        let CELL_WIDTH =  this.ctx.canvas.width / this.grid.length;
        let CELL_HEIGHT = this.ctx.canvas.height / this.grid[0].length;
    
        let r = Math.floor(y / CELL_HEIGHT);
        let c = Math.floor(x / CELL_WIDTH); 
    
        let newCellVal = GridObject.EMPTY;
        switch(editType){
            case "Start Node":
                if (this.grid[r][c] != GridObject.EMPTY)
                    return;
    
                // remove previous start node
                this.grid[this.startNode[0]][this.startNode[1]] = GridObject.EMPTY;
                this.startNode = [r, c];
    
                newCellVal = GridObject.START;
                break;
            case "End Node":
                if (this.grid[r][c] != GridObject.EMPTY)
                    return;
    
                // remove previous end node
                this.grid[this.endNode[0]][this.endNode[1]] = GridObject.EMPTY;
                this.endNode = [r, c];
    
                newCellVal = GridObject.END;
                break;
            case "Draw Wall":
                if (this.grid[r][c] != GridObject.EMPTY)
                    return;
    
                newCellVal = GridObject.WALL;
                break;
            case "Erase Wall":
                if (this.grid[r][c] != GridObject.WALL)
                    return;
    
                newCellVal = GridObject.EMPTY;
                break;
        }
    
        this.grid[r][c] = newCellVal;
        this.draw();
    }

    updateGridSize(){
        let newGridSize = parseInt(document.querySelector("input[type='number']").value);
        this.row = newGridSize;
        this.column = newGridSize;

        // initialize start/end nodes
        this.startNode = [0, 0];
        this.endNode = [this.row - 1, this.column - 1];

        // zero-initialize rowxcolumn grid, then add start and end node in grid
        this.grid = new Array(this.row);
        for (let i = 0; i < this.grid.length; i++){
            let a = new Array(this.column);
            for (let j=0; j<a.length; ++j) a[j] = 0;
            this.grid[i] = a;
        }
        this.grid[0][0] = 2;
        this.grid[this.row - 1][this.column - 1] = 3;

        this.draw();
    }

    async execute(){
        if (this.isAlgorithmRunning || window.playback.isPlaying)
            return;

        this.isAlgorithmRunning = true;
        let algo = null;
        switch (this.algorithmDropdown.value){
            case "dfs":
                algo = new DFS(this);
                break;
            case "bfs":
                algo = new BFS(this);
                break;
            case "astar":
                algo = new AStar(this);
                break;
        }

        this.algorithm = algo;

        await this.algorithm.execute();
        
        this.isAlgorithmRunning = false;
    }

    draw(grid=this.grid){
        let CELL_WIDTH =  this.ctx.canvas.width / grid[0].length;
        let CELL_HEIGHT = this.ctx.canvas.height / grid.length;

        this.ctx.strokeStyle = "#AAAAFF";
        this.ctx.globalAlpha = 1;


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


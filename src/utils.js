export function drawPath(grid, path, ctx, thickness=0.4){
    for (let i = 0; i < path.length; i++){
        let currNode = path[i];

        let CELL_WIDTH =  ctx.canvas.width / grid[0].length;
        let CELL_HEIGHT = ctx.canvas.height / grid.length;

        ctx.strokeStyle = "#AAAAFF";
        ctx.fillStyle = "#1F1";

        let neighborPaths = [];
        if (i > 0)
            neighborPaths.push(path[i - 1]);
        if (i < path.length - 1)
            neighborPaths.push(path[i + 1]);


        // need to draw circle at the center of the cell to cover rectangle edges
        ctx.beginPath();
        ctx.arc(currNode[1] * CELL_WIDTH + CELL_WIDTH / 2, 
                currNode[0] * CELL_HEIGHT + CELL_HEIGHT / 2,
                thickness / 2 * Math.max(CELL_WIDTH, CELL_HEIGHT), 
                0, 
                2 * Math.PI, 
                false);
        ctx.fill();


        for (let j = 0; j < neighborPaths.length; j++){
            let neighborPath = neighborPaths[j];
            let rDir = neighborPath[0] - currNode[0];
            let cDir = neighborPath[1] - currNode[1];

            if (rDir != 0){ // it's a row movement
                if (rDir > 0){ // it's a down movement
                    ctx.fillRect(currNode[1] * CELL_WIDTH + CELL_WIDTH / 2 - thickness / 2 * CELL_WIDTH,
                                 currNode[0] * CELL_HEIGHT + CELL_HEIGHT / 2, 
                                 thickness * CELL_WIDTH, 
                                 CELL_HEIGHT / 2);
                }
                else{ // it's an up movement
                    ctx.fillRect(currNode[1] * CELL_WIDTH + CELL_WIDTH / 2 - thickness / 2 * CELL_WIDTH, 
                                 currNode[0] * CELL_HEIGHT, 
                                 thickness * CELL_WIDTH, 
                                 CELL_HEIGHT / 2);
                }
            }
            else if (cDir != 0){ // it's a column movement
                if (cDir > 0){ // it's a right movement
                    ctx.fillRect(currNode[1] * CELL_WIDTH + CELL_WIDTH / 2, 
                                 currNode[0] * CELL_HEIGHT + CELL_HEIGHT / 2 - thickness / 2 * CELL_HEIGHT, 
                                 CELL_WIDTH / 2, 
                                 thickness * CELL_HEIGHT);
                }
                else{ // it's an left movement
                    ctx.fillRect(currNode[1] * CELL_WIDTH, 
                                 currNode[0] * CELL_HEIGHT + CELL_HEIGHT / 2 - thickness / 2 * CELL_HEIGHT, 
                                 CELL_WIDTH / 2, 
                                 thickness * CELL_HEIGHT);
                }
            }
        }
    }
}

export function drawAStarNode(aStarNode, grid, ctx, fillStyle="#111", ghSize=.3, fSize=.8){
    let CELL_WIDTH =  ctx.canvas.width / grid[0].length;
    let CELL_HEIGHT = ctx.canvas.height / grid.length;

    // draw the texts
    ctx.globalAlpha = 1;
    ctx.fillStyle = fillStyle;
    // draw g and h
    let ghPixelSize = Math.floor(ghSize * CELL_HEIGHT);

    ctx.font = ghPixelSize + "px Monospace";

    ctx.fillText(aStarNode.g, aStarNode.c * CELL_WIDTH, aStarNode.r * CELL_HEIGHT + ghPixelSize);
    ctx.fillText(aStarNode.h, aStarNode.c * CELL_WIDTH, aStarNode.r * CELL_HEIGHT + CELL_HEIGHT);

    // draw f
    let fPixelSize = Math.floor(fSize * CELL_HEIGHT);

    ctx.font = fPixelSize + "px Monospace";
    ctx.fillText(aStarNode.g + aStarNode.h, aStarNode.c * CELL_WIDTH + ghPixelSize, aStarNode.r * CELL_HEIGHT + fPixelSize);
}
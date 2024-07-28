"use strict";
console.log("hello world");
class Cell {
    constructor(row, col, height, isDead, isHuman = false) {
        this.row = row;
        this.col = col;
        this.height = height || 0;
        this.isDead = isDead !== null && isDead !== void 0 ? isDead : true;
        this.isHuman = isHuman !== null && isHuman !== void 0 ? isHuman : false;
    }
}
let grid = [];
const numRows = 40;
const numCols = 40;
for (let row = 0; row < numRows; row++) {
    grid[row] = [];
    for (let col = 0; col < numCols; col++) {
        grid[row][col] = new Cell(row, col, 0, true);
    }
}
// Populate initial state
grid[0][1].isDead = false;
grid[1][2].isDead = false;
grid[2][0].isDead = false;
grid[2][1].isDead = false;
grid[2][2].isDead = false;
grid[4][1].isDead = false;
grid[2][2].isDead = false;
grid[10][0].isDead = false;
grid[10][1].isDead = false;
grid[10][1].isDead = false;
grid[10][2].isDead = false;
grid[20][0].isDead = false;
grid[20][1].isDead = false;
grid[20][2].isDead = false;
grid[21][1].isDead = false;
grid[21][2].isDead = false;
grid[11][0].isDead = false;
grid[12][1].isDead = false;
// Rules
function getNextState(board) {
    const cellsToChange = {};
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            let count = 0;
            if (board[row - 1]) {
                if (board[row - 1][col - 1] && !board[row - 1][col - 1].isDead)
                    count++;
                if (board[row - 1][col] && !board[row - 1][col].isDead)
                    count++;
                if (board[row - 1][col + 1] && !board[row - 1][col + 1].isDead)
                    count++;
            }
            if (board[row][col - 1] && !board[row][col - 1].isDead)
                count++;
            if (board[row][col + 1] && !board[row][col + 1].isDead)
                count++;
            if (board[row + 1]) {
                if (board[row + 1][col - 1] && !board[row + 1][col - 1].isDead)
                    count++;
                if (board[row + 1][col] && !board[row + 1][col].isDead)
                    count++;
                if (board[row + 1][col + 1] && !board[row + 1][col + 1].isDead)
                    count++;
            }
            const posStr = JSON.stringify([row, col]);
            if (!board[row][col].isHuman && !board[row][col].isDead && (count < 2 || count > 3))
                cellsToChange[posStr] = true; // Cell dies
            else if (!board[row][col].isHuman && board[row][col].isDead && count === 3)
                cellsToChange[posStr] = false; // Cell becomes alive
        }
    }
    for (let key in cellsToChange) {
        let pos = JSON.parse(key);
        board[pos[0]][pos[1]].isDead = cellsToChange[key];
    }
}
const simulateButton = document.getElementById("simulate");
let inter;
simulateButton === null || simulateButton === void 0 ? void 0 : simulateButton.addEventListener("click", () => {
    if (inter) {
        clearInterval(inter); // Stop the previous simulation if it's running
    }
    inter = setInterval(() => {
        getNextState(grid);
        plotBoard(grid);
    }, 400);
});
const plotBoard = (board) => {
    const directions = [[0, -1], [0, 1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
    for (let row of grid) {
        for (let cell of row) {
            const cellElement = document.getElementById(`cell-${cell.row}-${cell.col}`);
            if (cell.isHuman) {
                cellElement === null || cellElement === void 0 ? void 0 : cellElement.classList.add("human");
            }
            else {
                if (cell.isDead) {
                    cellElement === null || cellElement === void 0 ? void 0 : cellElement.classList.add("dead");
                    cellElement === null || cellElement === void 0 ? void 0 : cellElement.classList.remove("alive");
                    cellElement === null || cellElement === void 0 ? void 0 : cellElement.classList.remove("isolated");
                    cellElement === null || cellElement === void 0 ? void 0 : cellElement.classList.remove("human");
                }
                else {
                    const cellNeighbors = [];
                    for (let direction of directions) {
                        const newRow = cell.row + direction[0];
                        const newCol = cell.col + direction[1];
                        if (grid[newRow] && grid[newRow][newCol] && !grid[newRow][newCol].isDead) {
                            cellNeighbors.push(grid[newRow][newCol]);
                        }
                    }
                    if (cellNeighbors.length === 0) {
                        cellElement === null || cellElement === void 0 ? void 0 : cellElement.classList.add("isolated");
                    }
                    else {
                        cellElement === null || cellElement === void 0 ? void 0 : cellElement.classList.add("alive");
                        cellElement === null || cellElement === void 0 ? void 0 : cellElement.classList.remove("isolated");
                    }
                    cellElement === null || cellElement === void 0 ? void 0 : cellElement.classList.remove("dead");
                }
            }
        }
    }
};
const getNextStateButton = document.getElementById("getNextState");
getNextStateButton === null || getNextStateButton === void 0 ? void 0 : getNextStateButton.addEventListener("click", () => {
    getNextState(grid);
    plotBoard(grid);
});
let humanCell = new Cell(numRows / 2, numCols / 2, 0, false, true);
//place character in the middle of the board
grid[numRows / 2][numCols / 2] = humanCell;
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && humanCell.row > 0) {
        humanCell.row--;
        //reset the previous cell
        grid[humanCell.row + 1][humanCell.col] = new Cell(humanCell.row + 1, humanCell.col, 0, true, false);
        //set the new cell
        grid[humanCell.row][humanCell.col] = humanCell;
    }
    else if (e.key === "ArrowDown" && humanCell.row < numRows - 1) {
        humanCell.row++;
        //reset the previous cell
        grid[humanCell.row - 1][humanCell.col] = new Cell(humanCell.row - 1, humanCell.col, 0, true, false);
        //set the new cell
        grid[humanCell.row][humanCell.col] = humanCell;
    }
    else if (e.key === "ArrowLeft" && humanCell.col > 0) {
        humanCell.col--;
        //reset the previous cell
        grid[humanCell.row][humanCell.col + 1] = new Cell(humanCell.row, humanCell.col + 1, 0, true, false);
        //set the new cell
        grid[humanCell.row][humanCell.col] = humanCell;
    }
    else if (e.key === "ArrowRight" && humanCell.col < numCols - 1) {
        humanCell.col++;
        //reset the previous cell
        grid[humanCell.row][humanCell.col - 1] = new Cell(humanCell.row, humanCell.col - 1, 0, true, false);
        //set the new cell
        grid[humanCell.row][humanCell.col] = humanCell;
    }
    else {
        return;
    }
    plotBoard(grid);
});
// Map out the board
const boardComponent = document.getElementById("board");
for (let gridRow of grid) {
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    for (let cell of gridRow) {
        const cellElement = document.createElement("div");
        cellElement.className = "cell";
        cellElement.id = `cell-${cell.row}-${cell.col}`;
        if (cell.isHuman) {
            cellElement.classList.add("human");
        }
        else {
            if (cell.isDead) {
                cellElement.classList.add("dead");
            }
            else {
                cellElement.classList.add("alive");
            }
        }
        cellElement.addEventListener("click", () => {
            cell.isDead = !cell.isDead;
            if (cell.isDead) {
                cellElement.classList.add("dead");
                cellElement.classList.remove("alive");
            }
            else {
                cellElement.classList.remove("dead");
                cellElement.classList.add("alive");
            }
        });
        rowElement.appendChild(cellElement);
    }
    boardComponent === null || boardComponent === void 0 ? void 0 : boardComponent.appendChild(rowElement);
}
// for (let row of grid) {
//   for (let cell of row) {
//     const cellElement = document.getElementById(`cell-${cell.row}-${cell.col}`);
//     if (cell.isDead) {
//       cellElement?.classList.add("dead");
//       cellElement?.classList.remove("alive");
//     } else {
//       const cellNeighbors = [];
//       for(let direction of directions){
//           const newRow = cell.row + direction[0];
//           const newCol = cell.col + direction[1];
//           if(grid[newRow] && grid[newRow][newCol] && !grid[newRow][newCol].isDead){
//               cellNeighbors.push(grid[newRow][newCol]);
//           }
//       }
//       if(cellNeighbors.length === 0){
//           cellElement?.classList.add("isolated");
//       }
//       else{
//           cellElement?.classList.add("alive");
//           cellElement?.classList.remove("isolated");
//       }
//       cellElement?.classList.remove("dead");
//     }
//   }
// }

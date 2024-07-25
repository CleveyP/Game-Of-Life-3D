console.log("hello world");



class Cell {
    row : number;
    col : number;
    height : number;
    isDead : boolean;
    constructor( row: number, col: number, height: number, isDead: boolean) {
        this.row = row;
        this.col = col;
        this.height = 0;
        this.isDead = true;
    }
}

let [][] grid: number = [100][100];
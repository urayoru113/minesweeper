"use strict"

class Minesweeper {
    constructor(x, y, mineNum) {
        this.x = x;
        this.y = y;
        this.mineNum = mineNum;
        this.table = document.querySelector('#table');
        this.table.innerHTML = "";
        this.clicked = 0
        this.firstClick = true;
        
        this.init()
    }


    init() {
        this.createBox();
        this.showBox();
        this.loadBoxListener();
    }
    
    createBox() {
        let tag = "";
        for (let i = 0; i < this.x; i++) {
            let TableRow = document.createElement('div');
            for (let j = 0; j < this.y; j++) {
                let TableCol = document.createElement('Button');
                TableCol.setAttribute('class', 'btn');
                TableCol.row = i;
                TableCol.col = j;
                TableRow.appendChild(TableCol);
            }
            this.table.appendChild(TableRow);
        }
    }
    
    showBox() {
        this.boxQuene = document.querySelectorAll('.btn');
        this.box = []
        for (let i = 0; i < this.x; i++) {
            this.box[i] = [];
        }
        
        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                this.box[i][j] = this.boxQuene[i*this.y + j];
                this.box[i][j].isMine = false;
                this.box[i][j].isClick = false;
                this.box[i][j].innerHTML = "&nbsp;";
                this.box[i][j].mineSum = 0;
            }
        }
    }
        
    loadBoxListener() {
        let self = this;
        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                this.box[i][j].addEventListener("click", () => {
                    if (self.firstClick) {
                        self.createMine(i, j);
                        self.firstClick = false;
                    }
                    
                    if (!self.box[i][j].isMine) {
                        self.showNumber(i, j);
                    }
                    if (self.box[i][j].isMine) {
                        alert("lose");
                    }
                    if (self.clicked === self.x*self.y) {
                        alert("win");
                    }
                });
                this.box[i][j].addEventListener('contextmenu', e => {
                    e.preventDefault();
                });
                this.box[i][j].onmousedown = e => {
                    if (e.which === 3) {
                        if (!self.box[i][j].isClick || self.box[i][j].isMine) {
                            if(self.box[i][j].innerHTML == "&nbsp;") {
                                self.box[i][j].innerHTML = "x";
                            } else {
                                self.box[i][j].innerHTML = "&nbsp;";
                            }
                        }
                    }
                };
            }
        }
    }
    
    createMine(x, y) {
        let mineList = []
        while (mineList.length < this.mineNum) {
            let list = Math.floor(Math.random()*this.x*this.y);
            if (mineList.indexOf(list) == -1 && (x*this.y + y) != list) {
                mineList.push(list);
            }
        }

        for (let i = 0; i < mineList.length; i++) {
            this.box[Math.floor(mineList[i]/this.y)][mineList[i]%this.y].isMine = true;
            this.box[Math.floor(mineList[i]/this.y)][mineList[i]%this.y].isClick = true;
            this.clicked++;
        }
        
        let spreadX;
        let spreadY;
        let spread = [
            [-1, -1], [0, -1], [1, -1],
            [-1,  0],          [1,  0],
            [-1,  1], [0,  1], [1,  1],
        ];
        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                for (let k = 0; k < spread.length; k++) {
                    spreadX = i + spread[k][0];
                    spreadY = j + spread[k][1];
                    if (this.box[i][j].isMine &&
                        spreadX >= 0 && spreadX < this.x &&
                        spreadY >= 0 && spreadY < this.y) {
                        this.box[spreadX][spreadY].mineSum += 1;
                    }
                }
            }
        }

        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                if (this.box[i][j].isMine) {
                    this.box[i][j].mineSum = 9;
                }
            }
        }
    }
    
    showNumber(x, y) {
        if (this.box[x][y].isClick|| this.box[x][y].innerHTML === "x") {
            return;
        }
        this.clicked++;
        this.box[x][y].isClick = true;
        this.box[x][y].setAttribute("class", "btn clicked" + this.box[x][y].mineSum);
        if (this.box[x][y].mineSum != 0) {
            this.box[x][y].innerHTML = this.box[x][y].mineSum;
            return;
        }
        let spread = [
            [-1, -1], [0, -1], [1, -1],
            [-1,  0],          [1,  0],
            [-1,  1], [0,  1], [1,  1],
        ];
        let spreadX;
        let spreadY;
        for (let i = 0; i < spread.length; i++) {
            spreadX = x + spread[i][0];
            spreadY = y + spread[i][1];
            if (spreadX >= 0 && spreadX < this.x && spreadY >= 0 && spreadY < this.y) {
                this.showNumber(spreadX, spreadY);
            }
        }
    }
}

const start = function gameStart() {
    let agent;
    let row = document.querySelector('#row').value || 10;
    let col = document.querySelector('#col').value || 10;
    let bomb = document.querySelector('#bomb').value || 10;
    agent = new Minesweeper(row, col, bomb);
}

"use strict";
//Declare 
let selectedNum, selectedTile, disableSelect, lives;
let timeRemaining, timer;
let stop = false; // variable test lives Remainning and Time lives
let pen = false; // variable test pen has used
let solution = [];
let gridSudoku = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
]; 

let grid = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
];

// recursive algo
function solveSudoku(grid, row, col) {
    let cell = findUnassignedLocation(grid, row, col);
    row = cell[0];
    col = cell[1];

    // base case: if no empty cell  
    if (row == -1) {
        console.log("solved");
        return true;
    }
    let numb = [1,2,3,4,5,6,7,8,9];
    shuffleArray(numb);
    for (let numt = 0; numt < 9; numt++) {
        let num = numb[numt];
        if ( noConflicts(grid, row, col, num) ) {   
            grid[row][col] = num;

            if ( solveSudoku(grid, row, col) ) {                
                return true;
            }

            // mark cell as empty (with 0)    
            grid[row][col] = 0;
        }
    }

    // trigger back tracking
    return false;
}
//Shuffle Array 1 - 9
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  //ES6
    }
}
//Find unassigned location (0)
function findUnassignedLocation(grid, row, col) {   
    for (; row < 9 ; col = 0, row++)
    for (; col < 9 ; col++)
        if (grid[row][col] == 0)
            return [row, col];
    return [-1, -1];
}

function noConflicts(grid, row, col, num) {
    return isRowOk(grid, row, num) && isColOk(grid, col, num) && isBoxOk(grid, row, col, num);
}

function isRowOk(grid, row, num) {
    for (let col = 0; col < 9; col++)
        if (grid[row][col] == num)
            return false;

    return true;
}
function isColOk(grid, col, num) {
    for (let row = 0; row < 9; row++)
    if (grid[row][col] == num)
        return false;

    return true;    
}
function isBoxOk(grid, row, col, num) {
    row = Math.floor(row / 3) * 3;
    col = Math.floor(col / 3) * 3;

    for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++)
            if (grid[row + r][col + c] == num)
                return false;

    return true;
}

function deleteElement(grid){
    let gridDelete = grid;  
    let num = [0,1,2,3,4,5,6,7,8];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            shuffleArray(num);
            gridDelete[i][num[j]] = 0;
        }
    }
    return gridDelete;
}

// Above build the solution grid sudoku

// function printGrid(grid) {
//     let res = "";

//     for (let i = 0; i < 9; i++) {
//         for (let j = 0; j < 9; j++) {
//             res += grid[i][j] + "  ";
//         }
//         res += "\n";
//     }
//     console.log(res);
// }


//Main function for sudoku game
//Controller
window.onload = function() {
    //Run startgame function when button is clicked
    id("start-btn").addEventListener("click", startGame); 
    //Add event listener to each number in number container
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function() {
            //If selecting is not disabled
            if(!disableSelect){
                //If number is already selected
                if(this.classList.contains("selected")) {
                    //Then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    //Deselected all other numbers
                    for (let i = 0; i < 9; i ++) {
                        id("number-container").children[i].classList.remove("selected"); // 146 != 219
                    }
                    //Select it and update selectedNum Variable
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
}

function startGame() {
    let board;
    board = createGrid();
    //Create board based on difficulty
    lives = 4;
    id("lives").textContent = "Lives Remainning: " + (lives-1);
    //Create board based on difficulty
    generateBoard(board);
    //Start the time 
    startTimer();
    //Sets theme based on input 
    if(id("theme-1").checked) {
        qs("body").classList.remove("dark");
    } else {
        qs("body").classList.add("dark");
    }
    //Show number container
    id("number-container").classList.remove("hidden");      
}

function startTimer() {
    //Sets time start
    timeRemaining = 1200;
    id("timer").textContent = timeConversion(timeRemaining);
    timer = setInterval(function() {
        if(timeRemaining > 0 && stop === false) timeRemaining--;
        //If no time Remaining end the game
        if(timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);        
    }, 1000);
}

function timeConversion(time) {
    let minutes = Math.floor(time/60);
    if(minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds; 
}

function createGrid(){
    let board = [];
    grid = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ];     
    gridSudoku = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ];
    solution = [];
    //Create solution 
    solveSudoku(grid,0,0);
    //Create grid
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            //Change Array 2 > 1
            solution.push(grid[i][j]);
        }
    }
    console.log(solution);
    gridSudoku = deleteElement(grid);
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            //Change Array 2 > 1
            board.push(grid[i][j]);
        }
    }
    console.log(grid);
    return board;
}
function generateBoard(board) {
    //Clear previous board
    clearPrevious();
    //Let used to increment tile ids
    let idCount = 0;
    //Create 81 tiles
    for (let i = 0; i < 81; i++){
        //Create a new paragraph elements
        let tile = document.createElement("p");
        
        //If tile has number == 0
        if (board[i] != 0) {
            //Set tile text to correct number
            tile.textContent = board[i];
        } else {
            //Add click event listener to tile
            tile.addEventListener("click", function() {
                //If selecting is not disabled
                if(!disableSelect) {
                    //If the tile is already selected
                    if(tile.classList.contains("selected")) {
                        //Then remove selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        //Deselect all other tiles
                        for(let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected"); // 219 != 146
                        }
                        // Add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }   
        // Assign tile id
        tile.id = idCount;
        //Increment for next tile
        idCount ++;
        //Add tile class to all tiles
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)){
            tile.classList.add("bottomBorder");
        }
        if((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        if ((tile.id >= 0 && tile.id < 9)){
            tile.classList.add("topBorder");
        }
        if (tile.id % 9 === 0){
            tile.classList.add("leftBorder");
        }
        if ((tile.id+1) % 9 === 0){
            tile.classList.add("rightBorder");
        }
        //Add tile to board
        id("board").appendChild(tile);
        if ((tile.id >= 72 && tile.id < 81)){
            tile.classList.add("bottomBorder");
        }
    }
}

function updateMove() {
    //If a tile and a number is selected
    if(selectedTile && selectedNum) {
        //Set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        //If the number matches the corresponding number in the solution key
        if (checkCorrect(selectedTile)) {
            //Deselects the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //Clear the selected variable
            selectedNum = null;
            selectedTile = null;
            //Check if board is completed
            if(checkDone()) {
                endGame();
            }
            //If the number does not match the solution key
        } else {
            //Disable selecting new numbers for one second
            disableSelect = true;
            //Make the tile turn red
            selectedTile.classList.add("incorrect");
            //Run in one second
            setTimeout(function (){ 
                //Subtract lives by one
                lives --;
                //If no lives left end the game
                if(lives === 0){
                    endGame();
                }else {
                    //If lives is not equal to zero
                    //Update lives text
                    id("lives").textContent = "Lives Remainning: " + (lives-1);
                    //Renable selecting numbers and tiles
                    disableSelect = false;
                }
                //Restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                //Clear the tiles text and clear selected variables
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            }, 1000);           
        }
    }
}

function endGame() {    
    //Display win or loss message
    if(lives === 0 || timeRemaining <= 0) {
        id("lives").textContent = "Mission Fail!";
        stop = true;
    } else {
        id("lives").textContent = "Won Won!";
        stop = true;
    }
    disableSelect = true;
}

function checkDone() {
    let tiles = qsa(".tile");
    for(let i = 0; i < tiles.length; i++) {
        if(tiles[i].textContent === "") return false;
    }
    return true;
}

function checkCorrect(tile) {
    //If tile's number is equal to solution's 
    console.log(solution[tile.id] , tile.textContent);
    if(solution[tile.id] == tile.textContent) return true;
    else return false; 
}

function clearPrevious() {
    // Access all of the tiles
    let tiles = qsa(".tile");        
    //Remove each tile
    for(let i = 0; i < tiles.length; i++){
        tiles[i].remove();
    }
    //Deselect any numbers
    for(let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    //Set stop = false
    stop = false;
    //Clear timer
    clearInterval(timer);
    //Clear selected variables
    selectedTile = null;
    selectedNum = null;
    disableSelect = false;
    //Set note write
    if(!id("number-option").children[0].classList.contains("pen-off")) {
        id("number-option").children[0].classList.remove("pen-on");
        id("number-option").children[0].classList.add("pen-off");   
    }
}

// helper Function
function noteWrite() {
    if(id("number-option").children[0].classList.contains("pen-off")) {
        id("number-option").children[0].classList.add("pen-on");
        id("number-option").children[0].classList.remove("pen-off");   
        pen = true;     
    } else {
        id("number-option").children[0].classList.remove("pen-on");
        id("number-option").children[0].classList.add("pen-off");  
        pen = false;
    }

}

function playPause() {
    if(id("play-pause").children[0].classList.contains("btn-play")){
        id("play-pause").children[0].classList.remove("btn-play");
        id("play-pause").children[0].classList.add("btn-pause");        
        for(let i = 0; i < id("board").children.length; i++) {
            id("board").children[i].classList.add("hidden");
        }
        stop = true;
    } else {
        id("play-pause").children[0].classList.add("btn-play");
        for(let i = 0; i < id("board").children.length; i++) {
            id("board").children[i].classList.remove("hidden");
        }
        stop = false;
    } 

}


let id = id => document.getElementById(id);

let qs = (selector) => document.querySelector(selector);

let qsa = (selector) => document.querySelectorAll(selector);

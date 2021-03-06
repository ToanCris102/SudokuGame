//Declare 
let selectedNum, selectedTile, disableSelect, lives;
let timeRemaining, timer;
let resultSet = [], arr = []; // set result for auto
let stop = false; // variable test lives Remainning and Time lives
let pen = false; // variable test pen has used
let solution = [];
let difficulty;
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

// backtrack find solution sudoku
function solveSudoku(grid, row, col) {
    let cell = findUnassignedLocation(grid, row, col);
    row = cell[0];
    col = cell[1];
    if (row == -1) {
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
            grid[row][col] = 0;
        }
    }
    return false;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  
    }
}

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
//easy-5  medium-8 hard- 30
function deleteElement(grid){
    let gridDelete = grid;  
    let num = [0,1,2,3,4,5,6,7,8];    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < difficulty; j++) {
            shuffleArray(num);
            gridDelete[i][num[j]] = 0;
        }
    }
    return gridDelete;
}

// Above build the solution grid sudoku
function printGrid(grid) {
    let res = "";

    for (let i = 0; i < 81; i++) {
        res += grid[i] + "  ";
        if((i + 1)%9 ===0 ) res += "\n";        
    }
    console.log(res);
}


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
                        id("number-container").children[i].classList.remove("selected"); 
                    }
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
    //Set difficulty for grid
    if(id("diff-1").checked){
        difficulty = 5;
    }else if(id("diff-2").checked) {
        difficulty = 8;
    }else
        difficulty = 30;
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
    //Show time live 
    id("time").classList.remove("hidden"); 
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
//    printGrid(solution);
    gridSudoku = deleteElement(grid);
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            //Change Array 2 > 1
            board.push(grid[i][j]);
        }
    }
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
            tile.addEventListener("click", function click() {
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
                        //Delete event when check true
                        // if(pen === true && solution[tile.id] == tile.textContent) {
                        //     if(solution[tile.id] == tile.textContent && pen === false) tile.removeEventListener("click", click()); 
                        // }                        
                        selectedTile = tile;                                                                                          
                        updateMove(tile);
                        try {
                            let font = selectedTile.style.fontSize;                  
                            if(tile.textContent !== "" && font === "35pt" || font === "25pt") tile.removeEventListener("click", click());
                        } catch (error) {
                            
                        }
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
        //Add border
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

function updateMove(tile) {
    //If a tile and a number is selected
    if(selectedTile && selectedNum && (Number(selectedNum.textContent) > 0 && Number(selectedNum.textContent) <= 9)) {        
        deletePen(selectedTile);
        //If pen === true update class .tile        
        if(pen === true) {                
            selectedTile.style.fontSize = "8pt"; 
            if(!selectedTile.textContent.match(selectedNum.textContent)){
                selectedTile.textContent += " "+selectedNum.textContent;
            }
            
        }else{
            //Set the tile to the correct number
            selectedTile.style.fontSize = ""; 
            
            selectedTile.style.hover = "black";
            selectedTile.textContent = selectedNum.textContent;
        }
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
        } else {
            //Disable selecting new numbers for one second
            disableSelect = true;
            selectedTile.classList.add("incorrect");
            setTimeout(function (){ 
                lives --;
                if(lives === 0){
                    endGame();
                }else {
                    id("lives").textContent = "Lives Remainning: " + (lives-1);
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
    // if(solution[tile.id] == tile.textContent || pen === true){         
    //     return true;
    // } 
    // else return false; 
    let temp_arr = [
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
    let i = 0;
    for(let x = 0; x < 9; x++){
        for(let y = 0; y < 9; y++){
            if(qsa(".tile")[i].textContent != "" && qsa(".tile")[i].style.fontSize != '8pt' )
                temp_arr[x][y] = parseInt(qsa(".tile")[i].textContent);
            i++;
        }
    }   
    console.log(solveSudoku(temp_arr,0,0));
    return solveSudoku(temp_arr,0,0);
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
    arr = [];
    resultSet = [];
}


// helper Function
async function createSolution() {  
    if(confirm("You know: There is only one thing that makes a dream impossible to achieve: the fear of failure. Are you sure ?")){  
        arr = [
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
        let i = 0;
        for(let x = 0; x < 9; x++){
            for(let y = 0; y < 9; y++){
                if(qsa(".tile")[i].textContent != "" && qsa(".tile")[i].style.fontSize != '8pt' )
                    arr[x][y] = parseInt(qsa(".tile")[i].textContent);
                else {
                    qsa(".tile")[i].style.color = "red";
                    qsa(".tile")[i].style.fontSize = "";
                }
                i++;
            }
        }
        stop = true;
        timeRemaining = 0;
        endGame();
        resultSet = [];
        writeSolution(arr,0,0);
            
        let temp = findUnassignedLocation(arr,0,0);
        if(temp[0] == -1) {
            for(let i = 0; i < resultSet.length; i++){
                let element = resultSet[i];        
                await timeout(1);            
                qsa(".tile")[element[0]].textContent = element[1];
            }
        }else{
            resultSet = solution;
            for(let i = 0; i < 81; i++){
                await timeout(10); 
                qsa(".tile")[i].textContent = resultSet[i];
            }
        }          
    } 
    
}


function writeSolution(grid, row, col) {           
    let cell = findUnassignedLocation(grid, row, col);
    row = cell[0];
    col = cell[1];
    if (row == -1) {
        return true;
    }
    for (let num = 1; num <= 9; num++) {
        if (noConflicts(grid, row, col, num) ) {             
            grid[row][col] = num;             
            resultSet.push([(row*9)+(col),num]);            
            if (writeSolution(grid, row, col) ) {                
                return true;
            }
            grid[row][col] = 0;             
            resultSet.push([(row*9)+(col),'']); 
        }
        
    }
    return false;
}



function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function deletePen(selectedTile){
    id("number-option").children[1].addEventListener("click", function(){
        if(selectedTile.classList.contains("selected")) {
            selectedTile.textContent = "";
            selectedTile.classList.remove("selected");
        }
    });

}


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
        arr = [
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
        let i = 0;
        for(let x = 0; x < 9; x++){
            for(let y = 0; y < 9; y++){
                if(qsa(".tile")[i].textContent != "" && qsa(".tile")[i].style.fontSize != '8pt' )
                    arr[x][y] = parseInt(qsa(".tile")[i].textContent);
                else {
                    qsa(".tile")[i].style.color = "red";
                    qsa(".tile")[i].style.fontSize = "";
                }
                i++;
            }
        }
        // let arr_temp = JSON.parse(arr);
        // arr = JSON.stringify(arr_temp);
        // console.log(arr_temp);
      //  saveSudoku(,timeRemaining)
    } else {
        id("play-pause").children[0].classList.add("btn-play");
        for(let i = 0; i < id("board").children.length; i++) {
            id("board").children[i].classList.remove("hidden");
        }
        stop = false;
    } 

}

function saveSudoku(list, time){
    if (window.XMLHttpRequest) {
        // code for modern browsers
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for old IE browsers
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        }
    };    
    xmlhttp.open("GET", "main.php/?list="+list+"&time="+time, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    xmlhttp.send();
}

let id = id => document.getElementById(id);

let qs = (selector) => document.querySelector(selector);

let qsa = (selector) => document.querySelectorAll(selector);

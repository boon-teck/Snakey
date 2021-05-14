//startpage & endpage

document.getElementById("start").addEventListener('click',startGame);
document.getElementById("playagain").addEventListener('click',restartGame)
document.querySelector('#home').addEventListener('click',home)


function startGame() {
    document.querySelector('.startpage').style.display = 'none';
    document.querySelector('.board').style.display = 'flex';
    backgroundSound.play();
    backgroundSound.loop = true;
    //invoke function for gameLogic
    gameLogic();
}

function restartGame() {
    document.querySelector('.endscreen').style.display = 'none';
    document.querySelector('.board').style.display = 'flex';
    snakeHeadXAxis = 10;
    snakeHeadYAxis = 10;
    snakeLength = 2;
    snakeBody = [];

    gameLogic();
}

function home() {
    document.querySelector('.endscreen').style.display = 'none';
    document.querySelector('.board').style.display = 'none';
    document.querySelector('.startpage').style.display = 'flex';
    snakeHeadXAxis = 10;
    snakeHeadYAxis = 10;
    snakeLength = 2;
    snakeBody = [];
    backgroundSound.pause();
}

//game --- Create canvas and game element

const canvas = document.getElementById('gameboard')
const ctx = canvas.getContext('2d');

//number of tile --- size of tiles/snakes/apples
let numberOfTiles = 20;
//size
let tileSize = canvas.width/numberOfTiles // 600/30 = 20 width so 20 by 20 for a block

//Attributes for snake game --- Position of snake  ----Speed of snake (can use object for this)
let snakeHeadXAxis = 10;
let snakeHeadYAxis = 10;
let snakeSpeed = 5;
let snakeBody = [];
let snakeLength = 2;
//sound
let loseGame = new Audio("audio/bangwall.wav");
let eatSound = new Audio("audio/bling.wav");

//changes from here
let backgroundSound = new Audio("audio/background.mp3");

//my object is here
class SnakeBodyAxis {
    constructor(x,y) {
    this.x = x;
    this.y = y;
}}


function gameLogic() { //move-drawhead-remove-delay doesnt work while remove-move-drawhead works)
    snakeMovement();
    let end = endGame()
    if (end  === true){
        document.querySelector('.endscreen').style.display = 'block';
        loseGame.play()
        return; //use return stop gameLogic for some reason cant use break
    }
    let wallLoseLogic = wallLose(); //L68-72 for losing on wall touch
    if (wallLoseLogic === true){
        document.querySelector('.endscreen').style.display = 'block';
        loseGame.play()
        return
    }
    clearSnake();
    spawnFood();
    ateFood();
    createBody();  //DOES NOT WORK YET
    // wallLogic();
    console.log(snakeHeadXAxis)
    // console.log(snakeHeadYAxis)
    snakeHead();
    //need to clear the snake trail here
    //spawnFood here -- keep spawning even without eating -- Need to invoke only once and invoke another time after eating

    setTimeout(gameLogic, 500/snakeSpeed)
}

//Draw SnakeHead
function snakeHead() {
    ctx.fillStyle = '#a86aa4';
    ctx.fillRect(snakeHeadXAxis*numberOfTiles, snakeHeadYAxis*numberOfTiles, tileSize, tileSize)
}


function createBody() {
    ctx.fillStyle = '#7b5fac';
    let snakeSectionObj = new SnakeBodyAxis(snakeHeadXAxis, snakeHeadYAxis)//An object of old axis
    //for length of array, draw rect when I move it
    for (let j=0; j < snakeBody.length; j++) {//snake length accessing the array of object
        let snakeSection = snakeBody[j]; //access object in array position
        ctx.fillRect(snakeSection.x * numberOfTiles,snakeSection.y * numberOfTiles, tileSize, tileSize)
    }
    // need to limit length of snake to length
    //     console.log('test', snakeSectionObj)
        snakeBody.unshift(snakeSectionObj); //push object to front of the array
    if (snakeBody.length > snakeLength) {
        snakeBody.pop(); //remove first item away since we add to the front work also with push and shift i think
        // console.log('array', snakeBody); //Now it keep adding to array though without eatingz
        // console.log('first array', snakeBody[0].x);
    }
}

//move snake
let moveInDirX = 0;
let moveInDirY = 0;

//wall logic for passing through
function wallLogic() {
    if (snakeHeadXAxis > 19){
        snakeHeadXAxis = 0;
    }
    if (snakeHeadXAxis < 0){
        snakeHeadXAxis = 20;
    }
    if (snakeHeadYAxis > 19){
        snakeHeadYAxis = 1;
    }
    if (snakeHeadYAxis < 0){
        snakeHeadYAxis = 20;
    }
}

//wall logic for losing
function wallLose() {
    if (snakeHeadXAxis > 19){
        return true;
    }
    if (snakeHeadXAxis < 0){
        return true;
    }
    if (snakeHeadYAxis > 19){
        return true;
    }
    if (snakeHeadYAxis < 0){
        return true;
    }
}


function snakeMovement() {
    snakeHeadXAxis += moveInDirX;
    snakeHeadYAxis += moveInDirY;
}

//for keyboard function --- Player 0 (keypress deprecated)
window.addEventListener('keydown', keyBoardEvent)
function keyBoardEvent(key){
    //keycode.info
    // console.log('test', key)
    if(key.keyCode === 39){
        // console.log("HI")
        if (!(moveInDirX > 0 || moveInDirX < 0)) {
            moveInDirX = 1
            moveInDirY = 0
        }
    }
    if(key.keyCode === 37){
        if (!(moveInDirX > 0 || moveInDirX < 0)) {
            moveInDirX = -1
            moveInDirY = 0
        }
    }
    if(key.keyCode === 38){
        if(!(moveInDirY > 0 || moveInDirY < 0)) {
            moveInDirY = -1
            moveInDirX = 0
        }
    }
    if(key.keyCode === 40){
        if(!(moveInDirY >0 || moveInDirY < 0)) {
            moveInDirY = 1
            moveInDirX = 0
        }
    }
}

function clearSnake() {
    // ctx.clearRect() //nope this doesnt work maybe just make it same as background color
    ctx.fillStyle = 'black';
    // ctx.fillRect(0,0, tileSize, tileSize)// too hard to cover specific part
    ctx.fillRect(0,0, canvas.height, canvas.width) //cover whole thing instead now everything is gone
}


//keep spawning even without eating - maybe take out the Math random from inside the function
let foodSize = tileSize
let foodXAxis = Math.floor(Math.random() * (numberOfTiles-1));
let foodYAxis = Math.floor(Math.random() * (numberOfTiles-1));
// let foodXAxis = Math.floor(Math.random() * numberOfTiles)
// let foodYAxis = Math.floor(Math.random() * numberOfTiles)
//maybe take out the Math random from inside the function
//ok for some reason this solution works


function spawnFood() {
    ctx.fillStyle = '#f7c978';
    ctx.fillRect(foodXAxis*numberOfTiles,foodYAxis*numberOfTiles, foodSize, foodSize)
}

function ateFood() {
    if ((snakeHeadXAxis === foodXAxis) && (snakeHeadYAxis === foodYAxis)) {
        eatSound.play();
        // spawnFood() //doesnt work
        foodXAxis = Math.floor(Math.random() * (numberOfTiles-1)) //1-29 tiles
        foodYAxis = Math.floor(Math.random() * (numberOfTiles-1))
        snakeLength += 1;
        // console.log(snakeHeadXAxis,snakeHeadYAxis)
    }
    // console.log(foodXAxis,foodYAxis)
}

//End the game after biting it's body accidentally/intentionally
function endGame() {
    for (let k=0; k < snakeBody.length; k++){ //snakeLength does not work here
        //snakeBody.length is 2 but it doesnt work
        // console.log(k) //works after putting into the gameLogic loop
        if ((snakeBody[k].x === snakeHeadXAxis) && (snakeBody[k].y === snakeHeadYAxis)){
            if (moveInDirX !== 0 || moveInDirY !== 0) { //to solve ending the game even though game havent start
                console.log('You are dead') //test
                return true
            }
        }
    }
}


//test -- remove functionality of scrolling with keyboard (from online)
let keys = {};
window.addEventListener("keydown",
    function(e){
        keys[e.keyCode] = true;
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    },
    false);
window.addEventListener('keyup',
    function(e){
        keys[e.keyCode] = false;
    },
    false);




//To do
//NEW PROBLEM???!!! why am i moving across y axis faster than x axis even if width height the same
//Spawning a food (Canvas cannot add picture apparently)
//Lengthen the body of snake after eating
//need to create an array for body and to make snake look like its moving, unshift and pop
//Hit detection (against own body)
//Switching webpage
//bugs to fix
//hitting left and right quickly will cause the snake to go back into its own body
//food spawning in the snake body - need logic to prevent that


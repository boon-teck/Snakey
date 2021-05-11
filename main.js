const canvas = document.getElementById('gameboard')
const ctx = canvas.getContext('2d');

//number of tile --- size of tiles/snakes/apples
let numberOfTiles = 20;
//size
let tileSize = canvas.width/numberOfTiles // 600/30 = 20 width so 20 by 20 for a block
//Attributes for snake game --- Position of snake  ----Speed of snake
let snakeHeadXAxis = 10; //go up to 600?
let snakeHeadYAxis = 10;
let snakeSpeed = 5;

function gameLogic() { //move-drawhead-remove-delay doesnt work while remove-move-drawhead works)
    clearSnake()
    spawnFood()
    snakeMovement();
    snakeHead();
    ateFood();
    //need to clear the snake trail here
    //spawnFood here -- keep spawning even without eating -- Need to invoke only once and invoke another time after eating

    setTimeout(gameLogic, 500/snakeSpeed)
}

//Draw SnakeHead
function snakeHead() {
    ctx.fillStyle = 'red';
        ctx.fillRect(snakeHeadXAxis*numberOfTiles, snakeHeadYAxis*numberOfTiles, tileSize, tileSize)
}

//move snake
let moveInDirX = 0;
let moveInDirY = 0;
function snakeMovement() {
    snakeHeadXAxis += moveInDirX;
    snakeHeadYAxis += moveInDirY;
}

//for keyboard function --- Player 0 (keypress depreciated)
window.addEventListener('keydown', keyBoardEvent)
function keyBoardEvent(key){
    //keycode.info
    // console.log('test', key)
    if(key.keyCode === 39){
        // console.log("HI")
        moveInDirX = 1
        moveInDirY = 0
    }
    if(key.keyCode === 37){
        moveInDirX = -1
        moveInDirY = 0
    }
    if(key.keyCode === 38){
        moveInDirY = -1
        moveInDirX = 0
    }
    if(key.keyCode === 40){
        moveInDirY = 1
        moveInDirX = 0
    }
}

function clearSnake() {
    // ctx.clearRect() //nope this doesnt work maybe just make it same as background color
    ctx.fillStyle = 'black';
    // ctx.fillRect(0,0, tileSize, tileSize)// too hard to cover specific part
    ctx.fillRect(0,0, canvas.height, canvas.width) //cover whole thing instead now everything is gone
}


//keep spawning even without eating - maybe take out the Math random from inside the function
let foodSize = tileSize//15-5
let foodXAxis = Math.floor(Math.random() * (numberOfTiles-1));
let foodYAxis = Math.floor(Math.random() * (numberOfTiles-1));
// let foodXAxis = Math.floor(Math.random() * numberOfTiles)
// let foodYAxis = Math.floor(Math.random() * numberOfTiles)
//maybe take out the Math random from inside the function
//ok for some reason this solution works

function spawnFood() {
    ctx.fillStyle = 'Orange';
    ctx.fillRect(foodXAxis*numberOfTiles,foodYAxis*numberOfTiles, foodSize, foodSize)
}

function ateFood() {
    if ((snakeHeadXAxis === foodXAxis) && (snakeHeadYAxis === foodYAxis)) {
        // spawnFood() //doesnt work
        foodXAxis = Math.floor(Math.random() * (numberOfTiles-1)) //1-29 tiles
        foodYAxis = Math.floor(Math.random() * (numberOfTiles-1))
    }
}
//test -- remove functionality of scrolling with keyboard (from online)
var keys = {};
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


//invoke function for gameLogic
gameLogic();

//To do
//NEW PROBLEM???!!! why am i moving across y axis faster than x axis even if width height the same
//Spawning a food (Canvas cannot add picture apparently)
//Lengthen the body of snake after eating
//need to create an array for body and to make snake look like its moving, unshift and pop
//Hit detection (against the wall) & (against own body)

const canvas = document.getElementById("game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

let elementsSize;
let canvasSize;

const playerPosition = {
  x: undefined,
  y: undefined
};

function setCanvasSize() {
  if(window.innerHeight > window.innerWidth){
    canvasSize = window.innerWidth * 0.8;
  }else{
    canvasSize = window.innerHeight * 0.8;
  }
      
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
  elementsSize = canvasSize / 10;
  startGame();
}

function startGame() {

  game.font = elementsSize + 'px Verdana';
  game.textAlign = "end";

  const map = maps[0];
  const mapRows =map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));

  // for (let row = 1; row <= 10; row++) {
  //   for(let col = 1; col <= 10; col++){
  //     game.fillText(emojis[mapRowCols[row-1][col-1]], elementsSize * col, elementsSize * row);
  //   }    
  // }
  game.clearRect(0,0,canvasSize,canvasSize);

   mapRowCols.forEach((row, rowI) => {
    row.forEach((col,colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);

      if(col == 'O' && (!playerPosition.x && !playerPosition.y)){
          playerPosition.x = posX/elementsSize;
          playerPosition.y = posY/elementsSize;        
      }

      game.fillText(emoji, posX, posY);
    });
   });

   movePlayer();

}

function movePlayer(){
  game.fillText(emojis['PLAYER'], playerPosition.x * elementsSize, playerPosition.y * elementsSize);
}

//eventos de bonotes y teclado
window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event){
  if(event.key == 'ArrowUp'){
    moveUp();
  }else if(event.key == 'ArrowLeft'){
    moveLeft();
  }else if(event.key == 'ArrowRight'){
    moveRight();
  }else if(event.key == 'ArrowDown'){
    moveDown();
  }
}

function moveUp(){
  console.log('me quiero mover hacia arriba');
  if(playerPosition.y > 1) {
    playerPosition.y -= 1;
  }
  startGame();
  
}

function moveLeft(){
  console.log('me quiero mover hacia la izquierda');
  if(playerPosition.x > 1) {
    playerPosition.x -= 1;
  }
  startGame();
  
}

function moveRight(){
  console.log('me quiero mover hacia la derecha');
  if(playerPosition.x < 10) {
      playerPosition.x += 1;
  }
  startGame();
}

function moveDown(){
  console.log('me quiero mover hacia abajo');
  if(playerPosition.y < 10) {
    playerPosition.y += 1;
  }
  startGame();
}



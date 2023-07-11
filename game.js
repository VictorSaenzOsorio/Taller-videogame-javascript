const canvas = document.getElementById("game");
const game = canvas.getContext("2d");

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

let elementsSize;

function setCanvasSize() {
  const canvasSize =
    window.innerHeight > window.innerWidth
      ? window.innerWidth * 0.8
      : window.innerHeight * 0.8;
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
  elementsSize = canvasSize / 10;
  startGame();
}

function startGame() {

  game.font = elementsSize + 'px Verdana';
  game.textAlign = "end";

  const map = maps[1];
  const mapRows =map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));

  // for (let row = 1; row <= 10; row++) {
  //   for(let col = 1; col <= 10; col++){
  //     game.fillText(emojis[mapRowCols[row-1][col-1]], elementsSize * col, elementsSize * row);
  //   }    
  // }
   mapRowCols.forEach((row, rowI) => {
    row.forEach((col,colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);
      game.fillText(emoji, posX, posY);
    });
   });


}



Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};
Array.prototype.equals = function (array) {
  if (!array) return false;
  if (array.length != this.length) return false;
  for (let i = 0; i < this.length; i++) {
    for (let j = 0; j < this[i].length; j++) {
      if (this[i][j] != array[i][j]) return false;
    }
  }
  return true;
};

let score = 0;
let absoluteGridCoords = [[], [], [], []];

const initialGameState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const scoreElement = document.getElementById("score");
const gameOverMessageElement = document.getElementById("game-over-msg");

function createTempValueCell(rowIndex, colIndex, blockValue){
  const block = document.createElement("div");
  block.classList.add("game-tile");
  block.id = "temp-" + rowIndex + colIndex;
  block.setAttribute("value", blockValue);
  block.style.position = "absolute";
  block.style.top = absoluteGridCoords[rowIndex][colIndex].top;
  block.style.left = absoluteGridCoords[rowIndex][colIndex].left;
  block.style.width = absoluteGridCoords[rowIndex][colIndex].width;
  block.style.height = absoluteGridCoords[rowIndex][colIndex].height;
  return block;
}

function makeCellBlank(rowIndex, colIndex){
  const elem = document.getElementById("" + rowIndex + colIndex);
  elem.style = {
    ...elem.style,
    position: "absolute",
    top: absoluteGridCoords[rowIndex][colIndex].top,
    left: absoluteGridCoords[rowIndex][colIndex].left,
    width: absoluteGridCoords[rowIndex][colIndex].width,
    height: absoluteGridCoords[rowIndex][colIndex].height
  }
  elem.removeAttribute("value");
}

function renderGameAbsolute(state) {
  state.forEach((row, rowIndex) => {
    const rowElem = document.getElementById("row" + rowIndex);
    row.forEach((blockValue, colIndex) => {
      makeCellBlank(rowIndex, colIndex);
      if (blockValue != 0) {
        const block = createTempValueCell(rowIndex, colIndex, blockValue);
        rowElem.appendChild(block);
      }
    });
  });
}

function renderGameRelative(state) {
  state.forEach((row, rowIndex) => {
    row.forEach((blockValue, colIndex) => {
      const elem = document.getElementById("" + rowIndex + colIndex);
      elem.style = {
        ...elem.style,
        position: "relative",
        top: "",
        left: "",
        height: "",
        width: ""
      }
      absoluteGridCoords[rowIndex][colIndex] = elem.getBoundingClientRect();
      elem.removeAttribute("value");
      if (blockValue != 0) elem.setAttribute("value", blockValue);
    });
  });
}

function moveBlock(from, to) {
  return new Promise((resolve, reject) => {
    const { x: startX, y: startY } = from;
    const { x: endX, y: endY, value: endValue } = to;
    const elem = document.getElementById("temp-" + startX + startY);
    setTimeout(() => {
      elem.style.top = absoluteGridCoords[endX][endY].top;
      elem.style.left = absoluteGridCoords[endX][endY].left;
      setTimeout(() => {
        const newElem = document.getElementById("" + endX + endY);
        newElem.setAttribute("value", endValue);
        elem.remove();
        resolve("finish");
      }, 100);
    }, 0);
  });
}

function animate(state, updatedState, positionUpdates) {
  renderGameAbsolute(state);
  const updateAnimations = positionUpdates.map((move) =>
    moveBlock(move.from, move.to)
  );
  Promise.all(updateAnimations).then((res) => {
    gameState = updatedState;
    const { blockValue, posX, posY } = generateRandomBlock(
      updatedState,
      [2, 4]
    );
    gameState[posX][posY] = blockValue;
    renderGameRelative(gameState);
  });
}

window.onload = (_) => {
  initializeGame();
};

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
      if (!canMoveRight(gameState)) return;
      [positionUpdates, updatedGameState, scoreGained] = moveRight(gameState);
      break;

    case "ArrowLeft":
      if (!canMoveLeft(gameState)) return;
      [positionUpdates, updatedGameState, scoreGained] = moveLeft(gameState);
      break;

    case "ArrowUp":
      if (!canMoveUp(gameState)) return;
      [positionUpdates, updatedGameState, scoreGained] = moveUp(gameState);
      break;

    case "ArrowDown":
      if (!canMoveDown(gameState)) return;
      [positionUpdates, updatedGameState, scoreGained] = moveDown(gameState);
      break;

    default:
      return;
  }
  score += scoreGained;
  scoreElement.setAttribute("value", score);
  if (isGameOver(gameState)) {
    gameOverMessageElement.hidden = false;
  } else {
    gameOverMessageElement.hidden = true;
  }
  animate(gameState, updatedGameState, positionUpdates);
});

function canMergeCells(state) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!state[i][j]) continue;
      if (j + 1 < 4 && state[i][j + 1] === state[i][j]) return true;
      if (i + 1 < 4 && state[i + 1][j] === state[i][j]) return true;
    }
  }
  return false;
}

function canMoveLeft(state) {
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      if (!state[i][j]) continue;
      const cellOnLeft = state[i][j - 1];
      if (cellOnLeft == state[i][j] || cellOnLeft == 0) return true;
    }
  }
  return false;
}

function canMoveRight(state) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (!state[i][j]) continue;
      const cellOnRight = state[i][j + 1];
      if (cellOnRight == state[i][j] || cellOnRight == 0) return true;
    }
  }
  return false;
}

function canMoveUp(state) {
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!state[i][j]) continue;
      const cellAbove = state[i - 1][j];
      if (cellAbove == state[i][j] || cellAbove == 0) return true;
    }
  }
  return false;
}

function canMoveDown(state) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      const cellBelow = state[i + 1][j];
      if (cellBelow == state[i][j] || cellBelow == 0) return true;
    }
  }
  return false;
}

function isGameOver(state) {
  //Game is over if there are no open positions and no possible moves
  const hasOpenPositions = getAllFreePositions(state).length > 0;
  return !hasOpenPositions && !canMergeCells(state);
}

function getAllFreePositions(state) {
  const freePositions = state
    .map((row, rowIndex) =>
      row.map((col, colIndex) => {
        if (col == 0) return [rowIndex, colIndex];
      })
    )
    .flat()
    .filter((x) => x != undefined);
  return freePositions;
}

function generateRandomBlock(state, allowedValues) {
  const [posX, posY] = getAllFreePositions(state).random();
  const blockValue = allowedValues.random();
  return {
    blockValue,
    posX,
    posY,
  };
}

function initializeGame() {
  gameState = structuredClone(initialGameState);
  score = 0;
  scoreElement.setAttribute("value", score);
  const { blockValue, posX, posY } = generateRandomBlock(gameState, [2]);
  gameState[posX][posY] = blockValue;
  renderGameRelative(gameState);
}

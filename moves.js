function compressRow(row, dir) {
  /*
    Accepts a one dimensional array and a direction to merge in.
    Merges cell using a stack and returns an array of position updates,
    a final array and total score gained.
  */
  let stack = [];
  let blockUpdates = [];
  let scoreGained = 0;
  const rowCopy = row.slice();
  if (dir === "right") rowCopy.reverse();
  rowCopy.forEach((tile, originalIndex) => {
    if (tile == 0) return;
    if (stack.at(-1) === tile) {
      stack.pop();
      stack.push(2 * tile);
      scoreGained += 2 * tile;
    } else {
      stack.push(tile);
    }
    blockUpdates.push({
      from: dir === "right" ? 3 - originalIndex : originalIndex,
      to: dir === "right" ? 4 - stack.length : stack.length - 1,
      value: stack.at(-1),
    });
  });
  const emptySpaces = 4 - stack.length;
  for (let i = 0; i < emptySpaces; i++) stack.push(0);
  if (dir === "right") stack.reverse();
  return [blockUpdates, stack, scoreGained];
}

function compressMatrix(state, dir){
  /*
    Accepts a two dimensional array and a direction to merge in.
    Merges all rows using compressRow and aggregates the final results.
  */
  const updatedState = [];
  let totalScoreGained = 0;
  const positionUpdates = state
    .map((row, rowIndex) => {
      const [blockUpdates, updatedRow, scoreGainedFromRow] = compressRow(row, dir);
      updatedState.push(updatedRow);
      totalScoreGained += scoreGainedFromRow;
      return blockUpdates.map((update) => {
        return {
          from: {
            x: rowIndex,
            y: update.from,
          },
          to: {
            x: rowIndex,
            y: update.to,
            value: update.value,
          },
        };
      });
    })
    .flat();
  return [positionUpdates, updatedState, totalScoreGained];
}

function moveRight(state) {
  return compressMatrix(state, 'right');
}

function moveLeft(state) {
  return compressMatrix(state, 'left');
}

function moveUp(state) {
  const rightRotatedState = rightRotateState(state);
  const [rightRotatedPositionUpdates, updatedRightRotatedState, totalScoreGained] = compressMatrix(rightRotatedState, 'right');
  const updatedState = leftRotateState(updatedRightRotatedState);
  const positionUpdates = leftRotateUpdates(rightRotatedPositionUpdates);
  return [positionUpdates, updatedState, totalScoreGained];
}

function moveDown(state) {
    const rightRotatedState = rightRotateState(state);
    const [rightRotatedPositionUpdates, updatedRightRotatedState, totalScoreGained] = compressMatrix(rightRotatedState, 'left');
    const updatedState = leftRotateState(updatedRightRotatedState);
    const positionUpdates = leftRotateUpdates(rightRotatedPositionUpdates);
    return [positionUpdates, updatedState, totalScoreGained];
}

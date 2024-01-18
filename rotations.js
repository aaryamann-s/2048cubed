function rightRotateState(state) {
  let rotatedState = [[], [], [], []];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      rotatedState[row][col] = state[3 - col][row];
    }
  }
  return rotatedState;
}

function leftRotateState(state) {
  let rotatedState = [[], [], [], []];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      rotatedState[row][col] = state[col][3 - row];
    }
  }
  return rotatedState;
}

function rightRotateUpdates(updates) {
  return updates.map((update) => {
    return {
      from: {
        x: update.from.y,
        y: 3 - update.from.x,
      },
      to: {
        x: update.to.y,
        y: 3 - update.to.x,
        value: update.to.value,
      },
    };
  });
}

function leftRotateUpdates(updates) {
  return updates.map((update) => {
    return {
      from: {
        x: 3 - update.from.y,
        y: update.from.x,
      },
      to: {
        x: 3 - update.to.y,
        y: update.to.x,
        value: update.to.value,
      },
    };
  });
}

export default class Pathfinder {
  static findPath(pathfinderData, pathNodes) {
    const colsCount = pathfinderData.colsCount;
    const allTiles = pathfinderData.allTiles;
    let wallTiles = pathfinderData.wallTiles;

    let remainingTiles = allTiles.reduce((acc, tile) => {
      if (!wallTiles.includes(tile)) {
        acc.push(tile);
      }

      return acc;
    }, []);

    let stepsStack = [[pathNodes[0]]];

    let nextStep = [pathNodes[0]];

    while (nextStep.length > 0 && nextStep.indexOf(pathNodes[1]) < 0) {
      let currentStep = nextStep;

      let accumulator = [];
      for (let curTile of currentStep) {
        curTile = parseInt(curTile);
        if (
          curTile + colsCount < allTiles.length &&
          remainingTiles.includes(curTile + colsCount)
        ) {
          accumulator.push(curTile + colsCount);
          remainingTiles.splice(remainingTiles.indexOf(curTile + colsCount), 1);
        }
        if (
          curTile > colsCount &&
          remainingTiles.includes(curTile - colsCount)
        ) {
          accumulator.push(curTile - colsCount);
          remainingTiles.splice(remainingTiles.indexOf(curTile - colsCount), 1);
        }
        if (
          (curTile + 1) % colsCount > 0 &&
          remainingTiles.includes(curTile + 1)
        ) {
          accumulator.push(curTile + 1);
          remainingTiles.splice(remainingTiles.indexOf(curTile + 1), 1);
        }
        if (curTile % colsCount > 0 && remainingTiles.includes(curTile - 1)) {
          accumulator.push(curTile - 1);
          remainingTiles.splice(remainingTiles.indexOf(curTile - 1), 1);
        }
      }

      nextStep = accumulator;

      if (nextStep.length > 0) {
        stepsStack.push(nextStep);
      }
    }

    const buffer = stepsStack.map((step) => {
      return step;
    });

    const pathBack = (arg) => {
      let stack = arg;

      stack.pop();

      let path = [pathNodes[1]];

      while (stepsStack.length > 0) {
        const currentStep = stack.pop();

        let up = currentStep.indexOf(path[0] - colsCount);
        let down = currentStep.indexOf(path[0] + colsCount);
        let right = currentStep.indexOf(path[0] + 1);
        let left = currentStep.indexOf(path[0] - 1);

        if (up >= 0) {
          path.unshift(currentStep[up]);
        } else if (down >= 0) {
          path.unshift(currentStep[down]);
        } else if (right >= 0) {
          path.unshift(currentStep[right]);
        } else if (left >= 0) {
          path.unshift(currentStep[left]);
        }
      }

      return path;
    };

    let path;

    if (buffer === ["noPath"]) {
      path = "noPath";
    } else {
      path = pathBack(stepsStack);
    }

    return {
      stepsStack: buffer,
      path: path,
    };
  }
}

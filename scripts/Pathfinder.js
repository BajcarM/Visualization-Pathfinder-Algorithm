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

    let nextStep = [[pathNodes[0]]];

    while (nextStep.length > 0 && nextStep.indexOf(pathNodes[1]) < 0) {
      let currentStep = nextStep;

      let accumulator = [];
      for (let curTile of currentStep) {
        curTile = parseInt(curTile);
        if (remainingTiles.includes(curTile + colsCount)) {
          accumulator.push(curTile + colsCount);
        }

        if (remainingTiles.includes(curTile - colsCount)) {
          accumulator.push(curTile - colsCount);
        }
        if (
          remainingTiles.includes(curTile + 1) &&
          (curTile + 1) % colsCount > 0
        ) {
          accumulator.push(curTile + 1);
        }
        if (remainingTiles.includes(curTile - 1) && curTile % colsCount > 0) {
          accumulator.push(curTile - 1);
        }
      }

      nextStep = accumulator;

      if (nextStep.length > 0) {
        stepsStack.push(nextStep);
      } else {
        stepsStack = ["noPath"];
      }

      remainingTiles = remainingTiles.reduce((acc, tile) => {
        if (nextStep.indexOf(tile) < 0) {
          acc.push(tile);
        }

        return acc;
      }, []);
    }

    const buffer = stepsStack.map((step) => {
      return step;
    });

    const pathBack = (arg) => {
      let stack = arg;

      if (stack === ["noPath"]) {
        return "noPath";
      }

      stack.pop();

      let path = [pathNodes[1]];

      while (stepsStack.length > 0) {
        const currentStep = stack.pop();

        let up = currentStep.indexOf(path[path.length - 1] - colsCount);
        let down = currentStep.indexOf(path[path.length - 1] + colsCount);
        let right = currentStep.indexOf(path[path.length - 1] + 1);
        let left = currentStep.indexOf(path[path.length - 1] - 1);

        if (up >= 0) {
          path.push(currentStep[up]);
        } else if (down >= 0) {
          path.push(currentStep[down]);
        } else if (right >= 0) {
          path.push(currentStep[right]);
        } else if (left >= 0) {
          path.push(currentStep[left]);
        }
      }

      return path;
    };

    let path = pathBack(stepsStack);

    return {
      stepsStack: buffer,
      path: path,
    };
  }
}

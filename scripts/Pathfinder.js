export default class Pathfinder {
  static findPath(pathfinderData, pathNodes) {
    const pathfinderData = pathfinderData;

    const colsCount = pathfinderData.colsCount;
    const allTiles = pathfinderData.allTiles;
    let wallTiles = pathfinderData.wallTiles;
    let pathNodes = pathNodes;

    let remainingTiles = allTiles.filter((tile) => !wallTiles.includes(tile));

    let stepsStack = [[pathNodes[0]]];

    let nextStep;

    while (nextStep.length > 0) {
      let currentStep = nextStep;
      nextStep = remainingTiles.reduce((acc, tile) => {
        currentStep.forEach((curTile) => {
          if (
            tile === curTile + 1 ||
            tile === curTile - 1 ||
            tile === curTile + colsCount ||
            tile === curTile - colsCount
          ) {
            acc.push(tile);
          }
        });
        return acc;
      }, []);

      nextStep.length > 0
        ? stepsStack.push(nextStep)
        : stepsStack.push(["noPath"]);

      remainingTiles = remainingTiles.filter(
        (tile) => !nextStep.includes(tile)
      );

      if (nextStep.includes(pathNodes[1])) {
        stepsStack.push([pathNodes[1]]);
      }
    }

    path = this.pathBack(stepsStack);

    return {
      stepsStack: stepsStack,
      path: path,
    };
  }

  pathBack(stepsStack) {
    let stepsStack = stepsStack;

    if (stepsStack[stepsStack.length - 1] === ["noPath"]) {
      return "noPath";
    }

    let path = [stepsStack.pop()[0]];

    for (let i = 0; i < stepsStack.length; i++) {
      path.push(
        stepsStack.pop().reduce((acc, tile) => {
          if (acc) {
            return acc;
          }

          if (
            path[path.length - 1] === tile + 1 ||
            path[path.length - 1] === tile - 1 ||
            path[path.length - 1] === tile + colsCount ||
            path[path.length - 1] === tile - colsCount
          ) {
            acc = tile;
          }
          return acc;
        }, null)
      );
    }

    return path;
  }
}

export default class Maze {
  static generateSimple(rowsCount, colsCount) {
    const walls = [];
    const pathWays = [];

    // Verticals

    for (i = 0; i < rowsCount; i++) {
      for (
        j = Math.floor(colsCount / 4);
        j < colsCount;
        j += Math.floor(colsCount / 4) + 1
      ) {
        walls.push(i * rowsCount + j);
      }
    }

    // Horizontals

    for (
      i = Math.floor(rowsCount / 4);
      i < rowsCount;
      i += Math.floor(rowsCount / 4) + 1
    ) {
      for (j = 0; j < colsCount; j++) {
        walls.push(i * rowsCount + j);
      }
    }

    const nodes = [
      Math.floor(rowsCount / 2) * colsCount + Math.floor(colsCount / 2),
      Math.floor(rowsCount / 4) * colsCount + Math.floor(colsCount / 4),
      Math.floor(rowsCount / 4) * colsCount + Math.floor(colsCount / 4) * 3,
      Math.floor(rowsCount / 4) * 3 * colsCount + Math.floor(colsCount / 4),
      Math.floor(rowsCount / 4) * 3 * colsCount + Math.floor(colsCount / 4) * 3,
    ];

    nodes.forEach((node, nodeIndex) => {
      const directions = [+1, -1 + colsCount, -colsCount];
      pathWays.push(
        directions
          .map((dir, index) => {
            return index < 2
              ? node +
                  dir *
                    Math.floor(
                      Math.random() *
                        Math.floor(colsCount / (2 * (1 + (nodeIndex > 0))))
                    )
              : node +
                  dir *
                    Math.floor(
                      Math.random() *
                        Math.floor(rowsCount / (2 * (1 + (nodeIndex > 0))))
                    );
          })
          .splice(Math.floor(Math.random() * 4), 1)
      );
    });

    return { walls: walls, pathWays: pathWays };
  }
}

export default class Maze {
  static generateSimple(rowsCount, colsCount) {
    const walls = [];
    const pathWays = [];

    // Verticals

    for (let i = 0; i < rowsCount; i++) {
      for (
        let j = Math.floor(colsCount / 4);
        j < colsCount;
        j += Math.floor(colsCount / 4) + 1
      ) {
        walls.push(i * colsCount + j);
      }
    }

    // Horizontals

    for (
      let i = Math.floor(rowsCount / 4);
      i < rowsCount;
      i += Math.floor(rowsCount / 4) + 1
    ) {
      for (let j = 0; j < colsCount; j++) {
        walls.push(i * colsCount + j);
      }
    }

    const nodes = [
      Math.floor(rowsCount / 2) * colsCount + Math.floor(colsCount / 2),
      Math.floor(rowsCount / 4) * colsCount + Math.floor(colsCount / 4),
      Math.floor(rowsCount / 4) * colsCount + Math.floor((colsCount * 3) / 4),
      Math.floor((rowsCount * 3) / 4) * colsCount + Math.floor(colsCount / 4),
      Math.floor((rowsCount * 3) / 4) * colsCount +
        Math.floor((colsCount * 3) / 4),
    ];

    const directions = [+1, -1, +colsCount, -colsCount];

    let remainWall = Math.floor(Math.random() * 4);
    let nodeWallDirs = directions.filter((dir, index) => {
      return index !== remainWall;
    });

    for (const dir of nodeWallDirs) {
      if (dir > -2 && dir < 2) {
        pathWays.push(
          nodes[0] +
            (Math.floor(Math.random() * 2) *
              (Math.floor(colsCount / 2) - 1) *
              dir +
              dir)
        );
      } else {
        pathWays.push(
          nodes[0] +
            (Math.floor(Math.random() * 2) *
              (Math.floor(rowsCount / 2) - 1) *
              dir +
              dir)
        );
      }
    }

    for (let i = 1; i < 5; i++) {
      let remainWall = Math.floor(Math.random() * 4);
      let nodeWallDirs = directions.filter((dir, index) => {
        return index !== remainWall;
      });

      for (const dir of nodeWallDirs) {
        pathWays.push(nodes[i] + dir);
      }
    }

    return { walls: walls, pathWays: pathWays };
  }
}

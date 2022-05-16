import Tile from "./Tile.js";
import Pathfinder from "./Pathfinder.js";
import Maze from "./Maze.js";

export default class Gameboard {
  #targetControls;
  #gameboardDOM;

  #allTiles = [];
  #wallTiles = [];
  #pathNodes = [];

  #height;
  #width;
  #rowsCount;
  #colsCount;

  #mouseOverTile = null;
  #draggingNode = null;
  #state;
  #path1 = [];
  #path2 = [];

  constructor(height, width, rowsCount, colsCount) {
    this.#height = height;
    this.#width = width;
    this.#rowsCount = rowsCount;
    this.#colsCount = colsCount;

    this.#gameboardDOM = document.querySelector(".gameboard");
    this.#gameboardDOM.style.gridTemplateColumns = `
      repeat( ${this.#colsCount}, 1fr)`;

    for (let row = 0; row < this.#rowsCount; row++) {
      for (let col = 0; col < this.#colsCount; col++) {
        this.#allTiles.push(
          new Tile(row * this.#colsCount + col, this.#height / this.#rowsCount)
        );
      }
    }

    this.#gameboardDOM.innerHTML = this.#allTiles
      .map((tile) => {
        return `${tile.tileHTML}`;
      })
      .join("");
    for (const tile of this.#allTiles) {
      tile.grabTileDOM();
    }
  }

  set targetControls(targetControls) {
    this.#targetControls = targetControls;
  }

  updateTiles(idsArray, color) {
    idsArray.forEach((id) => {
      this.#allTiles[id].recolor(color);
    });
  }

  resetBoard() {
    this.#allTiles.forEach((tile) => {
      tile.recolor("empty");
    });

    this.#wallTiles = [];
    this.#pathNodes = [];

    // this.#pathFound = false;
  }

  pathfinder(speed) {
    const pathfinderData = {
      colsCount: parseInt(this.#colsCount),
      allTiles: this.#allTiles.map((tile) => {
        return tile.id;
      }),
      wallTiles: this.#wallTiles.map((tile) => {
        return parseInt(tile);
      }),
    };

    const pathfinderResult1 = Pathfinder.findPath(
      pathfinderData,
      this.#pathNodes.slice(0, 2).map((node) => {
        return parseInt(node);
      })
    );

    const pathfinderResult2 = Pathfinder.findPath(
      pathfinderData,
      this.#pathNodes.slice(1, 3).map((node) => {
        return parseInt(node);
      })
    );

    const recolorStepsSlow = (pathfinderResult, number) => {
      pathfinderResult.stepsStack.shift().forEach((id) => {
        if (this.#pathNodes.indexOf(id.toString()) < 0) {
          this.#allTiles[id].recolor(`visited-${number}`);
        }
      });
    };

    const recolorPathSlow = (pathfinderResult, number) => {
      if (this.#pathNodes.includes(pathfinderResult.path[0].toString())) {
        pathfinderResult.path.shift();
        return;
      }
      this.#allTiles[pathfinderResult.path.shift()].recolor(`path-${number}`);
    };

    const displayInstant = () => {
      this.#allTiles.forEach((tile) => {
        if (
          !this.#wallTiles.includes(tile.id.toString()) &&
          !this.#pathNodes.includes(tile.id.toString())
        ) {
          tile.recolor("empty");
        }
      });

      if (pathfinderResult1.path[0] === "noPath") {
        // Nějaké modal upozorneni
        console.log("no path");
      }
      {
        pathfinderResult1.path.forEach((tile) => {
          this.#allTiles[tile].recolor("path-1");
        });
        this.#pathNodes.forEach((t) => {
          this.#allTiles[t].recolor("node");
        });
      }

      if (pathfinderResult2.path[0] === "noPath") {
        // Nějaké modal upozorneni
        console.log("no path");
      }
      {
        pathfinderResult2.path.forEach((tile) => {
          this.#allTiles[tile].recolor("path-2");
        });
        this.#pathNodes.forEach((t) => {
          this.#allTiles[t].recolor("node");
        });
      }
    };

    switch (speed) {
      case "instant":
        displayInstant();

        break;

      case "slow":
        const displayInterval = setInterval(() => {
          if (pathfinderResult1.stepsStack.length > 1) {
            recolorStepsSlow(pathfinderResult1, 1);
            return;
          }

          if (pathfinderResult2.stepsStack.length > 1) {
            recolorStepsSlow(pathfinderResult2, 2);

            return;
          }

          if (pathfinderResult1.path.length > 0) {
            recolorPathSlow(pathfinderResult1, 1);
            return;
          }

          if (this.#pathNodes[2] && pathfinderResult2.path.length > 0) {
            recolorPathSlow(pathfinderResult2, 2);
            return;
          }
          clearInterval(displayInterval);
          // this.#pathFound = true;

          this.#state = "pathFound";
          this.#targetControls.working = "ready";
          this.#targetControls.working = this.#state;
        }, 50);
        break;
    }

    this.#path1 = pathfinderResult1.path;
    this.#path2 = pathfinderResult2.path;
  }

  mouseEvent(id, event, mouseIsDown) {
    switch (event) {
      case "mousedown":
        if (this.#wallTiles.includes(id)) {
          break;
        }

        if (
          this.#pathNodes.includes(id) &&
          (this.#state === "ready" || this.#state === "pathFound")
        ) {
          this.#draggingNode = this.#pathNodes.indexOf(id);
          this.#mouseOverTile = id;

          break;
        }

        if (
          this.#state === "placingWall" &&
          !this.#wallTiles.includes(id) &&
          !this.#pathNodes.includes(id)
        ) {
          this.#allTiles[id].recolor("wall");
          this.#wallTiles.push(id);

          this.#mouseOverTile = null;

          break;
        }

      case "mouseup":
        if (mouseIsDown) {
          if (this.#draggingNode) {
            this.#draggingNode = null;
            this.#mouseOverTile = null;

            break;
          }
          if (
            this.#state === "placingNodes" &&
            this.#mouseOverTile &&
            !this.#pathNodes.includes(this.#mouseOverTile)
          ) {
            this.#pathNodes.push(this.#mouseOverTile);
            this.#mouseOverTile = null;
            if (this.#pathNodes.length === 3) {
              this.#state = "ready";
              this.#targetControls.working = this.#state;
            }
            break;
          }
        }
        break;

      case "mouseover":
        if (
          this.#state === "placingWall" &&
          !this.#wallTiles.includes(id) &&
          !this.#pathNodes.includes(id)
        ) {
          this.#allTiles[id].recolor("wall");

          if (mouseIsDown) {
            this.#wallTiles.push(id);
            this.#mouseOverTile = null;

            break;
          }
          if (this.#mouseOverTile) {
            this.#allTiles[this.#mouseOverTile].recolor("empty");
          }
          this.#mouseOverTile = id;

          break;
        }

        if (
          (this.#state === "placingNodes" || this.#draggingNode) &&
          !this.#wallTiles.includes(id) &&
          !this.#pathNodes.includes(id)
        ) {
          this.#allTiles[id].recolor("node");

          if (this.#mouseOverTile) {
            this.#allTiles[this.#mouseOverTile].recolor("empty");
          }
          this.#mouseOverTile = id;
          if (this.#draggingNode && mouseIsDown) {
            this.#pathNodes[this.#draggingNode] = id;
            this.pathfinder("instant");
          }
        }
        break;
    }
  }

  generateMaze() {
    this.resetBoard();

    const mazeResult = Maze.generateSimple(this.#rowsCount, this.#colsCount);
    this.#wallTiles = mazeResult.walls.filter(
      (wall) => !mazeResult.pathWays.includes(wall)
    );

    this.#wallTiles = mazeResult.walls.reduce((acc, wall) => {
      if (!mazeResult.pathWays.includes(wall)) {
        acc.push(wall.toString());
      }
      return acc;
    }, []);

    

    const displayInterval = setInterval(() => {
      if (mazeResult.walls.length > 0) {
        this.#allTiles[mazeResult.walls.pop()].recolor("wall");
        return;
      }

      if (mazeResult.pathWays.length > 0) {
        this.#allTiles[mazeResult.pathWays.pop()].recolor("empty");

        return;
      }

      clearInterval(displayInterval);
      this.#state = "ready";
      this.#targetControls.working = this.#state;
    }, 50);
  }

  buttonClicked(id) {
    if (
      this.#mouseOverTile &&
      !this.#wallTiles.includes(this.#mouseOverTile) &&
      !this.#pathNodes.includes(this.#mouseOverTile)
    ) {
      this.#allTiles[this.#mouseOverTile].recolor("empty");
    }
    this.#mouseOverTile = null;

    switch (id) {
      case "0":
        if (this.#pathNodes.length === 0) {
          this.#state = "placingNodes";
          this.#targetControls.working = "ready";
          this.#targetControls.working = this.#state;

          break;
        }

        this.#pathNodes.forEach((node) => {
          this.#allTiles[node].recolor("empty");
        });
        this.#pathNodes = [];
        this.#state = "ready";
        this.#targetControls.working = "ready";
        break;

      case "1":
        if (this.#state === "placingWall") {
          this.#state = "ready";
          this.#targetControls.working = "ready";

          break;
        }

        this.#state = "placingWall";
        this.#targetControls.working = "ready";
        this.#targetControls.working = this.#state;

        break;

      case "2":
        this.#state = "maze";
        this.#targetControls.working = "ready";
        this.#targetControls.working = this.#state;
        this.generateMaze();
        break;

      case "3":
        this.#pathNodes.length < 3
          ? this.#targetControls.flashBtn(0)
          : ((this.#state = "findingPath"),
            (this.#targetControls.working = "ready"),
            (this.#targetControls.working = this.#state),
            this.pathfinder("slow"));

        break;

      case "4":
        this.resetBoard();
        this.#state = "ready";
        this.#targetControls.working = this.#state;

        break;
    }
  }

  tileClicked(id) {
    if (this.#wallTiles.includes(id) || this.#pathNodes.includes(id)) {
      return;
    }

    switch (this.#state) {
      case "placingNodes":
        this.#allTiles[id].recolor("node");
        this.#pathNodes.push(id);
        if (this.#pathNodes.length === 3) {
          this.#state = "ready";
          this.#targetControls.working = this.#state;
        }

        break;
      case "placingWall":
        this.#wallTiles.push(id);
        this.#allTiles[id].recolor("wall");

        this.#mouseOverTile = null;

        break;
    }
  }
}

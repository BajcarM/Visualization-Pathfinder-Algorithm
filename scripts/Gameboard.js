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
  // #pathFound = false;

  constructor(height, width, rowsCount, colsCount) {
    this.#height = height;
    this.#width = width;
    this.#rowsCount = rowsCount;
    this.#colsCount = colsCount;

    this.#gameboardDOM = document.querySelector(".gameboard");

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
  }

  set targetControls(targetControls) {
    this.#targetControls = targetControls;
  }

  get working() {
    return this.#working;
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

    this.#pathFound = false;
  }

  pathfinder(speed) {
    const pathfinderData = {
      colsCount: this.#colsCount,
      allTiles: this.#allTiles.map((tile) => {
        return tile.id;
      }),
      wallTiles: this.#wallTiles.map((tile) => {
        return tile.id;
      }),
    };

    const pathfinderResult1 = Pathfinder(
      pathfinderData,
      this.#pathNodes.slice(0, 2)
    );

    const pathfinderResult2 = this.#pathNodes[2]
      ? Pathfinder(pathfinderData, this.#pathNodes.slice(1, 3))
      : null;

    switch (speed) {
      case "instant":
        displayInstant();

        break;

      case "slow":
        this.#working = true;

        const displayInterval = setInterval(() => {
          if (pathfinderResult1.stepsStack.length > 0) {
            recolorStepsSlow(pathfinderResult1, 1);
            return;
          }

          if (this.#pathNodes[2] && pathfinderResult2.stepsStack.length > 0) {
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
          this.#pathFound = true;

          this.#state = "pathFound";
          this.#targetControls.working = "ready";
          this.#targetControls.working = this.#state;
        }, 200);
        break;
    }

    const displayInstant = () => {
      pathfinderResult1.path[0] === "noPath"
        ? // Nějaké modal upozorneni
          console.log("no path")
        : pathfinderResult1.path.forEach((tile) => {
            this.#allTiles[tile].recolor("path-1");
          });

      if (!this.#pathNodes[2]) {
        return;
      }

      pathfinderResult2.path[0] === "noPath"
        ? // Nějaké modal upozorneni
          console.log("no path")
        : pathfinderResult2.path.forEach((tile) => {
            this.#allTiles[tile].recolor("path-2");
          });
    };

    const recolorStepsSlow = (pathfinderResult, number) => {
      pathfinderResult.stepsStack.unshift().forEach((id) => {
        this.#allTiles[id].recolor(`visited-${number}`);
      });
    };

    const recolorPathSlow = (pathfinderResult, number) => {
      pathfinderResult.path.unshift().forEach((id) => {
        this.#allTiles[id].recolor(`path-${number}`);
      });
    };
  }

  mouseEvent(id, event, mouseIsDown) {
    switch (event) {
      case "mousedown":
        if (this.#wallTiles.includes(id)) {
          break;
        }

        // if (this.#pathNodes.includes(id)){
        //   this.#draggingNode=this.#pathNodes.indexOf(id)
        //   this.#mouseOverTile=id

        //   break
        // }

        if (
          this.#pathNodes.includes(id) &&
          (this.#state === "ready" || this.#state === "pathFound")
        ) {
          this.#draggingNode = this.#pathNodes.indexOf(id);
          this.#mouseOverTile = id;

          break;
        }

        if (this.#state === "placingWall") {
          this.#allTiles[id].recolor("wall");
          this.#wallTiles.push(id);

          break;
        }

      // if (!buttonActive && !this.#pathNodes.includes(id)) {
      //   break;
      // }
      // if (!buttonActive && this.#pathNodes.includes(id)) {
      //   this.#dragging = this.#pathNodes.indexOf(id);
      //   this.#targetControls.buttonClicked(this.#pathNodes.indexOf(id));
      // }

      // if (
      //   buttonActive &&
      //   (this.#wallTiles.includes(id) || this.#pathNodes.includes(id))
      // ) {
      //   break;
      // }

      // switch (buttonActive) {
      //   case 0:
      //     this.#pathNodes[0] = id;
      //     break;
      //   case 1:
      //     this.#pathNodes[1] = id;
      //     break;
      //   case 2:
      //     this.#pathNodes[2] = id;
      //     break;
      //   case 3:
      //     this.#wallTiles.push(id);
      //     this.#allTiles[id].recolor("wall");
      //     break;
      // }

      // break;

      case "mouseup":
        if (mouseIsDown) {
          if (this.#draggingNode) {
            this.#draggingNode = null;
            this.#mouseOverTile = null;

            break;
          }
          if (this.#state === "placingNodes") {
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
          !this.#state === "placingWall" ||
          !this.#state === "placingNode" ||
          !this.#draggingNode ||
          this.#wallTiles.includes(id) ||
          this.#pathNodes.includes(id)
        ) {
          break;
        }

        if (this.#state === "placingWall") {
          this.#allTiles[id].recolor("wall");

          !mouseIsDown
            ? (this.#allTiles[this.#mouseOverTile].recolor("empty"),
              (this.#mouseOverTile = id))
            : this.#wallTiles.push(id);
          break;
        }

        if (this.#state === "placingNode" || this.#draggingNode) {
          this.#allTiles[id].recolor("node");

          this.#allTiles[this.#mouseOverTile].recolor("empty");
          this.#mouseOverTile = id;
          if (this.#draggingNode && mouseIsDown) {
            this.#pathNodes[this.#draggingNode] = id;
          }
        }
        break;

      //   if (!mouseIsDown) {
      //     break;
      //   }
      //   if (buttonActive === 0) {
      //     this.#allTiles[this.#pathNodes[0]].recolor("start");

      //     this.#dragging = null;
      //     break;
      //   }

      //   if (buttonActive === 1) {
      //     this.#allTiles[this.#pathNodes[1]].recolor(`end-1`);

      //     this.#dragging = null;
      //     break;
      //   }

      //   if (buttonActive === 2) {
      //     this.#allTiles[this.#pathNodes[1]].recolor(`end-2`);

      //     this.#dragging = null;
      //     break;
      //   }

      // case "mouseover":
      //   if (this.#wallTiles.includes(id) || this.#pathNodes.includes(id)) {
      //     break;
      //   }

      //   this.#allTiles[this.#mouseOverTile].recolor("empty");
      //   this.#mouseOverTile = id;

      //   if (this.#state === "placingNodes"||this.#draggingNode) {
      //     this.#allTiles[this.#mouseOverTile].recolor("node");
      //     break;
      //   }
      //   if (this.#state === "placingWall") {
      //     this.#allTiles[this.#mouseOverTile].recolor("wall");
      //     break;
      //   }

      // this.#mouseOverTile = id;
      // if (!buttonActive) {
      //   break;
      // }

      // switch (buttonActive) {
      //   case 0:
      //     if (this.#wallTiles.includes(id) || this.#pathNodes.includes(id)) {
      //       break;
      //     }

      //     this.#allTiles[id].recolor("start");
      //     this.#pathNodes[buttonActive].recolor("empty");
      //     this.#pathNodes[buttonActive] = id;

      //     if (mouseIsDown && this.#pathNodes.length > 1 && this.#pathFound) {
      //       this.pathfinder("instant");
      //     }

      //     break;

      //   case 1:
      //     if (this.#wallTiles.includes(id) || this.#pathNodes.includes(id)) {
      //       break;
      //     }

      //     this.#allTiles[id].recolor(`end-${buttonActive}`);
      //     this.#pathNodes[buttonActive].recolor("empty");
      //     this.#pathNodes[buttonActive] = id;

      //     if (mouseIsDown && this.#pathNodes.length > 1 && this.#pathFound) {
      //       this.pathfinder("instant");
      //     }

      //     break;

      //   case 2:
      //     if (this.#wallTiles.includes(id) || this.#pathNodes.includes(id)) {
      //       break;
      //     }

      //     this.#allTiles[id].recolor(`end-${buttonActive}`);
      //     this.#pathNodes[buttonActive].recolor("empty");
      //     this.#pathNodes[buttonActive] = id;

      //     if (mouseIsDown && this.#pathNodes.length > 1 && this.#pathFound) {
      //       this.pathfinder("instant");
      //     }

      //     break;

      //   case 3:
      //     if (this.#wallTiles.includes(id) || this.#pathNodes.includes(id)) {
      //       break;
      //     }

      //     if (this.#mouseOverTile) {
      //       this.#allTiles[this.#mouseOverTile].recolor("empty");
      //       this.#allTiles[id].recolor(`wall`);
      //     }

      //     if (mouseIsDown && !this.#pathFound) {
      //       this.#wallTiles.push(id);
      //       this.#allTiles[id].recolor(`wall`);
      //     }

      //     break;
      // }

      // break;
    }
    // this.#mouseOverTile = id;
  }

  generateMaze() {
    this.resetBoard();

    const mazeResult = Maze.generateSimple(this.#rowsCount, this.#colsCount);
    this.#wallTiles = mazeResult.walls.filter(
      (wall) => !mazeResult.pathWays.includes(wall)
    );

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
    }, 200);
  }

  buttonClicked(id) {
    this.#allTiles[this.#mouseOverTile].recolor("empty");
    this.#mouseOverTile = null;

    switch (id) {
      case 0:
        if (this.#pathNodes.length === 0) {
          this.#state = "placingNodes";
          this.#targetControls.working = "ready";
          this.#targetControls.working = this.#state;

          break;
        }

        this.#pathNodes.forEach((node) => {
          node.recolor("empty");
        });
        this.#state = "ready";
        this.#targetControls.working = "ready";
        break;

      case 1:
        this.#state = "placingWall";
        this.#targetControls.working = "ready";
        this.#targetControls.working = this.#state;

        break;

      case 2:
        this.#state = "maze";
        this.#targetControls.working = "ready";
        this.#targetControls.working = this.#state;
        this.generateMaze();
        break;

      case 3:
        this.#pathNodes.length < 3
          ? this.#targetControls.flashBtn(0)
          : ((this.#state = "findingPath"),
            (this.#targetControls.working = "ready"),
            (this.#targetControls.working = this.#state),
            this.pathfinder("slow"));

        break;

      case 4:
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
    switch (state) {
      case "placingNodes":
        this.#allTiles[id].recolor("node");
        this.#pathNodes.push(id);
        if (this.#pathNodes.length === 3) {
          this.#state = "ready";
          this.#targetControls.working = this.#state;
        }
        break;
      case "placingWall":
        this.#allTiles[id].recolor("wall");
        this.#wallTiles.push(id);
        break;
    }
  }
}

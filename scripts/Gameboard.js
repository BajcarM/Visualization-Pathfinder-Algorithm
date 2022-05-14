import Tile from "./Tile.js";
import Pathfinder from "./Pathfinder.js";

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

  #dragging = null;
  #working = false;

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
    this.#working = false;
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
          this.#working = false;
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

  mouseEvent(id, event, mouseIsDown, buttonActive) {
    switch (event) {
      case "mousedown":
        if (!buttonActive && !this.#pathNodes.includes(id)) {
          break;
        }
        if (!buttonActive && this.#pathNodes.includes(id)) {
          this.#dragging = this.#pathNodes.indexOf(id);
          this.#targetControls.buttonClicked(this.#dragging === 0 ? 0 : 1);
        }

        break;

      case "mouseup":
        if ( !mouseIsDown) {
          break;
        }
        if (buttonActive === 0) {
          this.#allTiles[this.#pathNodes[0]].recolor("start");

          this.#dragging = null;
          break;
        }

        if(buttonActive===1){
          this.#allTiles[this.#pathNodes[1]].recolor(`end`);

          this.#dragging = null;
          break;
        }

        if(buttonActive===2){
          this.#allTiles[this.#pathNodes[1]].recolor(`wall`);

          this.#dragging = null;
          break;
        }

        break;
    }
  }
}

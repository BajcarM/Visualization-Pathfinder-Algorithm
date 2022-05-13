import Tile from "./Tile.js";

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

  constructor( height, width, rowsCount, colsCount) {
    
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

  set targetControls(targetControls){
    this.#targetControls = targetControls;
  }

  get pathfinderData() {
    return {
      allTiles: this.#allTiles.map((tile, index) => {
        return index;
      }),
      wallTiles: this.#wallTiles.map((tile, index) => {
        return index;
      }),

      pathNodes: this.#pathNodes.map((tile, index) => {
        return index;
      }),
    };
  }

  updateTiles(idsArray, color){

    idsArray.forEach(id => {
      this.#allTiles[id].recolor(color)
    });
      
  }
}

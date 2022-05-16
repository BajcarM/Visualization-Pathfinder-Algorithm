export default class Tile {
  #id;
  #tileDOM;
  #size;

  constructor(id, size) {
    this.#id = id;
    this.#size = size;
  }

  get id() {
    return this.#id;
  }

  get tileHTML() {
    return `
        <div class="tile tile__empty" data-id="${this.#id}" 
        style="height: ${this.#size}px; width: ${this.#size}px">
        </div>`;
  }

  //   set tileSize(size) {
  //     this.#size = size;
  //     this.#tileDOM.style.height = `${this.#size}px`;
  //     this.#tileDOM.style.width = `${this.#size}px`;
  //   }

  grabTileDOM() {
    this.#tileDOM = document.querySelector(`[data-id="${this.#id}"]`);
  }

  recolor(color) {
    
    this.#tileDOM.className = `tile tile__${color}`;
  }
}

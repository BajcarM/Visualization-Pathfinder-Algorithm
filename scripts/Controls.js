import Gameboard from "./Gameboard";

export default class Controls {
  #targetGameboard;

  #gameboardDOM;
  #buttonsDOM;

  #buttons = ["Start", "End", "Wall", "Maze", "Begin", "Reset"];
  #buttonActive = null;

  #mouseIsDown = false;
  #touching = false;

  constructor() {
    document.querySelector(".controls").innerHTML = this.#buttons
      .map((button, index) => {
        return `<div class="button button__${button}" data-btn="${index}">
                    <div class="button__icon"></div>
                    <div class="button__label">${button}</div>
                </div>`;
      })
      .join("");

    this.#gameboardDOM = document.querySelector(".gameboard");
    this.#buttonsDOM = document.querySelectorAll(".button");

    this.addListeners();
  }

  set targetGameboard(targetGameboard) {
    this.#targetGameboard = targetGameboard;
  }

  addListeners() {
    this.#buttonsDOM.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.buttonClicked(e.target.dataset.btn);
      });
      button.addEventListener("touchstart", this.buttonClicked(e));
    });

    this.#gameboardDOM.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.#mouseIsDown = true;
      signalToGameboard(e.target.dataset.id, "mousedown");
    });
    window.addEventListener("mouseup", (e) => {
      e.preventDefault();
      this.#mouseIsDown = false;
      if (e.target.dataset.id) {
        signalToGameboard(e.target.dataset.id, "mouseup");
      }
    });
    this.#gameboardDOM.addEventListener("mouseover", (e) => {
      e.preventDefault();
      signalToGameboard(e.target.dataset.id, "mouseover");
    });

    this.#gameboardDOM.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.#mouseIsDown = true;
      signalToGameboard(e.target.dataset.id, "mousedown");
    });
    window.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.#mouseIsDown = false;
      if (e.target.dataset.id) {
        signalToGameboard(e.target.dataset.id, "mouseup");
      }
    });
  }

  buttonClicked(targetId) {
    switch (targetId) {
      case 3:
        this.#targetGameboard.generateMaze();
        break;
      case 4:
        this.#targetGameboard.pathfinder();
        this.switchActivBtn(targetId);
        break;
      case 5:
        this.#targetGameboard.resetBoard();
        break;
      default:
        this.switchActivBtn(targetId);
        this.changeCursor();
        break;
    }
  }

  switchActivBtn(targetId) {
    this.#buttonActive = this.#buttonActive === targetId ? null : targetId;

    this.#buttonsDOM.forEach((button) => {
      button.dataset.btn === this.#buttonActive
        ? button.classList.add("active")
        : button.classList.remove("active");
    });
  }

  changeCursor() {
    document.querySelector("main").className = this.#buttonActive
      ? `cursor-${this.#buttons[this.#buttonActive]}`
      : `cursor-initial`;
  }

  signalToGameboard(target, event) {
    this.#targetGameboard.mouseEvent(
      target,
      event,
      this.#mouseIsDown,
      this.#buttonActive
    );
  }
}

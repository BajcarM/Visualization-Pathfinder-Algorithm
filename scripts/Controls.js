import Gameboard from "./Gameboard.js";

export default class Controls {
  #targetGameboard;

  #gameboardDOM;
  #buttonsDOM;
  #displayDOM;

  #buttons = ["Nodes", "Wall", "Maze", "Start", "Reset"];
  #buttonActive = null;

  #mouseIsDown = false;
  #touching = false;

  constructor() {
    document.querySelector(".controls").innerHTML = this.#buttons
      .map((button, index) => {
        return `
        <div class="button button__${button}" data-btn="${index}">
            <div class="button__icon" data-btn="${index}"></div>
            <div class="button__label" data-btn="${index}">${button}</div>
        </div>`;
      })
      .join("");

    this.#gameboardDOM = document.querySelector(".gameboard");
    this.#buttonsDOM = document.querySelectorAll(".button");
    this.#displayDOM = document.querySelector(".display");

    this.addListeners();
  }

  set working(process) {
    switch (process) {
      case "ready":
        this.changeCursor("initial");
        this.#buttonsDOM.forEach((button) => {
          button.classList.remove("active");
          button.classList.remove("disabled");

          this.#displayDOM.innerHTML=`
        <p>Let's start by placing nodes...</p> 
        <p>Or walls... Or build a whole maze !!</p>`
        });

        break;
      case "placingNodes":
        this.changeCursor("node");
        this.#buttonsDOM[0].classList.add("active");
        this.#buttonsDOM[1].classList.add("disabled");
        this.#buttonsDOM[2].classList.add("disabled");
        this.#buttonsDOM[3].classList.add("disabled");
        this.#displayDOM.innerHTML=`
        <p>Place 3 nodes.</p> 
        <p>One start, one stop, one end.</p>`
        break;

      case "placingWall":
        this.changeCursor("wall");
        this.#buttonsDOM[1].classList.add("active");
        this.#displayDOM.innerHTML=`
        <p>Place walls on empty tiles.</p> 
        <p>You can click and move to draw them ;-)</p>`
        break;

      case "maze":
        this.changeCursor("loading");
        this.#buttonsDOM.forEach((button) => {
          button.classList.add("disabled");
        });
        this.#buttonsDOM[2].classList.add("active");
        this.#displayDOM.innerHTML=`
        <p>Building a new maze...</p>`
        break;
      case "findingPath":
        this.changeCursor("loading");
        this.#buttonsDOM.forEach((button) => {
          button.classList.add("disabled");
        });
        this.#buttonsDOM[3].classList.add("active");
        this.#displayDOM.innerHTML=`
        <p>Finding paths...</p> 
        <p>If there is one - I will find it !</p>`
        break;
      case "pathFound":
        this.changeCursor("initial");
        this.#buttonsDOM.forEach((button) => {
          button.classList.add("disabled");
        });
        this.#buttonsDOM[4].classList.remove("disabled");
        this.#displayDOM.innerHTML=`
        <p>Drag end nodes to see the paths change.</p> 
        <p>If there is no path - there is no path :-P</p>`
        break;
    }
  }

  set targetGameboard(targetGameboard) {
    this.#targetGameboard = targetGameboard;
  }

  addListeners() {
    this.#buttonsDOM.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (!e.target.classList.contains("disabled")) {
          this.#targetGameboard.buttonClicked(e.target.dataset.btn);
        }
      });
    });

    this.#gameboardDOM.addEventListener("click", (e) => {
      if (e.target.dataset.id) {
        this.#targetGameboard.tileClicked(e.target.dataset.id);
      }
    });
    this.#gameboardDOM.addEventListener("mouseover", (e) => {
      this.#targetGameboard.mouseEvent(
        e.target.dataset.id,
        "mouseover",
        this.#mouseIsDown
      );
    });

    this.#gameboardDOM.addEventListener("mousedown", (e) => {
      e.preventDefault();

      this.#mouseIsDown = true;
      this.#targetGameboard.mouseEvent(
        e.target.dataset.id,
        "mousedown",
        this.#mouseIsDown
      );
    });
    window.addEventListener("mouseup", (e) => {
      if (e.target.dataset.id && this.#mouseIsDown) {
        this.#targetGameboard.mouseEvent(
          e.target.dataset.id,
          "mouseup",
          this.#mouseIsDown
        );
      }
      this.#targetGameboard.mouseEvent("outside", "mouseup", this.#mouseIsDown);

      this.#mouseIsDown = false;
    });
  }

  flashBtn(id, times) {
    let i = 0;
    this.#buttonsDOM[id].classList.toggle("highlight");
    const flash = setInterval(() => {
      this.#buttonsDOM[id].classList.toggle("highlight");

      i++;

      if (i === times - 1) {
        clearInterval(flash);
      }
    }, 200);
  }

  switchActivBtn(targetId) {
    this.#buttonActive = this.#buttonActive === targetId ? null : targetId;

    this.#buttonsDOM.forEach((button) => {
      button.dataset.btn === this.#buttonActive
        ? button.classList.add("active")
        : button.classList.remove("active");
    });
  }

  changeCursor(cursor) {
    document.querySelector("section").className = `cursor-${cursor}`;
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

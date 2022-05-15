import Gameboard from "./Gameboard";

export default class Controls {
  #targetGameboard;

  #gameboardDOM;
  #buttonsDOM;

  #buttons = ["Nodes", "Wall", "Maze", "Start", "Reset"];
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

  set working(process) {
    switch (process) {
      case "ready":
        this.changeCursor("initial");
        this.#buttonsDOM.forEach((button) => {
          button.classList.remove("active");
          button.classList.remove("disabled");
        });

        break;
      case "placingNodes":
        this.changeCursor("node");
        this.#buttonsDOM[0].classList.add("active");
        this.#buttonsDOM[1].classList.add("disabled");
        this.#buttonsDOM[2].classList.add("disabled");
        this.#buttonsDOM[3].classList.add("disabled");
        break;

      case "placingWall":
        this.changeCursor("wall");
        this.#buttonsDOM[1].classList.add("active");

        break;

      case "maze":
        this.changeCursor("loading");
        this.#buttonsDOM.forEach((button) => {
          button.classList.add("disabled");
        });
        this.#buttonsDOM[2].classList.add("active");

        break;
      case "findingPath":
        this.changeCursor("loading");
        this.#buttonsDOM.forEach((button) => {
          button.classList.add("disabled");
        });
        this.#buttonsDOM[3].classList.add("active");

        break;
      case "pathFound":
        this.changeCursor("initial");
        this.#buttonsDOM.forEach((button) => {
          button.classList.add("disabled");
        });
        this.#buttonsDOM[4].classList.remove("disabled");
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
        // this.buttonClicked(e.target);
      });
      // button.addEventListener("touchstart", this.buttonClicked(e));
    });

    this.#gameboardDOM.addEventListener("click", (e) => {
      if (e.target.dataset.id) {
        this.#targetGameboard.tileClicked(e.target.dataset.id);
      }
    });
    this.#gameboardDOM.addEventListener("mouseover", (e) => {

      this.#targetGameboard.mouseEvent(e.target.dataset.id, 'mouseover', this.#mouseIsDown)

  
      // signalToGameboard(e.target.dataset.id, "mouseover");
    });


    this.#gameboardDOM.addEventListener("mousedown", (e) => {
e.preventDefault()

      this.#mouseIsDown = true;
      this.#targetGameboard.mouseEvent(e.target.dataset.id, 'mousedown', this.#mouseIsDown)

      // signalToGameboard(e.target.dataset.id, "mousedown", this.#buttonActive);
    });
    window.addEventListener("mouseup", (e) => {
      if (e.target.dataset.id&&this.#mouseIsDown) {
        this.#targetGameboard.mouseEvent(e.target.dataset.id, 'mouseup', this.#mouseIsDown)


        // signalToGameboard(e.target.dataset.id, "mouseup");
      }
      this.#targetGameboard.mouseEvent('outside', 'mouseup', this.#mouseIsDown)

      this.#mouseIsDown = false;
    });
    

    // this.#gameboardDOM.addEventListener("touchstart", (e) => {
    //   e.preventDefault();
    //   this.#mouseIsDown = true;
    //   signalToGameboard(e.target.dataset.id, "mousedown");
    // });
    // window.addEventListener("touchend", (e) => {
    //   e.preventDefault();
    //   this.#mouseIsDown = false;
    //   if (e.target.dataset.id) {
    //     signalToGameboard(e.target.dataset.id, "mouseup");
    //   }
    // });
  }

  // buttonClicked(target) {
  //   if (!target.classList.contains("available")) {
  //     return;
  //   }

  //   switch (target.dataset.id) {
  //     case 0:
  //       this.#targetGameboard.buttonNodes();
  //       break;
  //   }

    // if (this.#targetGameboard.working) {
    //   return;
    // }
    // switch (targetId) {

    //   case 0:

    //     break;
    //   case 2:
    //     this.#targetGameboard.generateMaze();
    //     break;
    //   case 3:
    //     this.#targetGameboard.pathfinder("slow");
    //     this.switchActivBtn(null);
    //     this.changeCursor();
    //     break;
    //   case 4:
    //     this.#targetGameboard.resetBoard();
    //     this.switchActivBtn(null);
    //     this.changeCursor();
    //     break;
    //   default:
    //     this.switchActivBtn(targetId);
    //     this.changeCursor();
    //     break;
    // }
  // }

  flashBtn(id) {
    this.#buttonsDOM[id].classList.add("highlight");
    setTimeout(() => {
      this.#buttonsDOM[id].classList.remove("highlight");
    }, 500);
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
    document.querySelector("main").className = `cursor-${cursor}`;
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

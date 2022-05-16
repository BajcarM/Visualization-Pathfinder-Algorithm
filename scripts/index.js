import Controls from "./Controls.js";
import Gameboard from "./Gameboard.js";

const controls = new Controls();
const gameboard = new Gameboard(570, 1050, 19, 35);

controls.targetGameboard = gameboard;
gameboard.targetControls = controls;

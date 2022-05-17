import Controls from "./Controls.js";
import Gameboard from "./Gameboard.js";

const controls = new Controls();
const gameboard = new Gameboard(620, 1100, 31, 55);

controls.targetGameboard = gameboard;
gameboard.targetControls = controls;

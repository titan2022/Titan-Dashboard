import { Scene } from "./graphics/Scene.js"
import * as THREE from "three";
var ipcRenderer = require("electron").ipcRenderer;

let scene = new Scene();
scene.init();

ipcRenderer.on("pos", (event, pos) => {
    scene.robot.position.x = pos[0];
    scene.robot.position.y = pos[1];
    scene.robot.position.z = -pos[2];
});
import { Plotter } from "./graphics/Plotter.js";
import { Scene } from "./graphics/Scene.js";
// import { apriltags } from "./config/apriltags.js";
import apriltags from './config/apriltags.js';
var ipcRenderer = require("electron").ipcRenderer;

let scene = new Scene(apriltags);
scene.init();

let plotter = new Plotter();
plotter.start();

ipcRenderer.on("pos", (event, pos) => {
    scene.robot.position.x = pos[0]; // -
    scene.robot.position.y = pos[1]; // -
    scene.robot.position.z = pos[2];
});

ipcRenderer.on("rot", (event, rot) => {
    scene.robot.rotation.x = rot[0];
    scene.robot.rotation.y = rot[1]; // -
    scene.robot.rotation.z = rot[2];
});

ipcRenderer.on("test", (event, test) => {
    plotter.y1 = test[0]
    plotter.y2 = test[1]
});

window.onload = () => {
    window.Split({
        columnGutters: [{
            track: 1,
            element: document.querySelector(".c2"),
        },
        {
            track: 3,
            element: document.querySelector(".c4"),
        }],
        rowGutters: [{
            track: 1,
            element: document.querySelector(".mr2"),
        },
        {
            track: 1,
            element: document.querySelector(".lr2"),
        },
        {
            track: 1,
            element: document.querySelector(".rr2"),
        }],
        onDrag: () => {scene.resizeListener()}
    });
}

const viewCheck = document.getElementById("view-checkbox");
viewCheck.addEventListener("change", () => {
    if (viewCheck.checked) {
        scene.enabled = true;
        scene.animate();
    } else {
        scene.enabled = false;
    }
});

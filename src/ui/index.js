import { Plotter } from "./graphics/Plotter.js";
import { Scene } from "./graphics/Scene.js";
import config from './config/config.js';
var ipcRenderer = require("electron").ipcRenderer;

let scene = new Scene(config);
scene.init();

let plotter = new Plotter();
plotter.start();

ipcRenderer.on("pos", (event, pos) => {
    console.log("pos", pos)
    // scene.robot.position.x = pos[0]; // -
    // scene.robot.position.y = pos[1]; // -
    // scene.robot.position.z = pos[2];
    scene.moveBot(pos);
});

ipcRenderer.on("prepos", (event, pos) => {
    console.log("prepos", pos)
    scene.prerobot.position.x = pos[0];
    scene.prerobot.position.y = pos[1];
    scene.prerobot.position.z = pos[2];
});


ipcRenderer.on("rot", (event, rot) => {
    // scene.robot.rotation.x = rot[0];
    // scene.robot.rotation.y = rot[1]; // -
    // scene.robot.rotation.z = rot[2];
    scene.rotateBot(rot);
});

ipcRenderer.on("test", (event, test) => {
    plotter.y1 = test[0]
    plotter.y2 = test[1]
});

window.onload = () => {
    const windowContainer = document.getElementById("window-container");
    const grid1Style =  document.getElementById("grid1");
    const grid2Style =  document.getElementById("grid2");
    const grid3Style =  document.getElementById("grid3");

    windowContainer.style["grid-template-columns"] = localStorage.getItem("windowStyle");
    grid1Style.style["grid-template-rows"] = localStorage.getItem("grid1style");
    grid2Style.style["grid-template-rows"] = localStorage.getItem("grid2style");
    grid3Style.style["grid-template-rows"] = localStorage.getItem("grid3style");

    scene.redrawFrame();

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
        onDrag: () => {
            scene.resizeListener()
        },
        onDragEnd: () => {
            localStorage.setItem("windowStyle", windowContainer.style["grid-template-columns"]);
            localStorage.setItem("grid1style", grid1Style.style["grid-template-rows"]);
            localStorage.setItem("grid2style", grid2Style.style["grid-template-rows"]);
            localStorage.setItem("grid3style", grid3Style.style["grid-template-rows"]);
        }
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

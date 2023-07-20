import { Scene } from "./graphics/Scene.js"
//import Split from window.Split
var ipcRenderer = require("electron").ipcRenderer;

let scene = new Scene();
scene.init();

ipcRenderer.on("pos", (event, pos) => {
    scene.robot.position.x = pos[0];
    scene.robot.position.y = pos[1];
    scene.robot.position.z = -pos[2];
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
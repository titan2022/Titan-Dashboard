const {writeFile} = require('fs')
import { Scene } from "../../ui/graphics/Scene.js";
import config from '../../ui/config/config.js';

let scene = new Scene(config);
scene.init(false);
window.scene = scene;

//PARAMETERS
//in meters and degrees
//0,0,0 is center of the bottom the barge, not the corner, adjust as needed
const robotX = 0, robotY = 1, robotZ = 0;
//x is up and down, y is left and right, z is rotate in terms of rotation (0,0,0)
const robotRotX = 0, robotRotY = 0, robotRotZ = 0;

//field dimensions: 17.55 x 8.05 m
//field texture dimensions: 22.5552 x 9.144 (3js units)
//ratios are different, so y ratio is the average
const xRatio = 17.55/22.5552;
const zRatio = 8.05/9.144;
const yRatio = (xRatio+zRatio)/2;

window.onload = () => {
    const cam = config.cameras[0];
    const robotPosition = [robotX, robotY, robotZ];
    const robotRotation = [robotRotX, robotRotY, robotRotZ];

    scene.setCameraPose(robotPosition, scene.toRad(robotRotation), cam);

    document.getElementById("capture").addEventListener("click", () => {
        scene.enabled = false;
        const url = document.querySelector("canvas").toDataURL();
        writeFile(__dirname+`/cameraOutput/XYZ(${robotX},${robotY},${robotZ}),Rot(${robotRotX},${robotRotY},${robotRotZ}).png`, url.replace(/^data:image\/png;base64,/, ""), 'base64', function(err) {
            console.log(err);
        });
        
        scene.enabled = true;
        alert(`saved to ${__dirname}/cameraOutput/XYZ(${robotX},${robotY},${robotZ}),Rot(${robotRotX},${robotRotY},${robotRotZ}).png`)
    })
}

// const viewCheck = document.getElementById("view-checkbox");
// viewCheck.addEventListener("change", () => {
//     if (viewCheck.checked) {
//         scene.enabled = true;
//         scene.animate();
//     } else {
//         scene.enabled = false;
//     }
// });
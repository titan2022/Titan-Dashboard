import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Scene {
    constructor(config) {
        this.apriltags = config.apriltags;
        this.cameras = config.cameras;
        this.robotSize = config.robot.size

        this.scene;
        this.camera;
        this.controls;
        this.renderer;
        this.resizeListener;
        this.tags = [];
        this.cameraObjs = [];
        this.enabled = true;
    }

    toRad(deg) {
        return [deg[0] / 180 * Math.PI, deg[1] / 180 * Math.PI, deg[2] / 180 * Math.PI]
    }
    
    init() {
        const canvas = document.getElementById("canvas");

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(54.4, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000); // Approx. 35mm
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.resizeListener = () => this.redrawFrame();
        window.addEventListener("resize", this.resizeListener, false);
        canvas.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        const robotGeom = new THREE.BoxGeometry(this.robotSize[0], this.robotSize[1], this.robotSize[2]);
        const robotMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.robot = new THREE.Mesh(robotGeom, robotMat);
        this.scene.add(this.robot);

        const prerobotGeom = new THREE.BoxGeometry(this.robotSize[0], this.robotSize[1], this.robotSize[2]);
        const prerobotMat = new THREE.MeshBasicMaterial({color: 0xffffff});
        this.prerobot = new THREE.Mesh(prerobotGeom, prerobotMat);
        this.scene.add(this.prerobot);
        
        this.cameras.forEach(cam => {
            const camGeom = new THREE.BoxGeometry(0.06, 0.06, 0.02);
            const camMat = new THREE.MeshBasicMaterial({color: cam.color});
            const camMesh = new THREE.Mesh(camGeom, camMat);
            camMesh.position.set(cam.position[0], cam.position[1], cam.position[2]);
            let newRot = this.toRad(cam.rotation);
            camMesh.rotation.set(newRot[0], newRot[1], newRot[2]);
            this.cameraObjs.push(camMesh);
            this.scene.add(this.cameraObjs.at(-1));
        });

        this.apriltags.forEach(tag => {
            let newRot = this.toRad(tag.rotation);

            const tagGeom = new THREE.BoxGeometry(tag.size, tag.size, 0.01);
            const tagMat = new THREE.MeshBasicMaterial({color: 0xff0000});
            const tagMesh = new THREE.Mesh(tagGeom, tagMat);

            tagMesh.position.set(tag.position[0], tag.position[1], tag.position[2]);
            tagMesh.rotation.set(newRot[0], newRot[1], newRot[2]);
            this.tags.push(tagMesh);
            this.scene.add(this.tags.at(-1));


            const tagNormalGeom = new THREE.BoxGeometry(0.005, 0.005, 1.0);
            const tagNormalMat = new THREE.MeshBasicMaterial({color: 0xffff00});
            const tagNormalMesh = new THREE.Mesh(tagNormalGeom, tagNormalMat);

            tagNormalMesh.position.set(0, 0, 0.5);
            tagNormalMesh.position.applyEuler(new THREE.Euler(newRot[0], newRot[1], newRot[2], "XYZ"));
            tagNormalMesh.position.add(new THREE.Vector3(tag.position[0], tag.position[1], tag.position[2]));
            tagNormalMesh.rotation.set(newRot[0], newRot[1], newRot[2]);

            this.scene.add(tagNormalMesh);
        });

        this.camera.position.z = 1;

        this.animate();
    }

    moveBot(pos) {
        // const dpos = new THREE.Vector3(pos[0], pos[1], pos[2]).sub(this.robot.position);
        const dpos = new THREE.Vector3(pos[0], 1.2, pos[2]).sub(this.robot.position);
        this.robot.position.add(dpos);
        // this.cameraObjs.forEach(camObj => {
        //     camObj.position.add(dpos);
        // });
    }

    rotateBot(rot) {
        // this.robot.rotation.x = rot[0];
        this.robot.rotation.y = rot[1];
        // this.robot.rotation.z = rot[2];

        // for (let i = 0; i < this.cameraObjs.length; i++) {
        //     const camObj = this.cameraObjs[i];

        //     camObj.position.set(0, 0, 0);
        //     camObj.rotation.x = this.cameras[i].rotation[0];
        //     camObj.rotation.y = this.cameras[i].rotation[1];
        //     camObj.rotation.z = this.cameras[i].rotation[2];

        //     camObj.position.x = this.cameras[i].position[0];
        //     camObj.position.y = this.cameras[i].position[1];
        //     camObj.position.z = this.cameras[i].position[2];

        //     camObj.position.applyEuler(new THREE.Euler(rot[0], rot[1], rot[2], "XYZ"));
        //     camObj.position.add(this.robot.position);

        //     camObj.rotation.x += rot[0];
        //     camObj.rotation.y += rot[1];
        //     camObj.rotation.z += rot[2];
        // }
    }

    // rotateBot(rot) {
    //     // this.robot.rotation.x = rot[0];
    //     this.robot.rotation.y = rot[1];
    //     // this.robot.rotation.z = rot[2];

    //     // for (let i = 0; i < this.cameraObjs.length; i++) {
    //     //     const camObj = this.cameraObjs[i];

    //     //     camObj.position.set(0, 0, 0);
    //     //     camObj.rotation.x = this.cameras[i].rotation[0];
    //     //     camObj.rotation.y = this.cameras[i].rotation[1];
    //     //     camObj.rotation.z = this.cameras[i].rotation[2];

    //     //     camObj.position.x = this.cameras[i].position[0];
    //     //     camObj.position.y = this.cameras[i].position[1];
    //     //     camObj.position.z = this.cameras[i].position[2];

    //     //     camObj.position.applyEuler(new THREE.Euler(rot[0], rot[1], rot[2], "XYZ"));
    //     //     camObj.position.add(this.robot.position);

    //     //     camObj.rotation.x += rot[0];
    //     //     camObj.rotation.y += rot[1];
    //     //     camObj.rotation.z += rot[2];
    //     // }
    // }

    redrawFrame() {
        this.camera.aspect = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.renderer.domElement.offsetWidth, this.renderer.domElement.offsetHeight, false);
    }

    animate() {
        if (this.enabled) {
            requestAnimationFrame(() => {this.animate()});
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        }
    }
}
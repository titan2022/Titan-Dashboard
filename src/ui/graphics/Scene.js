import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Scene {
    constructor(config) {
        this.config = config;
        this.apriltags = config["apriltags"];
        this.cameras = config["cameras"];

        this.scene;
        this.camera;
        this.controls;
        this.renderer;
        this.resizeListener;
        this.tags = [];
        this.enabled = true;
    }

    toRad(deg) {
        return [deg[0] / 180 * Math.PI, deg[1] / 180 * Math.PI, deg[2] / 180 * Math.PI]
    }
    
    init() {
        const canvas = document.getElementById("canvas");

        // default material
        const defaultMat = new THREE.MeshBasicMaterial({color: 0x404040});

        // Initiate scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(54.4, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000); // Approx. 35mm
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.resizeListener = () => this.redrawFrame();
        window.addEventListener("resize", this.resizeListener, false);
        canvas.appendChild(this.renderer.domElement);
        const textureLoader = new THREE.TextureLoader().setPath("img/");

        // Field floor
        const fieldGeom = new THREE.BoxGeometry(22.5552, 0.1, 9.144);
        const fieldMat = new THREE.MeshBasicMaterial({map: textureLoader.load("field.png")});
        const fieldMesh = new THREE.Mesh(fieldGeom, [defaultMat, defaultMat, fieldMat, defaultMat, defaultMat, defaultMat]);
        fieldMesh.position.set(0, -0.05, 0);
        this.scene.add(fieldMesh);

        // Orbit camera
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Robot object
        const robotGeom = new THREE.BoxGeometry(0.05, 0.04, 0.02);
        const robotMat = new THREE.MeshBasicMaterial();
        this.robot = new THREE.Mesh(robotGeom, robotMat);
        this.scene.add(this.robot);

        // Apriltag objects
        this.apriltags.forEach(tag => {
            let newRot = this.toRad(tag.rotation)

            // Tag mesh
            const tagGeom = new THREE.BoxGeometry(0.2159, 0.2794, 0.01);
            const tagMat = new THREE.MeshBasicMaterial({map: textureLoader.load(`apriltags/${tag.id}.png`)});
            const tagMesh = new THREE.Mesh(tagGeom, [defaultMat, defaultMat, defaultMat, defaultMat, tagMat, defaultMat]);

            tagMesh.position.set(tag.position[0], tag.position[1], tag.position[2]);
            tagMesh.rotation.set(newRot[0], newRot[1], newRot[2]);
            this.tags.push(tagMesh);
            this.scene.add(this.tags.at(-1));

            // Normal visualization
            if (this.config["debugEnableTagNormals"]) {
                const tagNormalGeom = new THREE.BoxGeometry(0.005, 0.005, 0.2);
                const tagNormalMat = new THREE.MeshBasicMaterial({color: 0xffff00});
                const tagNormalMesh = new THREE.Mesh(tagNormalGeom, tagNormalMat);

                tagNormalMesh.position.set(0, 0, 0.1);
                tagNormalMesh.position.applyEuler(new THREE.Euler(newRot[0], newRot[1], newRot[2], "XYZ"));
                tagNormalMesh.position.add(new THREE.Vector3(tag.position[0], tag.position[1], tag.position[2]));
                tagNormalMesh.rotation.set(newRot[0], newRot[1], newRot[2]);

                this.scene.add(tagNormalMesh);
            }
        });

        // Starting camera position
        this.camera.position.z = 1;

        this.animate();
    }

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
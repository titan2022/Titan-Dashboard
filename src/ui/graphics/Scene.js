import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Scene {
    constructor() {
        this.scene;
        this.camera;
        this.controls;
        this.renderer;
        this.resizeListener;
        this.tags = [];
    }

    init() {
        const canvas = document.getElementById("canvas");

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        
        this.renderer = new THREE.WebGLRenderer();
        this.resizeListener = () => {
            this.camera.aspect = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight;
            this.camera.updateProjectionMatrix();
        }
        window.addEventListener("resize", this.resizeListener, false);
        canvas.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        const robotGeom = new THREE.BoxGeometry(0.2, 0.2, 0.05);
        const robotMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.robot = new THREE.Mesh(robotGeom, robotMat);
        this.scene.add(this.robot);

        for (let i = 0; i < 1; i++) {
            const tagGeom = new THREE.BoxGeometry(0.2, 0.2, 0.05);
            const tagMat = new THREE.MeshBasicMaterial({color: 0xff0000});
            const tag = new THREE.Mesh(tagGeom, tagMat);
            this.tags.push(tag);
            this.scene.add(this.tags.at(-1));
        }

        const t1 = new THREE.BoxGeometry(0.2, 0.05, 0.05);
        const t2 = new THREE.MeshBasicMaterial({color: 0xffff00});
        const t3 = new THREE.Mesh(t1, t2);
        t3.position.y = 0.15;
        this.scene.add(t3);

        this.camera.position.z = 1;

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => {this.animate()});
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
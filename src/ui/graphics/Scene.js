import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import apriltags from "../config/apriltags.js";

export class Scene {
    constructor(config) {
        this.config = config;
        this.apriltags = apriltags;
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

    toRadSingle(deg){
        return deg/180*Math.PI;
    }
    
    init(enableOrbitControls = true) {
        const canvas = document.getElementById("canvas");

        // default material
        const defaultMat = new THREE.MeshBasicMaterial({color: 0x404040});

        // Initiate scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(54.4, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000); // Approx. 35mm
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.resizeListener = () => this.redrawFrame();
        window.addEventListener("resize", this.resizeListener, false);
        canvas.appendChild(this.renderer.domElement);
        const textureLoader = enableOrbitControls?new THREE.TextureLoader().setPath("img/"):new THREE.TextureLoader().setPath("../img/");
        this.redrawFrame();
        // Field floor
        //1755 x 805 cm
        const fieldGeom = new THREE.BoxGeometry(22.5552, 0.1, 9.144);
        const fieldMat = new THREE.MeshBasicMaterial({map: textureLoader.load("field.png")});
        const fieldMesh = new THREE.Mesh(fieldGeom, [defaultMat, defaultMat, fieldMat, defaultMat, defaultMat, defaultMat]);
        fieldMesh.position.set(0, -0.05, 0);
        this.scene.add(fieldMesh);

        // Orbit camera
        if (enableOrbitControls){
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        } else {
            this.controls = null;
        }

        // Robot object
        if (this.controls){
            const robotGeom = new THREE.BoxGeometry(0.5, 0.5, 0.2);
            const robotMat = new THREE.MeshBasicMaterial({color: 0xffff00});
            this.robot = new THREE.Mesh(robotGeom, robotMat);
            this.scene.add(this.robot);
        }

        // Apriltag objects
        this.apriltags.tags.forEach(tag => {

            // Tag mesh
            const tagGeom = new THREE.BoxGeometry(0.2159, 0.2794, 0.01);
            const tagMat = new THREE.MeshBasicMaterial({map: textureLoader.load(`apriltags/${tag.ID}.png`)});
            const tagMesh = new THREE.Mesh(tagGeom, [defaultMat, defaultMat, defaultMat, defaultMat, tagMat, defaultMat]);
        
            let qm = new THREE.Quaternion();
            let ninety = Math.PI/2; 
            
            tagMesh.quaternion.set(tag.pose.rotation.quaternion.W, tag.pose.rotation.quaternion.Y, tag.pose.rotation.quaternion.Z, tag.pose.rotation.quaternion.X);
            tagMesh.quaternion.normalize();
        
            const rotationQuat = new THREE.Quaternion();
            rotationQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), ninety); 
            rotationQuat.setFromAxisAngle(new THREE.Vector4(0, 1, 0, 0), ninety*3); 
            tagMesh.quaternion.multiply(rotationQuat);
            tagMesh.position.set(tag.pose.translation.x-apriltags.field.length/2, tag.pose.translation.z, tag.pose.translation.y-apriltags.field.width/2);
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
        this.camera.position.z = 5;
        this.camera.position.y = 2;
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
            if (this.controls){
                this.controls.update();
            }
            this.renderer.render(this.scene, this.camera);
        }
    }

    setCamPos = (x=0,y=0,z=0) => {
        this.camera.position.x = x;
        this.camera.position.z = z;
        this.camera.position.y = y;
        
    }

    setCamRot = (x=0,y=0,z=0) => {
        this.camera.rotation.z = z;
        this.camera.rotation.y = y;
        this.camera.rotation.x = x;
    }
}
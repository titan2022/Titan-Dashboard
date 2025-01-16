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
        this.cameraObjs = [];
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
        this.camera = new THREE.PerspectiveCamera(48.1752761112, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000); // Approx. 35mm
        
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
        if (enableOrbitControls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        } else {
            this.controls = null;
        }

        // Robot object
        if (this.controls) {
            const robotGeom = new THREE.BoxGeometry(0.5, 0.5, 0.2);
            const robotMat = new THREE.MeshBasicMaterial({color: 0xffff00});
            this.robot = new THREE.Mesh(robotGeom, robotMat);
            this.scene.add(this.robot);

            const robotTargetGeom = new THREE.BoxGeometry(0.05, 0.05, 0.2);
            const robotTargetMat = new THREE.MeshBasicMaterial({color: 0xff0000});
            const robotTarget = new THREE.Mesh(robotTargetGeom, robotTargetMat);
            this.scene.add(robotTarget);

            robotTarget.position.set(-2.143990141519472, 0.5344550747203898, -1.5007918547681542);
            robotTarget.rotation.set(0, 120.0 * (Math.PI / 180.0), 0);

            // robotTarget.position.set(-2.5330356831240692, 0.28568760646473246, 1.1402842607174104);
            // robotTarget.rotation.set(0, 30.0 * (Math.PI / 180.0), 0);

            this.cameras.forEach(cam => {
                const camGeom = new THREE.BoxGeometry(0.06, 0.06, 0.02);
                const camMat = new THREE.MeshBasicMaterial({color: 0xff00ff});
                const camMesh = new THREE.Mesh(camGeom, camMat);
                camMesh.position.set(cam.position[0], cam.position[1], cam.position[2]);
                let newRot = this.toRad(cam.rotation);
                camMesh.rotation.set(newRot[0], newRot[1], newRot[2]);
                this.cameraObjs.push(camMesh);
                this.robot.add(this.cameraObjs.at(-1));
            });

            // Add axes helper to robot
            var axesHelper = new THREE.AxesHelper( 3 );
            this.robot.add( axesHelper );
        }

        // XYZ in corner
        var axesHelper = new THREE.AxesHelper( 10 );
        this.scene.add( axesHelper );

        // Apriltag objects
        this.apriltags.tags.forEach(tag => {

            // Tag mesh
            const tagGeom = new THREE.BoxGeometry(0.2159, 0.2794, 0.01); // Letter paper size
            const tagMat = new THREE.MeshBasicMaterial({map: textureLoader.load(`apriltags/${tag.ID}.png`)});
            const tagMesh = new THREE.Mesh(tagGeom, [defaultMat, defaultMat, defaultMat, defaultMat, tagMat, defaultMat]);
            let qm = new THREE.Quaternion();
            let ninety = Math.PI/2; 
            
            // EXPLANATION OF QUATERNION TRANSFORMATIONS
            // First, I input the quaternions in (x, y, z, w), as that's the way 
            // that three.js takes quaternions. Then I rotated it -90 degrees 
            // about the X-axis and flipped the Y-axis. Following that, I 
            // realized that the rotations were still incorrect, so I had to do 
            // a 90 degree rotation clockwise around the X-axis and a 90 degree 
            // rotation clockwise around the Y-axis. 

            tagMesh.quaternion.set(tag.pose.rotation.quaternion.X, tag.pose.rotation.quaternion.Y, tag.pose.rotation.quaternion.Z, tag.pose.rotation.quaternion.W);
            // tagMesh.quaternion.set(tag.pose.rotation.quaternion.X, -tag.pose.rotation.quaternion.Z, tag.pose.rotation.quaternion.Y, tag.pose.rotation.quaternion.W);
            // tagMesh.quaternion.set(tag.pose.rotation.quaternion.W, -tag.pose.rotation.quaternion.Z, tag.pose.rotation.quaternion.Y, tag.pose.rotation.quaternion.X);
            tagMesh.quaternion.normalize();
        
            const rotationQuat = new THREE.Quaternion();
            rotationQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), ninety*3); 
            tagMesh.quaternion.multiply(rotationQuat);

            tagMesh.quaternion.y = -tagMesh.quaternion.y;

            rotationQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), ninety); 
            tagMesh.quaternion.multiply(rotationQuat);

            rotationQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), ninety); 
            tagMesh.quaternion.multiply(rotationQuat);

            tagMesh.position.set(tag.pose.translation.x-apriltags.field.length/2, tag.pose.translation.z, -(tag.pose.translation.y-apriltags.field.width/2));
            
            if (this.controls) {
                var axesHelper = new THREE.AxesHelper( 0.25 );
                tagMesh.add( axesHelper );
            }
            
            this.tags.push(tagMesh);
            this.scene.add(this.tags.at(-1));
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

    setCameraPose = (pos, rot, cam) => {
        let pose = this.robotToCameraPose(pos, rot, cam);
        this.camera.position.set(...pose[0]);
        this.camera.rotation.set(...pose[1]);
    }

    robotToCameraPose = (pos, rot, cam) => {
        let camPos = new THREE.Vector3();
        let camRot = new THREE.Euler();

        // Rotate by robot rotation
        camPos.set(...cam.position);
        let newRot = this.toRad(rot);
        camPos.applyEuler(new THREE.Euler(...newRot, "XYZ"));
        
        // Offset by robot position
        camPos.add(new THREE.Vector3(...pos));

        // Set camera orientation
        camRot.set(...cam.rotation);

        return [pos, rot];
    }

    moveBot = (pos) => {
        // Robot position
        this.robot.position.x = pos[0]; // -
        this.robot.position.y = pos[1]; // -
        this.robot.position.z = pos[2];

        // Camera positions
    }

    rotateBot = (rot) => {
        // Robot rotation
        this.robot.rotation.x = rot[0];
        this.robot.rotation.y = rot[1]; // -
        this.robot.rotation.z = rot[2];

        // Camera rotations
    }
}
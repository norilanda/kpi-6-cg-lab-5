import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { rotateScene } from "../common/helper-script";
import { initialX, initialY, initialZ, rotationSpeed, textureFile } from './script-common';

// Create a scene
const scene = new THREE.Scene();

const getWidth = () => {
    return window.innerWidth / 2;
}

// Create a camera
const camera = new THREE.PerspectiveCamera(75, getWidth() / window.innerHeight, 0.1, 1000);
camera.position.z = initialZ;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(getWidth(), window.innerHeight);
const containerElement = document.getElementById('right');
containerElement!.appendChild(renderer.domElement);

const radius = 0.4; // radius of the cylinder
const height = 1.0; // height of the cylinder
const radialSegments = 32; // number of segments around the cylinder
const heightSegments = 1; // number of segments along the height
const openEnded = false; // whether the ends of the cylinder are open or capped


const geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments, heightSegments, openEnded);;

const texture = new THREE.TextureLoader().load(textureFile); 
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.generateMipmaps = false

let Angle = 0;

const material = new THREE.MeshBasicMaterial( { map:texture } );

const cylinder = new THREE.Mesh(geometry, material);

cylinder.rotation.x = initialX;
cylinder.rotation.y = initialY;
scene.add(cylinder);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

window.addEventListener('resize', () => {
    renderer.setSize(getWidth(), window.innerHeight);
    camera.aspect = getWidth() / window.innerHeight;
    camera.updateProjectionMatrix();
    renderScene();
});

const renderScene = () => {
    renderer.render(scene, camera);
}

const rotateObject = () => {
    cylinder.rotation.y += rotationSpeed;
}

const animate = () => {
    requestAnimationFrame(animate);
    if (rotateScene) {
        rotateObject();
    }
    Angle += 0.3;
    texture.offset.x = (Angle % 360) / 360;
    renderScene();
}
animate();

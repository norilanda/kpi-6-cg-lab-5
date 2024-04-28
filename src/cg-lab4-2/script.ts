import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { rotateScene } from "../common/helper-script";
import { initialX, initialY, initialZ, rotationSpeed, sideSize, textureFile } from './script-common';

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
const containerElement = document.getElementById('left');
containerElement!.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(sideSize, sideSize, sideSize);

const texture = new THREE.TextureLoader().load(textureFile); 
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(0.25, 1);
texture.generateMipmaps = false;

let Angle = 0;

const material = new THREE.MeshBasicMaterial( { map:texture } );

const cube = new THREE.Mesh(geometry, material);
cube.rotation.x = initialX;
cube.rotation.y = initialY;
scene.add(cube);

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
    cube.rotation.y += rotationSpeed;
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

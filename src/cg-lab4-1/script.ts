import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { rotateScene } from "../common/helper-script";
import { initialX, initialY, initialZ, textureFile } from './script-common';

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
const containerElement = document.getElementById('without-minimaps');
containerElement!.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

const texture = new THREE.TextureLoader().load(textureFile); 
texture.generateMipmaps = false;

const material = new THREE.MeshBasicMaterial( { map:texture } );


const materials = [
    material, // right
    material, // left
    material, // top
    material, // bottom
    material, // front
    material // back
];

const cube = new THREE.Mesh(geometry, materials);
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
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

const animate = () => {
    requestAnimationFrame(animate);
    if (rotateScene) {
        // rotateObject();
    }
    renderScene();
}
animate();

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { rotateScene } from "../common/helper-script";

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2.5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

const texture = new THREE.TextureLoader().load('/textures/2x2.bmp' ); 

// Configure texture wrap mode to repeat
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

// Set the repeat factor for the texture
const repeatFactor = 4.0;
texture.repeat.set(repeatFactor, repeatFactor);

const material = new THREE.MeshBasicMaterial( { map:texture } );

const materials = [
    material, // right
    material, // left
    material, // top
    material, // bottom
    material, // front
    material,  // back
];

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
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
        rotateObject();
    }
    renderScene();
}
animate();

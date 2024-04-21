import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { rotateScene } from "../common/helper-script";

// Create a scene
const scene = new THREE.Scene();

const getWidth = () => {
    return window.innerWidth / 2;
}

// Create a camera
const camera = new THREE.PerspectiveCamera(75, getWidth() / window.innerHeight, 0.1, 1000);
camera.position.z = 2.5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(getWidth(), window.innerHeight);
const containerElement = document.getElementById('without-minimaps');
containerElement!.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

const texture = new THREE.TextureLoader().load('/textures/leaf.bmp' ); 

const material = new THREE.MeshBasicMaterial( { map:texture } );

const colors = {
    'lilac': 0xC8A2C8,
    'lemon': 0xFDE910,
    'brown': 0x993300,
    'aqua': 0x00FFFF,
    'cherry': 0x640023,
    'salad': 0x7FFF00
}
const materials = [
    new THREE.MeshBasicMaterial({ color: colors.lilac }), // right
    new THREE.MeshBasicMaterial({ color: colors.lemon }), // left
    material, // top
    material, // bottom
    new THREE.MeshBasicMaterial({ color: colors.cherry }), // front
    new THREE.MeshBasicMaterial({ color: colors.salad })  // back
];

const cube = new THREE.Mesh(geometry, materials);
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
        rotateObject();
    }
    renderScene();
}
animate();

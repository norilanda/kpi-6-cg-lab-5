import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { rotateScene } from "../common/helper-script";
import { initialX, initialY, initialZ, rotationSpeed, sideSize } from './script-common';

// Create a scene
const scene = new THREE.Scene();

const getWidth = () => {
    return window.innerWidth;
}

// Create a camera
const camera = new THREE.PerspectiveCamera(75, getWidth() / window.innerHeight, 0.1, 1000);
camera.position.z = initialZ;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(getWidth(), window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(sideSize, sideSize, sideSize);
let cube: THREE.Mesh;

function loadJpegTextures() {
    const n = 4; // Number of images
    const tw0 = 512; // Width of each image
    const th0 = 512; // Height of each image
    const tw = n * tw0; // Total width of the texture
    const th = th0; // Total height of the texture
    const arrayRGB = new Uint8Array(tw * th * 4); // Array to hold RGBA data

    const promises = [];

    for (let k = 1; k <= n; k++) {
        const fname = '/textures/4-2/' + k + '.jpg';
        const img = new Image();
        const promise = new Promise((resolve, reject) => {
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = tw0;
                canvas.height = th0;
                const context = canvas.getContext('2d');
                context?.drawImage(img, 0, 0, tw0, th0);
                const imageData = context?.getImageData(0, 0, tw0, th0);

                if (!imageData) {
                    reject('Failed to get image data');
                    return;
                }
                
                for (let i = 0; i < tw0; i++) {
                    for (let j = 0; j < th; j++) {
                        const index = (j * tw + i + (k - 1) * tw0) * 4;
                        const pixelIndex = (th - 1 - j) * tw0 * 4 + i * 4; // Convert canvas coordinates to pixel index
                        arrayRGB[index] = imageData.data[pixelIndex]; // Red component
                        arrayRGB[index + 1] = imageData.data[pixelIndex + 1]; // Green component
                        arrayRGB[index + 2] = imageData.data[pixelIndex + 2]; // Blue component
                    }
                }
                
                resolve(void 0);
            };
            
            img.onerror = reject;
        });

        img.src = fname;
        promises.push(promise);
    }

    return Promise.all(promises).then(() => {
        const materials = [];
        const cubePlanes = 6;

        for (let i = 0; i < cubePlanes; i++) {

            const texture = new THREE.DataTexture(arrayRGB, tw, th, THREE.RGBAFormat);
            texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.set(0.25, 1);
            texture.needsUpdate = true;
            texture.offset.x = (i%4) * 0.25;
            texture.needsUpdate = true;

            const material = new THREE.MeshBasicMaterial({ map: texture });
            materials.push(material);
        }
            
        cube = new THREE.Mesh(geometry, materials);
        cube.rotation.x = initialX;
        cube.rotation.y = initialY;
        scene.add(cube);
    });
}

loadJpegTextures();

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
    cube.rotation.x += rotationSpeed;
    cube.rotation.y += rotationSpeed;
}

const animate = () => {
    requestAnimationFrame(animate);
    if (cube && rotateScene) {
        rotateObject();
    }

    renderScene();
}
animate();

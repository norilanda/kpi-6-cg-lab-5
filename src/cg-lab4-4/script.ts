import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { rotateScene } from "../common/helper-script";

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let cube: THREE.Mesh;

function genRGBATexture(bmpFileName: string) {
    return new Promise((resolve, reject) => {
        const bmp = new Image();
        const tw = 512;
        const th = 512;
        let arrayRGBA = new Uint8Array(th * tw * 4);

        bmp.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = tw;
            canvas.height = th;
            const ctx = canvas.getContext('2d');
            ctx!.drawImage(bmp, 0, 0, tw, th);

            for (let i = 0; i < tw; i++) {
                for (let j = 0; j < th; j++) {
                    const index = (j * tw + i) * 4;
                    const pixelData = ctx!.getImageData(i, j, 1, 1).data;
                    const isWhite = pixelData[0] > 250 && pixelData[1] > 250 && pixelData[2] > 250;
                    arrayRGBA[index] = pixelData[0];
                    arrayRGBA[index + 1] = pixelData[1];
                    arrayRGBA[index + 2] = pixelData[2];
                    arrayRGBA[index + 3] = (isWhite) ? 0 : 255;
                }
            }

            const texture = new THREE.DataTexture(arrayRGBA, tw, th, THREE.RGBAFormat);
            texture.needsUpdate = true;

            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;

            resolve(texture);
        };

        bmp.onerror = function(error) {
            reject(error);
        };

        bmp.src = bmpFileName;
    });
}

async function draw3D() {
    const h = 1.0;
    const r = h * 1.1;

    const texture1 = new THREE.TextureLoader().load('/textures/2x2.bmp');
    const texture2 = await genRGBATexture('/textures/spider.bmp') as THREE.Texture;
    texture2.flipY = true;

    // full transparent material
    const material = new THREE.MeshBasicMaterial({
        map: texture1,
        transparent: true,
        opacity: 0.0
    });

    // base texture
    const materialBase = new THREE.MeshBasicMaterial({ map: texture1, transparent: true });
    materialBase.side = THREE.DoubleSide;
    const geometryCube = new THREE.BoxGeometry(h, h, h);
    cube = new THREE.Mesh(geometryCube, [materialBase, materialBase, materialBase, materialBase, material, materialBase]);
    scene.add(cube);

    // spider texture
    const materialSpider = new THREE.MeshBasicMaterial({ map: texture2, transparent: true });
    materialSpider.side = THREE.DoubleSide;
    materialBase.blendSrcAlpha = THREE.OneMinusDstAlphaFactor;
    const geometrySpider = new THREE.PlaneGeometry(r, r);
    const spider = new THREE.Mesh(geometrySpider, materialSpider);
    spider.position.set(0, 0, 0.501);
    cube.add(spider);
}

await draw3D();

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
    if (cube && rotateScene) {
        rotateObject();
    }
    renderScene();
}
animate();

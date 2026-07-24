import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildHouse, LOT } from './scene.js';

const canvas = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd8e8);
scene.fog = new THREE.Fog(0xbfd8e8, 40, 110);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 500);
const focusZ = LOT.totalDepth * 0.45;
camera.position.set(-22, 20, -10);
camera.lookAt(0, 2, focusZ);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2, focusZ);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.49;
controls.minDistance = 4;
controls.maxDistance = 90;

// Lighting: hemisphere sky/ground fill + directional sun with shadows
const hemi = new THREE.HemisphereLight(0xdfefff, 0x3a4a2f, 0.9);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff2d8, 1.6);
sun.position.set(-30, 40, -20);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -40;
sun.shadow.camera.right = 40;
sun.shadow.camera.top = 40;
sun.shadow.camera.bottom = -40;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 150;
sun.shadow.bias = -0.0015;
scene.add(sun);
scene.add(sun.target);
sun.target.position.set(0, 0, focusZ);

const house = buildHouse(THREE);
scene.add(house);

function resize() {
  const w = innerWidth, h = innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
addEventListener('resize', resize);
resize();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// --- simple UI: jump-to-view buttons -------------------------------------
const views = {
  street: { pos: [-2, 6, -14], target: [0, 3, 15] },
  aerial: { pos: [-8, 55, focusZ], target: [0, 0, focusZ] },
  rear: { pos: [3, 4.5, 60], target: [0, 1.2, 48] },
  interior: { pos: [1.5, 2.2, 33], target: [0, 1.6, 40] },
};
document.querySelectorAll('[data-view]').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = views[btn.dataset.view];
    if (!v) return;
    camera.position.set(...v.pos);
    controls.target.set(...v.target);
  });
});

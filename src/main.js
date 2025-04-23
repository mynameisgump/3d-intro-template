import * as THREE from 'three';

// Initialize Scene Creation
const scene = new THREE.Scene();
const skyboxTexture = new THREE.TextureLoader().load('/public/hdr.webp');
scene.environment = skyboxTexture;

// Initialize Camera and set position
let followTarget = null;
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 30;

// Initializing the Renderer and setting to correct size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Update camera aspect ratio and renderer on resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Creating a mesh and adding to the scene
const cubeGeo = new THREE.BoxGeometry(5,5,5)
const cubeMat = new THREE.MeshBasicMaterial()
const cube =new THREE.Mesh(cubeGeo,cubeMat);
scene.add(cube)

// Code For the Animation Loop
function animate() {
  renderer.render(scene, camera);
  
  cube.rotation.x += 0.02
  cube.rotation.y += 0.01
  cube.rotation.z += 0.04
}
renderer.setAnimationLoop(animate);

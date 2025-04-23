import * as THREE from 'three';

// Initializing the Renderer and setting to correct size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize Scene Creation
const scene = new THREE.Scene();

// Initialize Camera and set position

const camera = new THREE.PerspectiveCamera(
  75,
  // Aspect ratio should be set to window ratio
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Move camera position back to see
camera.position.z = 30;

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

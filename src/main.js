import * as THREE from 'three';

// Create Texture Loader
const textureLoader = new THREE.TextureLoader();

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

// Creating the Sun and adding to the scene
const sunGeo = new THREE.SphereGeometry(5);
const sunTex = textureLoader.load("/textures/sun_diffuse.jpg")
const sunMat = new THREE.MeshBasicMaterial({color: "Orange", map: sunTex});
const sun = new THREE.Mesh(sunGeo,sunMat);
scene.add(sun)

// Create mercury and add to the sun, offset for rotation 
const mercGeo = new THREE.SphereGeometry(1);
const mercTex = textureLoader.load("/textures/mercury_diffuse.jpg");
const mercMat = new THREE.MeshBasicMaterial({map: mercTex});
const merc = new THREE.Mesh(mercGeo,mercMat);
sun.add(merc)
merc.position.x = 8

// Code For the Animation Loop
function animate() {
  renderer.render(scene, camera);
  
  // Planet and sun rotations
  sun.rotation.y += 0.01
  merc.rotation.y += 0.01
}
renderer.setAnimationLoop(animate);

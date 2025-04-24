import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create Texture Loader
const textureLoader = new THREE.TextureLoader();

// function to create planet 
function createPlanet(size,texture) {
  const planetGeo = new THREE.SphereGeometry(size);
  const planetTex = textureLoader.load(texture);
  const planetMat = new THREE.MeshBasicMaterial({map: planetTex});
  const planet = new THREE.Mesh(planetGeo,planetMat);
  return planet
}

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
  5000
);
// Move camera position back to see
camera.position.z = 30;

// Initilize controls with Camera and Renderer
const controls = new OrbitControls( camera, renderer.domElement );

// Update camera aspect ratio and renderer on resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Creating the Sun and adding to the scene
const sunGeo = new THREE.SphereGeometry(5);
const sunTex = textureLoader.load("/textures/sun_diffuse.jpg")
const sunMat = new THREE.MeshBasicMaterial({ map: sunTex});
const sun = new THREE.Mesh(sunGeo,sunMat);
scene.add(sun)

// Create mercury and add to the sun, offset for rotation 
const merc = createPlanet(1,"/textures/mercury_diffuse.jpg")
sun.add(merc)
merc.position.x = 8

// Create Venus and add to sun, offset for rotation
// Need to seperate the orbits somehow 
const venus = createPlanet(2,"/textures/venus_diffuse.jpg")
sun.add(venus);
venus.position.x = 20

// Create large geo skybox
const starGeo = new THREE.SphereGeometry(4000);
const starTexture = textureLoader.load('/skybox/stars_skybox.jpg');
// Use back side of sphere for skybox
const starMat = new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide})
const stars = new THREE.Mesh(starGeo,starMat);
scene.add(stars)

// Code For the Animation Loop
function animate() {
  renderer.render(scene, camera);
  
  // Planet and sun rotations
  sun.rotation.y += 0.01
  merc.rotation.y += 0.01
}
renderer.setAnimationLoop(animate);

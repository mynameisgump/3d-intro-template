import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { degToRad } from 'three/src/math/MathUtils';
import { BloomEffect, ASCIIEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";


// Create Texture Loader
const textureLoader = new THREE.TextureLoader();

function createRing(orbitRadius) {
  const geometry = new THREE.RingGeometry( orbitRadius-0.1, orbitRadius, 32 ); 
  const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
  const mesh = new THREE.Mesh( geometry, material ); 
  return mesh;
}

function createOrbitPath(orbitRadius) {
  const geometry = new THREE.TorusGeometry(orbitRadius,0.05,12,80);
  const material = new THREE.MeshBasicMaterial( { color: "#b9b9b9", side: THREE.DoubleSide } );
  const mesh = new THREE.Mesh( geometry, material ); 
  return mesh;
}

// function to create planet 
function createPlanet(size,texture, orbitRadius, parent) {

  // Add orbit center to the planet
  const orbitCenter = new THREE.Group(); 
  parent.add(orbitCenter);
  const tempVec = new THREE.Vector3();
  orbitCenter.getWorldPosition(tempVec);
  const ring = createOrbitPath(orbitRadius);
  ring.rotateX(degToRad(90))
  orbitCenter.add(ring)

  // intitalize and add planet to orbit
  const planetGeo = new THREE.SphereGeometry(size);
  const planetTex = textureLoader.load(texture);
  const planetMat = new THREE.MeshStandardMaterial({map: planetTex});
  const planet = new THREE.Mesh(planetGeo,planetMat);
  orbitCenter.add(planet);
  planet.position.x = orbitRadius;
  planet.userData = {type: "planet"}
  
  return [orbitCenter,planet]
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

// Postprocessing Effects
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new EffectPass(camera, new BloomEffect()));

// Initialize a raycaster
const raycaster = new THREE.Raycaster();
// Variable for pointer location 
const pointer = new THREE.Vector2();

// Normalized pointer location 
function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('pointermove', onPointerMove);

// On Click Event
function onClick(event) {
  raycaster.setFromCamera(pointer, camera);
  // Calculates intersections
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    if (hit.isMesh && hit.userData.type == "planet") {
      console.log(hit)
    }
    
  }
}
window.addEventListener('mouseup', onClick);



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
const sunMat = new THREE.MeshStandardMaterial({ emissiveMap: sunTex, emissive: "#ffa400", emissiveIntensity: 4, });
const sun = new THREE.Mesh(sunGeo,sunMat);
scene.add(sun)


// Create light and add to sun 
const sunLight = new THREE.PointLight()
sunLight.intensity = 1000;
sun.add(sunLight)

// Create mercury and add to the sun, offset for rotation 
const [mercOrbit, merc] = createPlanet(3,"/textures/mercury_diffuse.jpg",25,sun)
const [mercMoonOrbit,mercMoon] = createPlanet(2,"/textures/moon_diffuse.jpg",8,merc)


// Create Venus and add to sun, offset for rotation
const [venusOrbit,venus] = createPlanet(2,"/textures/venus_diffuse.jpg",40,sun)

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
  composer.render();

  // Planet and sun rotations
  sun.rotation.y += 0.01

  mercOrbit.rotation.y += 0.01
  merc.rotation.y += 0.01

  // venusOrbit.rotation.y += 0.012;
  // venus.rotation.y +=0.02
}
renderer.setAnimationLoop(animate);
//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.01, 100);

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'console';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    object.traverse(function (node) {
      if (node.isMesh) {
        // check if material has a map (texture)
        if (node.material.map) {
          node.material.map.minFilter = THREE.LinearFilter;
          node.material.map.magFilter = THREE.LinearFilter;
          node.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    // Adjust the object's position
    object.position.y -= 0.2;

    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Add the renderer to the DOM
document.getElementById("ps5").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "console" ? 0.4 : 0.7;

//Add lights to the scene, so we can actually see the 3D model

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

const bottomLight = new THREE.DirectionalLight(0x0032FF, 1); // (color, intensity)
bottomLight.position.set(0, -10, 10); //top-left-ish
bottomLight.castShadow = true;
scene.add(bottomLight);

const topLight = new THREE.DirectionalLight(0xFFFFFF, 1); // (color, intensity)
topLight.position.set(0, 10, -10); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "console") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  
  // Add a rotation transformation
  if (object) {
    object.rotation.y += 0.003;
  }
  
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//Start the 3D rendering
animate();

window.addEventListener("scroll", function() {
  var scrollPosition = window.scrollY;
  var windowHeight = window.innerHeight;
  var ps5 = document.querySelector('.ps5');
  var ps4 = document.querySelector('.ps4');

  var ps5Position = ps5.getBoundingClientRect().top;
  var title = document.querySelector('.title-ps');
  var subTitle = document.querySelector('.small-title-ps');
  var content = document.querySelector('.ps5-content');

  var ps4Position = ps4.getBoundingClientRect().top;
  var titlePs4 = document.querySelector('.title-ps4');
  var subTitlePs4 = document.querySelector('.small-title-ps4');
  var contentPS4 = document.querySelector('.ps4-content-text');

  if (ps5Position < windowHeight - 150) {
    title.classList.add('scroll-anim');
    subTitle.classList.add('scroll-anim');
    content.classList.add('scroll-anim');
  }

  if (ps4Position < windowHeight - 20) {
    titlePs4.classList.add('scroll-anim');
    subTitlePs4.classList.add('scroll-anim');
    contentPS4.classList.add('scroll-anim');
  }
});
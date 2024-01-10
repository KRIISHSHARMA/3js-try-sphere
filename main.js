import * as THREE from 'three' ; 
import './style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { _setDefaults } from 'gsap/gsap-core';
import gsap from 'gsap';

// scene + sphere
const scene = new THREE.Scene()
const geometry = new THREE.SphereGeometry(3,64,64)
const material = new THREE.MeshStandardMaterial({
  color: '#ffffff', // Set to green for visibility
  roughness: 0.3
});
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)
scene.background = new THREE.Color('#000000'); // Set a dark background color
// const ambientLight = new THREE.AmbientLight(0x000000); // Soft white light
// scene.add(ambientLight);

// size to fit window
const sizes =  {
  width: window.innerWidth,
  height: window.innerHeight,
}
// add to camera and renderer



// adding light
const light = new THREE.PointLight(0xffffff,100,100)
light.position.set(0,10,10)
scene.add(light)
 
// camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height ,0.1)
camera.position.z = 20 // sets camera back other wise will overlap
scene.add(camera)

// renderer (html canvas)
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGL1Renderer({canvas})
renderer.setSize(sizes.width,sizes.height)
renderer.render(scene,camera)
renderer.setPixelRatio(2) // smooth edges 
//renderer.setClearColor('#111111'); // Set a dark clear color


// controls 
const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true  // physics
controls.enablePan = false // cant right click and move
controls.zoom = false // cant zoom
controls.autoRotate = true 
controls.autoRotateSpeed = 10



// Resize after moving
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});
// Start animation loop
const loop = () => {
  //sphere.position.y += 0.1
  controls.update() // keeps on going even after letting go
  // Your rendering code here
  renderer.render(scene, camera);
  // Request the next frame
  window.requestAnimationFrame(loop);
};
// Start the initial frame
loop();

// sync magic // timeline magic bwhahah
const t1 = gsap.timeline({defaults: {duration:1}})
t1.fromTo(sphere.scale,{z:0,x:0,y:0},{z:1,x:1,y:1})
t1.fromTo('nav',{x: '-100%'},{x:"0%"})
t1.fromTo(".title",{opacity:0},{opacity:1})

//mouse colourchange
let mouseDown = false
let rgb = [40,2,12]
window.addEventListener("mousedown",() => (mouseDown = true))
window.addEventListener("mouseup",() => (mouseDown = true))
window.addEventListener('mousemove',(e)=> {
  if(mouseDown){
     rgb =[Math.round((e.pageX/sizes.width)*255),
     Math.round((e.pageY/sizes.height)*255),150]
    //animating 
    let newcolor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(sphere.material.color,{r:newcolor.r
      ,g:newcolor.g,
      b:newcolor.b})
  }
})


console.log('Scene created:', scene);
console.log('Sphere created:', sphere);
console.log('Light created:', light);
console.log('Camera created:', camera);




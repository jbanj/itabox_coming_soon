import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import * as dat from 'dat.gui'

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// 3D Model
const gltfLoader = new GLTFLoader()

let mixer = null

gltfLoader.load( 'robot.glb',
function (gltf) {

    mixer = new THREE.AnimationMixer( gltf.scene );
    const action = mixer.clipAction( gltf.animations[ 0 ] ).play();
    const action1 = mixer.clipAction( gltf.animations[ 1 ] ).play();

    action.play();
    action1.play();
  
    const model = gltf.scene;
    model.position.set( 0, 0.1, 0 );
    model.scale.set( 1, 1, 1 );
    model.rotation.y = Math.PI * 1.18
    model.castShadow = true;
    scene.add(model);

    // gui.add(gltf.scene.rotation, 'y').min(-5).max(5).step(0.001).name('modelYRotation')


}, undefined, function ( e ) {

    console.error( e );

} );


gltfLoader.load('box.glb',
function (gltf2) {
    const model2 = gltf2.scene;
    model2.scale.set(0.012, 0.012, 0.012);
    model2.position.set(-0.5, -0.7, -1);
    model2.rotation.set(0.1, 0.8, 0)
    model2.receiveShadow = true;
    scene.add(model2)
});




// Lights

const light1 = new THREE.PointLight(0xff0000, 2)
light1.position.set(2, 5, -5)
scene.add(light1)
light1.intensity = 19

const light2 = new THREE.PointLight(0x1b047c, 2)
light1.position.set(-5, 4, -3)
scene.add(light2)
light2.intensity = 20

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(2,4,9)
scene.add(directionalLight)
directionalLight.castShadow = true;

// Gui Helper for Directional Light
// gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
// gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
// gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
// gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true

renderer.physicallyCorrectLights = true
// Test if sRGBEncoding is best and disable or enable it
renderer.outputEncoding = THREE.sRGBEncoding

// renderer.toneMapping = THREE.LinearToneMapping
// renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMapping = THREE.CineonToneMapping
// renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.8;


/**
 * Animate
 */

const clock = new THREE.Clock()
let previousTime = 0


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if(mixer !== null)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)


} 

tick()
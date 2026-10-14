
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x171923);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.6, 0);



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = '0';
document.body.appendChild(renderer.domElement);

const healthBar = document.createElement('div');

healthBar.style.cssText = `
  position: fixed;
  top: 20px;
  left: 20px;
  width: 200px;
  height: 20px;
  background: #333;
  border: 2px solid white;
  z-index: 10;
`;

const healthFill = document.createElement('div');

healthFill.style.cssText = `
  width: 100%;
  height: 100%;
  background: #e53935;
  transition: width 0.1s;
`;

healthBar.appendChild(healthFill);
document.body.appendChild(healthBar);

function updateHealthBar() {
  healthFill.style.width =
    `${Math.max(0, enemyHP / maxEnemyHP) * 100}%`;
}
const light = new THREE.HemisphereLight(0xffffff, 0x444466, 3);
scene.add(light);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x343847 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.8, 1),
  new THREE.MeshStandardMaterial({ color: 0x64b5f6 })
);
player.position.y = 0.9;
scene.add(player);

const enemy = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.5, 1),
  new THREE.MeshStandardMaterial({ color: 0xef5350 })
);

enemy.position.set(0, 0.75, -4);
scene.add(enemy);

let enemyHP = 100;
const maxEnemyHP = 100;

const keys = {};


window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  keys[key] = true;

  if (key === 'f') {
    enemyHP = Math.max(0, enemyHP - 10);
    updateHealthBar();
  }
});

window.addEventListener('keyup', (event) => {
  keys[event.key.toLowerCase()] = false;
});

const moveSpeed = 0.1;



function animate() {
  requestAnimationFrame(animate);

  
const forwardX = -Math.sin(yaw);
const forwardZ = -Math.cos(yaw);

const rightX = Math.cos(yaw);
const rightZ = -Math.sin(yaw);

if (keys['w']) {
  player.position.x += forwardX * moveSpeed;
  player.position.z += forwardZ * moveSpeed;
}

if (keys['s']) {
  player.position.x -= forwardX * moveSpeed;
  player.position.z -= forwardZ * moveSpeed;
}

if (keys['d']) {
  player.position.x += rightX * moveSpeed;
  player.position.z += rightZ * moveSpeed;
}

if (keys['a']) {
  player.position.x -= rightX * moveSpeed;
  player.position.z -= rightZ * moveSpeed;
}

  // Keep the camera at the player's eye height.
  camera.position.set(
    player.position.x,
    player.position.y + 0.7,
    player.position.z
  );

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
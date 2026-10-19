
import { CombatSystem } from "./combat/combatSystem.js";

import glbUrl from "../models/glb.glb?url";
import characterUrl from "../models/Solus_the_knight.glb?url";

const scene = new THREE.Scene();
let lastFrameTime = performance.now();
scene.background = new THREE.Color(0x171923);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.6, 0);
scene.add(camera);

const combatweaponModel = new THREE.Group();


 




// Initial first-person position.
// Initial first-person position.
combatweaponModel.position.set(0.55, -0.55, -1.15);
combatweaponModel.rotation.z = -0.18;

// Load the real combat.weapon model.
// Load the combat.weapon through a file picker.
const dracoLoader = new THREE.DRACOLoader();

dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
);

const glbLoader = new THREE.GLTFLoader();
glbLoader.setDRACOLoader(dracoLoader);
const combat.weaponFileInput = document.getElementById("combat.weaponFile");


glbLoader.load(
  glbUrl,
  (gltf) => {
    const combat.weapon = gltf.scene.getObjectByName("combat.weapon");
    // ...

    if (!combat.weapon) {
      console.error("Couldn't find the combat.weapon group!");
      console.log("Available groups:", gltf.scene.children);
      return;
    }

    const oldcombat.weapon = combatweaponModel.getObjectByName("loadedcombat.weapon");
    if (oldcombat.weapon) combatweaponModel.remove(oldcombat.weapon);

    const weapon = new THREE.Group();
    weapon.name = "loadedcombat.weapon";

    const model = combat.weapon.clone(true);
    weapon.add(model);

    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());

    model.position.sub(center);
    weapon.scale.setScalar(2.5);

    weapon.position.set(0, 0, 0);
    weapon.rotation.set(0, 0, 0);

    combatweaponModel.add(weapon);

    console.log(
      "Loaded combat.weapon successfully!",
      bounds.getSize(new THREE.Vector3())
    );
  },
  undefined,
  (error) => {
    console.error("Couldn't load the combat.weapon model:", error);
  }
);

camera.add(combatweaponModel);





const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = '0';
document.body.appendChild(renderer.domElement);

renderer.domElement.style.display = 'block';

renderer.domElement.addEventListener('click', () => {
  renderer.domElement.requestPointerLock();
});

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement !== renderer.domElement) return;

  yaw -= event.movementX * mouseSensitivity;
  pitch -= event.movementY * mouseSensitivity;

  pitch = Math.max(
    -Math.PI / 2 + 0.01,
    Math.min(Math.PI / 2 - 0.01, pitch)
  );

  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
});


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
const crosshair = document.createElement('div');

crosshair.textContent = '+';
crosshair.style.cssText = `
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font: 24px monospace;
  pointer-events: none;
  z-index: 10;
`;

document.body.appendChild(crosshair);

function updateHealthBar() {
  healthFill.style.width =
    `${Math.max(0, enemyHP / mcombat.weaponnemyHP) * 100}%`;
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

// The player object remains our invisible movement anchor.
player.visible = false;

let playerCharacter = null;

// Load Solus the Knight.
glbLoader.load(
  characterUrl,
  (gltf) => {
  const solusMesh = character.getObjectByName("Solus_Knight");
const skeleton = solusMesh.skeleton;

const armBoneNames = new Set([
  "Rig_Shoulder_L",
  "Rig_Upper_Arm_L",
  "Rig_Lower_Arm_L",
  "Rig_hand_L",
  "Rig_Shoulder_R",
  "Rig_Upper_Arm_R",
  "Rig_Lower_Arm_R",
  "Rig_hand_R"
]);

const skinIndices = solusMesh.geometry.getAttribute("skinIndex");
const skinWeights = solusMesh.geometry.getAttribute("skinWeight");

let armVertices = 0;
let bodyVertices = 0;

for (let i = 0; i < skinIndices.count; i++)  {
  let armWeight = 0;

  for (let j = 0; j < 4; j++) {
    const boneIndex = skinIndices.getComponent(i, j);
    const weight = skinWeights.getComponent(i, j);
    const boneName = skeleton.bones[boneIndex]?.name;

    if (armBoneNames.has(boneName)) {
      armWeight += weight;
    }
  }

  if (armWeight >= 0.5) {
    armVertices++;
  } else {
    bodyVertices++;
  }
}

console.log("Vertices mostly belonging to arms:", armVertices);
console.log("Other vertices:", bodyVertices);
console.log("Total vertices:", skinIndices.count);

    const targetHeight = 1.8;
    const scale = targetHeight / size.y;

    character.scale.setScalar(scale);
    character.position.y -= bounds.min.y * scale;

    // Hide separately named head pieces for first-person viewing.
    character.traverse((object) => {
      if (
        object.isMesh &&
        /head|helmet|face|hair|visor/i.test(object.name)
      ) {
        object.visible = false;
      }
    });

    // This group follows the player without changing the camera.
    playerCharacter = new THREE.Group();
    playerCharacter.add(character);
    scene.add(playerCharacter);

    console.log("Solus loaded successfully!");
    console.log(
      "Character animations:",
      gltf.animations.map((clip) => clip.name)
    );
  },
  undefined,
  (error) => {
    console.error("Couldn't load Solus the Knight:", error);
  }
);

const enemy = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.5, 1),
  new THREE.MeshStandardMaterial({ color: 0xef5350 })
);

enemy.position.set(0, 0.75, -4);
scene.add(enemy);

let enemyHP = 100;
const mcombat.weaponnemyHP = 100;

const combat = new CombatSystem({
  camera,
  enemy,
  scene,
  getEnemyHP: () => enemyHP,
  setEnemyHP: (value) => {
    enemyHP = value;
  },
  updateHealthBar
});

const keys = {};

let yaw = 0;
let pitch = 0;

const mouseSensitivity = 0.002;

window.addEventListener('keydown', (event) => {
  keys[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (event) => {
  keys[event.key.toLowerCase()] = false;
});

renderer.domElement.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    combat.startAttack();
  }
});


const moveSpeed = 4;
const sprintMultiplier = 1.6;



function animate() {
  requestAnimationFrame(animate);

  

const forwardX = -Math.sin(yaw);
const forwardZ = -Math.cos(yaw);

const rightX = Math.cos(yaw);
const rightZ = -Math.sin(yaw);

let moveX = 0;
let moveZ = 0;

if (keys['w']) {
  moveX += forwardX;
  moveZ += forwardZ;
}

if (keys['s']) {
  moveX -= forwardX;
  moveZ -= forwardZ;
}

if (keys['d']) {
  moveX += rightX;
  moveZ += rightZ;
}

if (keys['a']) {
  moveX -= rightX;
  moveZ -= rightZ;
}

// Normalize diagonal movement.
const length = Math.hypot(moveX, moveZ);

if (length > 0) {
  moveX /= length;
  moveZ /= length;
}

const sprinting = keys['shift'];
const speed = moveSpeed * (sprinting ? sprintMultiplier : 1);

// Convert units per second into movement per frame.
const now = performance.now();
const delta = Math.min((now - lastFrameTime) / 1000, 0.05);
lastFrameTime = now;

player.position.x += moveX * speed * delta;
player.position.z += moveZ * speed * delta;

// Keep the player inside the arena.
player.position.x = THREE.MathUtils.clamp(
  player.position.x, -9.5, 9.5
);

player.position.z = THREE.MathUtils.clamp(
  player.position.z, -9.5, 9.5
);


  // Keep the camera at the player's eye height.
  camera.position.set(
    player.position.x,
    player.position.y + 0.7,
    player.position.z
  );
  
if (playerCharacter) {
  // Match the player's horizontal position.
  // The character's feet stay at ground level.
  playerCharacter.position.set(
    player.position.x,
    player.position.y - 0.9,
    player.position.z
  );

  // Rotate the character with the player's facing direction.
  playerCharacter.rotation.y = yaw;
}




const smooth = (t) => t * t * (3 - 2 * t);

// Each pose moves the entire combat.weapon-and-arms assembly.
const idlePose = {
  x: 0.55, y: -0.55, z: -1.15,
  rx: 0, ry: 0, rz: -0.18
};


const windupPose = {
  x: 2.0, y: -0.20, z: -1.40,
  rx: -0.15, ry: -0.20, rz: -0.65
};

const impactPose = {
  x: -0.30, y: -0.65, z: -1.05,
  rx: 0.08, ry: 0.18, rz: 0.38
};


function setcombat.weaponPose(pose) {
  combatweaponModel.position.set(pose.x, pose.y, pose.z);
  combatweaponModel.rotation.set(pose.rx, pose.ry, pose.rz);
}


function blendcombat.weaponPose(from, to, progress, easing = smooth) {
  const t = easing(THREE.MathUtils.clamp(progress, 0, 1));
  const mix = (a, b) => a + (b - a) * t;

  setcombat.weaponPose({
    x: mix(from.x, to.x),
    y: mix(from.y, to.y),
    z: mix(from.z, to.z),
    rx: mix(from.rx, to.rx),
    ry: mix(from.ry, to.ry),
    rz: mix(from.rz, to.rz)
  });
}

    



if (combat.phase === 'windup') {
  // Pull the entire weapon and arms back to the right.
  blendcombat.weaponPose(
    idlePose,
    windupPose,
    combat.phaseTimer / combat.weapon.windup
  );

} else if (combat.phase === 'swing') {
  // Accelerate through a wide right-to-left sweep.
  // The quadratic easing makes the strike gain speed.
  blendcombat.weaponPose(
    windupPose,
    impactPose,
    combat.phaseTimer / combat.weapon.swing,
    t => t * t
  );

} else if (combat.phase === 'recovery') {
  // The weapon carries through before returning to guard.
  blendcombat.weaponPose(
    impactPose,
    idlePose,
    combat.phaseTimer / combat.weapon.recovery
  );

} else {
  setcombat.weaponPose(idlePose);
}

combat.update(delta);

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

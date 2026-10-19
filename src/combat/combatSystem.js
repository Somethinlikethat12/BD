

export class CombatSystem {
  constructor({
    camera,
    enemy,
    scene,
    getEnemyHP,
    setEnemyHP,
    updateHealthBar
  }) {
    this.camera = camera;
    this.enemy = enemy;
    this.scene = scene;
    this.getEnemyHP = getEnemyHP;
    this.setEnemyHP = setEnemyHP;
    this.updateHealthBar = updateHealthBar;

    this.weapon = {
      damage: 20,
      range: 2.5,
      windup: 0.4,
      swing: 0.2,
      recovery: 0.4
    };

    this.raycaster = new THREE.Raycaster();
    this.phase = "ready";
    this.phaseTimer = 0;
  }

  startAttack() {
    if (this.phase !== "ready") return;
    if (this.getEnemyHP() <= 0) return;

    this.phase = "windup";
    this.phaseTimer = 0;
  }

  hitWithWeapon() {
    if (this.getEnemyHP() <= 0) return;

    this.camera.updateMatrixWorld(true);

    this.raycaster.setFromCamera(
      new THREE.Vector2(0, 0),
      this.camera
    );

    const hits = this.raycaster.intersectObject(this.enemy);

    if (hits.length === 0) return;
    if (hits[0].distance > this.weapon.range) return;

    const newHP = Math.max(
      0,
      this.getEnemyHP() - this.weapon.damage
    );

    this.setEnemyHP(newHP);
    this.updateHealthBar();

    if (newHP === 0) {
      this.scene.remove(this.enemy);
    }
  }

  update(delta) {
    if (this.phase === "ready") return;

    this.phaseTimer += delta;

    if (
      this.phase === "windup" &&
      this.phaseTimer >= this.weapon.windup
    ) {
      this.phase = "swing";
      this.phaseTimer = 0;

      // One hit check per attack, when the swing begins.
      this.hitWithWeapon();

    } else if (
      this.phase === "swing" &&
      this.phaseTimer >= this.weapon.swing
    ) {
      this.phase = "recovery";
      this.phaseTimer = 0;

    } else if (
      this.phase === "recovery" &&
      this.phaseTimer >= this.weapon.recovery
    ) {
      this.phase = "ready";
      this.phaseTimer = 0;
    }
  }
}

import SwirlBehavior from './behavior/SwirlBehavior.js'
import ThrobBehavior from './behavior/ThrobBehavior.js'
import * as THREE from '../../../lib/three.module.js'
import PairShot from './PairShot/PairShot.js';
import dao from '../Dao.js';
import { map, lerp } from '../utils/math.js'
import { TWO_PI, HALF_PI, PI } from '../Const.js'

class PairWrapper extends THREE.Group {
  constructor(pair) {
    super()
    this.pair = pair;
    this.add(pair);
  }
}

export default class SwirlShot extends PairShot {
  Count = 1
  constructor() {
    super()
    const { bg, player, stage, pairPool } = dao.getData()

    var imageTexture = THREE.ImageUtils.loadTexture("assets/textures/cred-aaf.png");
    var creditAAF = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 512), new THREE.MeshBasicMaterial({
      map: imageTexture,
      transparent: true,
      color: 0x282828
    }));
    creditAAF.material.map.minFilter = THREE.LinearFilter;
    creditAAF.material.map.magFilter = THREE.NearestFilter;

    var imageTexture2 = THREE.ImageUtils.loadTexture("assets/textures/cred-popcorn.png");
    var creditPopcorn = new THREE.Mesh(new THREE.PlaneBufferGeometry(512, 256), new THREE.MeshBasicMaterial({
      map: imageTexture2,
      transparent: true,
      color: 0x282828
    }));
    creditPopcorn.material.map.minFilter = THREE.LinearFilter;
    creditPopcorn.material.map.magFilter = THREE.NearestFilter;

    this.container.add(creditAAF);
    this.container.add(creditPopcorn);
    creditAAF.visible = true
    creditPopcorn.visible = false
    creditAAF.name = "creditAAF"
    creditPopcorn.name = "creditPopcorn"

    creditAAF.scale.setLength(0.425);
    creditAAF.position.x = -125;

    // creditPopcorn.rotation.y = HALF_PI
    creditPopcorn.scale.setLength(0.6);
    creditPopcorn.position.x = 150;
    creditPopcorn.position.y = 100;
    console.error(this.in);

    player.timeline.call(() => {
      creditPopcorn.visible = true
      creditAAF.visible = false
      console.error(1234);
    }, [], this, 23 + 5);
  }

  start() {
    super.start()
    const Midi = Assets('mid/dennis.mid')
    const { bg, player, stage, pairPool } = dao.getData()
    const Renderer = stage.renderer
    bg.position.y = 0;
    bg.updateMatrix();
    this.camera.add(bg);

    this.camera.thetaRange = PI * 0.25;
    this.camera.phiRange = PI * 0.5;
    this.camera.position.z = 500
    this.lookAt = undefined;
    this.hero1 = this.next();
    this.heroGroup1 = new PairWrapper(this.hero1);
    this.heroGroup1.position.copy({ x: 158.4396, y: -25.7578, z: -22.0123 });
    this.heroGroup1.rotation.y = Math.PI * 0.5;
    this.heroGroup1.rotation.y += random.range(0.15, 0.25) * Math.PI;
    this.heroGroup1.rotation.x = random.range(0.15, 0.25) * Math.PI;
    this.heroGroup1.visible = false;
    this.heroGroup1.scale.set(0.4, 0.4, 0.4);
    this.heroGroup1.name = "heroGroup1"
    this.container.add(this.heroGroup1)

    this.hero2 = this.next();
    this.heroGroup2 = new PairWrapper(this.hero2);
    this.heroGroup2.name = "heroGroup2"
    this.heroGroup2.position.z = -30;
    this.heroGroup2.rotation.y = random.range(0.1, 0.15) * Math.PI;
    this.heroGroup2.visible = false;
    this.heroGroup2.scale.set(0.4, 0.4, 0.4);
    this.container.add(this.heroGroup2)
    let apperTime = 32;//32

    this.popCount = 0;

    this.heroGroup2.visible = false;
    this.heroGroup1.visible = false;

    stage.scene.add(this.heroGroup1);
    this.camera.add(this.heroGroup2);
    this.pairs = this.get(pairPool.size / 2);
    this.poppers = [];
    this.sploders = [];
    this.drifts = [];
    this.pairs.forEach(function (pair, n) {
      this.container.add(pair)
      pair.male.matrixAutoUpdate = false;
      pair.female.matrixAutoUpdate = false;

      pair.rotation.x = random.angle();
      pair.rotation.y = random.angle();
      pair.rotation.z = random.angle();
      var popper = n % 2 === 0;

      var s = random(0.09, 0.5) * 1.35;
      pair.scale.set(s, s, s)

      // 漩涡
      var behavior = new SwirlBehavior();
      this.drifts.push(behavior);
      behavior.n = n / this.pairs.length;
      behavior.target = pair;
      behavior.start();
      pair.strokeInflate(1 / s * 0.35);

      // 搏动
      var throb = new ThrobBehavior();
      throb.target = pair;
      throb.origin = pair.scale.x;
      pair.throb = throb;

    }, this);

    // Impact 1
    // -------------------------------
    player.timeline.set(this.heroGroup1, { visible: true });
    player.timeline.to(this.heroGroup1.position, 0.75, { x: this.heroGroup1.position.x - 2, ease: Linear.easeNone }, apperTime)
    player.timeline.to(this.hero1.rotation, 0.75, { x: 0.15, ease: Linear.easeNone }, apperTime);
    player.timeline.add(this.hero1.insert(), apperTime - 0.4);
    player.timeline.add(bg.curdle(new THREE.Color(0xffffff), this.hero1.colorMale), apperTime)
    player.timeline.to(this.hero1.position, 6, { z: -8000, ease: Linear.easeNone }, apperTime + 2);
    player.timeline.to(this.hero1.rotation, 6, { x: 480, ease: Linear.easeNone }, apperTime + 2);
    player.timeline.set(this.heroGroup2, { visible: true }, apperTime + 4);
    player.timeline.fromTo(this.hero2.position, 0.5.beats, { z: -20000 }, { z: 0, ease: Linear.easeNone }, apperTime + 5);
    player.timeline.fromTo(this.hero2.rotation, 0.5.beats, { x: 100 }, { x: 0, ease: Linear.easeNone }, apperTime + 5);

    // Impact 2
    // -------------------------------
    player.timeline.to(this.hero2.position, 0.75, { z: 4, ease: Linear.easeNone }, apperTime + 6);
    player.timeline.to(this.hero2.rotation, 0.75, { x: 0.25, ease: Linear.easeNone }, apperTime + 6);
    player.timeline.add(this.hero2.insert(), apperTime + 7 - 0.4);
    player.timeline.add(bg.curdle(new THREE.Color(0xffffff), this.hero2.colorMale), apperTime + 7)
    player.timeline.to(this.hero2.position, 0.75, { z: -8, ease: Linear.easeNone }, apperTime + 7);
    player.timeline.to(this.hero2.rotation, 0.75, { x: -0.5, ease: Linear.easeNone }, apperTime + 7);
    player.timeline.call(Renderer.setClearColor, [0xffffff, 1], Renderer, apperTime + 8);
    player.timeline.to(this.hero2.position, 6, { z: -8000, ease: Linear.easeNone }, apperTime + 8);
    player.timeline.to(this.hero2.rotation, 6, { x: -480, ease: Linear.easeNone }, apperTime + 8);

    Midi.query({ type: 'noteOn', track: 3 }).forEach(note => {
      if (note.time < this.in) return;
      var time = note.time - this.in;
      this.pairs.forEach((pair, i) => {
        if (!pair.throb) return;
        this.timeline.call(pair.throb.update, [], pair.throb, time + i / this.pairs.length);
        // console.error(pair.throb.update);
      });
    });
  }

  update() {
    // if (this.lookAt) {
    //   this.camera.lookAt(this[this.lookAt].position);
    // }
  }


  freeze() {
    this.drifts.forEach(function (d) {
      d.stop();
    });
  }

  stop() {
    this.sploders.forEach(function (behavior) {
      behavior.stop();
    })
    // console.error(this.poppers);

    // this.poppers.clear();
  }
}

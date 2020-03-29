// lib
import * as THREE from '../../lib/three.module.js'

// object
import PairPool from './object/PairShot/PairPool.js'
import Background from './object/Background.js'
import TestShot from './object/TestShot.js'
import IntroShot from './object/IntroShot.js'
import DriftShot from './object/DriftShot.js'
import SexyShot from './object/SexyShot.js'
import SwirlShot from './object/SwirlShot.js'
import JumpShot from './object/JumpShot.js'
import RainShot from './object/RainShot.js'

// core
import { Stage } from './Stage.js'
import Bootstrap from './Bootstrap.js'
import Player from './Player.js'
import dao from './Dao.js'
import Config from './Config.js'
import Debug from './Debug.js'

require('./utils/Promise.js')
require('./utils/url.js')
require('./Assets.js')

// 用于调试
window.THREE = THREE
window.dao = dao

const InOut = function (k) {
  if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
  return 0.5 * ((k -= 2) * k * k * k * k + 2);
}

export default class App {
  constructor() {
    window.lm = this
    this.dao = dao
    this.stage = new Stage("#canvasFather")
    dao.setData({
      stage: this.stage,
    })
    this.stage.run()
    this.bt = new Bootstrap()
    this.bt.init([
      'shaders/noise.glsl',
      'shaders/noise-lite.glsl',
      'shaders/background.vs',
      'shaders/background.fs',
      'shaders/background-lite.vs',
      'shaders/background-lite.fs',
      'shaders/pair.vs',
      'shaders/pair.fs',
      'shaders/floor.fs',
      'shaders/floor.vs',
      'shaders/floor-lite.fs',
      'shaders/floor-lite.vs',
      'textures/title.png',
      'textures/cred-aaf.png',
      'textures/cred-nhx.png',
      'textures/cred-popcorn.png',
      'textures/pastel.gif',
      'textures/pastel2.jpg',
      'mp3/dennis.mp3',
      'mid/dennis.mid',
    ], () => {
      this.player = new Player()
      dao.setData({ player: this.player })

      this.initBackground()
      let time1 = Date.now()
      let time2 = 0
      const pairPool = new PairPool(10)
      pairPool.init(() => {
        time2 = Date.now()
        console.error(`pairPool init time ${time2 - time1}`);
        // alert(time2 - time1)
        dao.setData({ pairPool, player: this.player })
        this.addShots()
        this.player.run()
        // this.player.play()
      })
    })

  }

  initBackground() {
    const LITE_PERLIN = false
    // lm.stage.camera.far
    var geometry = new THREE.SphereGeometry(29000 * 0.8, 32, 32);
    var vs = Assets('shaders/background.vs');
    var fs = Assets('shaders/noise.glsl') + Assets('shaders/background.fs');
    var vsLite = Assets('shaders/background-lite.vs')
    var fsLite = Assets('shaders/noise-lite.glsl') + Assets('shaders/background-lite.fs');
    var bg = new Background();
    bg.init(LITE_PERLIN ? vsLite : vs, LITE_PERLIN ? fsLite : fs, geometry);
    dao.setData({
      bg: bg,
    })

    var geometry = new THREE.CylinderGeometry(3000, 3000, 0, 20);
    var vs = Assets('shaders/floor.vs');
    var fs = Assets('shaders/noise.glsl') + Assets('shaders/floor.fs');
    var vsLite = Assets('shaders/floor-lite.vs')
    var fsLite = Assets('shaders/noise-lite.glsl') + Assets('shaders/floor-lite.fs');

    var floor = new Background();
    floor.init(LITE_PERLIN ? vsLite : vs, LITE_PERLIN ? fsLite : fs, geometry);
    floor.mesh.position.y = -10;
    floor.mesh.updateMatrix();
    floor.solid(0x027AC0);
    dao.setData({
      floor: floor,
    })
  }

  addShots() {
    const { player, bg, stage } = dao.getData()
    if (Config.debug) {
      var testShot = new TestShot()
      player.addShot(1, testShot)
      // player.timeline.add(bg.wipe(0, 0xffff00), 10);
      return
    }

    // var introShot = new IntroShot()
    // player.addShot(0, introShot)
    // player.timeline.time(0, false)
    // player.timeline.stop()

    // player.addCameraTween(0.01, 5.0, { x: 0, y: 30000, z: 500 });

    // var anotherDrift = new DriftShot(500, 0.1, 30, true);
    // player.addShot(5.2, anotherDrift)
    // this.anotherDrift = anotherDrift

    // var thirdDriftShot = new DriftShot(500, 1, 30, false);
    // player.addShot(8.5, thirdDriftShot);
    // this.thirdDriftShot = thirdDriftShot

    // var sexyShot01 = new SexyShot();
    // sexyShot01.len = 10.0;
    // sexyShot01.distance = 0.5;
    // sexyShot01.camera.position.z = 100;
    // sexyShot01.camera.distance = 100;
    // sexyShot01.credit = true;
    // player.addShot(18.0, sexyShot01);
    // player.timeline.add(() => {
    //   stage.scene.add(bg);
    //   bg.clear();
    //   bg.colorHigh = sexyShot01.pair.colorMale;
    //   bg.position.y = 0;
    //   bg.updateMatrix();
    //   bg.soak(6.0)
    // }, 18);

    // var swirlShot = new SwirlShot();
    // player.addShot(1, swirlShot);


    // var tomFillShot = new JumpShot();
    // tomFillShot.useTitle = true;
    // var tomFillTime = 1
    // player.addShot(tomFillTime, tomFillShot);
    // player.timeline.call(tomFillShot.jump, [], tomFillShot, tomFillTime);
    // player.timeline.call(tomFillShot.insert, [], tomFillShot, tomFillTime + 0.6);
    // player.timeline.call(tomFillShot.jump, [], tomFillShot, tomFillTime + 1);
    // player.timeline.call(tomFillShot.insert, [], tomFillShot, tomFillTime + 1 + 0.7);

    // var rainShot = new RainShot()
    // player.addShot(1, rainShot);
  }
}

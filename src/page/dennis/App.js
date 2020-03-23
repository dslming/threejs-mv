// lib
import * as THREE from '../../lib/three.module.js'

// object
import PairPool from './object/PairShot/PairPool.js'
import Background from './object/Background.js'
import TestShot from './object/TestShot.js'
import IntroShot from './object/IntroShot.js'
import DriftShot from './object/DriftShot.js'

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
      const pairPool = new PairPool(1000)
      pairPool.init(() => {
        dao.setData({ pairPool, player: this.player })
        this.addShots()
        this.player.run()
        // this.player.play()
      })
    })

  }

  initBackground() {
    const LITE_PERLIN = false
    var geometry = new THREE.SphereGeometry(lm.stage.camera.far * 0.9, 32, 12);
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



    // scope.creditNHX = new THREE.Mesh(new THREE.PlaneBufferGeometry(512, 256), new THREE.MeshBasicMaterial({
    //   map: Assets('textures/cred-nhx.png'),
    //   transparent: true,
    //   color: 0x282828
    // }));

    // scope.creditAAF = new THREE.Mesh(new THREE.PlaneBufferGeometry(1024, 512), new THREE.MeshBasicMaterial({
    //   map: Assets('textures/cred-aaf.png'),
    //   transparent: true,
    //   color: 0x282828
    // }));

    // scope.creditPopcorn = new THREE.Mesh(new THREE.PlaneBufferGeometry(512, 256), new THREE.MeshBasicMaterial({
    //   map: Assets('textures/cred-popcorn.png'),
    //   transparent: true,
    //   color: 0x282828
    // }));




    // creditNHX.material.map.minFilter = THREE.LinearFilter;
    // creditNHX.material.map.magFilter = THREE.NearestFilter;

    // creditAAF.material.map.minFilter = THREE.LinearFilter;
    // creditAAF.material.map.magFilter = THREE.NearestFilter;

    // creditPopcorn.material.map.minFilter = THREE.LinearFilter;
    // creditPopcorn.material.map.magFilter = THREE.NearestFilter;
  }

  addShots() {
    const { player } = dao.getData()
    if (Config.debug) {
      var testShot = new TestShot()
      player.addShot(0, testShot)
      player.timeline.add(
        dao.getData().bg.wipe(0, 0xffff00)
        , 10);
      return
    }

    var introShot = new IntroShot()
    player.addShot(0, introShot)
    player.timeline.time(0, false)
    player.timeline.stop()

    var anotherDrift = new DriftShot(500, 0.1, 30, false, undefined);
    player.addShot(0, anotherDrift)
    this.anotherDrift = anotherDrift

    var thirdDriftShot = new DriftShot(500, 1, 40, false, undefined);
    player.addShot(8.5, thirdDriftShot);
    this.thirdDriftShot = thirdDriftShot

  }
}

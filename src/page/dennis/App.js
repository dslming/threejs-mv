import * as THREE from '../../lib/three.module.js'
import { Stage } from './Stage.js'
import CameraCtl from './CameraCtl.js'

window.THREE = THREE

export default class App {
  constructor() {
    window.lm = this
    this.stage = new Stage("#canvasFather")
    this.stage.run()
    this.stage.scene.add(this._addBox(10))
    this.camCtl = new CameraCtl(this.stage)
    this.camCtl.setPosition(0, 0, 70, false)
  }

  _addBox(size) {
    var geometry = new THREE.BoxGeometry(size, size, size);
    var material = new THREE.MeshPhongMaterial({
      color: 0x63e42a,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    })
    var cube = new THREE.Mesh(geometry, material);
    return cube
  }
}

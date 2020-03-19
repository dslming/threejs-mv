import * as THREE from '../../lib/three.module.js'
import CameraControls from '../../lib/camera-controls.module.js'

CameraControls.install({ THREE: THREE });

export default class CameraCtl extends CameraControls {
  constructor(stage) {
    super(stage.camera, stage.renderer.domElement)
    const clock = new THREE.Clock();
    // 阻尼
    super.dampingFactor = 0.1
    stage.onUpdate(() => {
      const delta = clock.getDelta();
      const hasControlsUpdated = super.update(delta);
      if (hasControlsUpdated) {
        stage.renderer.render(stage.scene, stage.camera);
      }
    })
  }
}

import { TetrahedronGeometry } from "../../../lib/three.module"

/**
 * 获取相机可视范围
 *           c
 *          /|
 *        /  |
 *      /    |
 *    /      |
 *  /        |
 * a----------b
 *
 * @param {*} camera
 */
export function getCameraViewRange(camera) {
  let { fov, aspect, position: { z } } = camera
  let b = z / Math.cos(fov / 2 * THREE.Math.DEG2RAD)
  let c = z
  let a = Math.sqrt(b * b - c * c)
  return {
    x: 2 * a * aspect,
    y: 2 * a
  }
}


import { Easing } from '../../utils/Easing.js'
import Behavior from './Behavior.js'

export default class ShakeBehavior extends Behavior {
    vector = new THREE.Vector3();
    constructor() {
        super()
        this.magnitude = new THREE.Vector3(0, 2, 0);
        this.origin = new THREE.Vector3();
        this.duration = Time.beats(0.25);
        this.dir = 1;
    }
    start() {
    }
    update() {
        this.vector.copy(this.magnitude);
        this.vector.multiplyScalar(this.dir * Easing.Exponential.Out(this.now / this.duration));
    }
}

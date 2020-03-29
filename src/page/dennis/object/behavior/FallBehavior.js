import Behavior from './Behavior.js'
import dao from '../../Dao.js';

export default class FallBehavior extends Behavior {
    constructor() {
        super()
        var s = random(0.8, 1);
        this.s = s;

        this.origin = new THREE.Vector3();
        this.magnitude = 1;
        this.rx = random.range(PI) * 0.1;
        this.ry = random.range(PI) * s * 0.1;
        this.rz = random.range(PI) * 0.1;
    }

    start() {
        super.start()
        this.origin.copy(this.target.position);
    }
    update() {
        let { player } = dao.getData()
        this.target.position.y = this.origin.y + - 700 * this.s * (player.now * player.now) * this.magnitude;
        this.target.rotation.x = player.now * this.rx - Math.PI / 2;
        this.target.rotation.y = player.now * this.ry;
        this.target.rotation.z = player.now * this.rz;
    }
}

import Behavior from './Behavior.js'
import { map, lerp } from '../../utils/math.js'
import dao from '../../Dao.js';

export default class SwirlBehavior extends Behavior {
  constructor() {
    super()
    this.radius = random(10, 50);
    this.verticalSpeed = 1.2
    this.angleSpeed = lerp(0.0001, 0.02, this.radius / 50);
    this.seed = random(0.5, 2);
  }

  start() {
    super.start()
  }

  update() {
    let { player } = dao.getData()
    var angle = (this.n * 2 - (player.now * 0.7 + 18) * this.angleSpeed + 0.3) % 3;
    this.target.position.x = (angle) * 240 + 60;
    this.target.position.y = this.radius * Math.sin(-angle * TWO_PI);
    this.target.position.z = this.radius * Math.cos(-angle * TWO_PI);
  }
}

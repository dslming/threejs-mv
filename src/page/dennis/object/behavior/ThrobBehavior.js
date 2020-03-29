import { map, lerp, clamp } from '../../utils/math.js'
import dao from '../../Dao.js';

const Elastic = {
  In: function (k) {
    var s, a = 0.1, p = 0.4;
    if (k === 0) return 0;
    if (k === 1) return 1;
    if (!a || a < 1) { a = 1; s = p / 4; }
    else s = p * Math.asin(1 / a) / (2 * Math.PI);
    return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
  },
  Out: function (k) {
    var s, a = 0.1, p = 0.4;
    if (k === 0) return 0;
    if (k === 1) return 1;
    if (!a || a < 1) { a = 1; s = p / 4; }
    else s = p * Math.asin(1 / a) / (2 * Math.PI);
    return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
  },
  InOut: function (k) {
    var s, a = 0.1, p = 0.4;
    if (k === 0) return 0;
    if (k === 1) return 1;
    if (!a || a < 1) { a = 1; s = p / 4; }
    else s = p * Math.asin(1 / a) / (2 * Math.PI);
    if ((k *= 2) < 1) return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
  }
}

export default class ThrobBehavior {
  constructor() {
    this.amplitude = random(0.5, 2);
  }

  start() { }

  update() {
    let { player } = dao.getData()
    let cc = Math.sin(player.now)
    var v = map(cc, -1, 1, -0.05, 0.05)
    var d = (this.target.scale.x + v);
    this.target.scale.set(d, d, d);
  }
}

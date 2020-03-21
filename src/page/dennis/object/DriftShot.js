import PairShot from './PairShot/PairShot.js';
import Config from '../Config.js'
import { map, between, clamp } from '../utils/math.js'
import dao from '../Dao.js';
import { TWO_PI } from '../Const.js'
import { where } from '../utils/where.js'

class ScaleControl {
  constructor(inTime) {
    this.in = inTime
    this.duration = random(0.5, 1);
    this.amplitude = random(1, 1.5);
    this.period = random(0.2, 0.3);
    this.p3 = this.period / TWO_PI * (Math.asin(1 / this.amplitude) || 0);
    this.scale = 1;
  }

  start() {
    const { player } = dao.getData()
    this.update = this.update.bind(this)
    this.name = Date.now()
    player.addLoopFn(this.update, this.name)
  }

  update() {
    const { player } = dao.getData()
    this.now = player.now - this.in

    var t = clamp(this.now / this.duration, 0, 1);
    var s = this.ease(t) || 0.000001;
    s *= this.scale;
    this.target.scale.set(s, s, s);
    if (this.duration !== undefined && this.now > this.duration) {
      this.stop();
    }
  }

  stop() {
    this.target.scale.set(this.scale, this.scale, this.scale);
    const { player } = dao.getData()
    player.removeLoopFn(this.name)
  }

  ease(t) {
    return this.amplitude * Math.pow(2, -10 * t) * Math.sin((t - this.p3) * TWO_PI / this.period) + 1;
  }
}

class CameraControl {
  lastDir = random.sign();

  constructor() {
  }

  start(x, y, offset, speed) {
    this.x = x
    this.y = y
    const { player } = dao.getData()
    this.player = player
    this.offset = offset
    this.update = this.update.bind(this)
    this.name = Date.now()
    player.addLoopFn(this.update, this.name)
    this.target.position.x = this.x
    this.target.position.y = this.y
    this.target.position.z = random(-50, 50)
    this.offsetAll = 0
    this.speed = speed
  }

  update() {
    const offsetX = random(0, 0.3)
    const offsetY = random(0, 0.2)
    this.target.rotation.z += this.speed * random.range(0.1, 0.2) * 0.1;
    this.target.position.x += this.speed * offsetX
    this.target.position.y += this.speed * offsetY
    this.offsetAll += Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2))
    if (this.offsetAll >= this.offset) {
      this.player.removeLoopFn(this.name)
    }
  }

}

export default class DriftShot extends PairShot {
  constructor(cameraDistance, speed, numPairs, useZ, dir, offset, useMidi) {
    super()
    this.container.name = "DriftShot"

    this.camera.position.z = cameraDistance;
    this.speed = speed;
    this.numPairs = numPairs || 1;
    this.useZ = useZ;
    this.offset = offset || 0;
    this.dir = dir;
    this.useMidi = useMidi === undefined ? true : useMidi;
  }

  start() {
    console.error(this.container.name);

    for (var i = 0; i < this.numPairs; i++) {
      var behavior = new CameraControl()
      behavior.target = this.next();
      behavior.target.scale.setLength(random(0.85, 1.2));
      behavior.camera = this.camera;
      behavior.start(
        random(-500, 500),
        random(-50, 50),
        random(0, 300),
        this.speed
      );
    }

    if (this.useMidi) {
      const Midi = Assets('mid/dennis.mid')
      var popEvents = _.filter(Midi.events, where({
        type: 'noteOn',
        track: 2,
        time: between(this.in, this.out)
      }));

      popEvents.forEach((note, i) => {
        var pair = this.next();
        pair.scale.set(0.0001, 0.0001, 0.0001);
        var behavior = new CameraControl()
        behavior.target = pair
        behavior.camera = this.camera;
        behavior.start(
          random(-500, 500),
          random(-50, 50),
          random(0, 300),
          this.speed
        );

        var jiggle = new ScaleControl(this.in)
        jiggle.target = pair;
        // jiggle.scale = random(0.85, 1.2);
        this.timeline.call(jiggle.start, [], jiggle, note.time - this.in);
      })
    }
    super.start()
  }
}

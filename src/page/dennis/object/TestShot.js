import PairShot from './PairShot/PairShot.js'
import dao from '../Dao.js'
import { getCameraViewRange } from '../utils/threejs-utils.js'

export default class TestShot extends PairShot {
  constructor() {
    super()
    this.container.name = "TestShot"
    this.camera.position.z = 300;
    // this.camera.position.x = 5 * 50 / 2;
    // this.camera.position.y = 3 * 50 / 2;
    window.tt = this
    this.pairs = []
  }

  start() {
    // let { bg } = dao.getData()
    // this.container.add(bg);
    // for (var i = 0; i < 1; i++) {
    //   var pair = this.next();
    //   pair.position.x = 30;
    //   pair.position.y = 20;
    //   // pair.male.visible = i % 2 === 0;
    //   // pair.male.position.set(0, 0, 0);
    //   this.pairs.push(pair)
    //   this.container.add(pair)
    // }
    super.start()

    setInterval(() => {
      let { y } = getCameraViewRange(this.camera)
      this.jumpInsert(random.range(100, y), 0.8)
    }, 2000);
  }

  jumpInsert(h, speed) {
    let { x, y } = getCameraViewRange(this.camera)
    var pair = this.next();
    pair.position.x = random.range(-x / 2, x / 2)
    pair.position.y = -(y / 2 + 50)
    pair.male.position.z = this.camera.position.z;
    console.error(h);

    pair.jump3(h)
    pair.insert3(speed)
    this.container.add(pair)
  }
}

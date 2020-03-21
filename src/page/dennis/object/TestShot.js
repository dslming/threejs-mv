import PairShot from './PairShot/PairShot.js'
import dao from '../Dao.js'

export default class TestShot extends PairShot {
  constructor() {
    super()
    this.container.name = "TestShot"
    this.camera.position.z = 300;
    this.camera.position.x = 5 * 50 / 2;
    this.camera.position.y = 3 * 50 / 2;
  }

  start() {
    let { bg } = dao.getData()
    this.container.add(bg);
    for (var i = 0; i < 50; i++) {
      var pair = this.next();
      pair.position.x = i % 6 * 50;
      pair.position.y = ~~(i / 6) * 50;
      pair.male.visible = i % 2 === 0;
      pair.male.position.set(0, 0, 0);
    }
    super.start()
  }
}

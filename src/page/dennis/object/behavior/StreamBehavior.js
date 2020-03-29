import Behavior from './Behavior.js'

export default class StreamBehavior extends Behavior {
  Rate = 1
  constructor() {
    super()
    this.width = 18000;
    this.height = 13000;
    this.depth = 6500;
  }

  start() {
    super.start()
    this.speed = random(1000, 20000);
    this.target.position.y = random.range(this.height / 2);
    this.target.position.x = random.range(this.width / 2);
    this.target.position.z = random(-this.depth);
    this.rx = random.range(20);
    this.ry = random.range(20);
  }

  update() {
    this.target.position.x += this.speed * StreamBehavior.Rate * Player.delta;
    this.target.position.x += this.width / 2;
    this.target.position.x %= this.width;
    this.target.position.x -= this.width / 2;
    this.target.rotation.x += this.rx * StreamBehavior.Rate * Player.delta;
    this.target.rotation.y += this.ry * StreamBehavior.Rate * Player.delta;
  }
}

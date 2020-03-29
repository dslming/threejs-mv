import { clamp } from './utils/math.js'
import dao from './Dao.js'

let that = null
export default class Player {
  constructor() {
    that = this
    this.timeline = new TimelineLite()
    this.timeline.time(0, false);
    this.sound = Assets('mp3/dennis.mp3')
    this.now = 0
    this.delta = 0
    this.preNow = 0

    this.loopFnArr = []
    this.currentShots = []
    this.active = {}
    this.isPlay = false
  }

  play() {
    this.isPlay = true
    this.sound.play();
  }

  addLoopFn(fn, name) {
    this.loopFnArr.push({
      name,
      fn
    })
  }

  removeLoopFn(name) {
    this.loopFnArr.forEach((item, index) => {
      if (item.name == name) {
        this.loopFnArr.splice(index, 1)
      }
    })
  }

  run() {
    that._update()
  }

  _update() {
    const smoothed = that.sound.currentTime
    const duration = that.sound.duration | 0
    that.preNow = that.now
    that.now = clamp(smoothed, 0, duration);
    that.delta = that.now - that.preNow;

    that.timeline.time(that.now, false)
    requestAnimationFrame(that._update)
    that.loopFnArr.forEach(itemFn => {
      itemFn.fn()
    })
  }

  addShot(time, shot) {
    // this.timeline.add(time, Shot.stopAll);

    // 设置结束时间
    this.currentShots.forEach(s => { s.out = time; });
    if (this.currentShots.length > 0) {
      this.currentShots.length = 0
    }

    // 设置开始时间
    shot.in = time;
    this.timeline.call(() => {
      shot.start()
      this._stop()
      this.active[shot.id] = shot;
    }, [], shot, time);
    this.currentShots.push(shot)
  }

  addCameraTween(time, duration, dest) {
    // var tween = new CameraTween();
    // tween.easing = ease;
    // tween.duration = duration;
    // tween.dest = dest;
    let { stage } = dao.getData()
    this.timeline.call(() => {
      console.error(123);
      TweenLite.to(stage.camera.position, duration, {
        x: dest.x,
        y: dest.y,
        z: dest.z
      });
    }, [], this, time);
  }

  _stop() {
    for (var id in this.active) {
      this.active[id].stop();
    }
    this.active = {}
  }
}

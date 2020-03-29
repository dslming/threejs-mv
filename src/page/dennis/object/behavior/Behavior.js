import dao from '../../Dao.js';

export default class Behavior {
  constructor() {
    this.player = dao.getData().player
  }

  start() {
    this.update = this.update.bind(this)
    this.name = Date.now()
    this.player.addLoopFn(this.update, this.name)
  }

  stop() {
    this.player.removeLoopFn(this.name)
  }
}

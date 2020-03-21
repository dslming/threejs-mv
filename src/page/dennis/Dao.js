class DaoSingleton {
  constructor() {
  }

  getData() {
    return this
  }

  /**
   * objs:包括
   * stage,3d舞台
   * bg,背景
   * floor,地板
   * pairPool,
   * player
   *
   */
  setData(objs) {
    let { stage, bg, floor, pairPool, player } = objs
    stage && (this.stage = stage)
    bg && (this.bg = bg)
    floor && (this.floor = floor)
    pairPool && (this.pairPool = pairPool)
    player && (this.player = player)
  }
}

export default new DaoSingleton()


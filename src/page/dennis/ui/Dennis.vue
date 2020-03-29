<template>
  <div class="dennis">
    <div id="canvasFather"></div>
    <canvas id="debug-canvas" width="0" height="0px"></canvas>
    <div id="big-play" class="show" :class="{hiden: hiden}" @click="click">
      <svg viewBox="0 0 116 116">
        <use class="play" xlink:href="assets/img/sprites.svg#big-play" fill="#fff"></use>
      </svg>
    </div>
  </div>
</template>

<script>
import App from "../App.js";

export default {
  components: {},
  data() {
    return {
      hiden: false
    };
  },
  methods: {
    click() {
      this.hiden = true;
      const { player } = this.app.dao.getData();
      player.play();
    }
  },
  created() {},
  mounted() {
    this.app = new App();
  }
};
</script>
<style lang='scss' scoped>
.dennis,
#canvasFather {
  width: 100%;
  height: 100%;
}

.dennis {
  position: relative;
  display: flex;
  align-items: center;
  background: #000;
}
#debug-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  background-color: #ccc;
}

.hiden {
  display: none;
}

#big-play {
  touch-action: pan-y;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-tap-highlight-color: #0000;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 200px;
  transform: translateX(-50%);
  transform: translate(-50%, -50%);
  background-color: #00000080;
}
</style>

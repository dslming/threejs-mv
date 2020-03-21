<template>
  <div class="dennis">
    <div id="canvasFather"></div>
    <canvas id="debug-canvas" width="0" height="0px"></canvas>
  </div>
</template>

<script>
import App from "../App.js";

export default {
  components: {},
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {
    let app = new App();
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
}
#debug-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  background-color: #ccc;
}
</style>

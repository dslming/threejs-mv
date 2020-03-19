<template>
  <div class="dennis">
    <div id="canvasFather"></div>
  </div>
</template>

<script>
import App from "./App";

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
</style>

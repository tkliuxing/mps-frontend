<template>
  <div class="wiki-container" style="background: #fff;">
    <iframe src="http://mpsc.test.nmhuixin.com/" :height="frame_height" :width="frame_width" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      frame_width: 1200,
      frame_height: 600,
    }
  },
  methods: {
    resizeFrame(){
      let content = document.querySelector('.content.el-scrollbar');
      content.style.padding = '0';
      this.frame_width = content.offsetWidth;
      this.frame_height = content.offsetHeight;
    },
  },
  mounted() {
    this.resizeFrame();
    window.onresize = () => {
      this.resizeFrame();
    }
  },
}
</script>

<style scoped>
</style>

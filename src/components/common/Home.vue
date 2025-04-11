<template>
  <div class="wrapper">
    <v-head></v-head>
    <el-scrollbar class="content">
      <transition name="move" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta && $route.meta.keepAlive"></router-view>
        </keep-alive>
      </transition>
      <router-view v-if="!$route.meta || !$route.meta.keepAlive"></router-view>
    </el-scrollbar>
    <el-backtop target=".content .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<script>
import vHead from './Header.vue';
import vTags from './Tags.vue';
import bus from './bus';

export default {
  data() {
    return {
      collapse: false
    };
  },
  components: {
    vHead,
    vTags
  },
  created() {
    bus.$on('collapse-content', msg => {
      this.collapse = msg;
    });
  }
};
</script>

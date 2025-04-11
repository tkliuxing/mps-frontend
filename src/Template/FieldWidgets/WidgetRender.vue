<template>
  <div :class="$options.name">
    <cmp :html="widget"></cmp>
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.esm.browser.js'
import ElementUI from "element-ui"
Vue.use(ElementUI, {
  size: "small",
});
export default {
  name: "WidgetRender",
  props: {
    widget: {
      type: String,
      default: ""
    }
  },
  components: {
    cmp: {
      // functional: true,
      render(h, ctx){
        console.log('render');
        console.log(this.html);
        const com = Vue.extend({
          template: this.html
        })
        return h(com, {})
      },
      props: {
        html: {
          type: String,
          default: ""
        }
      }
    }
  },
}
</script>

<style scoped>

</style>

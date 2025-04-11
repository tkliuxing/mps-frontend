<template>
  <el-card>
    <el-form inline label-width="100" class="conf-form">
      <el-form-item label="名称">
        <el-input v-model="search_form.name" placeholder="查找" clearable></el-input>
      </el-form-item>
      <el-form-item label="图标颜色">
        <el-color-picker v-model="v_color" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="背景颜色">
        <el-color-picker v-model="bg_color" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item label="显示密度">
        <el-radio v-model="v_span" label="8">3</el-radio>
        <el-radio v-model="v_span" label="6">4</el-radio>
        <el-radio v-model="v_span" label="4">6</el-radio>
        <el-radio v-model="v_span" label="3">8</el-radio>
        <el-radio v-model="v_span" label="2">12</el-radio>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="Element UI 图标" name="elicon"></el-tab-pane>
      <el-tab-pane label="FontAwesome 色块图标" name="fasicon"></el-tab-pane>
      <el-tab-pane label="FontAwesome 线型图标" name="faricon"></el-tab-pane>
      <el-tab-pane label="FontAwesome 品牌图标" name="fabicon"></el-tab-pane>
      <el-tab-pane label="FontAwesome 图标分类" name="facate"></el-tab-pane>
    </el-tabs>
    <div class="icon-content" v-show="activeName === 'elicon'">
      <div class="title-bar"><i class="el-icon-s-grid"></i> Element UI 图标</div>
      <el-row :gutter="0" :style="{backgroundColor: bg_color}">
        <template v-for="i in find_elicon">
          <IconBox :icon="i" :span="b_span" :color="v_color" />
        </template>
      </el-row>
    </div>
    <div class="icon-content" v-show="activeName === 'fasicon'">
      <div class="title-bar">
        <i class="el-icon-s-grid"></i> FontAwesome 色块图标 {{this.fasicon.length}} 个
        <el-button type="text" @click="faHelpShow = true" icon="el-icon-question"></el-button>
      </div>
      <el-row :gutter="0" :style="{backgroundColor: bg_color}">
        <template v-for="i in find_fasicon">
          <IconBox :icon="`fas fa-${i}`" :span="b_span" :color="v_color" />
        </template>
      </el-row>
    </div>
    <div class="icon-content" v-show="activeName === 'faricon'">
      <div class="title-bar"><i class="el-icon-s-grid"></i> FontAwesome 线型图标 {{this.faricon.length}} 个
        <el-button type="text" @click="faHelpShow = true" icon="el-icon-question"></el-button>
      </div>
      <el-row :gutter="0" :style="{backgroundColor: bg_color}">
        <template v-for="i in find_faricon">
          <IconBox :icon="`far fa-${i}`" :span="b_span" :color="v_color" />
        </template>
      </el-row>
    </div>
    <div class="icon-content" v-show="activeName === 'fabicon'">
      <div class="title-bar"><i class="el-icon-s-grid"></i> FontAwesome 品牌图标 {{this.fabicon.length}} 个
        <el-button type="text" @click="faHelpShow = true" icon="el-icon-question"></el-button>
      </div>
      <el-row :gutter="0" :style="{backgroundColor: bg_color}">
        <template v-for="i in find_fabicon">
          <IconBox :icon="getIconName(i)" :span="b_span" :color="v_color" />
        </template>
      </el-row>
    </div>
    <div v-show="activeName === 'facate'">
      <div class="title-bar"><i class="el-icon-s-grid"></i> FontAwesome 图标分类
        <el-button type="text" @click="faHelpShow = true" icon="el-icon-question"></el-button>
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="side-nav">
            <el-menu @select="onCategorySelect">
              <template v-for="(k, i) in facate">
                <el-menu-item :index="`${i}`">
                  <template slot="title">
                    <i :class="getIconName(k.icons[0])"></i>
                    <span slot="title">{{k.cn_label}}</span>
                  </template>
                </el-menu-item>
              </template>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="18">
          <el-row class="category-content" :gutter="0" :style="{backgroundColor: bg_color}">
            <template v-for="i in facate[category].icons">
              <IconBox :icon="getIconName(i)" :span="b_span" :color="v_color" />
            </template>
          </el-row>
        </el-col>
      </el-row>
      <!-- <el-collapse accordion>
        <el-collapse-item v-for="k in facate" :key="k.label" :title="k.cn_label">
          <el-row :gutter="0" :style="{backgroundColor: bg_color}">
            <template v-for="i in k.icons">
              <IconBox :icon="`fa fa-${i}`" :span="b_span" :color="v_color" />
            </template>
          </el-row>
        </el-collapse-item>
      </el-collapse> -->
    </div>
    <el-dialog title="FontAwesome 字体库安装指南" :visible.sync="faHelpShow">
      <p>新的 PC WEB 基础库 (hx-pc-base) 已经内置，直接使用 &lt;i&gt; 标签加 class 即可。</p>
      <p>老项目需要先 <el-link type="danger" href="https://use.fontawesome.com/releases/v6.4.2/fontawesome-free-6.4.2-web.zip">下载字体库</el-link> ，解压放到assets目录；并在
        main.js 中引用css: <br><code>import "@/assets/fontawesome-free-6.4.2/css/all.css";</code> </p>
    </el-dialog>
  </el-card>
</template>

<script>
import elicon from "./el-icons.json";
import fabicon from "./fa-b-icons.json";
import faricon from "./fa-r-icons.json";
import fasicon from "./fa-s-icons.json";
import facate from "./fa-categorys.json";
import IconBox from "./IconBox.vue";

export default {
  data() {
    return {
      activeName: "elicon",
      icons: [],
      faHelpShow: false,
      v_span: "4",
      v_color: "#606266",
      bg_color: "#ffffff",
      elicon: elicon,
      fabicon: fabicon,
      faricon: faricon,
      fasicon: fasicon,
      facate: Object.values(facate),
      category: 0,
      search_form: {
        name: null,
      },
    };
  },
  components: {
    IconBox,
  },
  computed: {
    b_span() {
      return parseInt(this.v_span);
    },
    find_elicon() {
      if (!this.search_form.name) return this.elicon;
      return this.elicon.filter((i) => i.indexOf(this.search_form.name) > -1);
    },
    find_fabicon() {
      if (!this.search_form.name) return this.fabicon;
      return this.fabicon.filter((i) => i.indexOf(this.search_form.name) > -1);
    },
    find_faricon() {
      if (!this.search_form.name) return this.faricon;
      return this.faricon.filter((i) => i.indexOf(this.search_form.name) > -1);
    },
    find_fasicon() {
      if (!this.search_form.name) return this.fasicon;
      return this.fasicon.filter((i) => i.indexOf(this.search_form.name) > -1);
    },
  },
  methods: {
    onCategorySelect(index) {
      this.category = index;
    },
    getIconName(iname) {
      if(fabicon.indexOf(iname) > -1) return `fa fab fa-${iname}`;
      return `fa fa-${iname}`;
    }
  },
};
</script>

<style scoped>
.conf-form .el-form-item {
  border-right: 1px solid #c3c9de;
  padding-right: 10px;
  height: 35px;
}
.title-bar {
  height: 40px;
  margin-bottom: 20px;
  font-size: 40px;
}
.title-bar .el-button {
  font-size: 40px;
}
.side-nav{
  height: calc(100vh - 320px);
  overflow-y: scroll;
  border: 1px solid #e3e3e3;
}
.side-nav .el-menu-item{
  border-bottom: 1px solid #e3e3e3;
}
.icon-content{
  height: calc(100vh - 250px);
  overflow-y: scroll;
}
.category-content{
  height: calc(100vh - 320px);
  overflow-y: scroll;
}
</style>

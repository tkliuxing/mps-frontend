<template>
  <div class="sidebar">
    <el-menu
      class="menu"
      @select="onMenuSelect"
      text-color="#97989B"
      unique-opened
      mode="horizontal"
    >
      <el-menu-item index="SystemGuanLi">
        <i class="fa fa-globe"></i>
        <span slot="title">系统管理</span>
      </el-menu-item>
      <el-submenu index="document">
        <template slot="title">
          <i class="fa fa-solid fa-book-open"></i>
          <span slot="title">文档</span>
        </template>
        <el-menu-item index="compdocument">
          <i class="el-icon-edit"></i>
          <span slot="title">组件文档</span>
        </el-menu-item>
        <el-menu-item index="icons">
          <i class="el-icon-warning-outline"></i>
          <span slot="title">图标库</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="tmpl">
        <template slot="title">
          <i class="fa fa-solid fa-table-list"></i>
          <span>数据核心</span>
        </template>
        <el-submenu index="shujuyuan">
          <template slot="title">
            <i class="fa fa-solid fa-database" style="margin-left:4px;"></i>
            <span style="margin-left:5px;">数据源管理</span>
          </template>
          <el-menu-item index="basetree">
            <i class="el-icon-grape r180"></i>
            <span slot="title">分类树配置</span>
          </el-menu-item>
          <el-menu-item index="parameter">
            <i class="el-icon-grape r180"></i>
            <span slot="title">常参数据管理</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="template">
          <i class="el-icon-tickets"></i>
          <span slot="title">表单定义</span>
        </el-menu-item>
        <el-menu-item index="workflow">
          <i class="fa fa-regular fa-paper-plane"></i>
          <span slot="title">流程引擎</span>
        </el-menu-item>
        <el-menu-item index="reportconf">
          <i class="fa fa-solid fa-chart-line"></i>
          <span slot="title">报表配置</span>
        </el-menu-item>
        <el-menu-item index="fetl">
          <i class="fa fas fa-arrow-down-up-across-line"></i>
          <span slot="title">ETL</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="codereg">
        <template slot="title">
          <i class="fa fa-regular fa-newspaper"></i>
          <span>页面管理</span>
        </template>
        <el-menu-item index="coderouter"><i class="fa fa-regular fa-paper-plane"></i><span slot="title">页面路由</span></el-menu-item>
        <el-menu-item index="codemenu"><i class="fa far fa-rectangle-list"></i><span slot="title">页面菜单</span></el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
import { mapState } from "vuex";

export default {
  data() {
    return {
      collapse: false,
    };
  },
  methods: {
    onMenuSelect(name) {
      this.$router.push({ name });
    },

    //权限判断的方法
    hasPerm(name) {
      return this.userinfo.func_names.indexOf(name) > -1;
    },
  },
  computed: {
    ...mapState(["userinfo"]),
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  },
};
</script>

<style>
.el-submenu__title i[class^=fa]{
  margin-right:5px;
  font-size: 18px;
}
</style>

<style scoped>
.sidebar {
  height: 60px;
  line-height: 70px;
  /*width: 500px;*/
  float: left;
}

.menu {
  display: flex;
  align-items: center;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar > ul {
  height: 100%;
}

.r180{
  transform: rotate(180deg);
}
</style>

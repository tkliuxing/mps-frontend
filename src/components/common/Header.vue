<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <!--    <div class="collapse-btn" @click="collapseChage">-->
    <!--      <i v-if="!collapse" class="el-icon-s-fold"></i>-->
    <!--      <i v-else class="el-icon-s-unfold"></i>-->
    <!--    </div>-->
    <div class="logo">MPS管理系统</div>
    <v-sidebar></v-sidebar>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i v-if="!fullscreen" class="fa-solid fa-expand"></i>
            <i v-else class="fa-solid fa-compress"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userinfo.full_name || "未命名" }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled>{{currentSystemName}}</el-dropdown-item>
            <el-dropdown-item command="changeSys" icon="el-icon-set-up" divided>切换系统</el-dropdown-item>
            <el-dropdown-item command="changepwd" icon="el-icon-edit">修改密码</el-dropdown-item>
            <el-dropdown-item command="loginout" icon="el-icon-truck" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <ChangePWD :visable="showChangePWD" @close="closeChangePWD" />
    <el-dialog :visible.sync="changeSysVisible" :close-on-click-modal="false" center title="切换系统">
      <el-form label-width="100px" :model="system" ref="sysForm">
        <el-form-item label="选择系统" prop="currentSys" :rules="{required:true,message:'请选择系统'}">
          <el-select v-model="system.currentSys" style="width:90%" filterable>
            <el-option v-for="i in sys_list" :key="i.pk" :label="i.name" :value="i.sys_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="changeSysVisible = false" icon="el-icon-close">取消</el-button>
        <el-button @click="changeSysFn" type="primary" icon="el-icon-check">确定</el-button>
      </div>
    </el-dialog>
    <div style="clear: both;"></div>
  </div>
</template>
<script>
import vSidebar from "./Sidebar.vue";
import bus from "../common/bus";
import MailBox from "./MailBox.vue";
import ChangePWD from "./ChangePWD.vue";
import { mapState } from "vuex";
import { LOGOUT, SETSYSTEM, SETSYSTEMNAME } from "../../store";
import { getList } from '@/resource';
export default {
  data() {
    return {
      canFullScreen: false,
      showChangePWD: false,
      collapse: false,
      changeSysVisible: false,
      fullscreen: false,
      system: {
        currentSys: '',
      },
      name: "",
      sys_list: [],
      message: 2,
    };
  },
  components: { MailBox, ChangePWD, vSidebar },
  computed: {
    ...mapState(["userinfo", "currentSystemName"]),
  },
  methods: {
    async loadSystem() {
      let res = await getList('system')
      this.sys_list = res;
      if (this.$store.state.currentSystemId) {
        this.system.currentSys = this.$store.state.currentSystemId
      } else {
        if (res.length > 0) {
          this.$store.commit(SETSYSTEM, res[0].sys_id);
          this.$store.commit(SETSYSTEMNAME, res[0].name);
          this.system.currentSys = res[0].sys_id
        }
      }
    },
    closeChangePWD() {
      this.showChangePWD = false;
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === "loginout") {
        this.$store.commit(LOGOUT);
        this.$router.push("/login");
      } else if (command === "changeSys") {
        this.changeSysVisible = true;
      } else if (command === "changepwd") {
        this.showChangePWD = true;
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    async changeSysFn() {
      let valid = await new Promise(resolve => this.$refs.sysForm.validate(resolve))
      if (valid) {
        let sys_name = this.sys_list.find(i => i.sys_id === this.system.currentSys).name;
        this.$store.commit(SETSYSTEM, this.system.currentSys)
        this.$store.commit(SETSYSTEMNAME, sys_name);
        this.$notify({
          message: "设置成功!",
          duration: 1500,
          type: "success"
        })
        this.changeSysVisible = false;
        window.location.reload(); // 刷新页面
      }
    },
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
  created() {

    this.loadSystem()
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  /*height: 50px;*/
  font-size: 22px;
  border-bottom: solid 1px #e6e6e6;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 50px;
}

.header .logo {
  float: left;
  margin: 0 2rem;
  line-height: 60px;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 60px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>

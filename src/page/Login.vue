<template>
  <div class="login-wrap">
    <div v-if="isLogin" class="ms-login">
      <div class="ms-title">
        <span>系统登录</span>
        <i class="el-icon-setting login-settings" @click="showSettings"></i>
      </div>
      <el-form
          v-if="!loginType"
          :validate-on-rule-change="false"
          :model="param"
          :rules="rules"
          ref="login"
          label-width="0px"
          class="ms-content"
          v-loading="loginLoading"
      >
        <el-form-item prop="username">
          <el-input
              v-model="param.username"
              prefix-icon="el-icon-lx-people"
              placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              prefix-icon="el-icon-lx-lock"
              placeholder="密码"
              v-model="param.password"
              @keyup.enter.native="submitForm()"
          >
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
      </el-form>
    </div>

    <el-dialog
        title="设置"
        :visible.sync="show_settings"
        width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="后端地址">
          <el-input
              v-model="backend_url"
              placeholder="http://your_domain/api/v1"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetSettings">重 置</el-button>
        <el-button type="primary" @click="submitSettings">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import {LOGIN, USERINFO, SYSTEMLIST} from "@/store";
import {BACKEND_URL} from "../constvars";

export default {
  computed: {
    ...mapState(["token"]),
  },
  data() {
    return {
      isLogin: true,
      loginType: false,

      redirect: "/",
      show_settings: false,
      backend_url: "",
      //发送验证码后的按钮loading
      loading: false,

      //登录按钮的loading
      loginLoading: false,

      //验证码的form
      form: {
        phone: "",
        phone_access: "",
      },

      //验证码登录时的校验
      phoneCode: {
        phone: [
          {required: true, validator: this.checkPhone, trigger: "blur"},
        ],
        phone_access: [{required: true, message: "请输入验证码"}],
      },

      //用户名密码登录时的form
      param: {
        username: "",
        password: "",
        sys_id: 0,
      },

      //用户名密码登录时的校验
      rules: {
        username: [{required: true, message: "请输入用户名"}],
        password: [{required: true, message: "请输入密码"}],
      },
    };
  },
  methods: {
    ...mapMutations(["resetState"]),
    //用户名密码登录的方法
    submitForm() {
      this.$refs.login.validate((valid) => {
        if (valid) {
          this.loginLoading = true;
          this.$http
              .post("/auth/", this.param)
              .then((resp) => {
                this.$store.commit(LOGIN, resp.data.token);
                this.$http.get("/system/").then((res) => {
                  // localStorage.setItem('systemlist', JSON.stringify(res.data));
                  this.$store.commit(SYSTEMLIST, res.data);
                });
                return this.$http.get("/myinfo/").then((info_resp) => {
                  this.$store.commit(USERINFO, info_resp.data);
                  this.$message({
                    message: "登录成功！",
                    type: "success",
                    duration: 1000,
                    center: true,
                  });
                  this.$router.push(this.redirect);
                });
              })
              .catch((err) => {
                console.error(err);
                if (err.response && err.response.status === 400) {
                  this.$message.error({
                    message: "用户名或密码错误",
                    center: true,
                  });
                }
                if (err.response && err.response.status === 404) {
                  this.$message.error({
                    message: "地址配置错误",
                    center: true,
                  });
                }
              })
              .finally(()=>{
                this.loginLoading = false;
              });
        } else {
          this.$message.error("请输入账号和密码");
          console.log("error submit!!");
          return false;
        }
      });
    },
    showSettings(){
      this.backend_url = this.$store.state.backend_url;
      this.show_settings = true;
    },
    resetSettings(){
      // this.show_settings = false;
      this.backend_url = BACKEND_URL;
    },
    submitSettings(){
      this.show_settings = false;
      localStorage.setItem("backend_url", this.backend_url);
      this.$store.commit("BACKEND", this.backend_url);
    },
  },
  mounted() {
    if (this.$route.query.redirect) {
      this.redirect = this.$route.query.redirect;
    }
    if (this.token !== "") {
      this.$router.push(this.redirect);
    } else {
      this.resetState();
    }
    let backend_url = localStorage.getItem("backend_url");
    if (backend_url) {
      this.backend_url = backend_url;
      this.$store.commit("BACKEND", this.backend_url);
    } else {
      this.showSettings();
    }
  },
};
</script>

<style scoped>
.login-wrap {
  /*position: relative;*/
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}

body .el-scrollbar__wrap {
  overflow-x: hidden;
}

.login-settings {
  position: absolute;
  cursor: pointer;
  right: 20px;
  top: 15px;
  color: #2d8cf0;
}

.ms-title {
  position: relative;
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #333;
  border-bottom: 1px solid #ddd;
}

.back-btn {
  position: absolute;
  left: 10px;
  top: 10px;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 1);
  /*overflow: hidden;*/
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 65%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>

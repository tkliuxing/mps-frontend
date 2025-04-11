<template>
  <div>
    <el-form label-width="200px" :model="form" ref="form" :rules="rules">
      <el-form-item label='系统' prop="system" :rules='[{"required": true}]'>
        <el-select clearable filterable @change="systemChange" v-if="status==='新建'||status==='编辑'"
                   v-model="form.system">
          <el-option v-for="(item,index) in system_option_data" :label="item.name" :value="item.value"
                     :key="index"></el-option>
        </el-select>
        <span v-else>{{ form.system_display }}</span>
      </el-form-item>
      <el-form-item label='系统租户ID' prop="system_org" :rules='[{required: true,trigger:"blur"}]'>
        <el-select clearable filterable v-model="form.system_org">
          <el-option v-for="(item,index) in orgs" :label="item.name" :value="item.pk" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='邮件配置名称' prop="name" :rules='[{required: true}]'>
        <el-input  style="width:200px" v-model="form.name"/>
      </el-form-item>
      <el-form-item label='邮件服务器' prop="host" :rules='[{required: true}]'>
        <el-input  style="width:200px" v-model="form.host"/>
      </el-form-item>
      <el-form-item label='邮件服务器端口' prop="port" :rules='[{required: true}]'>
        <el-input  style="width:200px" v-model="form.port"/>
      </el-form-item>
      <el-form-item label='邮件服务器用户名' prop="username" :rules='[{required: true}]'>
        <el-input  style="width:200px" v-model="form.username"/>
      </el-form-item>
      <el-form-item label='邮件服务器密码' prop="password" :rules='[{required: true}]'>
        <el-input  style="width:200px" v-model="form.password"/>
      </el-form-item>
      <el-form-item label='使用SSL' prop="use_ssl" :rules='[{required: true}]'>
        <el-radio v-model="form.use_ssl" :label="true">是</el-radio>
        <el-radio v-model="form.use_ssl" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label='使用TLS' prop="use_tls" :rules='[{required: true}]'>
        <el-radio v-model="form.use_tls" :label="true">是</el-radio>
        <el-radio v-model="form.use_tls" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label='发件人邮箱' prop="from_email" :rules='[{required: true}]'>
        <el-input  style="width:200px" v-model="form.from_email"/>
      </el-form-item>
      <el-form-item label='发件人名称' prop="from_name" :rules='[{required: true}]'>
        <el-input  style="width:200px" v-model="form.from_name"/>
      </el-form-item>
      <div style="display:flex;justify-content:center;align-items:center">
        <el-button @click="clearClose">关闭</el-button>
        <el-button v-if="status!=='显示'" type="primary" @click="submit('form')">提交</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import resource from "@/resource";
import {mapState} from "vuex";

export default {
  name: "emailconfigform",
  props: {
    status: {
      type: String,
      default: "新建"
    },
    FormValueId: String,
  },
  computed:{
    ...mapState(["currentSystemId"])
  },
  data() {
    return {
      form: {
        "pk": "",
        "system": null,
        "system_org": null,
        "name": null,
        "host": null,
        "port": null,
        "username": null,
        "password": null,
        "use_ssl": null,
        "use_tls": null,
        "from_email": null,
        "from_name": null
      },
      rules:{},
      system_option_data: [], //定义system_option_data数据源
      sms_type_option_data: [], //定义sms_type_option_data数据源
      orgs: [],
    }
  },
  methods: {
    async system_fn() { //获取 system_option_data数据的函数
      let res = await this.$http.get("/system/");
      this.system_option_data = res.data.map(i => {
        return {name: i.name, value: i.pk,sys_id: i.sys_id}
      });
    },

    async systemChange(value) {
      let res = this.system_option_data.filter((i) => {
        return i.value === value;
      });
      this.form.system_org = null;
     if(res && res.length>0){
       this.orgs = await resource.getList('systemorg', {
         sys_id: res[0].sys_id
       });
     }
    },
    init() {
      if (this.status === '编辑' || this.status === '显示') {
        this.loadData();
      }
    },
    async loadData() {
      if (this.FormValueId) {
        let res = await this.$http.get("/emailconfig/" + this.FormValueId + "/")
        let obj = res.data;
        for (const key in obj) {
          if (key.startsWith("field")) {
            if (
                obj[key] &&
                typeof obj[key] === "string" &&
                obj[key].startsWith("[") &&
                obj[key].endsWith("]")
            ) {
              obj[key] = JSON.parse(obj[key]);
            }
          }
        }
        this.form = obj;
      }
    },
    clearClose() {
      this.form = {
        "pk": "",
        "system": null,
        "system_org": null,
        "name": null,
        "host": null,
        "port": null,
        "username": null,
        "password": null,
        "use_ssl": null,
        "use_tls": null,
        "from_email": null,
        "from_name": null
      };
      this.$emit("onClose");
    },
    async submit(formName) {
      let res;
      if (this.status === "新建") {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let data = this.translate_data(this.form);
            res = await this.$http.post("/emailconfig/", data);
            this.$message.success("新建成功!");
            this.$emit("onSubmit", res.data);
            this.clearClose();
          } else {
            this.$message.error("请检查所填项!");
            return false;
          }
        });
      } else if (this.status === "编辑") {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let data = this.translate_data(this.form);
            res = await this.$http.put("/emailconfig/" + this.form.pk + "/", data);
            this.$message.success("编辑成功!");
            this.$emit("onSubmit", res.data);
            this.clearClose();
          } else {
            this.$message.error("请检查所填项!");
            return false;
          }
        });
      }
    },
    translate_data(data) {
      for (const key in data) {
        if (Object.prototype.toString.call(data[key]) === "[object Array]") {
          data[key] = JSON.stringify(data[key]);
        }
      }
      return data
    },
    async getOrgs(){
      try {
        this.orgs = await resource.getList('systemorg', {
          sys_id: this.currentSystemId.sys_id
        });
      }catch (e) {

      }
    },
  },
  created() {
    this.init();
    this.system_fn(); //调用获取system_option_data数据源函数
    this.getOrgs();
  }
}
</script>

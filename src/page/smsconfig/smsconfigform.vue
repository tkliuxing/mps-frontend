<template>
  <div>
    <el-form label-width="200px" :model="form" ref="form">
      <el-form-item label='系统' prop="system" :rules='[{"required": true}]'>
        <el-select clearable="true" filterable="true" @change="systemChange" v-if="status==='新建'||status==='编辑'"
                   v-model="form.system">
          <el-option v-for="(item,index) in system_option_data" :label="item.name" :value="item.value"
                     :key="index"></el-option>
        </el-select>
        <span v-else>{{ form.system_display }}</span>
      </el-form-item>
      <el-form-item label='名称' prop="name" :rules='[{required: true}]'>
        <el-input v-if="status==='新建'||status==='编辑'" style="width:200px" v-model="form.name"/>
        <span v-else>{{ form.name }}</span>
      </el-form-item>
      <el-form-item label='平台类型' prop="sms_type" :rules='[]'>
        <el-select @change="sms_typeChange" v-if="status==='新建'||status==='编辑'" v-model="form.sms_type">
          <el-option v-for="(item,index) in sms_type_option_data" :label="item.name" :value="item.value"
                     :key="index"></el-option>
        </el-select>
        <span v-else>{{ form.sms_type_display }}</span>
      </el-form-item>
      <el-form-item label='是否启用' prop="is_enabled" :rules='[]'>
        <el-radio-group @change="is_enabledChange" v-if="status==='新建'||status==='编辑'" v-model.number="form.is_enabled">
          <el-radio v-for="(item,index) in is_enabled_option_data" :label="item.value" :key="index">{{ item.name }}
          </el-radio>
        </el-radio-group>
        <span v-else>{{ form.is_enabled }}</span>
      </el-form-item>
      <el-form-item label='发送接口URL' prop="post_url" :rules='[]'>
        <el-input v-if="status==='新建'||status==='编辑'" style="width:200px" v-model="form.post_url"/>
        <span v-else>{{ form.post_url }}</span>
      </el-form-item>
      <el-form-item label='App Key' prop="app_key" :rules='[]'>
        <el-input v-if="status==='新建'||status==='编辑'" style="width:200px" v-model="form.app_key"/>
        <span v-else>{{ form.app_key }}</span>
      </el-form-item>
      <el-form-item label='App ID' prop="app_id" :rules='[]'>
        <el-input v-if="status==='新建'||status==='编辑'" style="width:200px" v-model="form.app_id"/>
        <span v-else>{{ form.app_id }}</span>
      </el-form-item>
      <el-form-item label='短信模板ID' prop="template_id" :rules='[]'>
        <el-input v-if="status==='新建'||status==='编辑'" style="width:200px" v-model="form.template_id"/>
        <span v-else>{{ form.template_id }}</span>
      </el-form-item>
      <el-form-item label='短信模板签名' prop="template_sign" :rules='[]'>
        <el-input v-if="status==='新建'||status==='编辑'" style="width:200px" v-model="form.template_sign"/>
        <span v-else>{{ form.template_sign }}</span>
      </el-form-item>
      <el-form-item label='腾讯云APPID' prop="tencent_cloud_appid" :rules='[]'>
        <el-input v-if="status==='新建'||status==='编辑'" style="width:200px" v-model="form.tencent_cloud_appid"/>
        <span v-else>{{ form.tencent_cloud_appid }}</span>
      </el-form-item>
      <el-form-item label='腾讯云SECRETKEY' prop="tencent_cloud_secretkey" :rules='[]'>
        <el-input v-if="status==='新建'||status==='编辑'" style="width:200px" v-model="form.tencent_cloud_secretkey"/>
        <span v-else>{{ form.tencent_cloud_secretkey }}</span>
      </el-form-item>
      <div style="display:flex;justify-content:center;align-items:center">
        <el-button @click="clearClose">关闭</el-button>
        <el-button v-if="status!=='显示'" type="primary" @click="submit('form')">提交</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "smsconfigform",
  props: {
    status: {
      type: String,
      default: "新建"
    },
    FormValueId: String,
  },
  data() {
    return {
      form: {
        "name": "",
        "system": null,
        "sms_type": null,
        "is_enabled": null,
        "post_url": null,
        "app_key": null,
        "app_id": null,
        "template_id": null,
        "template_sign": null,
        "tencent_cloud_appid": null,
        "tencent_cloud_secretkey": null,
        "template": "9abff84f-63f8-45cf-a032-1cc52e23fff4"
      },
      system_option_data: [], //定义system_option_data数据源
      sms_type_option_data: [], //定义sms_type_option_data数据源
      is_enabled_option_data: [], //定义is_enabled_option_data数据源
    }
  },
  methods: {
    async system_fn() { //获取 system_option_data数据的函数
      let res = await this.$http.get("/system/");
      this.system_option_data = res.data.map(i => {
        return {name: i.name, value: i.pk}
      });
    }, sms_type_fn() { //获取 sms_type_option_data数据的函数
      this.sms_type_option_data = [{"name": "腾讯云", "value": "TENCENT"}, {"name": "聚合数据", "value": "JUHE"},
        {"name": "景鸿商旅", "value": "JHSL"}
      ];
    }, is_enabled_fn() { //获取 is_enabled_option_data数据的函数
      this.is_enabled_option_data = [
        {
          "name": "是",
          "value": "true"
        },
        {
          "name": "否",
          "value": "false"
        }
      ]
    },
    systemChange(value) {
      let res = this.system_option_data.filter((i) => {
        return i.value === value;
      });
      if ("system".startsWith("field")) {
        this.form["system_display"] = res[0].name;
      }

    },
    sms_typeChange(value) {

    },
    is_enabledChange(value) {
      let res = this.is_enabled_option_data.filter((i) => {
        return i.value === value;
      });
      if ("is_enabled".startsWith("field")) {
        this.form["is_enabled_display"] = res[0].name;
      }
    },
    init() {
      if (this.status === '编辑' || this.status === '显示') {
        this.loadData();
      }
    },
    async loadData() {
      if (this.FormValueId) {
        let res = await this.$http.get("/smsconfig/" + this.FormValueId + "/")
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
        "name": "",
        "system": null,
        "sms_type": null,
        "is_enabled": null,
        "post_url": null,
        "app_key": null,
        "app_id": null,
        "template_id": null,
        "template_sign": null,
        "tencent_cloud_appid": null,
        "tencent_cloud_secretkey": null,
        "template": "9abff84f-63f8-45cf-a032-1cc52e23fff4"
      };
      this.$emit("onClose");
    },
    async submit(formName) {
      let res;
      if (this.status === "新建") {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let data = this.translate_data(this.form);
            res = await this.$http.post("/smsconfig/", data);
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
            res = await this.$http.put("/smsconfig/" + this.form.pk + "/", data);
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
    handleExceed(files) {
      this.$message.warning("当前限制选择 1 个文件，本次选择了" + files.length + "个文件");
    },
  },
  created() {
    this.init();
    this.system_fn(); //调用获取system_option_data数据源函数
    this.sms_type_fn(); //调用获取sms_type_option_data数据源函数
    this.is_enabled_fn(); //调用获取is_enabled_option_data数据源函数


  }
}
</script>

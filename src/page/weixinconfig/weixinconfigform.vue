<template>
  <div>
    <el-form label-width="200px" :model="form" ref="form">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label='所属机构' prop="system_org" :rules='[{"required": true}]'>
            <el-select clearable filterable v-if="status==='新建'||status==='编辑'"
                       v-model="form.system_org">
              <el-option v-for="(item,index) in orgs" :label="item.name" :value="item.pk"
                         :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label='是否默认' prop="is_default" :rules='[]'>
            <el-radio v-model="form.is_default" :label="true">是</el-radio>
            <el-radio v-model="form.is_default" :label="false">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
        </el-col>
        <el-col :span="8">
          <el-divider content-position="left">微信公众号</el-divider>
          <div class="wxcard">
            <el-form-item label='微信公众号名称' prop="mp_name">
              <el-input v-model="form.mp_name"/>
            </el-form-item>
            <el-form-item label='微信公众号AppID' prop="mp_aid">
              <el-input v-model="form.mp_aid"/>
            </el-form-item>
            <el-form-item label='微信公众号AppSecret' prop="mp_sk">
              <el-input v-model="form.mp_sk"/>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <el-divider content-position="left">微信小程序</el-divider>
          <div class="wxcard">
            <el-form-item label='微信小程序名称' prop="wxa_name">
              <el-input v-model="form.wxa_name"/>
            </el-form-item>
            <el-form-item label='微信小程序AppID' prop="wxa_aid">
              <el-input v-model="form.wxa_aid"/>
            </el-form-item>
            <el-form-item label='微信小程序AppSecret' prop="wxa_sk">
              <el-input v-model="form.wxa_sk"/>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <el-divider content-position="left">微信支付</el-divider>
          <div class="wxcard">
            <el-form-item label='微信支付商户号' prop="mch_id">
              <el-input v-model="form.mch_id"/>
            </el-form-item>
            <el-form-item label='微信支付商户key' prop="mch_api_key">
              <el-input v-model="form.mch_api_key"/>
            </el-form-item>
            <el-form-item label='微信支付子商户号' prop="mch_sub_id">
              <el-input v-model="form.mch_sub_id"/>
            </el-form-item>
            <el-form-item label='微信支付商户证书路径' prop="mch_cert">
              <el-input v-model="form.mch_cert"/>
            </el-form-item>
            <el-form-item label='微信支付商户证书私钥路径' prop="mch_key">
              <el-input v-model="form.mch_key"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div style="display:flex;justify-content:center;align-items:center; margin-top:10px;">
        <el-button @click="clearClose">关闭</el-button>
        <el-button v-if="status!=='显示'" type="primary" @click="submit('form')">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>

const EMPTY_FORM = {
  'system': null,
  'system_org': null,
  'is_default': false,
  'mp_name': null,
  'mp_aid': null,
  'mp_sk': null,
  'wxa_name': null,
  'wxa_aid': null,
  'wxa_sk': null,
  'mch_api_key': null,
  'mch_id': null,
  'mch_sub_id': null,
  'mch_cert': null,
  'mch_key': null,
}
export default {
  name: "weixinconfigform",
  props: {
    status: {
      type: String,
      default: "新建"
    },
    FormValueId: String,
    orgs: {
      type: Array,
      default: () => []
    },
    system_id: String,
  },
  data() {
    return {
      form: {
        ...EMPTY_FORM
      },
    }
  },
  methods: {
    // 获取表单数据
    async loadData() {
      if (this.FormValueId) {
        let res = await this.$http.get("/wechatconfig/" + this.FormValueId + "/");
        this.form = res.data;
      }
    },
    clearClose() {
      this.form = {
        ...EMPTY_FORM
      };
      this.$emit("onClose");
    },
    // 提交表单
    async submit(formName) {
      let res;
      this.form.system = this.system_id;
      let valid = await new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          resolve(valid);
        });
      });
      console.log(formName,'formname')
      if(!valid){
        this.$message.error("请检查表单填写是否正确");
        return;
      }
      if (!this.form.pk) {
        let data = {...this.form};
        res = await this.$http.post("/wechatconfig/", data);
        this.$message.success("新建成功!");
        this.$emit("onSubmit", res.data);
        this.clearClose();
      } else {
        let data = this.translate_data(this.form);
        res = await this.$http.put("/wechatconfig/" + this.form.pk + "/", data);
        this.$message.success("编辑成功!");
        this.$emit("onSubmit", res.data);
        this.clearClose();
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
  },
  created() {
    this.loadData();
  }
}
</script>

<style>
.wxcard {
  min-height: 260px;
  padding: 10px 10px 0;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
}
</style>

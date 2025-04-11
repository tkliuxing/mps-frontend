<template>
<el-card class="generateuni">

  <div slot="header" class="clearfix">
    <span>UNI-APP 页面生成</span>
  </div>
  <el-form ref="form" inline :model="form" :rules="rules">
    <el-form-item label="业务子系统">
      <el-select v-model="form.biz_id" @change="listTypeChange">
        <el-option
          v-for="item in biz_ids"
          :key="item.biz_id"
          :label="`${item.biz_id}: ${item.name}`"
          :value="item.biz_id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择模板" prop="json">
      <el-select
        v-model="form.json"
        filterable
        @change="template_change"
        :disabled="form.sys_id === ''"
      >
        <el-option
          v-for="item in templateList"
          :key="item.pk"
          :label="item.title"
          :value="item.pk"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文件名">
      <el-input v-model="form.title" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="showDialog">代码生成</el-button>
    </el-form-item>
  </el-form>

  <el-dialog :visible.sync="indexFormVisable" title="列表页配置">
    <el-form :model="index_form" ref="IndexForm" label-width="150px">
      <el-form-item label="列表元素标题" prop="title" :rules="[{required:true, message:'标题是必选', trigger: 'change'}]">
        <el-select v-model="index_form.title" clearable filterable>
          <el-option v-for="field in field_list" :key="field.pk" :value="field.alias" :label="field.col_title"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="副标题" prop="sub_title">
        <el-select v-model="index_form.sub_title" clearable filterable>
          <el-option v-for="field in field_list" :key="field.pk" :value="field.alias" :label="field.col_title"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="右侧文字" prop="right">
        <el-select v-model="index_form.right" clearable filterable>
          <el-option v-for="field in field_list" :key="field.pk" :value="field.alias" :label="field.col_title"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="info" plain @click="cancel">取消</el-button>
        <el-button type="primary" @click="exportFile">生成</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-card>
</template>

<script>
import juicer from "juicer";
import JSZIP from "jszip";
import FileSaver from "file-saver";
import { mapState } from "vuex";
import {widgetsMap, in_input} from "../FieldWidgets/components";
import generate_form from "./generate_form";
import generate_index from "./generate_index";

export default {
  name: 'GenerateUni',
  data() {
    return {
      form: {
        sys_id: "",
        biz_id: 1,
        title: "",
        json: "",
      },
      biz_ids: [{name:'默认', biz_id:1}],
      templateList: [],
      rules: {
        sys_id: [{ required: true, message: "请选择系统" }],
        json: [{ required: true, message: "请选择模板" }],
      },
      field_list: [],
      indexFormVisable: false,
      index_form: {
        title: "",
        sub_title: "",
        right: "",
      },
    };
  },
  computed: {
    ...mapState(["systemlist", "currentSystemId"]),
  },
  methods: {
    async showDialog(){
      let valid = await new Promise((resolve) =>
        this.$refs.form.validate((validate) => resolve(validate))
      );
      if(!valid){
        this.$message.error('请检查表单');
        return;
      };
      this.index_form = {
        title: "",
        sub_title: "",
        right: "",
      };
      this.indexFormVisable = true;
      setTimeout(() => {
        this.$refs.IndexForm.resetFields();
      }, 100);
    },
    cancel(){
      this.index_form = {
        title: "",
        sub_title: "",
        right: "",
      };
      this.$refs.IndexForm.resetFields();
      this.indexFormVisable = false;
    },
    template_field_rander(template, form_name='form'){
      template.additional_fields = [];

      const field_parse = (field) => {
        let widget = widgetsMap[field.widget];
        if(field.data){
          try{
            widget = JSON.parse(field.data);
          } catch (e) {
            console.error(e);
          }
        }
        if(!widget){
          this.$message.error(`未找到组件${field.widget}`);
          throw new Error(`未找到组件${field.widget}`);
        }
        let context = {
          model: `${form_name}.${field.alias}`,
          alias: field.alias,
          data_source: null,
          data_url: '',
          params: '',
          value_field:  '',
          name_field: '',
          related_alias: widget.related_alias || '',
        };
        if(field.local_data_source){
          context.data_source = JSON.parse(field.local_data_source);
          context.data_url = context.data_source.url;
          context.params = context.data_source.params;
          context.value_field = context.data_source.value_field;
          context.name_field = context.data_source.name_field;
        }
        field.rules = widget.rules || null;
        field.data_url = context.data_url;
        field.params = context.params;
        field.name_field = context.name_field;
        field.value_field = context.value_field;
        field.widget_str = juicer(widget.template, context);
        field.in_input = in_input(field.widget);
        if(widget.method_js){
          field.method_js = juicer(widget.method_js, context);
        }
        if(widget.search_method_js){
          field.search_method_js = juicer(widget.search_method_js, context);
        }
        if(widget.mounted_js){
          field.mounted_js = juicer(widget.mounted_js, context);
        }
        if(widget.additional_field){
          template.additional_fields.push(juicer(widget.additional_field, context));
        }
        return field;
      }
      template.has_ueditor = !!template.field.find((item)=>item.widget == 'ueditor');
      template.field = template.field.map(field_parse);
      return template;
    },
    template_change(val){
      if(!val){
        this.field_list = [];
        return;
      }
      let template = this.templateList.filter((i) => {
        return i.pk === val;
      })[0];
      if(!this.form.title){
        this.form.title = template.title;
      }
      this.field_list = template.field;
    },
    async exportFile() {
      let valid = await new Promise((resolve) =>
        this.$refs.IndexForm.validate((validate) => resolve(validate))
      );
      if(!valid){
        this.$message.error('请检查表单');
        return;
      };
      if (valid) {
        try {
          let template = this.templateList.filter((i) => {
            return i.pk === this.form.json;
          })[0];
          template = this.template_field_rander(template);
          template.index_form = {...this.index_form};
          let form = generate_form(template);
          let container = generate_index(template);
          let zip = new JSZIP();
          zip.file("Index.vue", container);
          zip.file("Form.vue", form);
          zip.file(
            "页面使用说明.txt",
            "Index.vue为主页面，使用时替换为自己的文件名,\nForm.vue为表单页"
          );
          zip.generateAsync({ type: "blob" }).then((res) => {
            FileSaver(res, `${this.form.title || "common"}.zip`);
          });
          this.cancel();
        } catch (error) {
          console.log(error);
          this.$message.error("生成失败!");
        }
      }
    },
    async loadTemplate() {
      let res = await this.$http.get("/formtemplate/", {
        params: { sys_id: this.form.sys_id, biz_id: this.form.biz_id },
      });
      this.templateList = res.data;
    },
    listTypeChange(val) {
      this.form.biz_id = val;
      this.form.json = "";
      this.loadTemplate();
    },
    async loadBiz(){
      this.form.biz_id = 1;
      this.form.json = "";
      let params = {
        sys_id: this.currentSystemId
      };
      let res = await this.$http.get("/systembiz/", { params });
      this.biz_ids = res.data;
      if(this.biz_ids.length === 0){
        this.biz_ids = [{name:'默认', biz_id:1}];
      }
    },
  },
  async created() {
    this.form.sys_id = this.currentSystemId;
    await this.loadBiz();
    await this.loadTemplate();
  },
  watch: {
    sys_id(val) {
      this.loadData();
    },
    biz_id(val) {
      this.loadData();
    },
  },
};
</script>

<style scoped>

</style>

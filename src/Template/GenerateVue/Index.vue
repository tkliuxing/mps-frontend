<template>
  <el-card class="generatevue">
    <div slot="header" class="clearfix">
      <span>PC端页面生成</span>
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
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportFile">代码生成</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import juicer from "juicer";
import JSZIP from "jszip";
import FileSaver from "file-saver";
import { mapState } from "vuex";
import {widgetsMap} from "../FieldWidgets/components";
import {
  generate_form,
  generate_index,
  generate_detail,
  generate_table,
  generate_import,
  generate_mixin,
  generate_model
} from "./generate.js";
import generate from "./generate";
import { getList } from '@/resource';

export default {
  data() {
    return {
      form: {
        sys_id: "",
        biz_id: 1,
        title: "",
        json: "",
      },
      sys_list: [],
      biz_ids: [{name:'默认', biz_id:1}],
      templateList: [],
      rules: {
        sys_id: [{ required: true, message: "请选择系统" }],
        json: [{ required: true, message: "请选择模板" }],
      },
    };
  },
  computed: {
    ...mapState(["systemlist", "currentSystemId"]),
  },
  methods: {
    template_field_rander(template, form_name='form'){
      template.additional_fields = [];
      template.EN_NAME = this.form.title;

      const field_parse = (field) => {
        let widget = widgetsMap[field.widget];
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
        if(context.params && context.params.org_id != 0){
          context.params.org_id = 'this.userinfo.org_id'
        }
        field.params = context.params || {};
        field.name_field = context.name_field;
        field.value_field = context.value_field;
        field.widget_str = juicer(widget.template, context);
        if(form_name == 'searchForm'){
          field.widget_str = field.widget_str.replace(' :disabled="readonly"', '');
        }
        if(widget.method_js){
          field.method_js = juicer(widget.method_js, context);
        }
        if(widget.search_method_js){
          field.search_method_js = juicer(widget.search_method_js, context);
        }
        if(widget.mounted_js){
          field.mounted_js = juicer(widget.mounted_js, context);
        }
        if(widget.created_js){
          field.created_js = juicer(widget.created_js, context);
        }
        if(widget.additional_field){
          template.additional_fields.push(juicer(widget.additional_field, context));
        }
        return field;
      }

      template.has_ueditor = !!template.field.find((item)=>item.widget == 'ueditor');
      template.has_image = !!template.field.find((item)=>item.widget == 'image');
      template.has_file = !!template.field.find((item)=>item.widget == 'file');

      template.field = template.field.map(field_parse);
      return template;
    },
    async exportFile() {
      let valid = await new Promise((resolve) =>
        this.$refs.form.validate((validate) => resolve(validate))
      );
      if (valid) {
        try {
          let template = this.templateList.filter((i) => {
            return i.pk === this.form.json;
          })[0];
          template = this.template_field_rander(template);
          let data_import = generate_import(template);
          let form = generate_form(template);
          let container = generate_index(template);
          let table = generate_table(template);
          let detail = generate_detail(template);
          template = this.template_field_rander(template, 'searchForm');
          // let container = generate_index(template);
          // let table = generate_table(template);
          let mixin = generate_mixin(template);
          // let detail = generate_detail(template);
          let model = generate_model(template);
          let zip = new JSZIP();
          zip.file("ImportData.vue", data_import);
          zip.file("Index.vue", container);
          zip.file("Form.vue", form);
          zip.file("Table.vue", table);
          zip.file("mixin.js", mixin);
          zip.file("Detail.vue", detail);
          zip.file("model.js", model);
          zip.file(
            "页面使用说明.txt",
            "Index.vue为主页面，使用时替换为自己的文件名,\nForm和Detail可单独使用(引入相应的组件即可),也可在Index.vue中引用,\nForm.vue为表单页,\nmixin为数据源,\nTable.vue为表格页,\nDetail.vue为数据详情页,\nImportData.vue为Excel相关操作页,\nmodel.js为数据模型"
          );
          zip.generateAsync({ type: "blob" }).then((res) => {
            FileSaver(res, `${this.form.title || "common"}.zip`);
          });
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
      this.page = 1;
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
};
</script>

<style></style>

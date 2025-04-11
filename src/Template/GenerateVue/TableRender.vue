<template>
  <div>
    <el-dialog append-to-body
               :close-on-click-modal="false"
               destroy-on-close
               title="表单生成"
               :visible.sync="isDialogVisible"
               width="50%">
      <el-form :model="form" ref="form" label-width="100px" :rules="rules" label-position="top">
        <el-form-item label="文件名：" prop="file_name">
          <el-input v-model="form.file_name" clearable placeholder="请输入文件名" style="width: 80%;"></el-input>
        </el-form-item>
        <el-divider v-if="sortValue.length>0"/>
        <el-form-item label="排列字段及排列方式：" style="height: 250px;overflow: auto" v-if="sortValue.length>0">
          <div v-for="(item,index) in sortTable" :key="index" style="margin: 10px 0;">
            <el-row>
              <el-col :span="10">
                <el-select style="width: 100%" clearable v-model="item.value" placeholder="请选择要排序的字段">
                  <el-option
                    v-for="item in sortValue"
                    :key="item.pk"
                    :label="item.col_title"
                    :value="item.alias">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8" style="margin-left: 10px">
                <el-tooltip class="item" effect="light" content="从大到小排列" placement="top-start">
                  <el-radio v-model="item.sortRule" label="-">
                    倒序
                  </el-radio>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="从小到大排列" placement="top-start">
                  <el-radio v-model="item.sortRule" label="">
                    正序
                  </el-radio>
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" plain icon="el-icon-plus" :disabled="sortValue.length == sortTable.length" circle @click="addRow"></el-button>
                <el-button type="danger" plain icon="el-icon-minus" circle v-if="sortTable.length>1" @click="delRow(index)"></el-button>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" plain @click="$emit('dialog',false)">取 消</el-button>
        <el-button type="primary" @click="exportVal">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import JSZIP from "jszip";
import {widgetsMap} from "@/Template/FieldWidgets/components";
import {
  generate_detail,
  generate_form,
  generate_import,
  generate_index,
  generate_mixin, generate_model,
  generate_table
} from "@/Template/GenerateVue/generate";
import juicer from "juicer";
import FileSaver from "file-saver";
import api_fields from "../database_field";

export default {
  name:'tableRender',
  data(){
    return{
      generate_import,
      generate_detail,
      generate_form,
      generate_index,
      generate_mixin,
      generate_model,
      generate_table,
      template: null,
      file_name: null,
      sortTable:[
        {value:'',sortRule:'-'}
      ],
      api_fields: JSON.parse(JSON.stringify(api_fields)),
      form:{
        file_name: null,
      },
      rules:{
        file_name: [
          { required: true, message: '文件名为必填', trigger: 'blur' },
          { pattern: /^[a-zA-Z_]+$/, message: '只能包含字母和下划线', trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    isDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(value) {
        this.$emit('dialog', value);
      }
    }
  },
  props:{
    dialogVisible:{
      type:Boolean,
      default: false,
    },
    formTem:{
      type:Object,
      default: {}
    },
    sortValue:{
      type:Array,
      default: []
    }
  },
  methods:{
    addRow(){
      this.sortTable.push({
        value: null,
        sortRule: '-',
      });
    },
    delRow(index){
      this.sortTable.splice(index, 1);
    },
    async exportVal(){
      if(!this.form.file_name){
        return this.$message.error('文件名不能为空')
      }
      let valid = await new Promise(resolve => this.$refs.form.validate(validate => resolve(validate)));
      if (valid) {
        // let title = await resource.createObj('utils-pinyin', {origin_string: this.form.file_name});
        // let pinyin_name;
        //
        // if(title.pinyin.length>0){
        //   pinyin_name = title.pinyin.join('')
        // }

        let arr = [];
        this.sortTable.forEach(item=>{
          arr.push(item.sortRule +''+item.value)
        })
        arr.push('-create_time')
        arr = arr.filter(item=> item != '' && item != '-')
        this.exportFile(this.formTem,'searchForm',this.form.file_name,arr.join(','));
        this.$emit('dialog',false)
      }
    },
    exportFile(temp,val,file_name,sort_alias){
      let template;
      template = this.template_field_render(temp,'form',this.file_name);
      let data_import = this.generate_import(template);
      let form = this.generate_form(template);
      template = this.template_field_render(template, val,file_name,sort_alias);
      let container = this.generate_index(template);
      let table = this.generate_table(template);
      let mixin = this.generate_mixin(template);
      let detail = this.generate_detail(template);
      let model = this.generate_model(template);
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
        "Index.vue为主页面，使用时替换为自己的文件名,\nForm和Detail可单独使用(引入相应的组件即可),也可在Index.vue中引用,\nForm.vue为表单页,\nmixin为数据源,\nTable.vue为表格页,\nDetail.vue为数据详情页,\nImportData.vue为Excel相关操作页,\nmodel.js为数据模型,\n需要注意的是： 如果提交的数据需要转换成json字符串格式的话，请移步到model.js文件中的serialize和constructor方法中参考示例并做相应的处理"
      );
      zip.generateAsync({ type: "blob" }).then((res) => {
        FileSaver(res, `${file_name}.zip`);
      });
    },
    template_field_render(template, form_name='form',value,sort=null){
      let field = template.field;
      // 用于生成表单时，获取数据库字段为obj_id 字段的alias
      let obj_id_field = field.find((item)=>item.col_name == 'obj_id' && item.related_template);
      let alias = obj_id_field ? obj_id_field.alias : '';
      template.additional_fields = [];
      template.EN_NAME = value;
      template.alias = alias;
      template.sortAlias = sort;
      template.name = template.title;
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
        // 使用file，image组件时，title为文件名当作文件分类使用
        if(['file','image'].includes(field.widget)){
          context.title = template.title;
        }
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
          if(widget.search_template){
            let db_desc = this.find_database_field(template, field);
            context['is_datetime'] = db_desc && db_desc.label.indexOf('timestamp with timezone') > -1;
            field.widget_str = juicer(widget.search_template, context);
          }else{
            if(field.widget == 'input'){
              field.widget_str = field.widget_str.replace(':disabled="readonly"', ' @keyup.enter.native="loadData" ');
            }else{
              field.widget_str = field.widget_str.replace(':disabled="readonly"', '')
            }

          }
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

    find_database_field(template, field){
      let category = this.api_fields[template.api_name];
      if(!category){
        return null;
      }
      let field_obj = category.find((item)=>item.value == field.col_name);
      if(!field_obj){
        return null;
      }
      return field_obj;
    }
  }
}
</script>

<style scoped>

</style>

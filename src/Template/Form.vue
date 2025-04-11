<template>
  <fieldset class="ziduan">
    <legend>
      <h4>模板字段</h4>
    </legend>
    <el-form
      label-width="150px"
      :model="value"
      ref="ruleForm"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            v-if="value.is_related"
            prop="col_name"
            lable="数据库字段"
            :rules="{ validator: validateDbField, required: true, trigger: 'blur' }"
          >
            <el-select
              v-model.trim="value.col_name"
              @change="fillTitleAndName"
            >
              <el-option
                v-for="item in relTemplate.fields"
                :key="item.pk"
                :label="`${item.col_title} ${item.col_name}`"
                :value="item.col_name"
              >
              </el-option>
            </el-select>
            <span class="meme">关联模板中的数据库字段。</span>
          </el-form-item>
          <el-form-item
            v-else
            prop="col_name"
            label="数据库字段"
            :rules="{ validator: validateDbField, required: true, trigger: 'blur' }"
          >
            <el-autocomplete
              v-model.trim="value.col_name"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearch"
            >
              <el-button
                slot="append"
                icon="el-icon-more"
                @click="showFieldList = true"
              ></el-button>
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <span class="lab">{{ item.label }}</span>
              </template>
            </el-autocomplete>
            <span class="meme">对应数据表的字段名。</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="relTemplate && value.col_name != 'obj_id'">
          <el-form-item label="是否为关联字段">
            <el-radio-group v-model.trim="value.is_related">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <span class="meme">是否是关联其他模板字段的<strong>只读</strong>内容。当模板配置了<strong>obj_id</strong>字段并关联了其他模板后即可使用关联字段。</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="value.col_name == 'obj_id'">
          <el-form-item
            label="所属模版"
            prop="related_template"
          >
            <el-select
              v-model.trim="value.related_template"
              clearable
            >
              <el-option
                v-for="item in templateList"
                :label="item.title"
                :value="item.pk"
                :key="item.pk"
              />
            </el-select>
            <span class="meme">需要关联获取的模版。</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="hengxian"></div>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="字段名称"
            prop="col_title"
            :rules="{ required: true, message: '必填项!',}"
          >
            <el-input v-model.trim="value.col_title" />
            <span class="meme">需用中文标识字段含义。</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="字段别名"
            prop="alias"
            :rules="{
          required: true,
          validator: validateAliasField,
          trigger: 'blur',
        }"
          >
            <el-input v-model.trim="value.alias"/>
            <span class="meme">代码中的字段变量名称。</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="hengxian"></div>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="控件类型"
            prop="widget"
            :rules="{
          required: true,
          trigger: 'blur',
        }"
          >
            <div>
              <div style="display: inline-block;width: 65%;margin-right:10px;text-align: center;">
                <el-tag style="width: auto;" type="info" effect="dark" size="mini">{{getWidgetName()}}</el-tag>
              </div>
              <div style="display: inline-block;width: 30%;">
                <el-button type="primary" @click="showWidgetSelect=true">选择</el-button>
              </div>
            </div>
            <span class="meme">表单控件类型。用代码生成器导出表单代码时会根据此项来生成对应控件。</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="value.local_data_source"
            label="数据来源"
            prop="local_data_source"
          >
            <div style="display: inline-block;width: 30%;">
              <el-button
                @click="showJSONseditor('local_data_source')"
                type="primary"
              >查看
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="hengxian"></div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否为查询条件">
            <el-radio-group v-model.trim="inFilter" >
              <el-radio :label="true" :disabled="isDisabled">是</el-radio>
              <el-radio :label="false" :disabled="isDisabled">否</el-radio>
            </el-radio-group>
            <span class="meme">是否是需要进行查询筛选的字段。如果是查询条件则可在query参数中传入此字段和对应的查询值。</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否为隐藏输入">
            <el-radio-group v-model.trim="value.is_required">
              <el-radio :label="true">否</el-radio>
              <el-radio :label="false">是</el-radio>
            </el-radio-group>
            <span class="meme">是否在生成时隐藏这个字段的输入框。</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在移动端显示">
            <el-radio-group v-model.trim="value.is_vant_show">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
            <span class="meme">是否vant中显示此字段。</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否约束唯一">
            <el-radio-group v-model.trim="value.unique">
              <el-radio :disabled="isDisabledFilter" :label="false">否</el-radio>
              <el-radio :disabled="isDisabledFilter" :label="true">是</el-radio>
            </el-radio-group>
            <span class="meme">约束字段的值在同一org_id中唯一，重复新增会报错。</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段说明">
            <el-input
              v-model="value.desc"
              type="textarea"
              :rows="2"
              placeholder="说明字段用途"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="hengxian"></div>
        </el-col>
      </el-row>
    </el-form>
    <div class="foot">
      <el-button
        v-if="update"
        type="success"
        @click="saveValue('ruleForm')"
      >保存
      </el-button>
      <el-button
        v-else
        type="primary"
        @click="addList('ruleForm')"
      >添加
      </el-button>
    </div>

    <!--  JSON编辑框弹窗  -->
    <el-dialog
      :visible.sync="showJSONeditor"
      append-to-body
      top="4vh"
      center
    >
      <div v-highlight class="example">
        <pre>
          <code class="JSON" style="height: 488px;">{{ json }}</code>
        </pre>
      </div>
      <span slot="footer">
        <el-button
          type="primary"
          @click="showJSONeditor=false"
        >确定</el-button>
      </span>
    </el-dialog>

    <!--  数据库字段弹窗  -->
    <el-dialog
      :visible.sync="showFieldList"
      title="选择数据库字段"
      append-to-body
      top="0"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
<!--      <div style="margin-bottom: 5px;border-bottom: 1px solid #333333">-->
<!--        <template v-for="item in filteredFieldLists" >-->
<!--          <div-->
<!--            v-if="item.is_show"-->
<!--            :key="item.pk"-->
<!--            @click="handleClickField(item)"-->
<!--            class="field-name"-->
<!--          >-->
<!--            <div class="field-item">-->
<!--              {{ item.value }}-->
<!--              <span>({{ item.label }})</span>-->
<!--              <span-->
<!--                v-if="item.idx"-->
<!--                style="color: #409eff; margin-left: 5px"-->
<!--              >索引</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </div>-->
      <div v-for="(typeList, index) in filteredFieldLists" :key="index"
           :class="{ 'sline': filteredFieldLists[filteredFieldLists.length - 1] }">
        <template v-for="item in typeList">
          <div v-if="item.is_show" :key="item.pk" @click="handleClickField(item)" class="field-name">
            <div class="field-item">
              {{ item.value }}
              <span>({{ item.label }})</span>
              <span v-if="item.idx" style="color: #409eff; margin-left: 5px">索引</span>
            </div>
          </div>
        </template>
      </div>
    </el-dialog>

    <!--  选择前端控件弹窗  -->
    <el-drawer
      title="选择前端控件"
      :size="1200"
      :append-to-body="true"
      :close-on-press-escape="false"
      :visible.sync="showWidgetSelect">
      <div class="widget-select-body" v-if="showWidgetSelect">
        <FieldWidgets @select="widgetSelect" :sys_id="sys_id" :biz_id="biz_id"></FieldWidgets>
      </div>
    </el-drawer>
    <!--    <el-dialog-->
    <!--      :visible.sync="showWidgetSelect"-->
    <!--      title="选择前端控件"-->
    <!--      append-to-body-->
    <!--      fullscreen-->
    <!--      top="0"-->
    <!--      :close-on-click-modal="false"-->
    <!--      :close-on-press-escape="false"-->
    <!--      destroy-on-close-->
    <!--    >-->
    <!--      <span>neirong</span>-->
    <!--    </el-dialog>-->

  </fieldset>
</template>

<script>
import api_fields from "./database_field";
import SelectBaseTree from "./SelectBaseTree";
import {CONTROLS} from "./widgets";
import FieldWidgets from "./FieldWidgets/index.vue";
import widgets from "./FieldWidgets/components/index";

export default {
  name: "Form",
  props: {
    value: Object,
    update: {
      type: Boolean,
      default: false,
    },
    api_name: String,
    templateList: Array,
    relTemplate: Object,
    sys_id: Number,
    biz_id: Number,
  },
  components: {SelectBaseTree, FieldWidgets},
  data() {
    return {
      json: null,
      editor: null,
      showJSONeditor: false,
      showFieldList: false,
      type: "",
      dataSource: [],
      fieldList: [],
      fieldName: "",
      oldField: "",
      controls: CONTROLS,
      showWidgetSelect: false,
    };
  },
  methods: {
    widgetSelect(val) {
      this.showWidgetSelect = false;
      this.value.widget = val.name;
      if (val.data_source) {
        this.value.local_data_source = val.data_source;
      } else {
        this.value.local_data_source = null;
      }
      this.value.data = JSON.stringify(val);
    },
    getWidgetName() {
      let name = this.value.widget;
      if (!name) {
        return ''
      }
      let item = widgets.filter(item => item.name === this.value.widget)[0];
      return item ? item.title : ''
    },
    loadField() {
      let fl = JSON.parse(JSON.stringify(api_fields));
      this.fieldList = [];
      let fieldList = [];
      switch (this.api_name) {
        case "formdata":
          fieldList = fl["formdata"];
          break;
        case "goods":
          fieldList = fl["goods"];
          break;
        case "customer":
          fieldList = fl["customer"];
          break;
        case "services":
          fieldList = fl["services"];
          break;
        case "org":
          fieldList = fl["org"];
          break;
      }
      for (const fields of fieldList) {
        this.$parent.$parent.$parent.updateForm.field.forEach((field) => {
          if (!field.is_related && field.col_name === fields.value) {
            fields.is_show = false;
          }
        });
      }
      this.fieldList = fieldList;
    },
    querySearch(queryString, cb) {
      var restaurants = this.fieldList;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        if (restaurant.is_show) {
          return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >
            -1 || restaurant.label.indexOf(queryString) > -1
          );
        }
      };
    },
    validateAliasField(_, value, callback) {
      if (this.$parent.$parent.$parent.editValue) {
        if (!value) {
          return callback(new Error("不允许为空"));
        } else {
          let arr = this.fieldList.map(i=>i.value);
          if(this.value.col_name == 'create_time' && value == 'create_time'){
            if (arr.some(item => item == value)) {
              return callback();
            }
          }else{
            if (arr.some(item => item == value)) {
              return callback(new Error("该别名不能与数据库字段名称相等!"));
            }
          }
          this.$parent.$parent.$parent.updateForm.field.forEach((i) => {
            if (i.pk !== this.value.pk && i.alias === value) {
              return callback(new Error("已使用此别名!"));
            }
          });
          callback();
        }
      } else {
        if (!value) {
          return callback(new Error("不允许为空"));
        } else {
          let arr = this.fieldList.map(i=>i.value);
          if(this.value.col_name == 'create_time' && value == 'create_time'){
            if (arr.some(item => item == value)) {
              return callback();
            }
          }else{
            if (arr.some(item => item == value)) {
              return callback(new Error("该别名不能与数据库字段名称相等!"));
            }
          }
          this.$parent.$parent.$parent.updateForm.field.forEach((i) => {
            if (i.alias === value) {
              return callback(new Error("已使用此别名!"));
            }
          });
          callback();
        }
      }
    },
    validateDbField(_, value, callback) {
      if (this.$parent.$parent.$parent.editValue) {
        if (!value) {
          return callback(new Error("不允许为空"));
        } else {
          this.$parent.$parent.$parent.updateForm.field.forEach((i) => {
            if (i.pk !== this.value.pk && i.col_name === value && !i.is_related && !this.value.is_related) {
              return callback(new Error("已使用此数据库字段!"));
            }
          });
          callback();
        }
      } else {
        if (!value) {
          return callback(new Error("不允许为空"));
        } else {
          this.$parent.$parent.$parent.updateForm.field.forEach((i) => {
            if (i.alias === value && !i.is_related && !this.value.is_related) {
              return callback(new Error("已使用此数据库字段!"));
            }
          });
          callback();
        }
      }
    },
    addList(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.value && this.value.col_name == 'obj_id'){
            // this.value.is_required = false;
            this.value.in_filter = true;
          }
          this.$emit("add");
          this.fieldList.filter((field) => {
            if (field.value === this.value.col_name && !this.value.is_related) {
              field.is_show = false;
            }
          });
        } else {
          this.$message.error("请认真检查必填项!");
          return false;
        }
      });
    },
    onJsonSave(value) {
      if (this.type === "verify_exp") {
        this.value.verify_exp = JSON.stringify(value);
      } else if (this.type === "widget_attr") {
        this.value.widget_attr = JSON.stringify(value);
      }
      this.showJSONeditor = false;
      this.type = "";
      this.json = {};
    },
    showJSONseditor(type) {
      if (this.value.local_data_source) {
        this.json = this.value.local_data_source;
      } else {
        this.json = '';
      }
      this.showJSONeditor = true;
    },
    saveValue(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.value && this.value.col_name == 'obj_id'){
            // this.value.is_required = false;
            this.value.in_filter = true;
          }
          this.$emit("update");
          this.fieldList.filter((field) => {
            if (field.value === this.value.col_name && !this.value.is_related) {
              field.is_show = false;
            }
          });
        } else {
          this.$message.error("请认真检查必填项!");
          return false;
        }
      });
    },
    getJSONedit() {
      if (!this.editor) {
        const container = document.getElementById("arguments");
        const options = {
          modes: ["code", "tree", "form", "text", "view", "preview"],
          search: true,
        };
        this.editor = new this.$jsoneditor(container, options);
      }
      //set json
      this.editor.set(this.json ? this.json : {});
    },
    setJson(json) {
      this.json = json;
      this.editor.set(this.json);
    },
    getAndClear() {
      this.json = {};
      let value = this.editor.getText();
      this.value[this.type] = value;
      this.type = null;
      this.showJSONeditor = false;
    },
    handleClickField(obj) {
      this.value.col_name = obj.value;
      this.showFieldList = false;
    },
    editField(field_name) {
      this.fieldList.filter((field) => {
        if (field.value === field_name) {
          field.is_show = true;
        }
      });
    },
    fillTitleAndName(col_name) {
      const fields = this.relTemplate.fields.filter(
        (val) => val.col_name === col_name
      );
      if (fields.length > 0) {
        const field = fields[0];
        this.value.alias = field.alias;
        this.value.col_title = field.col_title;
      }
    },
  },
  created() {
    this.loadField();
  },
  computed: {
    filteredFieldLists() {
      const filteredLists = [];
      let num;
      switch (this.api_name) {
        case "formdata":
          num = 7;
          break;
        case "goods":
          num = 11;
          break;
        case "customer":
          num = 8;
          break;
        case "services":
          num = 10;
          break;
        case "org":
          num = 8;
          break;
      }
      for (let i = 0; i <= num; i++) {
        filteredLists.push(this.fieldList.filter(item => item.type === i));
      }
      return filteredLists;
    },
    inFilter: {
        get() {
          return this.value.col_name == 'obj_id' ? true : this.value.in_filter;
        },
        set(newValue) {
          this.value.in_filter = newValue;
        }
    },
    isDisabled() {
      return this.value.col_name == 'obj_id';
    },
    isDisabledFilter(){
      if(this.value.in_filter){
        return false
      }else{
        this.value.unique = false;
        return true
      }
    },

    verify_exp_list() {
      return [
        {label: "必填", value: "required"},
        {label: "手机号验证", value: "mobile"},
        {label: "身份证验证", value: "idCard"},
        {label: "邮箱验证", value: "email"},
      ];
    },
    widget_attr_list() {
      return [{label: "可清空", value: "clearable"}];
    },
  },
  watch: {
    api_name: "loadField",
  },
};
</script>

<style>
.el-drawer__body {
  overflow: auto;
}

.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>

<style scoped>
.sline{
  margin-bottom: 5px; border-bottom: 1px solid #333333
}
.widget-select-body {
  width: 1200px;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
}

.el-form-item *:not(label) {
  width: 100%;
}

.ziduan {
  width: 50%;
  position: relative;
  padding: 0 10px;
  padding-top: 1rem;
  margin: 10px;
  border-color: #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

h4 {
  width: 6rem;
  text-align: center;
}

.foot {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.jsonEditor {
  width: 98%;
  margin: 16px auto;
}

.jsonEditor:deep(.jsoneditor-vue) {
  height: 50vh;
}

.jsonEditor:deep(.json-save-btn) {
  margin-top: 10px;
  cursor: pointer;
  width: 100px;
  line-height: 30px;
  font-size: 14px;
}

.name {
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: normal;
}

.lab {
  font-size: 12px;
  color: #a0a0a0;
}

.field-name {
  width: auto;
  display: inline-block !important;
  display: inline;
  margin: 0 20px 10px 0;
}

.field-name:hover {
  color: #2d8cf0;
  cursor: pointer;
}

.field-name-color {
  color: #409eff;
}

.field-item {
  min-width: 220px;
}

.meme strong {
  color: #ea4d68;
}

i.inline {
  color: gray;
}
</style>

<style>
.inline {
  display: inline;
}

.hengxian {
  display: block;
  height: 1px;
  width: 100%;
  margin: 10px 0;
  background-color: #DCDFE6;
  position: relative;
}
</style>

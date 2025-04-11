<template>
  <div v-loading="save_loading">
    <el-form
      :model="template"
      ref="template"
      inline
      label-width="110px"
    >
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item
            label="所属系统"
            prop="sys_id"
            :rules="{ required: true, message: '必填项!' }"
          >
            <el-select
              v-model="template.sys_id"
              disabled
              style="width: 92%"
            >
              <el-option
                v-for="item in systemlist"
                :key="item.pk"
                :label="item.name"
                :value="item.sys_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="模板ID">
            <el-input
              v-model="template.pk"
              disabled
              ref="clipboard"
            >
              <el-button
                slot="append"
                icon="el-icon-document-copy"
                @click="copyid"
              ></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
<!--          <el-form-item-->
<!--            label="业务id"-->
<!--            prop="biz_id"-->
<!--            :rules="[-->
<!--              { required: true, message: '必填项！' },-->
<!--            ]"-->
<!--          >-->
<!--            <el-select v-model="template.biz_id" disabled>-->
<!--              <el-option-->
<!--                v-for="item in bizIds"-->
<!--                :key="item.biz_id"-->
<!--                :label="`${item.biz_id}: ${item.name}`"-->
<!--                :value="item.biz_id">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->

          <el-form-item
            label="对应功能"
            prop="permission"
            :rules="{ required: true, message: '必填项!' }"
          >
            <SelectPerm :sys_id="currentSystemId" v-model="template.permission" @change="permChange" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="模板名称"
            prop="title"
            :rules="{ required: true, message: '必填项!' }"
          >
            <el-input v-model="template.title" autocomplete="on" name="tpltitle" id="tpltitle" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="模板备注" style="width: 100%;">
            <el-input v-model="template.remark" style="width: calc(17vw - 20px);" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
<!--          <el-form-item-->
<!--            label="关键字"-->
<!--            prop="keyword"-->
<!--            :rules="[-->
<!--              { required: true, message: '必填项！' },-->
<!--              { min: 3, message: '最少三个字', trigger: 'blur' },-->
<!--            ]"-->
<!--          >-->
<!--            <el-input v-model="template.keyword" />-->
<!--          </el-form-item>-->
          <el-form-item label="登录读写" prop="need_login">
            <el-tooltip class="item" effect="light" content="如果开启后则需要登录后才可获取到表单内容" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
            <el-switch style="margin-left: 10px"
              v-model="template.need_login"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="需要登录"
              inactive-text="不需要登录">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="数据表"
            :rules="{ required: true, message: '必填项!' }"
          >
            <el-select
              v-model="tempApi_name"
              @change="
                (val) => {
                  this.template.api_name = val;
                }
              "
            >
              <el-option
                v-for="item in tempApi_list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="关联模板"
            v-if="tempApi_name == 'formdata' && !template.pk"
            prop="parent"
            :rules="{ required: true, message: '必填项!' }"
          >
            <el-select
              v-model="template.parent"
              clearable
              filterable
            >
              <el-option
                v-for="item in templateList"
                :key="item.pk"
                :label="item.title"
                :value="item.pk"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-tabs
      v-model="activePanel"
      type="card"
    >
      <el-tab-pane
        label="模板配置"
        name="form"
      >
        <div style="display: flex">
          <Form
            ref="formData"
            v-model="form"
            :relTemplate="related_template"
            @add="addformList"
            :templateList="templateList"
            :update="editValue"
            :api_name="template.api_name"
            @update="updateValue"
            :sys_id="template.sys_id"
            :biz_id="template.biz_id"
          />
          <div style="flex: 1">
             <span class="meme" style="">表格可进行拖拽排序, 点击最下方"确定"保存</span>
             <el-button class="code_generation" type="primary" :disabled="template.field.length>0 ? false : true" @click="exportFile">表单代码生成</el-button>
            <el-table
              :data="fields"
              class="field-table"
              border
              max-height="450"
              row-key="pk"
            >
              <el-table-column
                align="center"
                width="50"
                class-name="drag-column"
              >
                <template>
                  <div class="drag-box">
                    <i class="el-icon-d-caret"></i>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="字段名称"
                prop="col_title"
                align="center"
              ></el-table-column>
              <el-table-column
                label="字段别名"
                prop="alias"
                align="center"
              ></el-table-column>
              <el-table-column
                label="数据库字段名"
                prop="col_name"
                align="center"
              >
                <template v-slot="{ row }">
                  <span v-if="row.is_related">(只读) 关联表.</span><span>{{ row.col_name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="控件类型"
                prop="widget"
                align="center"
              >
                <template v-slot="{ row }">
                  <el-tag type="primary" effect="dark" size="mini">{{getWidgetName(row.widget)}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="查询字段"
                prop="in_filter"
                align="center"
              >
                <template v-slot="{ row }">
                  <el-tag v-if="row.in_filter" size="mini" type="success" effect="dark">是</el-tag>
                  <el-tag v-else size="mini" type="danger" effect="dark">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                  label="隐藏输入"
                  prop="is_required"
                  align="center"
              >
                <template v-slot="{ row }">
                  <el-tag v-if="!row.is_required" size="mini" type="success" effect="dark">是</el-tag>
                  <el-tag v-else size="mini" type="danger" effect="dark">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="150"
              >
                <template slot-scope="{ row }">
                  <el-button
                    @click="edit(row)"
                    type="primary"
                  >编辑</el-button>
                  <el-button
                    @click="del(row)"
                    type="danger"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="form-footer">
              <!--          <el-button-->
              <!--            v-if="!this.template.pk"-->
              <!--            type="success"-->
              <!--            @click="copyTemplateDialog = true"-->
              <!--            icon="el-icon-document-copy"-->
              <!--            style="margin-right: 50px"-->
              <!--          >去复制-->
              <!--          </el-button>-->
              <el-button @click="$emit('close', false)">取 消</el-button>
              <el-button
                type="primary"
                @click="createTemplate('template')"
              >确 定
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="Excel导入配置"
        name="excel"
      >
        <excel-rules
          v-if="activePanel === 'excel'"
          @close="$emit('close', false)"
          :templatePk="template.pk"
        />

        <div class="form-footer">
          <!--          <el-button-->
          <!--            v-if="!this.template.pk"-->
          <!--            type="success"-->
          <!--            @click="copyTemplateDialog = true"-->
          <!--            icon="el-icon-document-copy"-->
          <!--            style="margin-right: 50px"-->
          <!--          >去复制-->
          <!--          </el-button>-->
          <el-button @click="$emit('close', false)">取 消</el-button>
          <el-button
            type="primary"
            @click="createTemplate('template')"
          >确 定
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :visible.sync="copyTemplateDialog"
      title="复制模版"
      append-to-body
      top="5vh"
    >
      <el-input
        v-model="search"
        style="width: 300px; margin-bottom: 15px"
        placeholder="关键字查询"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="loadTemplateData"
        ></el-button>
      </el-input>
      <el-table
        :data="templateData_copy"
        v-loading="loading"
      >
        <el-table-column
          prop="title"
          label="模版名称"
        ></el-table-column>
        <el-table-column
          prop="keyword"
          label="关键字"
        ></el-table-column>
        <el-table-column
          label="页面截图"
          align="center"
          width="120px"
        >
          <template slot-scope="{ row }">
            <el-button
              v-if="row.photo"
              type="primary"
            >查看截图</el-button>
            <span v-else>暂无截图</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="120px"
        >
          <template slot-scope="{ row }">
            <el-button
              type="success"
              icon="el-icon-document-copy"
              @click="copy(row)"
            >复制
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <TableRender v-if="dialogVisibletable" :dialogVisible="dialogVisibletable" :formTem="formTem" :sortValue="sortValue" @dialog="dialogVisibletable = false"/>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import Form from "./Form.vue";
import { mapState } from "vuex";
import ExcelRules from "./ExcelRules.vue";
import widgets, {widgetsMap} from "@/Template/FieldWidgets/components";
import TableRender from "@/Template/GenerateVue/TableRender.vue";
import SelectPerm from "@/components/SelectPerm.vue";
const template_form = {
  sys_id: null,
  biz_id: null,
  title: null,
  remark: null,
  form_type: 1,
  keyword: "",
  api_version: "v1",
  api_name: "formdata",
  parent: null,
  code: "",
  photo: "",
  need_login: false,
  permission: null,
};

export default {
  computed: {
    ...mapState(["systemlist", "currentSystemId"]),
  },
  props: { updateForm: Object, sysId: Number, templateList: Array, bizId: Number , bizIds: Array},
  data() {
    return {
      save_loading: false,
      activePanel: "form",
      template: { ...template_form },
      biz_ids: [{name: '默认', biz_id: 1}],
      form: {
        sys_id: null,
        template: null,
        col_title: null,
        col_name: null,
        sort_num: 1,
        is_related: false,
        is_required: true,
        in_filter: false,
        is_vant_show: false,
        related_template: null,
        widget: "input",
        widget_attr: [],
        verify_exp: [],
        local_data_source: null,
        alias: null,
        unique: false,
        desc: null,
        data: null,
      },
      tempApi_name: "formdata",
      tempApi_list: [
        { name: "数据表:formtemplate_formdata", value: "formdata" },
        { name: "人员表:customer_customer", value: "customer" },
        { name: "服务表:service_services", value: "services" },
        { name: "物品表:goods_goods", value: "goods" },
        { name: "组织表:org_org", value: "org" },
      ],
      fields: [],
      editValue: false,
      copyTemplateDialog: false,
      templateData_copy: [],
      loading: false,
      search: "",
      copyform: {
        target_id: null,
        form_id: null,
        new_title: "",
      },
      related_template: null,
      dialogVisibletable: false,
      sortValue: [], // 排序字段
      formTem: null,
    };
  },
  methods: {
    async exportFile(){
      if(this.template && this.template.field.length<=0) return this.$message.error('请先添加字段');
      let sort_field = this.template.field.map((item)=>{
        if(item.in_filter){
          return item;
        }
      }).filter((item)=>{
        return item;
      });
      this.sortValue = sort_field ? sort_field : null;
      this.formTem = this.template;
      this.dialogVisibletable = true;
    },
    getWidgetName(widget){
      if (!widget) {
        return ''
      }
      let item = widgets.filter(item => item.name === widget)[0];
      return item ? item.title : ''
    },
    copyid() {
      try {
        this.$copyText(this.template.pk);
        this.$notify({
          message: "复制成功!",
          duration: 2000,
          type: "success",
        });
      } catch (error) {
        this.$notify({
          message: "复制失败!",
          duration: 2000,
          type: "error",
        });
      }
    },
    async copy(obj) {
      this.copyform.target_id = this.template.sys_id;
      this.copyform.form_id = obj.pk;
      this.copyform.new_title = obj.title;
      let resp = await this.$http.post("/formtemplatecopy/", this.copyform);
      this.$message.success("操作成功！");
      this.copyTemplateDialog = false;
      this.$emit("submitCopy", resp.data.pk);
    },
    loadTemplateData() {
      this.loading = true;
      this.$http
        .get("/formtemplate/", { params: { search: this.search } })
        .then((resp) => {
          this.templateData_copy = resp.data;
          this.loading = false;
        });
    },
    async addformList() {
      this.form.sys_id = this.currentSystemId;
      if (this.form.widget_attr) {
        this.form["widget_attr"] = JSON.stringify(this.form.widget_attr);
      } else {
        this.form.widget_attr = "[]";
      }
      if (this.form.verify_exp) {
        this.form["verify_exp"] = JSON.stringify(this.form.verify_exp);
      } else {
        this.form.verify_exp = "[]";
      }
      // 新增字段时，如果是已存在的模板则直接新增，否则需要新建模板后关联保存模板字段
      if (this.template.pk) {
        this.form["template"] = this.template.pk;
        let res = await this.$http.post("/formfields/", this.form);
        let temp = JSON.parse(this.template.header_conf);
        if(this.fields && this.fields.length>0){
            await this.createTimeAndDep(this.fields,this.form,this.template);
        }else{
          let res1 = await this.createFieldCreateTime('create_time','create_time',this.fields,this.template.pk,'创建时间');
          this.updateForm.field.push(res1.data);
          let res2 = await this.createFieldCreateTime('dep_id','department',this.fields,this.template.pk,'创建部门');
          this.updateForm.field.push(res2.data);
          let res3 = await this.createFieldCreateTime('user_id','user',this.fields,this.template.pk,'创建人');
          this.updateForm.field.push(res3.data);
        }
        if (temp) {
          temp.data.push(res.data);
          this.template.header_conf = JSON.stringify(temp);
          await this.$http.put(
            `/formtemplate/${this.template.pk}/`,
            this.template
          );
        }
        this.updateForm.field.push(res.data);
        this.clear();
      } else {
        let valid = await new Promise((resolve) => {
          this.$refs.template.validate((valid) => resolve(valid));
        });
        if (valid) {
          let resp = await this.$http.post("/formtemplate/", this.template);
          let pk = resp.data.pk;
          this.template = { ...resp.data };
          this.form["template"] = pk;
          this.tempApi_name = resp.data.api_name;
          let res = await this.$http.post("/formfields/", this.form);
          let fields = await this.$resource.getList('formfields',{
            template:pk,
          })
          if(fields && fields.length>0){
            await this.createTimeAndDep(fields,this.form,this.template);
          }
          resp.data.header_conf = JSON.stringify({
            start: 2,
            data: [res.data],
          });
          await this.$http.put(`/formtemplate/${resp.data.pk}/`, resp.data);
          this.updateForm.field.push(res.data);
          this.clear();
        } else {
          this.$message.error("请先填写模板字段!");
        }
      }
    },
    async createTimeAndDep(fields,form,template){
      let arr = fields.map(i=>i.col_name).find(i=>i=='create_time')
      if(!arr && form.col_name != 'create_time'){
        let res1 = await this.createFieldCreateTime('create_time','create_time',fields,template.pk,'创建时间');
        this.updateForm.field.push(res1.data)
      }
      // 创建部门判断
      let dep_id = fields.map(i=>i.col_name).find(i=>i=='department')
      if(!dep_id && this.form.col_name != 'department' ){
        let res1 =await this.createFieldCreateTime('dep_id','department',fields,template.pk,'创建部门');
        this.updateForm.field.push(res1.data);
      }
      // 创建人
      let user_id = fields.map(i=>i.col_name).find(i=>i=='user')
      if(!user_id && form.col_name != 'user' ){
        let res1 = await this.createFieldCreateTime('user_id','user',fields,template.pk,'创建人');
        this.updateForm.field.push(res1.data);
      }
    },
    async createFieldCreateTime(alias,col_name,fields,val,title){
      try {
        let params = {
          alias: alias,
          col_name: col_name,
          col_title: title,
          in_filter: true,
          is_related: false,
          is_required: false,
          is_vant_show: false,
          sort_num: fields.length || 0,
          unique: false,
          widget: "input",
          widget_attr: "[]",
          verify_exp: "[]",
          template:val
        }
        if(col_name == 'department'){
          params.data = '{"name":"bumen_pk","title":"部门下拉单选","desc":"单选，部门下拉单选，值为部门的pk","template":"<el-select :allow-create="false" filterable style="width: 100%;" :disabled="readonly" clearable v-model="$${model}"><el-option v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${name_field}" :value="item.$${value_field}"></el-option></el-select>","data_source":"{"url":"flatdepartment","params":{},"name_field":"name","value_field":"pk"}"}'
          params.local_data_source = '{"url":"flatdepartment","params":{},"name_field":"name","value_field":"pk"}'
          params.widget = 'bumen_pk'
        }
        if(col_name == 'user'){
          params.data = '{"name":"user_pk","title":"用户下拉单选","desc":"单选，用户下拉单选，值为用户的pk","template":"<el-select :allow-create="false" filterable style="width: 100%;" :disabled="readonly" clearable v-model="$${model}"><el-option v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${name_field}" :value="item.$${value_field}"></el-option></el-select>","data_source":"{"url":"usermin","params":{},"name_field":"full_name","value_field":"pk"}"}'
          params.local_data_source = '{"url":"usermin","params":{},"name_field":"full_name","value_field":"pk"}'
          params.widget = 'user_pk'
        }
        let res1 = await this.$http.post("/formfields/", params);
        return res1;
      }catch (e) {
        console.error(e)
      }
    },

    async createTemplate(formName) {
      this.save_loading = true;
      let valid = await new Promise((resolve, reject) => {
        this.$refs[formName].validate(resolve);
      });
      if (valid) {
        try {
          if (this.template.pk) {
            await this.$http.put(
              "/formtemplate/" + this.template.pk + "/",
              this.template
            );
          } else {
            await this.$http.post("/formtemplate/", this.template);
          }
          let arr = [];
          for (let i = 0; i < this.fields.length; i++) {
            let field = this.fields[i];
            arr.push(this.$http.patch(`/formfields/${field.pk}/`, { sort_num: i }))
          }
          await Promise.all(arr)
        } finally {
          this.save_loading = false;
        }
        this.$emit("close");
        this.$emit("loadData");
      } else {
        this.$message.error("请认真检查必填项!");
        this.save_loading = false;
        return;
      }
    },
    initUpdate() {
      this.fields =
        this.updateForm.field.length > 0 ? [...this.updateForm.field] : [];
      this.template = { ...this.template, ...this.updateForm };
      this.template.sys_id = this.sysId;
      this.template.biz_id = this.bizId;
      if (this.updateForm.pk) {
        this.tempApi_name = this.updateForm.api_name;
      }
    },
    edit(obj) {
      let tmp = {
        ...obj,
        sys_id: this.currentSystemId,
        verify_exp: JSON.parse(obj.verify_exp),
        widget_attr: JSON.parse(obj.widget_attr),
      };
      this.form = { ...tmp };
      this.editValue = true;
      this.$refs.formData.editField(obj.col_name);
    },
    del(obj) {
      this.$confirm("删除不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          if (obj.pk) {
            let res = await this.$http.get(
              `/formtemplate/${this.template.pk}/`
            );
            let header = JSON.parse(res.data.header_conf);
            if (header) {
              header.data.splice(
                header.data.findIndex((i) => i.pk === obj.pk),
                1
              );
              res.data.header_conf = JSON.stringify(header);
              await this.$http.put(`/formtemplate/${res.data.pk}/`, res.data);
            }
            await this.$http.delete(`/formfields/${obj.pk}/`);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          let idx = this.updateForm.field.findIndex((i) => {
            return i.pk === obj.pk;
          });
          this.updateForm.field.splice(idx, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async updateValue() {
      if (this.form.widget_attr) {
        this.form["widget_attr"] = JSON.stringify(this.form.widget_attr);
      } else {
        this.form.widget_attr = "[]";
      }
      if (this.form.verify_exp) {
        this.form["verify_exp"] = JSON.stringify(this.form.verify_exp);
      } else {
        this.form.verify_exp = "[]";
      }
      let res = await this.$http.put(
        "/formfields/" + this.form.pk + "/",
        this.form
      );
      let resp = await this.$http.get(`/formtemplate/${this.form.template}/`);
      let temp = JSON.parse(resp.data.header_conf);
      if (temp) {
        temp.data.splice(
          temp.data.findIndex((i) => i.pk === this.form.pk),
          1,
          res.data
        );
        resp.data.header_conf = JSON.stringify(temp);
        await this.$http.put(`/formtemplate/${resp.data.pk}/`, resp.data);
      }
      let idx = this.updateForm.field.findIndex((i) => {
        return i.pk === res.data.pk;
      });
      this.updateForm.field.splice(
        idx,
        1,
        JSON.parse(JSON.stringify(res.data))
      );
      this.clear();
      this.editValue = false;
    },
    clear() {
      this.form = {
        sys_id: this.currentSystemId,
        template: null,
        sort_num: 1,
        col_title: null,
        col_name: null,
        is_related: false,
        is_required: true,
        is_vant_show: false,
        related_template: null,
        widget: "input",
        widget_attr: [],
        verify_exp: [],
        local_data_source: null,
        in_filter: false,
        alias: null,
        unique: false,
        desc: null,
      };
      this.$refs.formData.$refs["ruleForm"].resetFields();
    },
    async getRelatedTemplate() {
      for (const field of this.fields) {
        if (field.col_name === "obj_id" && field.related_template) {
          let tmpl = this.templateList.filter(
            (val) => val.pk === field.related_template
          );
          if (tmpl.length > 0) {
            let data = await this.$http.get(`/formfields/`, {
              params: { template: field.related_template },
            });
            this.related_template = { ...tmpl[0], fields: data.data };
          }
          return;
        }
      }
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(
        ".field-table .el-table__body-wrapper tbody"
      );
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.fields.splice(oldIndex, 1)[0];
          _this.fields.splice(newIndex, 0, currRow);
        },
      });
    },
  },
  created() {
    this.initUpdate();
    this.getRelatedTemplate();
  },
  mounted() {
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this.rowDrop();
  },
  components: {
    SelectPerm,
    Form,
    ExcelRules,
    TableRender
  },
  watch: {
    updateForm: {
      handler() {
        this.initUpdate();
        this.getRelatedTemplate();
      },
      deep: true,
    },
    sysId: {
      handler() {
        this.template.sys_id = this.sysId;
      },
    },
    bizId: {
      handler() {
        this.template.biz_id = this.bizId;
      },
    },
    dialogVisible(val) {
      if (!val) {
        this.currentVal = '';
      }
    },
  },
};
</script>

<style scoped>
.meme {
  font-size: 12px;
  color: gray;
  float: left;
}
.code_generation{
  float: left;
  margin-left: 20px;
}
.form-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  box-sizing: border-box;
}

.upload:deep(.el-upload) {
  display: none;
}
</style>
<style>
.drag-column {
  padding: 0 !important;
}

.drag-column .cell {
  padding: 0 !important;
}

.drag-box {
  cursor: move;
  height: 47px;
  width: 47px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

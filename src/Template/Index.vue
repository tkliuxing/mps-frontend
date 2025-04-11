<template>
  <el-card style="width: 100%">
    <el-row :gutter="10">
      <el-col :span="24">
        <div>{{ systemName }}</div>
        <el-form inline label-width="100px" style="margin-top: 10px">
          <el-form-item>
            <el-button
              type="primary"
              @click="createTemplate"
              icon="el-icon-circle-plus-outline"
            >新建模板
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="search"
              prefix-icon="el-icon-search"
              placeholder="模板名称搜索"
              clearable
              @clear="
                () => {
                  this.page = 1;
                  this.loadData();
                }
              "
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="
                () => {
                  this.page = 1;
                  this.loadData();
                }
              "
            >搜索
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              @click="
                () => {
                  this.search = '';
                  this.loadData();
                }
              "
            >全部
            </el-button>
          </el-form-item>
          <el-form-item label="业务子系统">
            <el-select v-model="biz_id" @change="listTypeChange">
              <el-option
                v-for="item in biz_ids"
                :key="item.biz_id"
                :label="`${item.biz_id}: ${item.name}`"
                :value="item.biz_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-table
          :data="data"
          border
          v-loading="loading"
          :default-sort="{ prop: 'sort_num', order: 'ascending' }"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="模板名称" prop="title"></el-table-column>
          <el-table-column
            label="模板ID"
            prop="pk"
            width="220px"
          ></el-table-column>
          <el-table-column
            label="数据表"
            prop="api_name"
            width="120px"
          ></el-table-column>
          <el-table-column label="是否需要登录" prop="need_login" width="120">
              <template slot-scope="{row}">
                <el-tag :type="row.need_login ? 'success' : 'danger'">
                  {{row.need_login ? '是':'否'}}
                </el-tag>
              </template>
          </el-table-column>
          <el-table-column label="描述" prop="remark"></el-table-column>
          <el-table-column label="操作" width="300px" align="center">
            <template slot-scope="{ row }">
              <el-button type="primary" round @click="edit(row)">编辑</el-button>
              <el-button type="info" round @click="editAggr(row)">统计</el-button>
              <el-button type="warning" round @click="exportFile1(row)">生成</el-button>
              <el-button type="success" circle icon="el-icon-view" @click="view(row)"></el-button>
              <el-button type="danger" circle icon="el-icon-delete" @click="del(row.pk)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next, sizes"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          @current-change="loadData"
          @size-change="loadData"
          :hide-on-single-page="false"
          :total="total"
          style="margin-top: 20px"
        ></el-pagination>
      </el-col>
    </el-row>

    <!-- 统计字段 -->
    <el-dialog fullscreen :visible.sync="aggrDialogVisible" :show-close="false">
      <TemplateAggregate v-if="updateValue" :template_id="updateValue.pk" @close="aggrDialogVisible=false" />
    </el-dialog>

    <!-- 新建和编辑模板 -->
    <el-dialog
      :visible.sync="dialogVisiable"
      fullscreen
      custom-class="TableEdit"
      @closed="updateValue = { field: [] }"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <Template
        v-if="dialogVisiable"
        :updateForm="updateValue"
        :templateList="data_list"
        :sysId="sys_id"
        :bizId="biz_id"
        :bizIds="biz_ids"
        @close="(status) => (this.dialogVisiable = status)"
        @submitCopy="copyTemplate"
        @loadData="loadData"
      ></Template>
    </el-dialog>

    <!-- 复制模板 -->
    <el-dialog
      :visible.sync="copydialog"
      title="复制模板"
      width="30%"
      @close="clear"
    >
      <el-form :model="copyform" label-width="120px" ref="copyForm">
        <el-form-item
          label="模版名称："
          prop="new_title"
          :rules="{ required: true, message: '必填项！' }"
        >
          <el-input
            v-model="copyform.new_title"
            style="width: 250px"
          ></el-input>
        </el-form-item>
<!--        <el-form-item-->
<!--          label="复制到："-->
<!--          prop="target_id"-->
<!--          :rules="{ required: true, message: '必填项！' }"-->
<!--        >-->
<!--          <el-select-->
<!--            v-model="copyform.target_id"-->
<!--            style="width: 250px"-->
<!--            placeholder="请选择目标项目"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in systemlist"-->
<!--              :key="item.pk"-->
<!--              :label="item.name"-->
<!--              :value="item.sys_id"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copydialog = false">取 消</el-button>
        <el-button type="primary" @click="submitCopy">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看模版抽屉 -->
    <el-drawer
      :title="view_obj.title"
      :visible.sync="viewdialog"
      size="80%"
      direction="rtl"
    >
      <div slot="title" class="dr-header">
        <span style="margin-right:10px;">{{ view_obj.title }}</span>
        <el-button
          type="success"
          icon="el-icon-document-copy"
          size="mini"
          :disabled="view_obj.field.length<=0 ? true : false"
          @click="copy(view_obj)"
        >复制
        </el-button>

        <el-button type="primary" plain icon="el-icon-download" @click="exportField(view_obj)">导出字段</el-button>
      </div>
      <div style="padding:10px;">
        <el-row :gutter="10" class="info-row">
          <el-col :span="6">
            <span>标题：{{ view_obj.title }}</span>
          </el-col>
          <el-col :span="18">
            <span>URL：/api/v1/data/?template_id={{ view_obj.pk }}</span>
          </el-col>
          <el-col :span="6">
            <span>关键字：{{ view_obj.keyword }}</span>
          </el-col>
          <el-col :span="18">
            <span>备注：{{ view_obj.remark }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-table
              :data="view_obj.field"
              border
              max-height="450"
              :cell-style="{ 'text-align': 'center' }"
              :header-cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column
                label="字段名称"
                prop="col_title"
              ></el-table-column>
              <el-table-column label="字段别名" prop="alias"></el-table-column>
              <el-table-column
                label="数据库字段名"
                prop="col_name"
              ></el-table-column>
              <el-table-column label="是否是查询条件" prop="in_filter">
                <template slot-scope="{ row }">
                  <i v-if="row.in_filter" class="el-icon-success green"></i>
                  <i v-else class="el-icon-error grey"></i>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="8">
            <json-viewer
              class="drawer-json-viewer"
              :value="view_obj.json_fields"
              :expand-depth="1"
              expanded
              copyable
              boxed
            />
          </el-col>
          <el-col :span="24">
            <codemirror class="codeinline" v-model="code" :options="cmOption"></codemirror>
          </el-col>
        </el-row>
      </div>
    </el-drawer>

    <!-- 表单生成弹窗 -->
    <TableRender v-if="dialogVisible" :dialogVisible="dialogVisible" :formTem="formTem" :sortValue="sortValue" @dialog="dialogVisible = false"/>
  </el-card>
</template>

<script>
//sql编辑器
import {codemirror} from "vue-codemirror";
import "codemirror/mode/sql/sql.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/solarized.css";

import {mapState} from "vuex";
import Template from "./Template.vue";
import TemplateAggregate from "./TemplateAggregate.vue";
import JsonViewer from "vue-json-viewer";
import resource from "@/resource";
import {format as sqlFormatter} from "sql-formatter";
import TableRender from "@/Template/GenerateVue/TableRender.vue";
import XLSX from "xlsx";
import SelectPerm from "@/components/SelectPerm.vue";
export default {
  name: "TemplateIndex",
  components: {
    codemirror,
    Template,
    TemplateAggregate,
    "json-viewer": JsonViewer,
    TableRender,
    SelectPerm,
  },
  computed: {
    ...mapState(["systemlist", "currentSystemId"]),
    excelDownloadTranslate(){
      return {
        'col_title': '字段名称',
        'alias': '字段别名',
        'col_name': '数据库字段名',
        'in_filter': '是否是查询条件',
      }
    }
  },
  data() {
    return {
      biz_id: 1,
      biz_ids: [{name: '默认', biz_id: 1}],
      systemPk: "",
      systemName: "",
      systemSearch: "",
      sys_id: null,
      page: 1,
      pageSize: 20,
      total: 0,
      search: "",
      loading: false,
      dialogVisiable: false,
      updateValue: null,
      data: [],
      data_list: [],
      systemData: [],
      copydialog: false,
      copyform: {
        target_id: null,
        form_id: null,
        new_title: "",
      },
      apiname_map: {
        formdata: "formtemplate_formdata",
        customer: "customer_customer",
        services: "service_services",
        goods: "goods_goods",
        org: "org_org",
      },
      code: "",
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: "text/x-pgsql",
        theme: "solarized light",
      },
      viewdialog: false,
      view_obj: {
        pk: "",
        api_path: "", // /api/v1/goods/
        title: "",
        keyword: "",
        remark: "",
        field: [
          // {
          //   "related_template": null,
          //   "col_title": "类别",
          //   "alias": "category",
          //   "col_name": "category",
          //   "in_filter": false,
          //   "is_required": false,
          //   "is_related": false,
          //   "widget": "input",
          //   "local_data_source": null,
          //   "sort_num": null,
          // }
        ],
        json_fields: {},
        formType: "",
        sys_name: "",
      },
      dialogVisible: false,
      aggrDialogVisible: false,
      sortValue: [], // 排序字段
      // currentVal: '', // 当前选中的排序字段
      template: null,
      file_name: null,
      sortTable:[
        {value:'',sortRule:''}
      ],
      form:{
        file_name: null,
      },
      rules:{
        file_name: [
          { required: true, message: '文件名为必填', trigger: 'blur' },
          { pattern: /^[a-zA-Z_]+$/, message: '只能包含字母和下划线', trigger: 'blur' }
        ]
      },
      formTem: null,
      copyObj: {},
    };
  },
  methods: {
    exportField(val){
      let data = val.field;
      if(data.length<0) return;
      let header = [
        "字段名称",
        "字段别名",
        "数据库字段名",
        "是否是查询条件",
      ]
      let tmp = [];
      data.forEach((i) => {
        let obj = {};
        for (const key in i) {
          if (Object.hasOwnProperty.call(this.excelDownloadTranslate, key)){
            if(key == 'in_filter'){
              obj[this.excelDownloadTranslate[key]] = i[key] && i[key] ? '是' : '否'
            }else{
              obj[this.excelDownloadTranslate[key]] = i[key]
            }
          }
        }
        tmp.push(obj);
      });
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(tmp, { header });
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${val.title}.xlsx`);
    },
    exportFile1(formtemplate){
      // 找出表单中带搜索的字段，从中选出一个当作排序字段；
      let sort_field = formtemplate.field.map((item)=>{
        if(item.in_filter){
          return item;
        }
      }).filter((item)=>{
        return item;
      });
      this.sortValue = sort_field ? sort_field : null;
      this.formTem = formtemplate;
      this.dialogVisible = true;
    },
    listTypeChange(val) {
      this.biz_id = val;
      this.page = 1;
      this.loadData();
    },
    async loadSystemData() {
      let resp = await resource.getList("system", {
        sys_id: this.$store.state.currentSystemId,
      });
      this.systemPk = resp[0].pk;
      this.systemName = resp[0].name;
      this.sys_id = resp[0].sys_id;
      this.systemData = resp;
      this.loadBiz();
    },
    permChange(val){
      console.log(val);
    },
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        search: this.search,
        sys_id: this.sys_id,
        biz_id: this.biz_id,
      };
      let res = await this.$http.get("/formtemplate/", {params});
      this.total = res.data.count;
      this.sysid_to_name(res.data.data);
      this.loadDataList();
      this.loading = false;
    },
    async loadDataList() {
      let params = {
        sys_id: this.sys_id,
        biz_id: this.biz_id,
      };
      let res = await this.$http.get("/formtemplatemin/", {params});
      let list = res.data;
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < this.systemlist.length; j++) {
          if (list[i].sys_id === this.systemlist[j].sys_id) {
            list[i].sys_name = this.systemlist[j].name;
          }
        }
      }
      this.data_list = list;
    },
    async loadBiz() {
      let params = {
        sys_id: this.sys_id,
      };
      let res = await this.$http.get("/systembiz/", {params});
      this.biz_ids = res.data;
      if (this.biz_ids.length === 0) {
        this.biz_ids = [{name: '默认', biz_id: 1}];
      }
    },
    createTemplate() {
      this.dialogVisiable = true;
      this.updateValue = {field: []};
    },
    view(obj) {
      this.view_obj = JSON.parse(JSON.stringify(obj));
      this.view_obj.json_fields = {
        pk: null,
        sys_id: obj.sys_id,
        org_id: null,
        biz_id: obj.biz_id,
      };
      let select_line = [];
      this.view_obj.field.forEach((val) => {
        let alias = val.alias || val.col_title;
        if(val.col_name == 'user' || val.col_name == 'department'){
          val.col_name = val.col_name + '_id'
        }
        this.view_obj.json_fields[alias] = null;
        select_line.push(`A.${val.col_name} as ${alias}`);
      });
      let table_name = this.apiname_map[obj.api_name];
      this.code = sqlFormatter(`select ${select_line.join(', \n')}
                                from ${table_name} A
                                where A.template_id = '${obj.pk}'`, {language: "postgresql"});
      this.viewdialog = true;
    },
    copy(obj) {
      console.log(obj)
      this.copyObj = obj;
      this.copyform.form_id = obj.pk;
      this.copydialog = true;
    },
    edit(obj) {
      this.updateValue = obj;
      this.dialogVisiable = true;
    },
    editAggr(obj) {
      this.updateValue = obj;
      this.aggrDialogVisible = true;
    },
    del(pk) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete(`/formtemplate/${pk}/`);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          setTimeout(() => {
            this.loadData();
          }, 200);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async submitCopy() {
      const loading = this.$loading({
        lock: true,
        text: '正在复制中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255,255, 0.7)'
      });
      try {
        if(this.copyObj){
          let resp;
          let params = {
            api_name: this.copyObj.api_name,
            keyword: this.copyform.new_title,
            remark: this.copyform.new_title,
            title: this.copyform.new_title,
            sys_id: this.copyObj.sys_id,
            biz_id: this.copyObj.biz_id,
            org_id: this.copyObj.org_id,
            src_id: this.copyObj.src_id
          }
           resp = await this.$resource.createObj('formtemplate',params)
          if(resp.pk && this.copyObj && this.copyObj.field.length>0){
              for (let i = 0; i < this.copyObj.field.length; i++) {
                let item = this.copyObj.field[i]
                let params = {
                  alias: item.alias,
                  col_name: item.col_name,
                  col_title: item.col_title,
                  data: item.data,
                  desc: item.desc,
                  in_filter: item.in_filter,
                  is_related: item.is_related,
                  is_required: item.is_required,
                  is_vant_show: item.is_vant_show,
                  local_data_source: item.local_data_source,
                  related_template: item.related_template,
                  sort_num: item.sort_num,
                  sys_id: item.sys_id,
                  biz_id: item.biz_id,
                  org_id: item.org_id,
                  src_id: item.src_id,
                  template:resp.pk,
                  unique: item.unique,
                  verify_exp: item.verify_exp,
                  widget: item.widget,
                  widget_attr: item.widget_attr
                }
               await this.$resource.createObj('formfields',params)
              }
              this.$message.success('复制成功！')
              this.copydialog = false;
              this.viewdialog = false;
              await this.loadData();
          }else{
            this.$message.error('复制失败！')
          }
        }else{
          this.$message.warning('未找到要复制的内容！')
        }
        loading.close();
      }catch (e) {
        console.error(e)
        if(loading){
          loading.close();
        }
      }
      // this.$refs["copyForm"].validate((valid) => {
      //   if (valid) {
      //     this.$http.post("/formtemplatecopy/", this.copyform).then((resp) => {
      //       this.$message.success("操作成功！");
      //       this.copydialog = false;
      //       this.loadData();
      //     });
      //   } else {
      //     this.$message.error("请填写必填项！");
      //     return false;
      //   }
      // });
    },
    clear() {
      this.copyform = {
        target_id: null,
        form_id: null,
        new_title: "",
      };
    },
    sysid_to_name(list) {
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < this.systemlist.length; j++) {
          if (list[i].sys_id === this.systemlist[j].sys_id) {
            list[i].sys_name = this.systemlist[j].name;
          }
        }
      }
      this.data = list;
    },
    async copyTemplate(template_pk) {
      this.page = 1;
      this.search = "";
      await this.loadData();
      this.data.forEach((template) => {
        if (template.pk === template_pk) {
          this.edit(template);
        }
      });
    },
  },
  async created() {
    await this.loadSystemData();
    await this.loadData();
  },
  watch: {
    currentSystemId: {
      async handler() {
        await this.loadSystemData();
        await this.loadData();
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
.foot {
  width: 100%;
  display: flex;
}

.sys-tabs {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 30px;
}

.sys-tabs:hover {
  color: #2d8cf0;
  cursor: pointer;
}

.sys-tabs-color {
  color: #2d8cf0;
}

.info-row {
  margin: 15px;
}

.info-row span {
  font-size: 14px;
}
</style>

<style>
.drawer-json-viewer {
  max-height: 450px;
  /*overflow-y: scroll;*/
}

.drawer-json-viewer .jv-node {
  max-height: 380px;
  overflow-y: scroll !important;
}

.green {
  color: #22b822;
}

.grey {
  color: #575757;
}

.codeinline .CodeMirror {
  height: 100px;
}
.TableEdit .el-dialog__header{
  display: none;
}
.TableEdit .el-dialog__body{
  padding: 15px;
}
</style>

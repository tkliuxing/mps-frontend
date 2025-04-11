<template>
  <div class="workflow">
    <el-card :style="`height: ${getHeight}px`">
      <div style="margin-bottom:10px">{{system.name}}</div>
      <el-form inline style="float:right;">
        <el-form-item>
          <el-button type="primary" @click="create" icon="el-icon-plus">
            新建
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="loadData" icon="el-icon-refresh">
            刷新
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="data" border highlight-current-row v-loading="loading" :height="getHeight - 130">
        <el-table-column label="流程名称" prop="name"></el-table-column>
        <el-table-column label="表单模版" prop="formtemplate_name"></el-table-column>
        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="{ row }">
            <el-button type="warning" size="small" @click.stop="editflow(row)">流程图
            </el-button>
            <el-button type="primary" size="small" @click.stop="edit(row)">编辑
            </el-button>
            <el-button type="danger" size="small" @click.stop="del(row.pk)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <!--  新建流程 Dialog  -->
    <el-dialog :title="update ? '修改' : '新建'" :visible.sync="createDialogVisable" width="30%" center :close-on-click-modal="false" @closed="clear">
      <el-form :model="form" inline label-width="150px" ref="form">
        <el-form-item label="所属机构" prop="org_id" :rules="{ required: true, message: '必填项!' }">
          <el-input type="number" v-model="form.org_id"></el-input>
        </el-form-item>
        <el-form-item label="业务ID" prop="biz_id" :rules="{ required: true, message: '必填项!' }">
          <el-input type="number" v-model="form.biz_id"></el-input>
        </el-form-item>
        <el-form-item label="流程名称" prop="name" :rules="{ required: true, message: '必填项!' }">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="表单模版" prop="formtemplate" :rules="{ required: true, message: '必填项!' }">
          <el-select v-model="form.formtemplate" filterable @change="template_change">
            <el-option v-for="item in formtemplates" :label="item.title" :value="item.pk" :key="item.pk"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模版标题字段" prop="title_field_name" :rules="{ required: true, message: '必填项!' }">
          <el-select v-model="form.title_field_name" filterable>
            <el-option v-for="item in field_list" :label="item.col_title" :value="item.alias" :key="item.pk"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公文流" prop="is_doc_flow" :rules="{ required: true, message: '必填项!' }">
          <el-switch v-model="form.is_doc_flow"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="createDialogVisable = false">取消</el-button>
        <el-button type="primary" @click="submit" :loading="createLoading">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import resource from '@/resource';

export default {
  name: "workflow",
  props: {
    biz_id: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      loading: false,
      createLoading: false,
      createDialogVisable: false,
      system: {},
      formtemplates: [],
      field_list: [],
      data: [],
      form:{
        sys_id: null,
        org_id: 1,
        biz_id: 1,
        name: '',
        formtemplate: null,
        title_field_name: null,
        is_doc_flow: false,
      },
      update: null,
    }
  },
  async mounted() {
    await this.loadSystem();
  },
  methods: {
    async loadSystem() {
      let res = await resource.getList('system', { sys_id: this.currentSystemId })
      this.system = res[0]
      this.form.sys_id = this.system.sys_id;
      this.loadData();
      this.loadFormTemplates();
    },
    async loadData() {
      let params = {
        sys_id: this.system.sys_id,
      };
      if(this.biz_id){
        params.biz_id = this.biz_id;
      }
      this.loading = true;
      this.data = await resource.getList("workflowdefine", params);
      this.loading = false;
    },
    async loadFormTemplates(){
      let params = {
        sys_id: this.system.sys_id,
      };
      if(this.biz_id){
        params.biz_id = this.biz_id;
      }
      this.loading = true;
      this.formtemplates = await resource.getList("formtemplatemin", params);
      this.loading = false;
    },
    async template_change(){
      this.form.title_field_name = null;
      let data = await resource.getObj('formtemplate', this.form.formtemplate);
      console.log(data);
      this.field_list = data.field;
      // this.field_list = this.formtemplates.find((item)=>{
      //   return item.pk === this.form.formtemplate;
      // }).field_list;
    },
    create(){
      this.form.biz_id = this.biz_id;
      this.createDialogVisable = true;
    },
    async submit(){
      let valid = await new Promise((resolve, reject)=>{
        this.$refs["form"].validate(valid=>{
          resolve(valid);
        })
      });
      if (valid) {
        this.createLoading = true;
        if (this.update) {
          let data = {...this.form};
          if(data.bpmn_file){
            delete data.bpmn_file;
          }
          if (data.users){
            delete data.users;
          }
          await this.$http.patch(`/workflowdefine/${this.update.pk}/`, data);
          this.$message.success("修改成功!");
          this.createDialogVisable = false;
          this.createLoading = false;
          await this.loadData();
        } else {
          await this.$http.post("/workflowdefine/", this.form);
          this.$message.success("新建成功!");
          this.createDialogVisable = false;
          this.createLoading = false;
          await this.loadData();
        }
        this.clear();
        this.$refs["form"].resetFields();
      } else {
        this.$message.error("请填写必填项！");
      }
    },
    editflow(obj){
      this.$router.push({name:'workflowedit', params:{pk: obj.pk}});
    },
    async edit(obj) {
      this.form = { ...obj };
      let data = await resource.getObj('formtemplate', this.form.formtemplate);
      this.field_list = data.field;
      this.update = obj;
      this.createDialogVisable = true;
    },
    async del(pk) {
      try{
        await this.$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await resource.deleteObj('workflowdefine', pk);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        await this.loadData();
      }catch (e) {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      }
    },
    clear() {
      this.form = {
        sys_id: this.currentSystemId,
        org_id: 1,
        biz_id: 1,
        name: '',
        formtemplate: null,
        title_field_name: null,
        is_doc_flow: false,
      };
      this.field_list = [];
      this.update = null;
    },
  },
  computed: {
    ...mapState(["currentSystemId"]),
    getHeight() {
      return window.innerHeight - 150;
    },
  },
  watch: {
    currentSystemId: {
      async handler() {
        this.$emit("click", null);
        await this.loadSystem();
      }
    },
    biz_id(){
      this.loadSystem();
    }
  }
}
</script>

<style scoped>
</style>


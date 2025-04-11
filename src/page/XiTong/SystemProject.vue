<template>
  <div class="systemproject">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ system.name }} 项目工程配置</span>
        <el-button style="float: left; padding: 4px 3px; margin-right:20px;" icon="el-icon-back" type="text" @click="$router.go(-1)">返回
        </el-button>
      </div>
      <el-form inline>
        <el-form-item>
          <el-button type="primary" @click="addProject" icon="el-icon-plus">新建</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="data" border highlight-current-row v-loading="loading" style="width: 100%">
        <el-table-column prop="pk" label="工程ID" width="200">
        </el-table-column>
        <el-table-column prop="name" label="名称" width="200">
        </el-table-column>
        <el-table-column prop="biz_id" label="业务子系统">
          <template slot-scope="scope">
            {{ biz_display(scope.row.biz_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="project_type" label="类型">
        </el-table-column>
        <el-table-column prop="git_url" label="GIT url">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :before-close="closeDialog" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工程名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="业务子系统" prop="biz_id">
          <el-select v-model="form.biz_id">
            <el-option v-for="item in bizs" :key="item.biz_id" :label="item.name" :value="item.biz_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工程类型" prop="project_type">
          <el-select v-model="form.project_type">
            <el-option v-for="item in projectTypes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="GIT URL" prop="name">
          <el-input v-model="form.git_url"></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.desc" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { PROJECT_TYPES } from '@/constvars';

const FORM = {
  pk: null,
  system: null,
  biz_id: null,
  name: '',
  pm_name: '',
  git_url: '',
  project_type: '',
  desc: '',
}

export default {
  name: "SystemProject",
  props: {
    system_id: { type: String, required: true },
  },
  data() {
    return {
      data: [],
      bizs: [],
      dialogVisible: false,
      loading: false,
      projectTypes: PROJECT_TYPES,
      form: JSON.parse(JSON.stringify(FORM)),
      rules: {
        name: [{ type: 'string', required: true, message: '请填写名称' }],
        project_type: [{ type: 'string', required: true, message: '选择项目类型' }],
        git_url: [{ type: 'string', required: true, message: '选择填写 GIT url' }],
      },
      system: {
        name: '',
      },
    }
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        let resp = await this.$http.get('/systemproject/', { params: { system: this.system_id } });
        this.data = resp.data;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async loadBiz(){
      let params = {
        system: this.system_id,
        o: "biz_id",
      };
      let res = await this.$http.get("/systembiz/", { params });
      this.bizs = res.data;
    },
    biz_display(biz_id){
      let biz = this.bizs.find(item => item.biz_id === biz_id);
      return biz ? biz.name : '';
    },
    handleSelect(item) {
      console.log(item);
      // this.form.pm_name = item.value;
    },
    async loadSystem() {
      let resp = await this.$http.get(`/system/${this.system_id}/`);
      this.system = resp.data;
    },
    resetForm() {
      this.form = JSON.parse(JSON.stringify(FORM));
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.resetForm();
      this.dialogVisible = false;
    },
    addProject() {
      this.resetForm();
      this.dialogVisible = true;
    },
    edit(data) {
      this.form = { ...data };
      this.dialogVisible = true;
    },
    async submit() {
      let data = { ...this.form };
      data.system = this.system_id;
      try {
        if (data.pk) {
          await this.$http.put(`/systemproject/${data.pk}/`, data);
          this.$message('修改成功！');
        } else {
          await this.$http.post(`/systemproject/`, data);
          this.$message('添加成功！');
        }
        await this.loadData();
        this.closeDialog();
      } catch (e) {
        console.log(e)
      } finally {
        this.dialogVisible = false;
      }
    },
  },
  mounted() {
    this.loadSystem();
    this.loadBiz();
    this.loadData();
  },
}
</script>

<style>
.systemproject {
  padding: 0;
  margin: 0;
}
</style>

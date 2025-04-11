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
        <el-table-column prop="sys_id" label="sys_id" width="100">
        </el-table-column>
        <el-table-column prop="org_id" label="org_id" width="100">
        </el-table-column>
        <el-table-column prop="org_name" label="租户名称">
          <template v-slot="{row}">{{get_org_name(row.org_id)}}</template>
        </el-table-column>
        <el-table-column prop="user_name" label="操作人">
        </el-table-column>
        <el-table-column prop="create_time" label="操作时间">
          <template v-slot="{row}">{{get_datetime_display(row.create_time)}}</template>
        </el-table-column>
        <el-table-column prop="backup_params" label="备份内容">
          <template v-slot="{row}">{{get_backup_params_display(row)}}</template>
        </el-table-column>
        <el-table-column label="备份文件">
          <template v-slot="{row}">
            <el-link :href="row.backup_file" target="_blank">{{get_filename(row.backup_file)}}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="提示" :visible.sync="dialogVisible" :before-close="closeDialog" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="租户" prop="org_id">
          <el-select v-model="form.org_id" clearable>
            <el-option v-for="item in orgs" :key="item.pk" :label="item.name" :value="item.org_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否包含清空语句">
          <el-switch v-model="form.backup_params.include_delete"></el-switch>
        </el-form-item>
        <el-form-item label="是否包含用户产生的数据">
          <el-switch v-model="form.backup_params.include_data"></el-switch>
        </el-form-item>
        <el-form-item label="是否包含常参">
          <el-switch v-model="form.backup_params.include_parameters"></el-switch>
        </el-form-item>
        <el-form-item label="是否包含CMS数据">
          <el-switch v-model="form.backup_params.include_cms"></el-switch>
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

export default {
  name: "SystemDataBackup",
  props: {
    sys_id: { type: Number, required: true },
  },
  data() {
    return {
      data: [],
      dialogVisible: false,
      loading: false,
      projectTypes: PROJECT_TYPES,
      form: {
        pk: null,
        sys_id: null,
        org_id: null,
        user_name: '',
        backup_params: {
          include_delete: false,
          include_data: false,
          include_parameters: false,
          include_cms: false,
        },
      },
      rules: {},
      orgs: [],
      system: {
        name: '',
      },
    }
  },
  methods: {
    get_org_name(org_id){
      let org = this.orgs.find(item => item.org_id === org_id);
      if (org) {
        return org.name;
      } else {
        return org_id;
      }
    },
    get_datetime_display(datetime){
      return this.$moment(datetime).format('YYYY-MM-DD HH:mm:ss');
    },
    get_filename(url){
      let arr = url.split('/');
      return arr[arr.length - 1];
    },
    get_backup_params_display(row){
      let params = JSON.parse(row.backup_params);
      let arr = [];
      if (params.include_delete) {
        arr.push('包含清空语句');
      }
      arr.push('包含数据定义');
      if (params.include_data) {
        arr.push('包含用户产生的数据');
      }
      if (params.include_parameters) {
        arr.push('包含常参');
      }
      if (params.include_cms) {
        arr.push('包含CMS数据');
      }
      return arr.join('，');
    },
    async loadData() {
      this.loading = true;
      try {
        let resp = await this.$http.get('/systemdatabackup/', { params: { sys_id: this.sys_id } });
        this.data = resp.data;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async loadSystem() {
      if (this.sys_id === null) {
        this.$message.error("sys_id 未设置");
        return;
      }
      this.loading = true;
      let params = {
        sys_id: this.sys_id,
      };
      try {
        let resp = await this.$http.get("/system/", { params });
        if (resp.data.length > 0) {
          this.system = resp.data[0];
        } else {
          this.$message.error("sys_id 错误！");
        }
      } finally {
        this.loading = false;
      }
    },
    async loadOrgs() {
      let params = {
        sys_id: this.sys_id,
        o: "org_id",
      };
      let res = await this.$http.get("/systemorg/", { params });
      this.orgs = res.data;
    },
    resetForm() {
      this.form = {
        pk: null,
        sys_id: null,
        org_id: null,
        user_name: '',
        backup_params: {
          include_delete: false,
          include_data: false,
          include_parameters: false,
          include_cms: false,
        },
      }
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
      data.backup_params = JSON.stringify(data.backup_params);
      data.sys_id = this.sys_id;
      data.user_name = this.$store.state.userinfo.full_name;
      try {
        if (data.pk) {
          await this.$http.put(`/systemdatabackup/${data.pk}/`, data);
          this.$message('修改成功！');
        } else {
          await this.$http.post(`/systemdatabackup/`, data);
          this.$message('备份成功！');
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
    this.loadOrgs();
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

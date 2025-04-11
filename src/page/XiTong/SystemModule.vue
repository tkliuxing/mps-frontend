<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>{{ system.name }} 系统模块配置</span>
      <el-button style="float: left; padding: 4px 3px; margin-right:20px;" icon="el-icon-back" type="text"
                 @click="$router.go(-1)">返回
      </el-button>
    </div>
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="createDialogVisiable=true" icon="el-icon-circle-plus-outline">新建</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table stripe border :data="data"
                :cell-style="{ 'text-align': 'center' }"
                :header-cell-style="{ 'text-align': 'center' }" style="margin-top:1rem">
        <el-table-column label='名称' prop="name"></el-table-column>
        <el-table-column label='权限' prop="func_names"></el-table-column>
        <el-table-column label='角色' prop="func_group_names"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" icon="el-icon-edit" @click="edit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="form.pk? '编辑': '新建'" :visible.sync="createDialogVisiable" width="30%" center
               @closed="clearFormData('form')">
      <el-form inline :model="form" ref="form">
        <el-form-item label='名称' prop="name" :rules='[{required: true, message:"此项必填"}]'>
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label='权限'>
          <el-select v-model="form.permissions" placeholder="权限" multiple>
            <el-option
                v-for="item in permissions"
                :key="item.pk"
                :label="item.name"
                :value="item.pk">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='角色'>
          <el-select v-model="form.groups" placeholder="角色" multiple>
            <el-option
                v-for="item in groups"
                :key="item.pk"
                :label="item.name"
                :value="item.pk">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button icon="el-icon-close" @click="createDialogVisiable=false">取消</el-button>
    <el-button type="primary" icon="el-icon-check" @click="submitForm('form')">确定</el-button>
    </span>
    </el-dialog>

  </el-card>
</template>
<script>
import resource from "@/resource";

export default {
  name: "systemmodule",
  props: {
    sys_id: {type: Number, required: true},
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        name: null,
        system: null,
        permissions: [],
        groups: [],
        sys_id: null,
        pk: null,
      },
      filterData: {},
      data: [],
      permissions: [],
      groups: [],
      createDialogVisiable: false,
      system: {
        pk: '',
        sys_id: '',
        name: '',
      }
    }
  },
  methods: {
    async loadPermissions() {
      let params = {
        sys_id: this.sys_id,
      }
      this.permissions = await resource.getList('permissions', params);
    },
    async loadGroups() {
      let params = {
        sys_id: this.sys_id,
      }
      this.groups = await resource.getList('group', params);
    },
    async loadData() {
      let params = {
        sys_id: this.sys_id,
      }
      let res = await resource.getList('systemmodule', params, this.page, this.pageSize);
      this.total = res.length;
      this.data = res;
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = this.form;
          data.sys_id = this.sys_id;
          data.system = this.system.pk;
          if (data.pk) {
            await resource.updateObj('systemmodule', data.pk, data);
            this.$message.success("修改成功!");
          } else {
            await resource.createObj('systemmodule', data);
            this.$message.success("新建成功!");
          }
          this.createDialogVisiable = false;
          await this.loadData();
        } else {
          this.$message.error("请检查所填项!")
          return false;
        }
      });
    },
    search() {
    },
    clearFormData(formName) {
      this.form = {
        name: null,
        system: null,
        permissions: [],
        groups: [],
        sys_id: this.sys_id,
        pk: null,
      };
      this.$refs[formName].resetFields();
    },
    edit(obj) {
      this.form = {...obj};
      this.createDialogVisiable = true;
    },
    async loadSystem() {
      if (this.sys_id === null) {
        this.$message.error('sys_id 未设置');
        return;
      }
      this.loading = true;
      let params = {
        sys_id: this.sys_id,
      }
      try {
        let system = await resource.getObjFromList('system', params);
        if (system) {
          this.system = system;
        } else {
          this.$message.error('sys_id 错误！');
        }
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.loadSystem();
    await this.loadPermissions();
    await this.loadGroups();
    await this.loadData();
  },
}
</script>

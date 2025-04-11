<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>功能模块开通</span>
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
        <el-table-column label='名称' prop="systemmodule_info.name"></el-table-column>
        <el-table-column label='权限' prop="func_names"></el-table-column>
        <el-table-column label='角色' prop="func_group_names"></el-table-column>
        <el-table-column label='开通日期' prop="add_date"></el-table-column>
        <el-table-column label='时长(天)' prop="period"></el-table-column>
        <el-table-column label='截止日期' prop="end_date"></el-table-column>
        <el-table-column label='剩余时长(天)' prop="remaining_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" icon="el-icon-edit" @click="edit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="form.pk? '编辑': '新建'" :visible.sync="createDialogVisiable" width="30%" center
               @closed="clearFormData('form')">
      <el-form inline :model="form" ref="form" label-width="100px">
        <el-form-item label="功能模块" prop="systemmodule" :rules="[{required:true, message: '必填项'}]">
          <el-select v-model="form.systemmodule">
            <el-option
                v-for="item in systemmodules"
                :key="item.pk"
                :label="item.name"
                :value="item.pk">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开通日期" prop="add_date" :rules="[{required:true, message: '必填项'}]">
          <el-date-picker v-model="form.add_date" value-format="yyyy-MM-dd" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="时长(天)" prop="period" :rules="[{required:true, message: '必填项'}]">
          <el-input v-model="form.period" type="number"></el-input>
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
  name: "orgmodule",
  props: {
    org_pk: {type: String, required: true},
  },
  data() {
    return {
      sys_id: null,
      page: 1,
      pageSize: 10,
      total: 0,
      form: {
        sys_id: null,
        org: null,
        systemmodule: null,
        add_date: null,
        period: 0,
        pk: null,
      },
      filterData: {},
      data: [],
      systemmodules: [],
      groups: [],
      createDialogVisiable: false,
      org: {
        pk: '',
        sys_id: '',
        org_id: '',
        name: '',
      }
    }
  },
  methods: {
    async loadSystemModules() {
      let params = {
        sys_id: this.sys_id,
      }
      this.systemmodules = await resource.getList('systemmodule', params);
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
        org: this.org_pk,
      }
      this.loading = true;
      try{
        let res = await resource.getList('orgmodule', params, this.page, this.pageSize);
        this.total = res.count;
        this.data = res.data;
      } finally {
        this.loading = false;
      }
    },
    async submitForm(formName) {
      let valid = await new Promise((resolve, reject) => {
        this.$refs[formName].validate(resolve);
      })
      if (valid) {
        let data = this.form;
        data.sys_id = this.sys_id;
        data.org = this.org_pk;
        if (data.pk) {
          await resource.updateObj('orgmodule', data.pk, data);
          this.$message.success("修改成功!");
        } else {
          await resource.createObj('orgmodule', data);
          this.$message.success("新建成功!");
        }
        this.createDialogVisiable = false;
        await this.loadData();
      } else {
        this.$message.error("请检查所填项!")
        return false;
      }
    },
    search() {
    },
    clearFormData(formName) {
      this.form = {
        sys_id: this.sys_id,
        org: this.org_pk,
        systemmodule: null,
        add_date: null,
        period: 0,
        pk: null,
      };
      this.$refs[formName].resetFields();
    },
    edit(obj) {
      this.form = {...obj};
      this.createDialogVisiable = true;
    },
    async loadOrg() {
      if (this.org_pk === null) {
        this.$message.error('org_pk 未设置');
        return;
      }
      this.loading = true;
      try {
        let org = await resource.getObj('org', this.org_pk);
        this.sys_id = org.sys_id;
        this.org = org;
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.loadOrg();
    await this.loadSystemModules();
    await this.loadData();
  },
}
</script>

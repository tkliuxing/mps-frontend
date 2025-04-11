<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>{{ system.name }} 机构管理</span>
      <el-button
        style="float: left; padding: 4px 3px; margin-right:20px;"
        icon="el-icon-back"
        type="text"
        @click="$router.go(-1)"
        >返回
      </el-button>
    </div>
    <div>
      <el-form inline>
        <el-form-item>
          <el-button
            type="primary"
            @click="createDialogVisiable = true"
            icon="el-icon-circle-plus-outline"
            >新建</el-button
          >
        </el-form-item>
        <el-form-item label="机构名称">
          <el-input v-model="filterData.name" />
        </el-form-item>
        <el-form-item label="机构编号">
          <el-input v-model="filterData.org_id" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      stripe
      border
      :data="data"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      style="margin-top:1rem"
    >
      <el-table-column label="机构编号" prop="org_id"></el-table-column>
      <el-table-column label="机构名称" prop="name"></el-table-column>
      <el-table-column label="到期时间" prop="end_date"></el-table-column>
      <el-table-column label="功能列表">
        <template slot-scope="scope">
          <el-tag
            effect="plain"
            size="mini"
            v-for="(name, idx) in scope.row.permissions_display"
            :key="idx"
            >{{ name }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="{ row }">
          <el-button
            :type="row.manager ? 'info' : 'success'"
            icon="el-icon-user-solid"
            @click="Manage(row)"
            >{{ row.manager ? "编辑" : "添加" }}管理员</el-button
          >
          <el-button type="primary" icon="el-icon-edit" @click="edit(row)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-remove" @click="del(row.pk)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, sizes, total"
      :page-size.sync="pageSize"
      :current-page.sync="page"
      @current-change="loadData"
      @size-change="loadData"
      :hide-on-single-page="false"
      :total="total"
      style="margin-top: 20px"
    ></el-pagination>
    <el-dialog
      title="新建"
      :visible.sync="createDialogVisiable"
      width="30%"
      center
      @closed="clearFormData('form')"
    >
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item
          label="机构名称"
          prop="name"
          :rules="[{ required: true, message: '请填写名称' }]"
        >
          <el-input style="" v-model="form.name" />
        </el-form-item>
        <el-form-item label="功能列表" prop="permissions">
          <el-select
            v-model="form.permissions"
            multiple
            clearable
            filterable
            placeholder="功能列表"
            @change="permissions_change"
          >
            <el-checkbox v-model="form.select_all" @change="permissions_check" style="padding-left: 18px;" >全选</el-checkbox>
            <el-option
              v-for="item in permissions"
              :key="item.pk"
              :label="item.name"
              :value="item.pk"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权码" prop="license">
          <el-input type="textarea" style="" v-model="form.license" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button icon="el-icon-close" @click="createDialogVisiable = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="submitForm('form')"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="编辑"
      :visible.sync="updateDialogVisiable"
      width="30%"
      center
      @closed="clearFormData('updateform')"
    >
      <el-form :model="update" ref="updateform" label-width="100px">
        <el-form-item
          label="机构名称"
          prop="name"
          :rules="[{ required: true, message: '请填写名称' }]"
        >
          <el-input style="" v-model="update.name" />
        </el-form-item>
        <el-form-item label="功能列表" prop="permissions">
          <el-select
            v-model="update.permissions"
            multiple
            clearable
            filterable
            placeholder="功能列表"
            @change="update_permissions_change"
          >
            <el-checkbox v-model="update.select_all" @change="update_permissions_check" style="padding-left: 18px;" >全选</el-checkbox>
            <el-option
              v-for="item in permissions"
              :key="item.pk"
              :label="item.name"
              :value="item.pk"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权码" prop="license">
          <el-input type="textarea" style="" v-model="update.license" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button icon="el-icon-close" @click="updateDialogVisiable = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="updateForm('updateform')"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="manageDialogVisible"
      :title="manageUser.pk ? '编辑管理员' : '新增管理员'"
      center
      :close-on-click-modal="false"
      @closed="currentOrg = null"
    >
      <el-form :model="manageUser" label-width="100px" ref="manageForm">
        <el-form-item
          label="用户名"
          prop="username"
          :rules="{ required: true, message: '请填写用户名' }"
        >
          <el-input v-model="manageUser.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :rules="{ required: !manageUser.pk, message: '请填写密码' }"
        >
          <el-input
            type="password"
            v-model="manageUser.password"
            show-password
            :placeholder="manageUser.pk && '非修改密码可不填写'"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="!manageUser.pk"
          label="确认密码"
          prop="checkpassword"
          :rules="{ required: true, validator: checkPassword }"
        >
          <el-input
            type="password"
            v-model="manageUser.checkpassword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="full_name">
          <el-input v-model="manageUser.full_name"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-cascader
            style="width:100%"
            v-model="manageUser.department"
            :options="dep_list"
            :props="defineProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="功能">
          <el-select
            v-model="manageUser.func_user_permissions"
            style="width:100%"
            multiple
            clearable
            filterable
            placeholder="功能列表"
            @change="user_permissions_change"
          >
            <el-checkbox v-model="manageUser.select_all" @change="user_permissions_check" style="padding-left: 18px;" >全选</el-checkbox>
            <el-option
              v-for="i in user_permissions_list"
              :key="i.pk"
              :label="i.name"
              :value="i.pk"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button icon="el-icon-close" @click="manageDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" icon="el-icon-check" @click="submitManage"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
const formdata = {
  sys_id: null,
  org_id: null,
  src_id: null,
  system: null,
  name: null,
  manager: null,
  license: null,
  permissions: null,
  permissions_display: null,
  select_all: false,
};
import resource from "@/resource";
export default {
  name: "Org",
  props: {
    sys_id: { type: String, default: 0 },
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      form: { ...formdata },
      update: { ...formdata, pk: null },
      filterData: { name: null, org_id: null },
      data: [],
      createDialogVisiable: false,
      updateDialogVisiable: false,
      manageDialogVisible: false,
      permissions: [],
      dep_list: [],
      system: {
        pk: "",
        sys_id: "",
        name: "",
      },
      currentOrg: null,
      manageUser: {
        username: "",
        password: "",
        full_name: "",
        department: "",
        func_user_permissions: [],
        select_all: false,
      },
      user_permissions_list: [],
    };
  },
  methods: {
    user_permissions_change(list){
      if(list.length === this.user_permissions_list.length){
        this.manageUser.select_all = true;
      } else {
        this.manageUser.select_all = false;
      }
    },
    user_permissions_check(val){
      if(val){
        this.manageUser.func_user_permissions = this.user_permissions_list.map(item => item.pk);
      } else {
        this.manageUser.func_user_permissions = [];
      }
    },
    update_permissions_check(val) {
      if (val) {
        this.update.permissions = this.permissions.map((item) => item.pk);
      } else {
        this.update.permissions = [];
      }
    },
    update_permissions_change(list) {
      if (list.length === this.permissions.length) {
        this.update.select_all = true;
      } else {
        this.update.select_all = false;
      }
    },
    permissions_check(val) {
      if (val) {
        this.form.permissions = this.permissions.map((item) => item.pk);
      } else {
        this.form.permissions = [];
      }
    },
    permissions_change(list) {
      if (list.length === this.permissions.length) {
        this.form.select_all = true;
      } else {
        this.form.select_all = false;
      }
    },
    async submitManage() {
      let valid = await new Promise((resolve) =>
        this.$refs.manageForm.validate(resolve)
      );
      if (valid) {
        try {
          if (this.manageUser.pk) {
            await resource.updateObj(
              "user",
              this.manageUser.pk,
              this.manageUser
            );
            this.$notify({
              type: "success",
              message: "编辑成功!",
            });
          } else {
            this.manageUser.org_id = this.currentOrg.org_id;
            this.manageUser.sys_id = this.currentOrg.sys_id;
            let res = await resource.createObj("user", this.manageUser);
            await resource.patchObj("systemorg", this.currentOrg.pk, {
              manager: res.pk,
            });
            this.$notify({
              type: "success",
              message: "添加成功!",
            });
          }
          (this.manageUser = {
            username: "",
            password: "",
            full_name: "",
            department: "",
            func_user_permissions: [],
          }),
            (this.manageDialogVisible = false);
          this.$refs.manageForm.resetFields();
          this.loadData();
        } catch (error) {}
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
    async loadData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sys_id: this.sys_id,
        o: "org_id",
      };
      let res = await this.$http.get("/systemorg/", { params });
      this.total = res.data.count;
      this.data = res.data.data;
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = { ...this.form };
          data.sys_id = this.sys_id;
          data.system = this.system.pk;
          await this.$http.post("/systemorg/", data);
          this.$message.success("新建成功!");
          this.createDialogVisiable = false;
          await this.loadData();
        } else {
          this.$message.error("请检查所填项!");
          return false;
        }
      });
    },
    async loadDepartment(row) {
      let res = await resource.getList("department", { org_id: row.org_id });
      function deepClean(obj) {
        obj.forEach((i) => {
          if (Array.isArray(i.items) && i.items.length === 0) {
            i.items = null;
          } else {
            deepClean(i.items);
          }
        });
      }
      deepClean(res);
      this.dep_list = res;
    },
    async loadPerms() {
      let params = {
        sys_id: this.sys_id,
      };
      let res = await this.$http.get("/permissions/", { params });
      this.permissions = res.data;
    },
    async Manage(row) {
      if (row.manager) {
        let res = await resource.getObj("user", row.manager);
        this.manageUser = { ...res };
      }
      let permissionList = [];
      row.permissions.forEach((e, i) => {
        permissionList.push({ pk: e, name: row.permissions_display[i] });
      });
      this.user_permissions_list = permissionList;
      this.currentOrg = row;
      await this.loadDepartment(row);
      this.manageDialogVisible = true;
    },
    async updateForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = { ...this.update };
          await this.$http.put("/systemorg/" + this.update.pk + "/", data);
          this.$message.success("编辑成功!");
          this.updateDialogVisiable = false;
          await this.loadData();
        } else {
          this.$message.error("请检查所填项!");
          return false;
        }
      });
    },
    del(pk) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete("/systemorg/" + pk + "/");
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
    async search() {
      this.page = 1;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sys_id: this.sys_id,
        o: "org_id",
      };
      let check = Object.prototype.toString;
      for (const key in this.filterData) {
        if (check.call(this.filterData[key]) === "[object Array]") {
          params[key + "_before"] = this.filterData[key][0];
          params[key + "_after"] = this.filterData[key][1];
        } else {
          params[key] = this.filterData[key];
        }
      }
      let res = await this.$http.get("/systemorg/", { params });
      this.data = res.data;
      this.total = res.data.count;
      this.data = res.data.data;
    },
    clearFormData(formName) {
      this.form = { ...formdata };
      this.update = { ...formdata, pk: null };
      this.$refs[formName].resetFields();
    },
    edit(obj) {
      for (const key in obj) {
        if (key.startsWith("field")) {
          if (
            obj[key] &&
            typeof obj[key] === "string" &&
            obj[key].startsWith("[") &&
            obj[key].endsWith("]")
          ) {
            obj[key] = JSON.parse(obj[key]);
          }
        }
      }
      this.update = { ...obj, select_all: obj.permissions.length === this.permissions.length };
      this.updateDialogVisiable = true;
    },
    checkPassword(rules, value, cb) {
      if (!value) {
        return cb(new Error("请输入密码"));
      }
      if (value !== this.manageUser.password) {
        return cb(new Error("两次密码不一致！"));
      }
      cb();
    },
  },
  async mounted() {
    await this.loadSystem();
    await this.loadPerms();
    await this.loadData();
  },
  computed: {
    defineProps() {
      return {
        label: "name",
        value: "pk",
        children: "items",
        checkStrictly: true,
        emitPath: false,
      };
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 5px;
}
</style>

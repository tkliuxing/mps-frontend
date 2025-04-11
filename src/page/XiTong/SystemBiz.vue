<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>{{ system.name }} 业务子系统定义</span>
      <el-button
        style="float: left; padding: 4px 3px; margin-right:20px;"
        icon="el-icon-back"
        type="text"
        @click="$router.replace({name: 'systems'})"
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
        <el-form-item label="业务子系统名称">
          <el-input v-model="filterData.name" />
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="filterData.biz_id" />
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
      <el-table-column label="业务子系统编号" prop="biz_id" width="200"></el-table-column>
      <el-table-column label="名称" prop="name" width="300"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="{ row }">
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
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请填写名称' }]"
        >
          <el-input style="" v-model="form.name" />
        </el-form-item>
        <el-form-item label="编号biz_id" prop="biz_id" :rules="[{ required: true, message: '请填写编号' }]">
          <el-input-number v-model="form.biz_id"></el-input-number>
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
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请填写名称' }]"
        >
          <el-input style="" v-model="update.name" />
        </el-form-item>
        <el-form-item label="编号biz_id" prop="biz_id" :rules="[{ required: true, message: '请填写编号' }]">
          <el-input-number v-model="update.biz_id"></el-input-number>
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
  </el-card>
</template>
<script>
const formdata = {
  sys_id: null,
  org_id: null,
  src_id: null,
  system: null,
  name: null,
};
import resource from "@/resource";
export default {
  name: "Org",
  props: {
    system_id: { type: String, default: 0 },
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      form: { ...formdata },
      update: { ...formdata, pk: null },
      filterData: { name: null, biz_id: null },
      data: [],
      createDialogVisiable: false,
      updateDialogVisiable: false,
      system: {
        pk: "",
        sys_id: "",
        name: "",
      },
    };
  },
  methods: {
    async loadSystem() {
      if (this.system_id === null) {
        this.$message.error("system_id 未设置");
        return;
      }
      this.loading = true;
      try {
        this.system = await resource.getObj('system', this.system_id);
      } finally {
        this.loading = false;
      }
    },
    async loadData() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        system: this.system_id,
        o: "biz_id",
      };
      let res = await this.$http.get("/systembiz/", { params });
      this.total = res.data.count;
      this.data = res.data.data;
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = { ...this.form };
          data.sys_id = this.system.sys_id;
          data.system = this.system.pk;
          try{
            await this.$http.post("/systembiz/", data);
            this.$message.success("新建成功!");
            this.createDialogVisiable = false;
            await this.loadData();
          } catch (e) {
            this.$message.error(JSON.stringify(e.response.data))
          }
        } else {
          this.$message.error("请检查所填项!");
          return false;
        }
      });
    },
    async updateForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = { ...this.update };
          try{
            await this.$http.put("/systembiz/" + this.update.pk + "/", data);
            this.$message.success("编辑成功!");
            this.updateDialogVisiable = false;
            await this.loadData();
          } catch (e) {
            this.$message.error(JSON.stringify(e.response.data));
          }
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
          await this.$http.delete("/systembiz/" + pk + "/");
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
      let res = await this.$http.get("/systembiz/", { params });
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
      this.update = { ...obj };
      this.updateDialogVisiable = true;
    },
  },
  async mounted() {
    await this.loadSystem();
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

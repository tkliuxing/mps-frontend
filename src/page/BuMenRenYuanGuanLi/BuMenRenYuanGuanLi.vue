<template>
  <div class="BuMenRenYuanGuanLi">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ system.name }} 部门人员管理</span>
        <el-button
          style="float: left; padding: 4px 3px; margin-right:20px;"
          icon="el-icon-back"
          type="text"
          @click="$router.go(-1)"
          >返回
        </el-button>
      </div>
      <el-row style="margin-top:8px;" :gutter="10">
        <el-col :span="8">
          <el-form inline>
            <el-form-item label="机构">
              <el-select v-model="query.org_id" filterable @change="loadData">
                <el-option
                  v-for="item in orgDatas"
                  :key="item.pk"
                  :label="item.name"
                  :value="item.org_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              round
              @click="
                () => {
                  this.from_clean();
                  this.add_department = true;
                }
              "
              class="ln-yellow"
            >
              新增顶级部门
            </el-button>
          </el-form>
          <el-card v-loading="loading">
            <div class="block">
              <el-tree
                :data="data"
                node-key="id"
                :props="{ children: 'items', label: 'name' }"
                :expand-on-click-node="false"
              >
                <span class="custom-tree-node" slot-scope="{ data }">
                  <span>{{ data.name }}</span>
                  <span style="text-align: center">
                    <el-button
                      type="text"
                      size="small"
                      @click="child_add_department(data.pk)"
                      style="margin: 0 10px"
                    >
                      增加子部门
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="update_department(data)"
                      style="margin: 0 10px"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      v-if="data.parent"
                      @click="delete_department(data)"
                      style="margin: 0 10px"
                    >
                      删除
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="view_department(data)"
                      style="margin: 0 10px"
                    >
                      查看
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="user_list(data)"
                      style="margin: 0 10px"
                    >
                      人员
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <renyuan
            v-if="dep_id"
            :org_id="String(query.org_id)"
            :sys_id="sys_id"
            :department_id="dep_id"
          />
        </el-col>
      </el-row>
    </el-card>
    <!--新增部门-->
    <el-dialog title="新增部门" :visible.sync="add_department" width="30%">
      <el-form
        :model="department_form"
        :rules="rules"
        ref="createForm"
        label-width="100px"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input
            v-model="department_form.name"
            autocomplete="off"
            style="width:60%"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input
            v-model="department_form.contact_name"
            autocomplete="off"
            style="width:60%"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input
            v-model="department_form.contact_mobile"
            autocomplete="off"
            style="width:60%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="add_department = false" class="ln-button" round
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="department_add"
          class="ln-button"
          round
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--部门编辑-->
    <el-dialog title="编辑部门" :visible.sync="edt_department" width="30%">
      <el-form
        :model="department_form"
        :rules="rules"
        ref="edtForm"
        label-width="100px"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input
            v-model="department_form.name"
            autocomplete="off"
            style="width:60%"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input
            v-model="department_form.contact_name"
            autocomplete="off"
            style="width:60%"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input
            v-model="department_form.contact_mobile"
            autocomplete="off"
            style="width:60%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="edt_department = false" class="ln-button" round
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="department_edt"
          class="ln-button"
          round
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--查看部门-->
    <el-dialog title="查看部门信息" :visible.sync="departmentView" width="30%">
      <el-form :model="departmentView_list" label-width="50">
        <el-form-item label="部门名称：" prop="name">
          {{ departmentView_list.name }}
        </el-form-item>
        <el-form-item label="联系人：">
          {{ departmentView_list.contact_name }}
        </el-form-item>
        <el-form-item label="手机号：">
          {{ departmentView_list.contact_mobile }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="departmentView = false" class="ln-button" round
          >关 闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RenYuanComponent from "@/page/BuMenRenYuanGuanLi/RenYuanGuanLi/RenYuanComponent.vue";

export default {
  name: "BuMenRenYuanGuanLi",
  components: { renyuan: RenYuanComponent },
  props: {
    sys_id: { type: String, required: true },
  },
  data() {
    return {
      data: [],
      loading: false,
      system: {
        pk: "",
        sys_id: "",
        name: "",
      },
      query: {
        org_id: null,
      },
      dep_id: null,
      orgDatas: [],
      add_department: false,
      edt_department: false,
      rules: {
        name: [
          { required: true, message: "请输入部门名称", trigger: "change" },
        ],
      },
      department_form: {
        name: "",
        category: "",
        contact_name: "",
        contact_mobile: "",
      },
      departmentView: false,
      departmentView_list: {
        name: "",
        category: "",
        contact_name: "",
        contact_mobile: "",
      },
    };
  },
  methods: {
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
      if (!this.query.org_id) {
        return;
      }
      this.loading = true;
      // 加载数据列表及刷新
      let params = {
        sys_id: this.sys_id,
        org_id: this.query.org_id,
      };
      try {
        const resp = await this.$http.get("/department/", { params });
        this.data = resp.data;
        if (resp.data.length > 0) {
          this.dep_id = resp.data[0].pk;
        }
      } catch (err) {
        this.$message.error({ message: "数据获取失败！！", center: true });
      } finally {
        this.loading = false;
      }
    },
    async loadOrgDatas() {
      // 加载数据列表及刷新
      try {
        const resp = await this.$http.get("/systemorg/", {
          params: { sys_id: this.sys_id },
        });
        this.orgDatas = resp.data;
        if (resp.data.length > 0) {
          this.query.org_id = resp.data[0].org_id;
        }
      } catch (err) {
        this.$message.error({ message: "数据获取失败！！", center: true });
      }
    },
    view_department(data) {
      this.departmentView = true;
      this.departmentView_list = { ...data };
      // this.$router.push({name: 'chakanbumen', params: {pk: pk}});
    },
    from_clean() {
      this.department_form = {
        name: "",
        category: "",
        contact_name: "",
        contact_mobile: "",
      };
    },
    // 新增顶级部门
    department_add() {
      // 新增顶级部门
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.add_department = false;
          this.department_form.sys_id = this.sys_id;
          this.department_form.org_id = this.query.org_id;
          this.$http
            .post("/department/", this.department_form)
            .then((resp) => {
              this.loadOrgDatas();
              this.loadData();
            })
            .catch((err) => {
              this.$message.error({
                message: "数据获取失败！！",
                center: true,
              });
            });
        } else {
          this.$message.error("请填写完整信息后提交");
          return false;
        }
      });
    },
    // 新增子部门
    child_add_department(pk) {
      this.department_form.parent = pk;
      this.add_department = true;
    },
    // 编辑部门
    update_department(data) {
      this.department_form = { ...data };
      this.edt_department = true;
    },
    department_edt() {
      this.$refs.edtForm.validate((valid) => {
        if (valid) {
          let id = this.department_form.pk;
          delete this.department_form.pk;
          this.$http
            .patch("/department/" + id + "/", this.department_form)
            .then((resp) => {
              this.edt_department = false;
              this.loadOrgDatas();
              this.loadData();
              this.from_clean();
            })
            .catch((err) => {
              this.$message.error({
                message: "编辑失败，轻重试！！",
                center: true,
              });
            });
        } else {
          this.$message.error("请填写完整信息后提交");
          return false;
        }
      });
    },
    delete_department(data) {
      this.$confirm(
        '此操作将永久删除  "' + data.name + '"  及所属部门, 是否继续?',
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http
            .delete("/department/" + data.pk + "/")
            .then((resp) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.loadData();
            })
            .catch((err) => {
              this.$message.error({ message: "删除失败！！", center: true });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    user_list(data) {
      // this.$router.push({name: 'RenYuanGuanLi', params: {department: data}});
      this.dep_id = data.pk;
    },
  },
  async mounted() {
    await this.loadSystem();
    await this.loadOrgDatas();
    await this.loadData();
  },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

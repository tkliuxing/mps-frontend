<template>
  <div class="workflowrole">
    <el-card :style="`height: ${getHeight}px`">
      <div style="margin-bottom:10px">{{ system.name }}</div>

      <el-form inline style="float:right;">
        <el-form-item>
          <el-button type="primary" @click="createDialogVisable = true" icon="el-icon-plus">
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
        <el-table-column label="职务名称" prop="name" width="170px"></el-table-column>
        <el-table-column label="职务说明" prop="description"></el-table-column>
        <el-table-column label="所在流程" prop="in_workflow_define_names"></el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="{ row }">
            <el-button type="primary" size="small" @click.stop="edit(row)">编辑
            </el-button>
            <el-button type="danger" size="small" @click.stop="del(row.pk)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
    <!--  新建流程 Dialog  -->
    <el-dialog :title="update ? '修改' : '新建'" :visible.sync="createDialogVisable" width="30%" center
               :close-on-click-modal="false" @closed="clear">
      <el-form :model="form" inline label-width="150px" ref="form">
        <el-form-item label="所属机构" prop="org_id" :rules="{ required: true, message: '必填项!' }">
          <el-input type="number" v-model="form.org_id"></el-input>
        </el-form-item>
        <el-form-item label="业务ID" prop="biz_id" :rules="{ required: true, message: '必填项!' }">
          <el-input type="number" v-model="form.biz_id"></el-input>
        </el-form-item>
        <el-form-item label="职务名称" prop="name" :rules="{ required: true, message: '必填项!' }">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="职务描述" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              :autosize="{ minRows: 4}"
              placeholder="请输入内容"
              maxlength="300"
              style="width:210px;"
              show-word-limit/>
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
import resource from "@/resource";

const initial_form = {
  pk: null,
  org_id: 1,
  biz_id: 1,
  name: '',
  description: '',
};

export default {
  name: "workflowrole",
  data() {
    return {
      system: {name: ''},
      update: null,
      loading: false,
      createLoading: false,
      createDialogVisable: false,
      form: {...initial_form},
      data: [],
    }
  },
  computed: {
    ...mapState(["currentSystemId"]),
    getHeight() {
      return window.innerHeight - 100;
    },
  },
  async mounted() {
    await this.loadSystem();
  },
  methods: {
    async loadSystem() {
      let res = await resource.getList('system', {sys_id: this.currentSystemId})
      this.system = res[0]
      this.form.sys_id = this.system.sys_id;
      this.loadData();
    },
    async loadData() {
      let params = {
        sys_id: this.system.sys_id,
      };
      this.loading = true;
      this.data = await resource.getList("workflowrole", params);
      this.loading = false;
    },
    async submit() {
      let valid = await new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          resolve(valid);
        })
      });
      if (valid) {
        this.createLoading = true;
        if (this.update) {
          await this.$http.put(`/workflowrole/${this.update.pk}/`, this.form);
          this.$message.success("修改成功!");
          this.createDialogVisable = false;
          this.createLoading = false;
          await this.loadData();
        } else {
          await this.$http.post("/workflowrole/", this.form);
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
    async del(pk) {
      try {
        await this.$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await resource.deleteObj('workflowrole', pk);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        await this.loadData();
      } catch (e) {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      }
    },
    edit(obj) {
      this.form = {...obj};
      this.update = obj;
      this.createDialogVisable = true;
    },
    clear() {
      this.form = {...initial_form};
      this.update = null;
      this.createLoading = false;
    },
  },
  watch: {
    currentSystemId: {
      async handler() {
        await this.loadSystem();
      }
    }
  }
}
</script>

<style scoped>

</style>

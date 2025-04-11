<template>
  <div class="coderegister">
    <h3>页面菜单</h3>
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card>
          <el-form inline>
            <el-form-item>
              <el-select v-model="system_project_id" placeholder="选择项目" filterable clearable @change="proj_change">
                <el-option v-for="item in systemProjects" :key="item.pk" :label="item.name" :value="item.pk"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" round size="mini" icon="el-icon-refresh" @click="loadData">刷新</el-button>
            </el-form-item>
            <el-form-item>
              <el-button v-if="is_collapse" type="info" icon="el-icon-minus" size="mini" round @click="toggleCollapse" class="ln-yellow">
                全部收起
              </el-button>
              <el-button v-else type="info" icon="el-icon-plus" size="mini" round @click="toggleCollapse" class="ln-yellow">
                全部展开
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" round icon="el-icon-plus" @click="addRoot">增加顶级</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="success" round icon="el-icon-plus" @click="generate">一键生成菜单</el-button>
            </el-form-item>
          </el-form>
          <el-tree v-loading="loading" ref="codeTree" :data="data" node-key="pk" :props="props" :indent="20" :draggable="true" default-expand-all @node-drop="movenode">
            <span class="custom-tree-node" slot-scope="{  data }">
              <span class="custom-tree-name"> <i v-if="data.icon" :class="data.icon"></i> {{ data.name }}</span>
              <span style="text-align: center">
                <el-button type="text" size="small" @click.stop="() => remove('', data)">删除</el-button>
                <el-button type="text" size="small" @click.stop="() => edit('', data)">编辑</el-button>
                <el-button type="text" size="small" @click.stop="() => addChild(data)">新增下级</el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="14" v-if="showModuleInfo">
        <el-card style="position: fixed;width: 58.33333%;">
          <el-row :gutter="15">
            <el-col :span=12>
              <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="标题" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                  <el-input v-model="form.icon"></el-input>
                </el-form-item>
                <el-form-item label="路由名称" prop="router_name">
                  <el-cascader :options="router_tree" :props="router_props" :show-all-levels="false" clearable v-model="form.router_name"></el-cascader>
                </el-form-item>
                <el-form-item label="菜单权限" prop="permission">
                  <el-cascader :options="permissions" :props="perm_props" :show-all-levels="false" clearable v-model="form.permission"></el-cascader>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" round icon="el-icon-check" @click="onSubmit">提交</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span=12>
              <div v-highlight class="router-code" v-if="router_content">
                <pre>
                  <code class="JSON" style="height: 488px;" v-html="router_content"></code>
                </pre>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
/*
  维护 SystemProjectMenu
 */

import { mapState } from "vuex";
import MenuInit from "@/page/CodeRegister/CodeMentInit";
import resource from "@/resource";

const FORM = {
  sys_id: null,
  project: null,
  parent: null,
  name: "",
  icon: "",
  router_name: "",
  permission: null,
};

export default {
  name: "CodeMenu",
  data() {
    return {
      loading: false,
      is_collapse: false,
      sys_id: null,
      system_project_id: null,
      showModuleInfo: false,
      props: {
        id: "pk",
        children: "children",
        label: "name",
      },
      form: JSON.parse(JSON.stringify(FORM)),
      router_content: "",
      rules: {
        name: [{ type: "string", required: true, message: "请填写名称" }],
        router_name: [{ type: "string", required: true, message: "请填写路由名称" }],
        permission: [{ type: "string", required: true, message: "请选择菜单权限" }],
      },
      perm_props: {
        label: 'name',
        value: 'pk',
        children: 'items',
        leaf: "is_leaf_node",
        checkStrictly: true,
        emitPath: false,
      },
      router_props: {
        label: 'name',
        value: 'name',
        leaf: "is_leaf_node",
        checkStrictly: true,
        emitPath: false,
      },
      title: "",
      data: [],
      systemProjects: [],
      permissions: [],
      router_tree: [],
    };
  },
  computed: {
    ...mapState(["systemlist", "userinfo", "currentSystemId"]),
  },
  methods: {
    async generate() {
      if (this.data.length > 0) {
        return this.$message.warning("已有菜单数据,请清除后再生成");
      }
      let data = MenuInit();
      for (const item of data) {
        await this.addDataToAPI(item);
      }
    },
    async addDataToAPI(item, parentPk = null) {
      const loading = this.$loading({
        lock: true,
        text: "生成中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const newItem = { ...item };
      newItem.parent = parentPk; // 设置新的 parent 值
      // 构建请求对象
      let params = {
        sys_id: this.currentSystemId,
        project: this.system_project_id,
        parent: newItem.parent,
        name: newItem.name,
        icon: newItem.icon,
        router_name: newItem.router_name,
        permission: newItem.permission
      };
      try {
        let response = await resource.createObj("systempm", params);
        // 递归处理子项
        for (const childItem of newItem.children) {
          await this.addDataToAPI(childItem, response.pk); // 传递当前项的父级的 pk 作为 parent
        }
        await this.loadData();
      } catch (error) {
        console.error(error);
      } finally {
        // 拿原始数据和当前数据对比，如果长度相等，说明已经全部加载完毕
        if (MenuInit().length == this.data.length) {
          loading.close();
        }
      }
    },
    async loadSystemProject() {
      this.loading = true;
      const project_id = this.$route.query.id;
      let params = {};
      if (!project_id) {
        params.sys_id = this.currentSystemId;
      }
      try {
        let resp = await this.$http.get("/systemproject/", { params });
        this.systemProjects = resp.data;
        if (!project_id) {
          this.system_project_id = this.systemProjects[0].pk;
          await this.loadData();
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async proj_change(){
      await this.loadRouter();
      await this.loadData();
    },
    async loadData() {
      this.showModuleInfo = false;
      this.loading = true;
      try {
        let resp = await this.$http.get(`/systempm/`, {
          params: { project: this.system_project_id, is_root: "True" },
        });
        this.data = resp.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
      this.is_collapse = false;
    },
    async loadRouter() {
      try {
        let resp = await this.$http.get(`/systempr/`, {
          params: { project: this.system_project_id, is_root: "True" },
        });
        this.router_tree = resp.data;
      } catch (e) {
        console.error(e);
      }
    },
    async loadPermissions(){
      let resp = await this.$http.get(`/permissionstree/`, {
        params: { sys_id: this.sys_id, level: 0 },
      });
      this.permissions = resp.data;
    },
    toggleCollapse() {
      this.is_collapse = !this.is_collapse;
      for (
        let i = 0;
        i < this.$refs.codeTree.store._getAllNodes().length;
        i++
      ) {
        this.$refs.codeTree.store._getAllNodes()[i].expanded = this.is_collapse;
      }
    },
    addRoot() {
      this.form = { ...FORM };
      this.form.sys_id = this.currentSystemId;
      this.form.project = this.system_project_id;
      this.showModuleInfo = true;
    },
    addChild(data) {
      this.form = { ...FORM };
      this.form.parent = data.pk;
      this.form.sys_id = this.currentSystemId;
      this.form.project = this.system_project_id;
      this.showModuleInfo = true;
    },
    async onSubmit() {
      const valid = await new Promise((resolve) => this.$refs.form.validate(resolve));
      if(!valid) return;
      this.form.meta = this.genMeta();
      if (this.form.pk) {
        await this.$http.put(`/systempm/${this.form.pk}/`, this.form);
        this.$message.success("修改成功!");
      } else {
        await this.$http.post("/systempm/", this.form);
        this.$message.success("新建成功!");
      }
      this.$refs.form.resetFields();
      await this.loadData();
      this.clear();
    },
    cancel() {
      this.showModuleInfo = false;
      this.clear();
    },
    edit(node, val) {
      let dd = JSON.parse(JSON.stringify(val));
      this.form = dd;
      this.showModuleInfo = true;
    },
    async movenode(node, target, position, event) {
      let pos = "";
      switch (position) {
        case "before":
          pos = "left";
          break;
        case "after":
          pos = "right";
          break;
        case "inner":
          pos = "first-child";
          break;
      }
      let params = {
        node: node.data.pk,
        target: target.data.pk,
        position: pos,
      };
      await this.$resource.createObj("systempmmove", params);
      await this.loadData();
    },
    async remove(node, val) {
      try {
        await this.$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await this.$http.delete(`/systempm/${val.pk}/`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        setTimeout(() => {
          this.loadData();
        }, 300);
      } catch (e) {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      }
    },
    clear() {
      this.form = { ...FORM };
      this.showModuleInfo = false;
    },
    genMeta(){
      let meta = {};
      if(this.form.meta){
        try {
          meta = JSON.parse(this.form.meta);
        } catch {
          meta = {};
        }
      }
      meta.title = this.form.title;
      if(this.form.keepAlive){
        meta.keepAlive = true;
      } else {
        delete meta.keepAlive;
      }
      return JSON.stringify(meta);
    },
  },
  async mounted() {
    this.sys_id = this.currentSystemId;
    await this.loadSystemProject();
    this.loadPermissions();
    this.loadRouter();
    await this.loadData();
  },
};
</script>

<style scoped>
.red {
  color: red;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

<style>
.router-code .JSON.hljs {
  height: 600px !important;
}
</style>


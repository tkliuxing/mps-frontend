<template>
  <div class="coderegister">
    <h3>页面路由</h3>
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card>
          <el-form inline>
            <el-form-item>
              <el-select v-model="system_project_id" placeholder="选择项目" filterable clearable @change="loadData">
                <el-option v-for="item in systemProjects" :key="item.pk" :label="item.name" :value="item.pk"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" round size="mini" icon="el-icon-refresh" @click=loadData>刷新</el-button>
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
              <el-button type="success" round icon="el-icon-plus" @click="generate">一键生成路由</el-button>
            </el-form-item>
          </el-form>
          <el-tree v-loading="loading" ref="codeTree" :data="data" node-key="pk" :props="props" :indent="20" :draggable="true" @node-drop="movenode">
            <span class="custom-tree-node" slot-scope="{  data }">
              <span class="custom-tree-node">{{ data.title || data.path }}</span>
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
                <el-form-item label="上级" v-if="parent_name">
                  <span>{{ parent_name }}</span>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                  <el-input v-model="form.title">
                    <template slot="append">title</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="路径" prop="path">
                  <el-input v-model="form.path">
                    <template slot="append">path</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                  <el-input v-model="form.name">
                    <template slot="append">name</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="组件注册名" prop="component">
                  <el-input v-model="form.component">
                    <template slot="append">需要在pageReg中注册同名组件</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="重定向" prop="redirect">
                  <el-input v-model="form.redirect">
                    <template slot="append">redirect</template>
                  </el-input>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="路径属性传参" prop="props">
                      <el-switch v-model="form.props"></el-switch>
                      <el-tooltip style="margin-left:5px;font-size:18px;" :open-delay="300" transition="el-zoom-in-top">
                        <div slot="content">通过路径参数定义进行对组件props的传参</div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="保持页面" prop="props">
                      <el-switch v-model="form.keepAlive"></el-switch>
                      <el-tooltip style="margin-left:5px;font-size:18px;" :open-delay="300" transition="el-zoom-in-top">
                        <div slot="content" style="line-height:18px;">在home组件内可配置路由的keepAlive<br />页面将保持最后操作的状态<br />不会进行跳转后的页面刷新<br />需手动进行watch进行所需的操作</div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="页面权限" prop="permission" :rules="permission_rules">
                  <el-cascader :options="permissions" :props="perm_props" :show-all-levels="false" clearable v-model="form.permission" @change="(val)=>{form.need_permission=!!val;}"></el-cascader>
                  <el-tooltip style="margin-left:5px;font-size:18px;" :open-delay="300" transition="el-zoom-in-top">
                    <div slot="content" style="line-height:18px;">当用户没有权限时，进入此路由对应的页面时会重定向到404页面<br />用来屏蔽非法访问</div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" round icon="el-icon-check" @click="onSubmit">提交</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span=12>
              <el-form>
              <el-form-item v-if="!!form.parent" label="权限必填" prop="meta">
                <el-switch v-model="form.need_permission"></el-switch>
              </el-form-item>
              </el-form>
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
  维护 CodeModule
 */

import { mapState } from "vuex";
import resource from "@/resource";
import TreeInit from "../CodeRegister/CodeTreeInit";
const FORM = {
  sys_id: null,
  project: null,
  parent: null,
  path: "",
  title: "",
  name: "",
  component: "",
  redirect: "",
  props: true,
  alias: null,
  keepAlive: false,
  meta: null,
  permission: null,
  need_permission: true,
};

export default {
  name: "CodeReg",
  data() {
    return {
      log: console.log,
      loading: false,
      is_collapse: false,
      sys_id: null,
      system_project_id: null,
      showModuleInfo: false,
      props: {
        id: "pk",
        children: "children",
        label: "title",
      },
      form: JSON.parse(JSON.stringify(FORM)),
      parent_name: '',
      router_content: "",
      rules: {
        name: [{ type: "string", required: true, message: "请填写文件名称" }],
        path: [{ type: "string", required: true, message: "请填写文件路径" }],
        // permission: [{ type: "string", required: true, message: "请选择页面权限" }],
        category: [
          {
            type: "array",
            required: true,
            defaultField: { type: "string" },
            message: "请填写标签",
          },
        ],
      },
      title: "",
      data: [],
      systemProjects: [],
      permissions: [],
      perm_props: {
        label: 'name',
        value: 'pk',
        children: 'items',
        leaf: "is_leaf_node",
        checkStrictly: true,
        emitPath: false,
      },
    };
  },
  computed: {
    ...mapState(["systemlist", "userinfo", "currentSystemId"]),
    permission_rules(){
      let val = this.form.need_permission;
      let is_top = !this.form.parent;
      if(val && !is_top) return [{ type: "string", required: true, message: "请选择页面权限" }];
      else return [];
    },
  },
  methods: {
    async generate() {
      if (this.data.length > 0) {
        return this.$message.warning("已有路由数据,请清除后再生成");
      }
      let data = TreeInit();
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
        path: newItem.path,
        title: newItem.title,
        name: newItem.name,
        component: newItem.component,
        redirect: newItem.redirect,
        props: newItem.props,
        alias: newItem.alias,
        meta: newItem.meta,
      };
      try {
        let response = await resource.createObj("systempr", params);
        // 递归处理子项
        for (const childItem of newItem.children) {
          await this.addDataToAPI(childItem, response.pk); // 传递当前项的父级的 pk 作为 parent
        }
        await this.loadData();
      } catch (error) {
        console.error(error);
      } finally {
        // 拿原始数据和当前数据对比，如果长度相等，说明已经全部加载完毕
        if (TreeInit().length == this.data.length) {
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
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async loadPermissions(){
      let resp = await this.$http.get(`/permissionstree/`, {
        params: { sys_id: this.sys_id, level: 0 },
      });
      this.permissions = resp.data;
    },
    async loadData() {
      this.showModuleInfo = false;
      this.loading = true;
      try {
        let resp = await this.$http.get(`/systempr/`, {
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
      this.parent_name = data.title;
      this.form = { ...FORM };
      this.form.parent = data.pk;
      this.form.sys_id = this.currentSystemId;
      this.form.project = this.system_project_id;
      this.form.need_permission = true;
      this.showModuleInfo = true;
      this.$refs.form.resetFields();
    },
    async onSubmit() {
      const is_valid = await new Promise((resolve) => this.$refs.form.validate(resolve));
      if (!is_valid) {
        return;
      }
      this.form.meta = this.genMeta();
      if (this.form.pk) {
        await this.$http.put(`/systempr/${this.form.pk}/`, this.form);
        this.$message.success("修改成功!");
      } else {
        await this.$http.post("/systempr/", this.form);
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
      console.log('[edit]', val)
      if(this.showModuleInfo) {
        this.$refs.form.resetFields();
      }
      this.parent_name = '';
      this.showModuleInfo = true;
      let dd = JSON.parse(JSON.stringify(val));
      if(dd.meta){
        try {
          let meta = JSON.parse(dd.meta);
          if(meta.keepAlive){
            dd.keepAlive = meta.keepAlive;
          } else {
            dd.keepAlive = false;
          }
        } catch {
          dd.keepAlive = false;
        }
      } else {
        dd.keepAlive = false;
      }
      dd.need_permission = true;
      this.form = dd;
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
      await this.$resource.createObj("systemprmove", params);
      await this.loadData();
    },
    async remove(node, val) {
      try {
        await this.$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await this.$http.delete(`/systempr/${val.pk}/`);
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
    const project_id = this.$route.query.id;
    if (project_id) {
      this.system_project_id = project_id;
      await this.loadData();
    }
  },
  watch: {
    form: {
      handler(val) {
        if (this.showModuleInfo) {
          this.router_content = "";
          let json_data = {
            path: this.form.path,
            name: this.form.name,
            component: this.form.component,
            props: this.form.props,
          };
          if (this.form.redirect) {
            json_data.redirect = this.form.redirect;
          }
          if (this.form.meta) {
            try {
              let meta = JSON.parse(this.form.meta);
              meta.title = this.form.title;
              json_data.meta = meta;
            } catch {
              json_data.meta = "解析错误";
            }
          } else {
            json_data.meta = { title: this.form.title };
          }
          if (this.form.keepAlive === true) {
            json_data.meta.keepAlive = true;
          } else {
            delete json_data.meta.keepAlive;
          }
          this.$nextTick(() => {
            // console.log('this.form.keepAlive', this.form.keepAlive);
            // console.log('json_data.meta', json_data.meta);
            this.router_content = JSON.stringify(json_data, null, 2);
          });
        }
      },
      deep: true,
    },
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


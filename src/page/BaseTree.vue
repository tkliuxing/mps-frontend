<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card>
          <div style="margin-bottom:10px">{{system.name}}</div>
          <el-form inline>
            <el-form-item label="业务子系统">
              <el-select v-model="biz_id" @change="bizChange">
                <el-option
                    v-for="item in biz_ids"
                    :key="item.biz_id"
                    :label="`${item.biz_id}: ${item.name}`"
                    :value="item.biz_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="org_type" @input="orgTypeChange">
                <el-radio-button label="0">系统级</el-radio-button>
                <el-radio-button label="1">租户级</el-radio-button>
              </el-radio-group>
              <el-tooltip placement="top" style="margin-left:5px;">
                <div slot="content">系统级的 org_id 为 0<br/>租户级需要先指定一个租户</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="租户ID" v-if="org_type === '1'">
              <el-select v-model="org_id" @change="orgIDChange">
                <el-option
                    v-for="item in orgs"
                    :key="item.pk"
                    :label="`${item.org_id}: ${item.name}`"
                    :value="item.org_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-plus" type="primary" @click="append()">新增根节点</el-button>
            </el-form-item>
          </el-form>
          <el-tree v-loading="loading" :data="data" node-key="id" :props="props" :draggable="true" :indent="20" @node-drop="movenode">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="custom-tree-node">{{ data.name }}</span>
              <span style="text-align: center">
                <el-button type="text" size="small" @click.stop="() => append(data)">添加</el-button>
                <el-button type="text" size="small" @click.stop="() => cptobt(data)">复制</el-button>
                <el-button type="text" size="small" @click.stop="() => edit(node, data)">编辑</el-button>
                <el-button type="text" size="small" @click.stop="() => remove(node, data)">删除</el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="16" v-if="show_type">
        <el-card>
          <div style="margin: 0 0 20px 50px">{{ title }}</div>
          <el-form :model="form" ref="form" :rules="rules" label-width="100px" inline>
            <el-form-item v-if="form.pk" label="分类项ID">
              <span style="display:inline-block; width: 300px;">{{form.pk}}</span>
            </el-form-item>
            <el-row :gutter="10" v-if="!form.parent">
              <el-col :span="8">
                <el-form-item label="系统ID">
                  <el-input-number v-model="form.sys_id" :controls="false" disabled></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分类PK">
                  <el-input v-model="form.pk" :disabled="!!this.update.pk" :maxlength="30"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="业务ID">
                  <el-select v-model="form.biz_id">
                    <el-option
                      v-for="item in biz_ids"
                      :key="item.biz_id"
                      :label="`${item.biz_id}: ${item.name}`"
                      :value="item.biz_id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="归属" style="height:33px;">
                  <el-switch
                    disabled
                    :value="is_system"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="系统级"
                    inactive-text="租户级"
                    @change="is_system_change"
                    >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col v-if="!is_system" :span="8">
                <el-form-item label="租户ID">
                  <el-select v-model="form.org_id" disabled>
                    <el-option
                        v-for="item in orgs"
                        :key="item.pk"
                        :label="`${item.org_id}: ${item.name}`"
                        :value="item.org_id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col  :span="8">
                <el-form-item label="分类树配置">
                <el-button icon="el-icon-download" plain type="success" @click="downloadTree(form)">下载分类树配置代码</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider v-if="!form.parent"></el-divider>
            <el-row :gutter="10">
             <el-col :span="24">
               <el-form-item label="类别名称" prop="name">
                 <el-input v-model="form.name" />
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="field_01">
                 <el-input v-model="form.field_01"></el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="field_02">
                 <el-input v-model="form.field_02"></el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="field_03">
                 <el-input v-model="form.field_03"></el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="int_01">
                 <el-input v-model="form.int_01"></el-input>
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="float_01">
                 <el-input v-model="form.float_01"></el-input>
               </el-form-item>
             </el-col>
             <el-col :span="24">
               <el-form-item label="text_01">
                 <el-input type="textarea" v-model="form.text_01" style="width: 600px" />
               </el-form-item>
             </el-col>
             <el-col :span="24">
               <el-form-item label="说明">
                 <el-input type="textarea" v-model="form.description" style="width: 600px" />
               </el-form-item>
             </el-col>
             <el-col :span="24">
               <el-form-item label="参数定义">
                 <template>
                   <div class="jsoneditor" id="arguments"></div>
                 </template>
               </el-form-item>
             </el-col>
             <el-col :span="24">
               <el-form-item label=" ">
                 <el-button type="primary" @click="onSubmit">保存</el-button>
                 <el-button @click="cancel">取消</el-button>
               </el-form-item>
             </el-col>
            </el-row>
          </el-form>
          <div v-if="datasource_json">
            <p>数据源JSON</p>
            <json-viewer class="drawer-json-viewer" :value="datasource_json" :expand-depth="2" expanded copyable boxed />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="copyDialogVisible">
      <p>复制到分类树</p>
      <el-form :model="copyForm" label-width="100px">
        <el-form-item v-if="copyForm.id" label="节点ID">
          <el-input disabled v-model="copyForm.id" />
        </el-form-item>
        <el-form-item v-else label="类别">
          <el-input disabled v-model="copyForm.category" />
        </el-form-item>
        <el-form-item label="系统">
          <el-select v-model="copyForm.sys_id" @change="choseSys">
            <el-option v-for="i in AllSystem" :key="i.sys_id" :value="i.sys_id" :label="`${i.sys_id}: ${i.name}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务子系统" >
          <el-select v-model="copyForm.biz_id">
            <el-option v-for="i in curBiz_ids" :key="i.biz_id" :value="i.biz_id" :label="`${i.biz_id}: ${i.name}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统级/租户级">
          <el-switch
            v-model="isxitongji"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="系统级"
            inactive-text="租户级">
          </el-switch>
        </el-form-item>
        <el-form-item label="租户" v-if="isxitongji == 1">
          <el-select v-model="copyForm.org_id">
            <el-option v-for="i in AllOrgs" :key="i.org_id" :value="i.org_id" :label="`${i.org_id}: ${i.name}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitCopy">保存</el-button>
          <el-button @click="cancelCopy">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import JsonViewer from 'vue-json-viewer';
import resource from '@/resource';
import FileSaver from "file-saver";
import ejs from "ejs";
import Container from "@/page/BaseTree/components/index.tpl.ejs";
export default {
  name: "BaseTree",
  components: {
    'json-viewer': JsonViewer,
  },
  computed: {
    ...mapState(["token", "userinfo", "systemlist", "currentSystemId"]),
    is_system() {
      return this.form.org_id === 0;
    }
  },
  data() {
    return {
      loading: false,
      sys_id: 1,
      biz_id: 1,
      orgs: [],
      biz_ids: [{name:'默认', biz_id:1}],
      data: [],
      props: {
        children: "items",
        label: "name",
      },
      org_type: '0',
      org_id: 0,
      rules: {
        name: [
          { required: true, message: "请输入类别名称", trigger: "blur" },
          { min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" },
        ],
      },
      form: {
        pk: null,
        sys_id: 1,
        org_id: 1,
        biz_id: 1,
        parent: null,
        type_id: 1,
        name: "",
        description: "",
        arguments: "",
        field_01: '',
        field_02: '',
        field_03: '',
        text_01: '',
        int_01: null,
        float_01: null,
      },
      datasource_json: "",
      update: {pk: null},
      arguments_editor: null,
      show_type: false,
      title: "",
      system: {},
      copyForm: {
        root_node: null,
        category: null,
        sys_id: null,
        org_id: null,
        biz_id: null,
      },
      AllOrgs:[],
      copyDialogVisible: false,
      curBiz_ids: [],
      AllSystem: [],
      isxitongji: 1
    };
  },
  methods: {
    cptobt(data){
      if(!!data.is_root){
        this.copyForm.category = data.category;
        this.copyForm.root_node = null;
      } else {
        this.copyForm.category = data.name;
        this.copyForm.root_node = data.pk;
      }
      this.copyDialogVisible = true;
    },
    async getSystem(){
      try {
        let resp = await resource.getList('system',{})
        if(resp.length>0){
          this.AllSystem = resp;
        }
      }catch (e) {
        console.error(e)
      }
    },
    async choseSys(val){
      try {
        this.AllOrgs = await resource.getList('systemorg', {
          sys_id:val
        });
        this.copyForm.sys_id = val;
        this.copyForm.org_id = null;
        this.copyForm.biz_id = null;
        let params = {
          sys_id:val,
        };
        this.curBiz_ids = await resource.getList("systembiz", params);
        if(this.curBiz_ids.length === 0){
          this.curBiz_ids = [{name:'默认', biz_id:1}];
        }
      }catch (e) {
        console.error(e)
      }
    },
    cancelCopy(){
      this.copyDialogVisible = false;
      this.copyForm = {
        root_node: null,
        category: null,
        sys_id: null,
        org_id: null,
        biz_id: null,
      };
    },
    async onSubmitCopy(){
      let params = {
        sys_id: this.copyForm.sys_id,
        org_id: this.isxitongji == 1 ? this.copyForm.org_id : 0,
        biz_id: this.copyForm.biz_id,
        category: this.copyForm.category,
        root_node: this.copyForm.root_node,
      };
      await resource.createObj('basetreecopy', params);
      this.copyDialogVisible = false;
      this.copyForm = {
        root_node: null,
        category: null,
        sys_id: null,
        org_id: null,
        biz_id: null,
      };
      this.$message.success('复制成功');
    },
    orgTypeChange(){
      if (this.org_type === '1') {
        this.org_id = this.orgs[0].org_id;
      } else {
        this.org_id = 0;
      }
      this.show_type = false;
      this.loadData();
    },
    orgIDChange(){
      this.loadData();
      this.show_type = false;
      this.form.org_id = this.org_id;
    },
    // 下载分类树配置方法
      async downloadTree(val){
        try {
          let form = ejs.render(Container, {name:val.name, parent:val.pk})
          let blob = new Blob([form], {type: "text/plain;charset=utf-8"});
          FileSaver.saveAs(blob, `${this.form.name || "common"}.vue`);
        } catch (error) {
          console.log(error);
          this.$message.error("生成失败!");
        }
      },
    is_system_change(val){
      if(val === true){
        this.form.org_id = 0;
      } else {
        this.form.org_id = this.orgs[0].org_id;
      }
    },
    async loadSystem() {
      let res = await resource.getList('system', {
        sys_id: this.currentSystemId
      })
      this.system = res[0];
      this.sys_id = res[0].sys_id;
      this.orgs = await resource.getList('systemorg', {
        sys_id: this.currentSystemId
      });

    },
    async loadBiz(){
      let params = {
        sys_id: this.currentSystemId,
      };
      this.biz_ids = await resource.getList("systembiz", params);
      if(this.biz_ids.length === 0){
        this.biz_ids = [{name:'默认', biz_id:1}];
      }
    },
    async loadData() {
      this.loading = true;
      let params = {
        noroot: false, sys_id: this.sys_id, biz_id: this.biz_id
      };
      if(this.org_type === '0'){
        params.is_system = true;
      } else {
        params.is_system = false;
        params.org_id = this.org_id;
      }
      try {
        let resp = await this.$http.get("/basetree/", { params });
        this.data = resp.data;
      } finally {
        this.loading = false;
      }
    },
    async bizChange(val){
      this.biz_id = val;
      this.form.biz_id = val;
      this.page = 1;
      await this.loadData();
    },
    async onSubmit() {
      try{
        let valid = await this.$refs.form.validate();
        if(!valid){
          return
        }
      } catch (e) {
        console.error(e);
        return
      }
      this.form.arguments = this.arguments_editor.getText();
      if (this.update && this.update.pk) {
        await this.$http.put(`/basetree/${this.update.pk}/`, this.form);
        this.$message.success("修改成功!");
        await this.loadData();
      } else {
        await this.$http.post("/basetree/", this.form);
        this.$message.success("新建成功!");
        await this.loadData();
      }
      this.show_type = false;
      this.clear();
    },
    cancel() {
      this.show_type = false;
      this.arguments_editor = null;
      this.clear();
    },
    append(val = null) {
      this.datasource_json = "";
      this.title = val ? val.name + " 添加子节点" : "添加根节点";
      this.show_type = true;
      this.form = {
        sys_id: this.sys_id,
        org_id: val ? val.org_id : this.org_id,
        biz_id: val ? val.biz_id : this.biz_id,
        parent: val ? val.pk : null,
        type_id: val ? val.type_id : 1,
        name: "",
        description: "",
        arguments: "",
        pk: null,
        field_01: '',
        field_02: '',
        field_03: '',
        text_01: '',
        int_01: null,
        float_01: null,
      };
      this.update = {pk: null};
      setTimeout(() => {
        this.initArgumentsJson();
      }, 500);
    },
    edit(node, val) {
      this.title = "编辑 " + val.name;
      this.show_type = true;
      this.update = { ...val };
      this.form = { ...val };
      if(!val.parent){
        if(val.org_id === 0){
          this.datasource_json = {
            url: "basetree",
            params: {parent: val.pk, org_id: 0},
            name_field: "name",
            value_field: "name"
          };
        } else {
          this.datasource_json = {
            url: "basetree",
            params: {
              name: val.name,
              isroot: true,
              org_id: "需要根据实际情况为org_id赋值",
            },
            name_field: "name",
            value_field: "name"
          };
        }
      } else {
        this.datasource_json = "";
      }
      setTimeout(() => {
        this.initArgumentsJson(val.arguments);
      }, 500);
    },
    remove(node, val) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete(`/basetree/${val.pk}/`);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          setTimeout(() => {
            this.loadData();
          }, 300);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    movenode(node, target, position, event) {
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
      this.$http.post("/basetreemove/", params).then((resp) => {
      });
    },
    initArgumentsJson(json = null) {
      if (!this.arguments_editor) {
        const container = document.getElementById("arguments");
        const options = {
          modes: ["code", "tree", "form", "text", "view", "preview"],
          search: true,
        };
        this.arguments_editor = new this.$jsoneditor(container, options);
      }
      // set json
      this.arguments_editor.set(json ? JSON.parse(json) : {});
    },
    clear() {
      this.form = {
        sys_id: this.sys_id,
        org_id: this.orgs.length > 0 ? this.orgs[0].org_id : 1,
        biz_id: this.biz_id,
        parent: null,
        type_id: 1,
        name: "",
        description: "",
        arguments: "",
        field_01: '',
        field_02: '',
        field_03: '',
        text_01: '',
        int_01: null,
        float_01: null,
      };
      this.update = {pk: null};
    },
  },
  async mounted() {
    await this.loadSystem()
    await this.loadData();
    await this.loadBiz();
    this.getSystem();
  },
  watch: {
    currentSystemId: {
      async handler() {
        await this.loadSystem()
        await this.loadData();
        await this.loadBiz();
      }
    }
  }
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

.jsoneditor {
  width: 700px;
  height: 250px;
}
</style>

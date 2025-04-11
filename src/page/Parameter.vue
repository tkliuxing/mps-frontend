<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card>
          <div style="margin-bottom:10px">{{system.name}}</div>
          <el-form inline>
            <el-form-item>
              <el-button icon="el-icon-plus" type="primary" @click="append()">新增类别并增加一个节点</el-button>
            </el-form-item>
          </el-form>
          <el-tree v-loading="loading" ref="ptree" :load="loadNode" lazy node-key="pk" :props="props" :indent="20">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="custom-tree-node">{{ data.name }}</span>
              <span style="text-align: center">
                <el-button type="text" size="small" @click.stop="() => append(data)">添加</el-button>
                <el-button type="text" size="small" @click.stop="() => cptobt(data)">复制</el-button>
                <el-button type="text" size="small" v-if="node.level > 1" @click.stop="() => edit(node, data)">编辑</el-button>
                <el-button type="text" size="small" v-if="node.level > 1" @click.stop="() => remove(node, data)">删除</el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="16" v-if="show_type">
        <el-card>
          <div style="margin: 0 0 20px 50px">{{ title }}</div>
          <el-form label-width="100px" inline>
            <el-form-item v-if="form.pk" label="父级ID">
              <span style="display:inline-block; width: 300px;">{{form.pk}}</span>
            </el-form-item>
            <el-row :gutter="10">
             <el-col :span="8">
               <el-form-item label="类别">
                 <el-input v-model="form.category" />
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="名称">
                 <el-input v-model="form.name" />
               </el-form-item>
             </el-col>
             <el-col :span="8">
               <el-form-item label="值">
                 <el-input v-model="form.value" />
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
             <el-col :span="24">
               <el-form-item label="text_01">
                 <el-input type="textarea" v-model="form.text_01" style="width: 600px" />
               </el-form-item>
             </el-col>
             <el-col :span="24">
               <el-form-item label="说明">
                 <el-input type="textarea" :rows="3" v-model="form.remark" style="width: 600px" />
               </el-form-item>
             </el-col>
             <el-col :span="24">
               <el-form-item label="参数定义">
                 <template>
                   <div class="jsoneditor" id="field_json"></div>
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
        <el-form-item label="租户">
          <el-select v-model="copyForm.org_id">
            <el-option :value="0" label="0: 系统级"></el-option>
            <el-option v-for="i in orgs" :key="i.org_id" :value="i.org_id" :label="`${i.org_id}: ${i.name}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务子系统">
          <el-select v-model="copyForm.biz_id">
            <el-option v-for="i in biz_ids" :key="i.biz_id" :value="i.biz_id" :label="`${i.biz_id}: ${i.name}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
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
import resource, {createObj} from '@/resource';
export default {
  name: "BaseTree",
  components: {
    'json-viewer': JsonViewer
  },
  computed: {
    ...mapState(["token", "userinfo", "systemlist", "currentSystemId"]),
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
      form: {
        parent: null,
        category: 1,
        name: "",
        value: "",
        remark: "",
        field_json: "",
        field_01: '',
        field_02: '',
        field_03: '',
        text_01: ''
      },
      copyForm: {
        id: null,
        category: null,
        sys_id: null,
        org_id: null,
        biz_id: null,
      },
      copyDialogVisible: false,
      update: null,
      field_json_editor: null,
      show_type: false,
      title: "",
      system: {},
      edit_node: null,
    };
  },
  methods: {
    cptobt(data){
      if(!!data.is_root){
        this.copyForm.category = data.category;
        this.copyForm.id = null;
        this.copyForm.sys_id = this.currentSystemId;
      } else {
        this.copyForm.category = data.name;
        this.copyForm.id = data.pk;
        this.copyForm.sys_id = this.currentSystemId;
      }
      this.copyDialogVisible = true;
    },
    async onSubmitCopy(){
      let params = {
        sys_id: this.copyForm.sys_id,
        org_id: this.copyForm.org_id,
        biz_id: this.copyForm.biz_id,
        category: this.copyForm.category,
        id: this.copyForm.id,
      };
      await resource.createObj('parameters-to-basetree', params);
      this.copyDialogVisible = false;
      this.copyForm = {
        id: null,
        category: null,
        sys_id: null,
        org_id: null,
        biz_id: null,
      };
      this.$message.success('复制成功');
    },
    cancelCopy(){
      this.copyDialogVisible = false;
      this.copyForm = {
        id: null,
        category: null,
        sys_id: null,
        org_id: null,
        biz_id: null,
      };
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
    async loadNode(node, resolve){
      if(node.level === 0){
        let resp = await this.$http.get("/parameters-categorys/");
        resolve(resp.data.map((item) => {
          item.pk = item.category;
          item.name = item.category;
          item.is_root = true;
          return item;
        }))
      } else if(node.level === 1){
        let resp = await this.$http.get("/flatparameters/", { params: { category: node.data.category, isroot: true } });
        resolve(resp.data)
      } else {
        let resp = await this.$http.get("/flatparameters/", { params: { parent: node.data.pk } });
        resolve(resp.data)
      }
    },
    async loadData() {
      // this.$router.go(0);
    },
    async bizChange(val){
      this.biz_id = val;
      this.form.biz_id = val;
      this.page = 1;
      await this.loadData();
    },
    async onSubmit() {
      this.form.field_json = this.field_json_editor.getText();
      if (this.update) {
        let resp = await this.$http.put(`/parameters/${this.update.pk}/`, this.form);
        if(this.edit_node){
          let node = this.$refs.ptree.getNode(this.edit_node.pk);
          node.data = resp.data;
          this.edit_node = null;
        }
        this.$message.success("修改成功!");
        await this.loadData();
      } else {
        let resp = await this.$http.post("/parameters/", this.form);
        this.$message.success("新建成功!");
        if(this.form.parent){
          this.$refs.ptree.append({...this.form, pk: resp.data.pk}, this.form.parent)
        } else if(this.form.category) {
          if(this.form.is_root){
            this.$refs.ptree.append({...this.form, pk: this.form.category, name: this.form.category, is_root: true}, null)
          } else {
            this.$refs.ptree.append({...this.form, pk: resp.data.pk}, this.form.category)
          }
        }

        await this.loadData();
      }
      this.show_type = false;
      this.clear();
    },
    cancel() {
      this.edit_node = null;
      this.show_type = false;
      this.field_json_editor = null;
      this.clear();
    },
    append(val = null) {
      this.edit_node = null;
      this.title = val ? val.name + " 添加子节点" : "添加类别和节点";
      this.show_type = true;
      let parent = null;
      if(val && !val.is_root && val.pk){
        parent = val.pk;
      }
      this.form = {
        parent: parent,
        category: val ? val.category : '',
        name: "",
        value: "",
        remark: "",
        field_json: "",
        pk: null,
        field_01: '',
        field_02: '',
        field_03: '',
        text_01: '',
      };
      if(val){
        this.form.is_root = false;
      } else {
        this.form.is_root = true;
      }
      this.update = null;
      setTimeout(() => {
        this.initArgumentsJson();
      }, 500);
    },
    edit(node, val) {
      this.edit_node = val;
      this.title = "编辑 " + val.name;
      this.show_type = true;
      this.update = { ...val };
      this.form = { ...val };
      setTimeout(() => {
        this.initArgumentsJson(val.field_json);
      }, 500);
    },
    remove(node, val) {
      this.cancel();
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete(`/parameters/${val.pk}/`);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.$refs.ptree.remove(val.pk);
          let resp = await this.$http.get("/flatparameters/", { params: { category: val.category, page: 1, pageSize:1 } });
          if(resp.data.count === 0){
            this.$refs.ptree.remove(val.category);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    initArgumentsJson(json = null) {
      if (!this.field_json_editor) {
        const container = document.getElementById("field_json");
        const options = {
          modes: ["code", "tree", "form", "text", "view", "preview"],
          search: true,
        };
        this.field_json_editor = new this.$jsoneditor(container, options);
      }
      // set json
      this.field_json_editor.set(json ? JSON.parse(json) : {});
    },
    clear() {
      this.form = {
        sys_id: this.sys_id,
        org_id: this.orgs.length > 0 ? this.orgs[0].org_id : 1,
        biz_id: this.biz_id,
        parent: null,
        type_id: 1,
        name: "",
        remark: "",
        field_json: "",
        field_01: '',
        field_02: '',
        field_03: '',
        text_01: ''
      };
      this.update = null;
    },
  },
  mounted(){
    this.loadSystem();
  },
  watch: {
    currentSystemId: {
      async handler() {
        await this.loadSystem();
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

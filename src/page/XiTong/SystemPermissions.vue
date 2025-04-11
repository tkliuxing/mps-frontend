<template>
  <el-card :body-style='{height: "calc(100vh - 200px)", overflow: "scroll"}'>
    <div slot="header" class="clearfix">
      <span>{{ system.name }} 功能配置</span>
      <el-button style="float: left; padding: 4px 3px; margin-right:20px;" icon="el-icon-back" type="text"
                 @click="$router.go(-1)">返回
      </el-button>
    </div>
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
        <el-button type="primary" @click="append()" icon="el-icon-circle-plus-outline">新建功能</el-button>
        <el-button type="success" @click="loadData" icon="el-icon-refresh">刷新</el-button>
        <el-button type="success" @click="generate" icon="el-icon-plus">一键生成功能</el-button>
        <el-button type="info" @click="exportExcel" icon="el-icon-plus">导出功能列表</el-button>
      </el-form-item>
    </el-form>
    <div class="tree-box">
      <el-tree v-loading="loading" :data="data" default-expand-all node-key="id" :props="tree_props" :indent="20">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="tree-node-name">{{ data.name }}</span>
          <span style="text-align: center">
            <el-button type="text" size="small" @click.stop="() => append(data)">添加下级</el-button>
            <el-button type="text" size="small" @click.stop="() => edit(data)">编辑</el-button>
            <el-button type="text" size="small" @click.stop="() => remove(node, data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog title="新建" :visible.sync="createDialogVisiable" width="30%" center @closed="clearFormData('form')">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label='名称' prop="name" :rules='[{required: true, message: "名称必填"}]'>
          <el-input  v-model="form.name"/>
        </el-form-item>
        <el-form-item label='功能说明' prop="codename" :rules='[{required:true, min: 10, message: "说明不能为空，且长度不能少于10个字符"}]'>
          <el-input type="textarea" :autosize="{ minRows: 5,maxRows:20 }" show-word-limit v-model="form.codename" :maxlength="100"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button icon="el-icon-close" @click="createDialogVisiable=false">取消</el-button>
    <el-button type="primary" icon="el-icon-check" @click="submitForm('form')">确定</el-button>
    </span>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="updateDialogVisiable" width="30%" center @closed="clearFormData('updateform')">
      <el-form :model="update" ref="updateform" label-width="100px">
        <el-form-item label='名称' prop="name" :rules='[{required: true, message: "名称必填"}]'>
          <el-input v-model="update.name"/>
        </el-form-item>
        <el-form-item label='功能说明' prop="codename" :rules='[{required:true, min: 10, message: "说明不能为空，且长度不能少于10个字符"}]'>
          <el-input type="textarea" :autosize="{ minRows: 5,maxRows:20 }" show-word-limit v-model="update.codename" :maxlength="100"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
    <el-button icon="el-icon-close" @click="updateDialogVisiable=false">取消</el-button>
    <el-button type="primary" icon="el-icon-check" @click="updateForm('updateform')">确定</el-button>
    </span>
    </el-dialog>
  </el-card>
</template>
<script>
import resource from "@/resource";
import TreeInit from "@/page/CodeRegister/CodeGongNengInit";
import ExportExcel from "./system_permission_export";

const FORM = {"name": null, "codename": null, biz_id: 1, sys_id: null, parent: null,};

export default {
  name: "systempermissions",
  props: {
    sys_id: {type: Number, required: true},
  },
  data() {
    return {
      biz_id: 1,
      biz_ids: [{name:'默认', biz_id:1}],
      tree_props: {
        children: "items",
        label: "name",
      },
      form: {...FORM},
      update: {...FORM},
      filterData: {},
      data: [],
      createDialogVisiable: false,
      updateDialogVisiable: false,
      system: {
        pk: '',
        sys_id: '',
        name: '',
      }
    }
  },
  methods: {
    async generate() {
      if (this.data && this.data.find(item => item.name === '系统管理')) {
        return this.$message.warning("已有系统管理功能数据,请清除后再生成");
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
        sys_id: this.sys_id,
        biz_id: this.biz_id,
        creator: this.$store.state.userinfo.pk,
        is_leaf_node: newItem.is_leaf_node,
        parent: newItem.parent,
        name: newItem.name,
        codename: newItem.codename,
      };
      try {
        let response = await resource.createObj("permissions", params);
        // 递归处理子项
        for (const childItem of newItem.items) {
          await this.addDataToAPI(childItem, response.pk); // 传递当前项的父级的 pk 作为 parent
        }
        await this.loadData();
      } catch (error) {
        console.error(error);
      } finally {
        // 拿原始数据和当前数据对比，如果长度相等，说明已经全部加载完毕
        let data = this.data.find(i=>i.name == '系统管理')
        if (TreeInit().length == [data].length) {
          loading.close();
        }
      }
    },
    async loadBiz(){
      let params = {
        sys_id: this.sys_id
      };
      this.biz_ids = await resource.getList("systembiz", params);
      if(this.biz_ids.length === 0){
        this.biz_ids = [{name:'默认', biz_id:1}];
      }
    },
    async loadData() {
      let params = {
        sys_id: this.sys_id,
        biz_id: this.biz_id,
        level: 0,
      }
      if(!params.biz_id){
        delete params.biz_id
      }
      let res = await this.$http.get("/permissionstree/", {params});
      this.data = res.data;
    },
    async bizChange(val){
      this.biz_id = val;
      this.form.biz_id = val;
      await this.loadData();
    },
    get_biz_id_display(biz_id){
      let bb = this.biz_ids.filter((item)=>item.biz_id == biz_id);
      if(bb.length > 0){
        return bb[0].name;
      }else{
        return '未知';
      }
    },
    append(val = null){
      console.log(val);
      this.form = {...FORM, parent: val ? val.pk : null}
      this.createDialogVisiable=true;
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = this.translate_data(this.form);
          data.sys_id = this.sys_id;
          data.biz_id = this.biz_id;
          await this.$http.post("/permissions/", data);
          this.$message.success("新建成功!");
          this.createDialogVisiable = false;
          await this.loadData();
          this.clearFormData('form');
        } else {
          this.$message.error("请检查所填项!")
          return false;
        }
      });
    },
    async updateForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = this.translate_data(this.update);
          data.sys_id = this.sys_id;
          await this.$http.put("/permissions/" + this.update.pk + "/", data);
          this.$message.success("编辑成功!");
          this.updateDialogVisiable = false;
          await this.loadData();
          this.clearFormData('updateform');
        } else {
          this.$message.error("请检查所填项!")
          return false;
        }
      });
    },
    remove(node, val) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete(`/permissions/${val.pk}/`, {params: {real: true}});
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
    clearFormData(formName) {
      this.form = {
        "name": null,
        "codename": null,
        biz_id: this.biz_id,
        sys_id: this.sys_id,
      };
      this.update = {
        "name": null,
        "codename": null,
        biz_id: this.biz_id,
        sys_id: this.sys_id,
      };
      this.$refs[formName].resetFields();
    },
    translate_data(data) {
      for (const key in data) {
        if (Object.prototype.toString.call(data[key]) === "[object Array]") {
          data[key] = JSON.stringify(data[key]);
        }
      }
      return data
    },
    edit(obj) {
      for (const key in obj) {
        if (key.startsWith('field')) {
          if (obj[key] && typeof obj[key] === 'string' && obj[key].startsWith('[') && obj[key].endsWith(']')) {
            obj[key] = JSON.parse(obj[key]);
          }
        }
      }
      this.update = {...obj};
      this.updateDialogVisiable = true;
    },
    async loadSystem() {
      if (this.sys_id === null) {
        this.$message.error('sys_id 未设置');
        throw Error('sys_id 未设置!');
      }
      this.loading = true;
      let params = {
        sys_id: this.sys_id,
      }
      try {
        let resp = await this.$http.get('/system/', {params});
        if (resp.data.length > 0) {
          this.system = resp.data[0];
        } else {
          this.$message.error('sys_id 错误！');
          throw Error('sys_id 错误！');
        }
      } finally {
        this.loading = false;
      }
    },
    async exportExcel() {
      const exportExcel = new ExportExcel(this.system.name);
      await exportExcel.asyncExportExcel();
    },
  },
  async mounted() {
    await this.loadSystem();
    await this.loadBiz();
    await this.loadData();
  },
}
</script>

<style scoped>
.tree-box{
  width: 500px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #e9e9e9;
  border-radius: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  border-bottom: 1px dotted #e0e0e0;
  cursor: auto;
}
.custom-tree-node .el-button{
  padding-top: 0;
  padding-bottom: 0;
}
</style>

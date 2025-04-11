<template>
  <div class="SelectBaseTree">
    <el-row :gutter="5">
      <el-col :span="12" class="header-form">
        <el-form inline size="mini">
          <el-form-item>
            <h2>分类树</h2>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="org_type" @input="orgTypeChange">
              <el-radio-button label="0">系统级</el-radio-button>
              <el-radio-button label="1">租户级</el-radio-button>
            </el-radio-group>
            <el-tooltip placement="top" style="margin-left:5px;">
              <div slot="content">系统级的 org_id 为 0<br />租户级需要先指定一个租户</div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="租户ID" v-if="org_type === '1'">
            <el-select v-model="org_id" @change="orgIDChange">
              <el-option v-for="item in orgs" :key="item.pk" :label="`${item.org_id}: ${item.name}`" :value="item.org_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="data.filter(data => !btsearch || data.name.includes(btsearch))" border height="198" style="width: 100%">
          <el-table-column width="80" label="操作">
            <template v-slot="{row}">
              <el-button type="success" size="mini" plain @click="selectNode(row)">选择</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称">
            <template slot="header" slot-scope="scope">
              <span>名称</span>
              <el-input
                v-model="btsearch"
                style="width: 60%;display:inline-block;float:right;"
                size="mini"
                clearable
                placeholder="搜索分类树名称"/>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <h2>系统接口</h2>
        <el-table :data="systemApi" border height="200" style="width: 100%">
          <el-table-column width="80" label="操作">
            <template v-slot="{row}">
              <el-button type="success" size="mini" plain @click="selectApiNode(row)">选择</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称">
          </el-table-column>
          <el-table-column prop="description" label="备注">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <h2>常参</h2>
        <el-table border :data="parameters" style="width: 100%" height="200">
          <el-table-column width="80" label="操作">
            <template v-slot="{row}">
              <el-button type="success" size="mini" plain @click="selectPNode(row)">选择</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="类别">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <h2>表单模板</h2>
        <el-table border v-loading="ploading" :data="tmpldata.filter(data => !search || data.title.includes(search))" style="width: 100%" height="200">
          <el-table-column width="130" label="操作">
            <template v-slot="{row}">
              <el-dropdown split-button size="mini" type="primary" @command="(name)=>selectTmplField(row, name)">
                字段选择
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="field in row.field" :key="field.pk" :command="field.alias">{{field.col_title}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="模板名称">
            <template slot="header" slot-scope="scope">
              <span>模板名称</span>
              <el-input
                v-model="search"
                style="width: 60%;display:inline-block;float:right;"
                size="mini"
                clearable
                placeholder="搜索模板名称"/>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import resource from "@/resource";
export default {
  name: "SelectBaseTree",
  props: {
    sys_id: Number,
    biz_id: Number,
    isTree: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      ploading: false,
      data: [],
      parameters: [],
      tmpldata: [],
      org_type: '0',
      orgs: [],
      org_id: 0,
      search: '',
      btsearch: '',
      systemApi: [
        {
          name: "用户",
          url: "usermin",
          params: {},
          name_field: "full_name",
          value_field: "pk",
          description: "用户接口",
        },
        {
          name: "部门",
          url: "flatdepartment",
          params: {},
          name_field: "name",
          value_field: "pk",
          description: "部门接口",
        },
        {
          name: "角色",
          url: "group",
          params: {},
          name_field: "name",
          value_field: "pk",
          description: "角色接口",
        },
        {
          name: "文章",
          url: "article",
          params: {},
          name_field: "title",
          value_field: "pk",
          description: "文章接口",
        },
      ],
    };
  },
  methods: {
    orgTypeChange(){
      if (this.org_type === '1') {
        this.org_id = this.orgs[0].org_id;
      } else {
        this.org_id = 0;
      }
      this.show_type = false;
      this.loadBaseTree();
    },
    orgIDChange(){
      this.loadBaseTree();
    },
    async loadBaseTree(){
      this.loading = true;
      this.orgs = await resource.getList('systemorg', {
        sys_id: this.sys_id
      });
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
    async loadData() {
      this.ploading = true;
      this.loadBaseTree();
      try {
        let resp = await this.$http.get("/formtemplate/", { params: { sys_id: this.sys_id, biz_id: this.biz_id } });
        this.tmpldata = resp.data;
      } finally {
        this.ploading = false;
      }
    },
    selectApiNode(node) {
      let json = {
        url: node.url,
        params: node.params,
        name_field: node.name_field,
        value_field: node.value_field,
      };
      this.$emit("select", json);
    },
    selectNode(node) {
      let json = {
        url: "basetree",
        params: { parent_name: node.name, noroot: true, org_id: this.org_id },
        name_field: "name",
        value_field: "name",
      };
      if (this.isTree) {
        json = {
          url: "basetree",
          params: { parent_name: node.name, noroot: true, org_id: this.org_id },
          name_field: "name",
          value_field: "name",
        };
      }
      if (node.org_id == 0) {
        json.params.org_id = 0;
      }
      this.$emit("select", json);
    },
    selectPNode(node) {
      let json = {
        url: "parameters",
        params: { category: node.category },
        name_field: "name",
        value_field: "name",
      };
      this.$emit("select", json);
    },
    selectTmplField(node, name) {
      let json = {
        url: "data-field-list",
        params: { template_id: node.pk,field_names:name + ',pk' },
        name_field: name,
        value_field: 'pk',
      };
      this.$emit("select", json);
    },
    async loadParameters() {
      this.parameters = await resource.getList("parameters-categorys");
    },
  },
  mounted() {
    this.loadData();
    this.loadParameters();
  },
  watch: {
    sys_id(val) {
      this.loadData();
    },
    biz_id(val) {
      this.loadData();
    },
  },
};
</script>

<style scoped>
 .header-form ::v-deep .el-form-item{
  margin-bottom: 5px !important;
}
</style>

<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ system.name }} 微信配置</span>
      <el-button style="float: left; padding: 4px 3px; margin-right:20px;" icon="el-icon-back" type="text"
                 @click="$router.go(-1)">返回
      </el-button>
    </div>
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="dialogVisable = true" icon="el-icon-plus">新建</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="search" style="width: 300px; margin-left: 10px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="() => {this.page=1; this.loadData()}">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="() => {this.search=''; this.page=1; this.loadData()}">全部</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table
          :data="data"
          border
          highlight-current-row
          v-loading="loading"
          style="width: 100%">
        <el-table-column
            prop="system_org"
            label="所属机构"
            width="200">
          <template v-slot="{row}">
            <span v-if="row.system_org">{{get_org_name(row.system_org)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否默认"
          width="80"
          align="center"
        >
          <template v-slot="{row}">
            <i v-if="row.is_default" class="el-icon-success" style="color: #17e717;"></i>
            <i v-else class="el-icon-error"></i>
          </template>
        </el-table-column>
        <el-table-column
            prop="mp_name"
            label="公众号名称">
        </el-table-column>
        <el-table-column
            prop="mp_aid"
            label="微信公众号AppID">
        </el-table-column>
        <el-table-column
          prop="wxa_name"
          label="微信小程序名称">
        </el-table-column>
        <el-table-column
          prop="wxa_aid"
          label="微信小程序AppID">
        </el-table-column>
        <el-table-column
          prop="mch_id"
          label="微信支付商户号">
        </el-table-column>
        <el-table-column
          prop="mch_api_key"
          label="微信支付商户key">
        </el-table-column>
        <el-table-column
            label="操作">
          <template v-slot="{row}">
            <el-button type="primary" @click="edit(row)">编辑</el-button>
            <el-button type="danger" @click="del(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          layout="prev, pager, next, sizes"
          :current-page.sync="page"
          :page-size.sync="pageSize"
          @size-change="loadData"
          @current-change="loadData"
          :total="total">
      </el-pagination>
    </div>
    <el-dialog
        title="新建"
        :visible.sync="dialogVisable"
        width="80%">
      <weixinconfigform :orgs="org_data" :system_id="system_id" @onSubmit="loadData" @onClose="() => {this.dialogVisable = false;}"></weixinconfigform>
    </el-dialog>
    <el-dialog
        title="编辑"
        :visible.sync="editorVisable"
        width="80%">
      <weixinconfigform v-if="editorVisable" :system_id="system_id" :orgs="org_data" status="编辑" :FormValueId="editorID" @onSubmit="loadData" @onClose="() => {this.editorVisable = false;}"></weixinconfigform>
    </el-dialog>
  </el-card>
</template>

<script>
import weixinconfigform from "./weixinconfigform.vue";

export default {
  name: "WeiXinConfig",
  props: {
    system_id: {type: String, default: ''},
  },
  components: {
    weixinconfigform
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      dialogVisable: false,
      editorVisable: false,
      editorID: "",
      search: '',
      data: [],
      org_data: [],
      loading: false,
      system: {
        pk: '',
        sys_id: '',
        name: '',
      }
    }
  },
  methods: {
    async loadData() {
      if (this.sys_id === null) {
        this.$message.error('system_id 未设置');
        return;
      }
      this.loading = true;
      let params = {
        system: this.system_id,
        page: this.page,
        pageSize: this.pageSize,
        search: this.search,
      }
      try {
        let resp = await this.$http.get('/wechatconfig/', {params});
        this.total = resp.data.count;
        this.data = resp.data.data;
      } finally {
        this.loading = false;
      }
    },
    async loadSystem() {
      if (!this.system_id) {
        this.$message.error('system_id 未设置');
        return;
      }
      this.loading = true;
      try {
        let resp = await this.$http.get(`/system/${this.system_id}/`);
        this.system = resp.data;
      } finally {
        this.loading = false;
      }
    },
    async loadOrg() {
      this.loading = true;
      let params = {
        system: this.system_id
      };
      let res = await this.$http.get("/systemorg/", { params });
      this.org_data = res.data;
      this.loading = false;
    },
    get_org_name(org_id) {
      let org = this.org_data.find((item) => {
        return item.pk === org_id;
      });
      if (org) {
        return org.name;
      }
      return "";
    },
    edit(row){
      this.editorID = row.pk;
      this.editorVisable = true;
    },
    del(row){
      this.$confirm('此操作将永久删除该配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$http.delete(`/wechatconfig/${row.pk}/`);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.loadData();
        } catch (e) {
          this.$message.error(e.response.data.message);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  async mounted() {
    await this.loadSystem();
    await this.loadOrg();
    await this.loadData();
  }
}
</script>

<style scoped>

</style>

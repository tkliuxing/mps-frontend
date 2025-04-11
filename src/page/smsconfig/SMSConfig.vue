<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ system.name }} 短信配置</span>
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
            prop="name"
            label="名称"
            width="200">
        </el-table-column>
        <el-table-column
            prop="sms_type_display"
            label="类型">
        </el-table-column>
        <el-table-column
            label="是否启用">
          <template slot-scope="scope">
            <i v-if="scope.row.is_enabled" class="el-icon-success" style="color: #17e717;"></i>
            <i v-else class="el-icon-error"></i>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
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
        width="30%">
      <smsconfigform @onSubmit="loadData" @onClose="() => {this.dialogVisable = false;}"></smsconfigform>
    </el-dialog>
    <el-dialog
        title="编辑"
        :visible.sync="editorVisable"
        width="30%">
      <smsconfigform v-if="editorVisable" status="编辑" :FormValueId="editorID" @onSubmit="loadData" @onClose="() => {this.editorVisable = false;}"></smsconfigform>
    </el-dialog>
  </el-card>
</template>

<script>
import smsconfigform from "./smsconfigform.vue";

export default {
  name: "SMSConfig",
  props: {
    sys_id: {type: String, default: 0},
  },
  components: {
    smsconfigform
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
        this.$message.error('sys_id 未设置');
        return;
      }
      this.loading = true;
      let params = {
        sys_id: this.sys_id,
        page: this.page,
        pageSize: this.pageSize,
        search: this.search,
      }
      try {
        let resp = await this.$http.get('/smsconfig/', {params});
        this.total = resp.data.count;
        this.data = resp.data.data;
      } finally {
        this.loading = false;
      }
    },
    async loadSystem() {
      if (this.sys_id === null) {
        this.$message.error('sys_id 未设置');
        return;
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
        }
      } finally {
        this.loading = false;
      }
    },
    edit(row){
      this.editorID = row.pk;
      this.editorVisable = true;
    }
  },
  mounted() {
    this.loadSystem();
    this.loadData();
  }
}
</script>

<style scoped>

</style>

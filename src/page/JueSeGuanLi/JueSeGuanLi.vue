<template>
  <div class="JueSeGuanLi">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ system.name }} 角色管理</span>
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
        <el-form-item label="租户ID">
          <el-select v-model="org_Id" @change="orgIDChange" clearable>
            <el-option
              v-for="item in orgs"
              :key="item.pk"
              :label="`${item.org_id}: ${item.name}`"
              :value="item.org_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="newGroup" icon="el-icon-plus">新建角色</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table :data="data" v-loading="loading" border>
          <el-table-column type="index" label="#" width="70" align="center"></el-table-column>
          <el-table-column prop="org_id" label="ORG ID" width="70" align="center"></el-table-column>
          <el-table-column prop="name" label="角色名称" width="200" align="center"></el-table-column>
          <el-table-column label="权限" width="400" align="center">
            <template slot-scope="scope">
              <span v-for="p in scope.row.permissions_name">{{ p }}&nbsp;</span>
            </template>
          </el-table-column>
          <el-table-column label="用户数量" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.user.length }}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" @click="editFuncGroup(scope.row.pk)">编辑</el-button>
              <el-button type="danger" @click="deleteGroup(scope.row.pk)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            :hide-on-single-page="true"
            :total="total"
            :current-page.sync="page"
            :page-size="pageSize"
            @current-change="loadData"
            layout="prev, pager, next, sizes">
        </el-pagination>
      </div>
    </el-card>
    <JueSeGuanLiEdit
        v-if="showEditDialog"
        :pk="editPK"
        :show-dialog="showEditDialog"
        :sys_id="sys_id"
        :biz_id="biz_id"
        @close="closeEditDialog"
    />

  </div>
</template>

<script>
import JueSeGuanLiEdit from './JueSeGuanLiEdit.vue';
import resource from "@/resource";
export default {
  name: 'JueSeGuanLi',
  components: {JueSeGuanLiEdit},
  props: {
    sys_id: {type: String, required: true},
    org_id: {type: Number, default: null},
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      biz_id: 1,
      biz_ids: [{name:'默认', biz_id:1}],
      data: [],
      loading: false,
      showEditDialog: false,
      editPK: null,
      system: {
        pk: '',
        sys_id: '',
        name: '',
      },
      show_type: false,
      orgs: [],
      org_Id: null,
    };
  },
  methods: {
    orgIDChange(){
      this.loadData();
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
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sys_id: this.sys_id,
        biz_id: this.biz_id,
        org_id: this.org_Id,
      };
      let resp = await this.$http.get('/group/', {params});
      this.data = resp.data.data;
      this.total = resp.data.count;
      this.loading = false;
    },
    async bizChange(val){
      this.biz_id = val;
      await this.loadData();
    },
    editFuncGroup(pk) {
      this.editPK = pk;
      this.showEditDialog = true;
    },
    closeEditDialog(status) {
      this.showEditDialog = false;
      if (status === 'success') {
        this.loadData();
      }
    },
    newGroup() {
      this.editPK = null;
      this.showEditDialog = true;
    },
    deleteGroup(pk) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/group/${pk}/`).then(() => {
          this.$message.success('成功');
          this.loadData();
        }).catch(() => {
          this.$message.error('删除失败');
        });
      }).catch(() => {
        this.$message.success('已取消');
      });
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
        this.orgs = await resource.getList('systemorg', {
          sys_id: this.sys_id
        });
        this.org_Id = this.orgs[0].org_id
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.loadSystem();
    await this.loadBiz();
    await this.loadData();
  }
};
</script>

<style scoped>
.JueSeGuanLi .head-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

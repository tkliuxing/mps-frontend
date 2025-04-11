<template>
  <div class="baseconfigcurd">
    <div v-if="categoryPK">
      <el-button icon="el-icon-circle-plus-outline" type="primary" @click="createCategory">新建{{categoryName}}
      </el-button>
    </div>
    <el-table style="margin-top: 15px" :data="data">
      <el-table-column width="50" align="center" prop="sort_number" label="#"></el-table-column>
      <el-table-column prop="name" align="center" :label="categoryName"></el-table-column>
      <el-table-column v-if="strDefault" prop="str_default" align="center" label="内容"></el-table-column>
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click="updateCategory(scope.row)">编辑</el-button>
          <el-button type="danger" @click="onDelete(scope.row.pk)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        layout="prev, pager, next, sizes" :page-size="pageSize" :current-page.sync="page" @current-change="pagechange"

        :total="total">
    </el-pagination>

    <el-dialog title="新增" :visible.sync="showCreate" width="500px" :modal-append-to-body="false" append-to-body>
      <el-form style="margin-left: 15%">
        <el-form-item :label="categoryName + '：'">
          <el-input style=";margin-right: 5px" v-model="createForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="strDefault" label="内容">
          <el-input style=";margin-right: 5px" v-model="createForm.str_default"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCreate = false">取 消</el-button>
        <el-button type="primary" @click="onCreateSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="showUpdate" width="500px" :modal-append-to-body="false" append-to-body>
      <el-form style="margin-left: 15%">
        <el-form-item :label="categoryName + '：'">
          <el-input style=";margin-right: 5px" v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="strDefault" label="内容">
          <el-input style=";margin-right: 5px" v-model="updateForm.str_default"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdate = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    /**
     * 基本信息的增删改组件
     * 需传入参数 categoryName: 基本配置项名称 、  strDefault: 字符串的默认值
     */
    name: 'BaseconfigCURD',
    props: {
      // 分类名称
      categoryPK: {
        type: String,
        required: true,
      },
      // 是否需要默认内容
      strDefault: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        page: 1,
        pageSize: 15,
        total: 0,
        data: [],
        sys_id: null,
        org_id: null,
        biz_id: null,
        showCreate: false,
        categoryName: '',
        createForm: {
          name: '',
          str_default: '',
          sys_id: null,
          org_id: null,
          biz_id: null,
        },
        showUpdate: false,
        updateForm: {
          pk: null,
          name: '',
          str_default: '',
          sys_id: null,
          org_id: null,
          biz_id: null,
        }
      };
    },
    mounted() {
      this.init();
    },
    watch: {
      'categoryPK'(){
        this.init();
      }
    },
    methods: {
      async init() {
        this.data = [];
        this.total = 0;
        this.page = 1;
        try {
          let resp = await this.$http.get(`/baseconfigcategory/${this.categoryPK}/`);
          this.categoryName = resp.data.name;
          this.sys_id = resp.data.sys_id;
          this.biz_id = resp.data.biz_id;
          this.org_id = resp.data.org_id;
          await this.loadData();
        } catch (err) {
          this.$message.error('加载数据错误！');
        }
      },
      async loadData() {
        let params = { page: this.page, pageSize: this.pageSize, category: this.categoryPK };
        let resp = await this.$http.get('/baseconfigitem/', {params})
        this.total = resp.data.count;
        this.data = resp.data.data;
      },
      pagechange() {
        this.loadData();
      },
      createCategory() {
        this.createForm.name = '';
        this.createForm.org_id = this.org_id;
        this.createForm.sys_id = this.sys_id;
        this.createForm.biz_id = this.biz_id;
        this.createForm.category = this.categoryPK;
        this.showCreate = true;
      },
      updateCategory(data) {
        this.updateForm = {...data};
        this.updateForm.org_id = this.org_id;
        this.updateForm.sys_id = this.sys_id;
        this.updateForm.biz_id = this.biz_id;
        this.showUpdate = true;
      },
      async onCreateSubmit() {
        let { name } = this.createForm;
        if (!name) {
          this.$message.error(`请填写${this.categoryName}名称`);
        } else {
          await this.$http.post('/baseconfigitem/', this.createForm)
          this.showCreate = false;
          await this.loadData();
        }
      },
      async onUpdateSubmit() {
        let { name, pk } = this.updateForm;
        if (!name) {
          this.$message.error(`请填写${this.categoryName}名称`);
        } else {
          await this.$http.put(`/baseconfigitem/${pk}/`, this.updateForm)
          this.showUpdate = false;
          await this.loadData();
        }
      },
      async onDelete(pk) {
        try{
          await this.$confirm(`此操作将永久删除该${this.categoryName}, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
          try{
            await this.$http.delete(`/baseconfigitem/${pk}/`);
          } catch (e) {
            this.$message({
              type: 'info',
              message: '删除失败!'
            });
            return;
          }
          this.page = 1;
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } catch (e) {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        } finally {
          await this.loadData();
        }
      }
    }
  };
</script>

<style scoped>

</style>

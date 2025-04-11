<template>
  <el-card>
    <div style="margin-bottom:10px">{{ system.name }}</div>

    <el-form inline label-width="100px">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="create">新建报表配置</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="search" prefix-icon="el-icon-search" placeholder="搜索关键词" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="report_id" prefix-icon="el-icon-search" placeholder="报表ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="
            () => {
              this.page = 1;
              this.loadData();
            }
          ">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="
            () => {
              this.search = '';
              this.report_id = '';
              this.loadData();
            }
          ">全部</el-button>
      </el-form-item>
      <el-form-item label="业务子系统">
        <el-select v-model="biz_id" clearable @change="listTypeChange">
          <el-option
            v-for="item in biz_ids"
            :key="item.biz_id"
            :label="`${item.biz_id}: ${item.name}`"
            :value="item.biz_id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table :data="data" border v-loading="loading">
      <el-table-column prop="sys_id" label="系统ID" align="center" width="200px"></el-table-column>
      <el-table-column prop="org_id" label="组织ID" align="center" width="200px"></el-table-column>
      <el-table-column prop="biz_id" label="业务ID" align="center" width="200px"></el-table-column>
      <el-table-column prop="report_id" label="报表ID" align="center" width="200px"></el-table-column>
      <el-table-column prop="report_name" label="报表名称" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="210px">
        <template slot-scope="{ row }">
          <el-button type="success" @click="copy(row)">复制</el-button>
          <el-button type="primary" @click="edit(row)">编辑</el-button>
          <el-button type="danger" @click="del(row.pk)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination layout="prev, pager, next, sizes" :current-page.sync="page" :page-size.sync="pageSize" @size-change="loadData" @current-change="loadData" :total="total">
    </el-pagination>

    <el-dialog
      :visible.sync="copydialogVisible"
      width="30%"
      :close-on-click-modal="false"
      >
      <el-form ref="form" :model="copyForm" :rules="rules"  label-width="100px">
        <el-form-item label="当前报表ID">
          <el-input v-model="copyForm.cur_ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="系统" prop="sys_id">
          <el-select v-model="copyForm.sys_id" @change="choseSys">
            <el-option v-for="i in AllSystem" :key="i.sys_id" :value="i.sys_id" :label="`${i.sys_id}: ${i.name}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务子系统" prop="biz_id">
          <el-select v-model="copyForm.biz_id" clearable>
            <el-option v-for="i in curBiz_ids" :key="i.biz_id" :value="i.biz_id" :label="`${i.biz_id}: ${i.name}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能模块" prop="permission">
         <SelectPerm :sys_id="copyForm.sys_id" :biz_id="copyForm.biz_id" v-model="copyForm.permission"/>
        </el-form-item>
        <el-form-item label="报表ID" prop="report_id">
          <el-input v-model="copyForm.report_id"></el-input>
        </el-form-item>
        <el-form-item label="报表名称" prop="report_name">
          <el-input v-model="copyForm.report_name"></el-input>
        </el-form-item>
        <el-form-item label="报表说明">
          <el-input type="textarea" v-model="copyForm.report_remark"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="copydialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="copySubmit('form')">确 定</el-button>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import resource from "@/resource";
import SelectPerm from "@/components/SelectPerm.vue";

const COPY_FORM = {
  cur_ID: null,
  sys_id: null,
  biz_id: null,
  org_id: 0,
  report_id: null,
  report_name: null,
  report_remark: null,
  arguments: null,
  charts_struct: null,
  data_struct: null,
  permission: null,
};

export default {
  name: "ReportConf",
  components: {
    SelectPerm,
  },
  computed: {
    ...mapState(["systemlist", "currentSystemId", "userinfo"]),
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      search: "",
      report_id: "",
      loading: false,
      dialogVisable: false,
      data: [],
      system: {
        sys_id: "",
      },
      biz_id: 1,
      biz_ids: [{name: '默认', biz_id: 1}],
      copydialogVisible: false,
      copyForm: JSON.parse(JSON.stringify(COPY_FORM)),
      rules:{
        sys_id:[
          {required: true, message: '请选择系统', trigger: 'change'}
        ],
        biz_id:[
          {required: true, message: '请选择业务子系统', trigger: 'change'}
        ],
        permission:[
          {required: true, message: '请选择功能模块', trigger: 'change'}
        ],
        report_id:[
          {required: true, message: '请输入报表ID', trigger: 'blur'}
        ],
        report_name:[
          {required: true, message: '请输入报表名称', trigger: 'blur'}
        ],
      },
      AllSystem: [],
      curBiz_ids: [],
    };
  },
  methods: {
    copy(val){
      this.copyForm = {
        ...JSON.parse(JSON.stringify(COPY_FORM)),
        cur_ID: val.report_id,
        arguments: val.arguments,
        charts_struct: val.charts_struct,
        data_struct: val.data_struct,
        creator: this.userinfo.pk,
        org_id: 0,
      }
      this.copydialogVisible = true;
    },
    async copySubmit(formName){
      try {
        const valid = await new Promise((resolve) => {
          this.$refs[formName].validate((valid) => {
            resolve(valid);
          });
        });
        if (valid) {
          delete this.copyForm.cur_ID;
          await resource.createObj('reportconf', this.copyForm);
          this.copydialogVisible = false;
          this.$message.success('复制成功');
        } else {
          this.$message.warning('请检查输入');
        }
      } catch (e) {
        this.$message.error('复制失败');
        console.error(e);
      }

    },
    async getSystem(){
      try {
        let resp = await resource.getList('system',{})
        this.AllSystem = resp;
      }catch (e) {
        console.error(e)
      }
    },
    async choseSys(val){
      try {
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
    async loadSystem() {
      let res = await resource.getList("system", {
        sys_id: this.currentSystemId,
      });
      this.system = res[0];
      this.loadBiz();
    },
    loadData() {
      this.loading = true;
      this.$http
        .get("/reportconf/", {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            search: this.search,
            report_id: this.report_id,
            sys_id: this.system.sys_id,
            biz_id: this.biz_id,
          },
        })
        .then((resp) => {
          this.data = resp.data.data;
          this.total = resp.data.count;
          this.loading = false;
        });
    },
    listTypeChange(val) {
      this.biz_id = val;
      this.page = 1;
      this.loadData();
    },
    async loadBiz() {
      let params = {
        sys_id: this.system.sys_id,
      };
      let res = await this.$http.get("/systembiz/", {params});
      this.biz_ids = res.data;
      if (this.biz_ids.length === 0) {
        this.biz_ids = [{name: '默认', biz_id: 1}];
      }
    },
    create() {
      this.$router.push({
        name: "reporteditor-add",
        params: {
          sysid: this.system.sys_id,
        }
      });
    },
    edit(val) {
      this.$router.push({
        name: "reporteditor-edit",
        params: {
          sysid: val.sys_id,
          pk: val.pk,
        }
      });
    },
    del(val) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete(`/reportconf/${val}/`);
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
  },
  async mounted() {
    await this.loadSystem();
    await this.loadData();
    this.getSystem();
  },
  watch: {
    currentSystemId: {
      async handler() {
        await this.loadSystem();
        await this.loadData();
      },
    },
  },
};
</script>

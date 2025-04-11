<template>
  <el-card>
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="dialogVisable = true" icon="el-icon-plus">新建系统</el-button><el-button type="danger" @click="helpDialogVisable = true" icon="el-icon-question">说明</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="search" prefix-icon="el-icon-search" placeholder="搜索关键词"></el-input>
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
              this.loadData();
            }
          ">全部</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="data" border :max-height="tableHeight" highlight-current-row v-loading="loading">
        <el-table-column label="ID" prop="sys_id" width="50px" align="center"></el-table-column>
        <el-table-column label="系统名称" prop="name" width="250px" align="center"></el-table-column>
        <el-table-column label="多租户" width="70px" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.multi_org" style="color:#67C23A;font-size:16px;"><i class="el-icon-success"></i></span>
            <span v-else style="color:#909399;font-size:16px;"><i class="el-icon-error"></i></span>
          </template>
        </el-table-column>
        <el-table-column label="行业" width="200px" header-align="center" prop="industry"></el-table-column>
        <el-table-column label="项目说明" prop="description" header-align="center"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template slot-scope="{ row }">
            <div class="table-button">
              <el-button type="info" round plain size="mini" @click.stop="edit(row)">编辑</el-button>
              <el-button type="warning" round plain size="mini" @click.stop="systembiz(row)">业务子系统</el-button>
              <el-button type="primary" round plain size="mini" @click.stop="perms(row)">功能</el-button>
              <el-button type="primary" round plain size="mini" @click.stop="systemgroups(row)">角色</el-button>
              <el-button type="success" round plain size="mini" @click.stop="org(row)">租户管理</el-button>
              <el-button round plain size="mini" @click.stop="sms(row)">短信</el-button>
              <el-button round plain size="mini" @click.stop="email(row)">邮件</el-button>
              <el-button round plain size="mini" @click.stop="weixin(row)">微信</el-button>
              <el-button round plain size="mini" @click.stop="sysproject(row)">项目工程</el-button>
              <el-button round plain size="mini" @click.stop="department(row)">部门人员</el-button>
              <el-button type="danger" round plain size="mini" @click.stop="databackup(row)">SQL备份</el-button>
<!--              <el-button type="danger" round plain size="mini" @click.stop="del(row.pk)">删除</el-button>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next, sizes" :current-page.sync="page" :page-size.sync="pageSize" @size-change="loadData" @current-change="loadData" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="form.pk ? '编辑' : '新建'" :visible.sync="dialogVisable" width="30%" center @closed="clear">
      <el-form inline label-width="180px">
        <el-form-item label="系统ID">
          <el-input-number v-model="form.sys_id" :controls="false" />
        </el-form-item>
        <el-form-item label="系统名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="行业">
          <el-select v-model="form.industry">
            <el-option v-for="item in industies" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线上地址">
          <el-input v-model="form.url" style="width: 300px" />
        </el-form-item>
        <el-form-item label="多租户系统">
          <el-switch v-model="form.multi_org" active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item label="允许租户注册">
          <el-switch v-model="form.allow_org_register" active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item label="是否开启网站" v-if="!form.pk">
          <el-switch v-model="form.wangzhan" active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item label="默认租户有效期">
          <el-input-number :controls="false" v-model="form.default_org_validity_period" />
        </el-form-item>
        <el-form-item label="长期有效">
          <el-switch v-model="form.is_long_time_validity_period" active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item label="默认租户模块权限">
          <el-select v-model="form.default_org_permissions" multiple clearable filterable @change="default_org_permissions_change">
            <el-checkbox v-model="form.select_all" @change="default_org_permissions_check" style="padding-left: 18px;" >全选</el-checkbox>
            <el-option v-for="item in permsList" :key="item.pk" :label="item.name" :value="item.pk"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户需要定期更改密码">
          <el-switch v-model="form.need_reset_passwd" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="密码更新周期(日)" v-if="form.need_reset_passwd">
          <el-input v-model="form.reset_passwd_interval"></el-input>
        </el-form-item>
        <el-form-item label="系统说明">
          <el-input type="textarea" v-model="form.description" style="width: 300px" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisable = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新建系统的说明 -->
    <el-dialog title="新建系统说明" :visible.sync="helpDialogVisable" width="30%" center>
      <p>
        <h3>
          新建系统并进行开发的流程：
        </h3>
        <ol style="margin-left:2em;">
          <li>在本页面新建系统，确定sys_id</li>
          <li>规划业务子系统，指定biz_id</li>
          <li>规划系统功能</li>
          <li>新建系统租户并添加租户管理员用户（单租户系统）</li>
          <li>在git平台创建代码库，配置git的webhook</li>
          <li>在“项目工程”中配置对应代码库</li>
        </ol>
        <el-divider></el-divider>
        <h3>
          其它说明：
        </h3>
        <ul style="margin-left:2em;">
          <li>微信登录相关功能的需要配置“微信”</li>
          <li>短信登录功能需要配置“短信”</li>
          <li>多租户系统如果允许注册则可不配置租户</li>
        </ul>
      </p>
    </el-dialog>

  </el-card>
</template>

<script>
import { mapState } from "vuex";
import industry from "@/page/industies.json";
import TemplateInit from "@/page/CodeRegister/CodeTemplateInit";
import fuwu_and_yinsi from "@/page/CodeRegister/Code_FuWu_And_YinSi_TemplateInit";
const FORM = {
  sys_id: null,
  name: "",
  industry: "",
  url: "",
  description: "",
  multi_org: false,
  allow_org_register: false,
  wangzhan: false,
  default_org_validity_period: 365,
  is_long_time_validity_period: false,
  default_org_permissions: [],
  need_reset_passwd: false,
  reset_passwd_interval: 90,
  select_all: false,
};

export default {
  name: "System",
  computed: {
    ...mapState(["token", "userinfo", "systemlist"]),
  },
  data() {
    return {
      page: 1,
      pageSize: 100,
      total: 0,
      search: "",
      industies: industry,
      form: JSON.parse(JSON.stringify(FORM)),
      permsList: [],
      update: null,
      data: [],
      options: [],
      dialogVisable: false,
      helpDialogVisable: false,
      loading: false,
      tableHeight: 600,
    };
  },
  methods: {
    default_org_permissions_check(val) {
      if (val) {
        this.form.default_org_permissions = this.permsList.map((item) => item.pk);
      } else {
        this.form.default_org_permissions = [];
      }
    },
    default_org_permissions_change(list) {
      if (list.length === this.permsList.length) {
        this.form.select_all = true;
      } else {
        this.form.select_all = false;
      }
    },
    async loadData() {
      this.loading = true;
      let res = await this.$http.get("/system/", {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          search: this.search,
        },
      });
      this.data = res.data.data;
      this.total = res.data.count;
      this.loading = false;
    },
    async submit() {

      const loading = this.$loading({
        lock: true,
        text: '创建中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      });

      if (this.update) {
        this.update.create_user = this.userinfo.pk;
        await this.$http.put(`/system/${this.update.pk}/`, this.form);
        this.$message.success("修改成功!");
        this.dialogVisable = false;
        this.loadData();
      } else {
        this.form.create_user = this.userinfo.pk;
        let res = await this.$http.post("/system/", this.form);
        if(res && res.data){
          if(this.form.wangzhan){
            let params = {
              biz_id: 1,
              codename: 'wagtailadmin.access_admin',
              name: '网站管理',
              parent: '',
              sys_id:res.data.sys_id,
            }
            await this.$http.post("/permissions/", params);
          }
          // 创建隐私政策和服务协议表单
          let service = {
            api_name: 'services',
            api_path: '/api/v1/services/',
            api_version: 'v1',
            biz_id:1,
            create_time: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
            keyword: '隐私政策和服务协议',
            remark: '隐私政策和服务协议',
            title: '隐私政策和服务协议',
            sys_id: res.data.sys_id,
            org_id: 1,
            src_id: 1,
            need_login: false,
          }
          let res0 = await this.$resource.createObj('formtemplate',service)
          let data1 = fuwu_and_yinsi();
          if(res0 && data1.length){
            let arr1 = [];
            for (let i = 0; i < data1.length; i++) {
              let item = data1[i];
              let params = {
                alias: item.alias,
                col_name: item.col_name,
                col_title: item.col_title,
                local_data_source: item.local_data_source,
                data: item.data,
                in_filter: item.in_filter,
                is_related: item.is_related,
                is_required: item.is_required,
                is_vant_show: item.is_vant_show,
                sort_num: i,
                sys_id: res0.sys_id,
                biz_id: res0.biz_id,
                org_id: res0.org_id,
                src_id: res0.src_id,
                template:res0.pk,
                unique: item.unique,
                verify_exp: item.verify_exp,
                widget: item.widget,
                widget_attr: item.widget_attr
              }
              arr1.push(this.$resource.createObj('formfields',params))
            }
            await Promise.all(arr1)
          }
          // 职工管理
          let params = {
            api_name: 'customer',
            api_path: '/api/v1/customer/',
            api_version: 'v1',
            biz_id:1,
            create_time: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
            keyword: '职工管理',
            remark: '职工管理',
            title: '职工管理',
            sys_id: res.data.sys_id,
            org_id: 1,
            src_id: 1,
            need_login: true,
          }
          let data = TemplateInit();
          let res1 = await this.$resource.createObj('formtemplate',params)
          if(res1 && data.length>0){
            let arr = [];
            for (let i = 0; i < data.length; i++) {
              let item = data[i];
              let params = {
                alias: item.alias,
                col_name: item.col_name,
                col_title: item.col_title,
                local_data_source: item.local_data_source,
                data: item.data,
                in_filter: item.in_filter,
                is_related: item.is_related,
                is_required: item.is_required,
                is_vant_show: item.is_vant_show,
                sort_num: i,
                sys_id: res1.sys_id,
                biz_id: res1.biz_id,
                org_id: res1.org_id,
                src_id: res1.src_id,
                template:res1.pk,
                unique: item.unique,
                verify_exp: item.verify_exp,
                widget: item.widget,
                widget_attr: item.widget_attr
              }
              arr.push(this.$resource.createObj('formfields',params))
            }
            await Promise.all(arr)
          }
        }
        this.$message.success("新建成功!");
        this.dialogVisable = false;
        this.loadData();
        loading.close();
      }
      this.clear();
    },
    async edit(obj) {
      let resp = await this.$http.get("/permissions/", {
        params: { sys_id: obj.sys_id },
      });
      this.permsList = resp.data;
      this.form = { ...obj };
      this.update = obj;
      this.dialogVisable = true;
    },
    del(pk) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$http.delete(`/system/${pk}/`);
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
      return false;
    },
    dropClick(name, row) {
      switch (name) {
        case "sms":
          this.sms(row);
          break;
        case "perms":
          this.perms(row);
          break;
        case "systemgroups":
          this.systemgroups(row);
          break;
        case "sysproject":
          this.sysproject(row);
          break;
        case "org":
          this.org(row);
          break;
        case "department":
          this.department(row);
          break;
        case "systemmodule":
          this.systemmodule(row);
          break;
        default:
          break;
      }
    },
    sms(row) {
      this.$router.push({
        name: "smsconfig",
        params: { sys_id: String(row.sys_id) },
      });
    },
    email(row){
      this.$router.push({
        name: "emailconfig",
        params: { sys_id: String(row.sys_id) },
      });
    },
    weixin(row) {
      this.$router.push({
        name: "weixinconfig",
        params: { system_id: row.pk },
      });
    },
    perms(row) {
      this.$router.push({
        name: "systempermissions",
        params: { sys_id: row.sys_id },
      });
    },
    systembiz(row) {
      this.$router.push({
        name: "systembiz",
        params: { system_id: row.pk },
      });
    },
    systemgroups(row) {
      this.$router.push({
        name: "systemgroups",
        params: { sys_id: String(row.sys_id) },
      });
    },
    sysproject(row) {
      this.$router.push({
        name: "systemproject",
        params: { system_id: String(row.pk) },
      });
    },
    org(row) {
      this.$router.push({
        name: "org",
        params: { sys_id: String(row.sys_id) },
      });
    },
    department(row) {
      this.$router.push({
        name: "department",
        params: { sys_id: String(row.sys_id) },
      });
    },
    systemmodule(row) {
      this.$router.push({
        name: "systemmodule",
        params: { sys_id: row.sys_id },
      });
    },
    databackup(row) {
      this.$router.push({
        name: "systemdatabackup",
        params: { sys_id: row.sys_id },
      });
    },
    clear() {
      this.form = JSON.parse(JSON.stringify(FORM));
      this.update = null;
    },
  },
  created() {
    this.loadData();
    this.tableHeight = document.querySelector('body').clientHeight - 230;
    window.onresize = () => {
      this.tableHeight = document.querySelector('body').clientHeight - 230;
    }
  },
};
</script>

<style scoped>
.tab-btn {
  margin-right: 10px;
}
.table-button {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 3px;
  height: 60px;
  width: 100%;
}
.table-button .el-button--mini {
  padding: 5px 5px;
  margin-left: 0;
}
</style>

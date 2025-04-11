<template>
  <el-card v-loading="loading">
    <div style="margin-bottom: 10px">{{ system.name }}</div>

    <el-form inline label-width="100px">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="create">新建ETL</el-button>
      </el-form-item>
      <el-form-item label="业务子系统">
        <el-select v-model="biz_id" clearable @change="bizChange">
          <el-option v-for="item in biz_ids" :key="item.biz_id" :label="`${item.biz_id}: ${item.name}`" :value="item.biz_id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-user" @click="FetlUserVisible = true">Fetl RSA 加密用户</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="data" border v-loading="loading" :cell-style="{ textAlign: 'center', padding: '0px', paddingLeft: 0, paddingRight: 0 }" :header-cell-style="{ textAlign: 'center', padding: '0px', paddingLeft: 0, paddingRight: 0 }">
      <el-table-column prop="data_source_name" label="数据源名称" width="200px"></el-table-column>
      <el-table-column prop="data_source_desc" label="数据源描述"></el-table-column>
      <el-table-column prop="data_direction_display" label="数据方向" width="80px"></el-table-column>
      <el-table-column prop="data_source_type_display" label="数据源类型" width="60px"></el-table-column>
      <el-table-column prop="api_code" label="API编号代码" width="280px"></el-table-column>
      <el-table-column prop="formtemplate_display" label="表单模板" width="200px"></el-table-column>
      <el-table-column prop="is_things_data" label="物联网数据" width="90px">
        <template slot-scope="{ row }">
          {{ row.is_things_data ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column prop="use_rsa" label="RSA加密" width="90px">
        <template slot-scope="{ row }">
          {{ row.use_rsa ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210px">
        <template slot-scope="{ row }">
          <el-button-group size="mini">
            <el-button type="success" @click="copy(row)" size="mini">复制</el-button>
            <el-button type="primary" @click="edit(row)" size="mini">编辑</el-button>
            <el-button type="danger" @click="del(row.pk)" size="mini">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination layout="prev, pager, next, sizes" :current-page.sync="page" :page-size.sync="pageSize" @size-change="loadData" @current-change="loadData" :total="total"> </el-pagination>

    <el-dialog append-to-body v-if="CopyVisable" title="复制" :visible.sync="CopyVisable" width="25%" :close-on-click-modal="false" :close-on-press-escape="false" top="10vh" center destroy-on-close>
      <el-form class="formStyle" :model="formEtl" ref="formEtl" label-width="100px" :rules="formEtlRules" status-icon>
        <el-row type="flex" style="flex-wrap: wrap">
          <el-col :span="24">
            <el-form-item label="数据源名称" prop="data_source_name">
              <el-input placeholder="请输入数据源名称" v-model="formEtl.data_source_name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统" prop="sys_id">
              <el-tooltip class="item" effect="light" content="如果不选择则默认为本系统" placement="top-start">
                <i class="el-icon-question"></i>
              </el-tooltip>
              <el-select style="width: 94%; margin-left: 5px" v-model="formEtl.sys_id" @change="choseSys" clearable>
                <el-option v-for="i in AllSystem" :key="i.sys_id" :value="i.sys_id" :label="`${i.sys_id}: ${i.name}`"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业务子系统" prop="biz_id" :rules="{ required: formEtl.sys_id ? true : false, message: '请选择业务子系统', trigger: 'change' }">
              <el-select style="width: 100%" v-model="formEtl.biz_id" clearable>
                <el-option v-for="i in curBiz_ids" :key="i.biz_id" :value="i.biz_id" :label="`${i.biz_id}: ${i.name}`"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center">
        <el-button @click="CopyVisable = false" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="CopyEtl">确定</el-button>
      </div>
    </el-dialog>

    <el-drawer :visible.sync="FetlUserVisible" title="Fetl RSA 加密用户" size="80%" :close-on-click-modal="false">
      <template v-if="FetlUserVisible">
        <fetl-user></fetl-user>
      </template>
    </el-drawer>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import resource from "@/resource";
import FetlUser from "./FetlUser.vue";
const formEtl = {
  data_source_name: null,
  sys_id: null,
  biz_id: null,
};
export default {
  name: "Fetl",
  computed: {
    ...mapState(["systemlist", "currentSystemId", "userinfo"]),
  },
  components: {
    "fetl-user": FetlUser,
  },
  data() {
    return {
      loading: false,
      biz_id: 1,
      biz_ids: [{ name: "默认", biz_id: 1 }],
      system: {
        sys_id: "",
        name: "",
      },
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
      CopyVisable: false,
      formEtl: JSON.parse(JSON.stringify(formEtl)),

      formEtlRules: {
        data_source_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      curretnEtl: null,
      AllSystem: [],
      curBiz_ids: [],
      FetlUserVisible: false,
    };
  },

  mounted() {
    this.loadSystem();
    this.loadBiz();
    this.loadData();
  },

  methods: {
    async choseSys(val) {
      try {
        let params = {
          sys_id: val,
        };
        this.curBiz_ids = await resource.getList("systembiz", params);
        if (this.curBiz_ids.length === 0) {
          this.curBiz_ids = [{ name: "默认", biz_id: 1 }];
        }
      } catch (e) {
        console.error(e);
      }
    },
    async loadSystem() {
      let res = await resource.getList("system", {
        sys_id: this.currentSystemId,
      });
      this.system = res[0];
    },
    async loadBiz() {
      let params = {
        sys_id: this.currentSystemId,
      };
      let res = await this.$http.get("/systembiz/", { params });
      this.biz_ids = res.data;
      if (this.biz_ids.length === 0) {
        this.biz_ids = [{ name: "默认", biz_id: 1 }];
      }
    },
    bizChange() {
      console.log(this.biz_id);
    },
    async loadData() {
      this.loading = true;
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sys_id: this.currentSystemId,
      };
      let resp = await resource.getList("fetlruledefine", params);
      this.data = resp.data;
      this.total = resp.count;
      this.loading = false;
    },
    create() {
      this.$router.push({ name: "fetlcreate" });
    },
    async CopyEtl() {
      try {
        let valid = await new Promise((resolve) => this.$refs.formEtl.validate((validate) => resolve(validate)));
        if (valid) {
          let curretnEtl = { ...this.curretnEtl, api_code: null, data_source_name: this.formEtl.data_source_name, sys_id: this.formEtl.sys_id ? this.formEtl.sys_id : this.curretnEtl.sys_id, biz_id: this.formEtl.biz_id ? this.formEtl.biz_id : this.curretnEtl.biz_id };
          let datas = await resource.createObj("fetlruledefine", curretnEtl);
          if (datas.pk) {
            const arr = this.curretnEtl.rule_chains.map((field, i) =>
              resource.createObj("fetlrulechain", {
                ...this.formEtl,
                node_code: field.node_code,
                node_desc: field.node_desc,
                node_name: field.node_name,
                node_type: field.node_type,
                rule_define: datas.pk,
                sort_num: i,
              })
            );
            // 等待所有规则链创建完成
            await Promise.all(arr);
          }
          // 加载数据
          await this.loadData();
          this.$message.success("创建成功");
          this.CopyVisable = false;
        } else {
          this.$message.warning("请填写完整信息！");
        }
      } catch (e) {
        console.error(e);
      }
    },
    async copy(row) {
      console.log(row);
      try {
        let resp = await resource.getList("system", {});
        this.AllSystem = resp;
      } catch (e) {
        console.error(e);
      }
      this.curretnEtl = { ...row };
      this.CopyVisable = true;
    },
    edit(row) {
      this.$router.push({ name: "fetlcreate", query: { pk: row.pk } });
    },
    async del(pk) {
      try {
        await this.$confirm("确认删除该ETL吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        try {
          await resource.deleteObj("fetlruledefine", pk, {});
          this.$message.success("删除成功!");
          await this.loadData();
        } catch (err) {
          this.$message.error("删除失败!");
        }
      } catch (e) {
        if (e !== "cancel") {
          console.error(e);
          this.$message.error("删除失败");
        }
      }
    },
  },

  watch: {
    currentSystemId: {
      async handler() {
        this.loadSystem();
        this.loadBiz();
        this.loadData();
      },
    },
  },
};
</script>

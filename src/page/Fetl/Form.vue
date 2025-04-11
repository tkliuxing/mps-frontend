<template>
  <el-card v-loading="loading">
    <div style="margin-bottom: 10px">
      <el-button icon="el-icon-back" circle @click="Back"></el-button>
      <span style="font-size: 16px; margin-left: 10px">ETL编辑器</span>
    </div>
    <el-divider direction="horizontal"></el-divider>
    <el-row :gutter="10">
      <el-col :span="12" style="border-right: 1px solid #ddd">
        <div style="margin-bottom: 10px">ETL基本配置</div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="名称" prop="data_source_name">
            <el-input placeholder="名称" :maxLength="255" v-model="form.data_source_name"></el-input>
          </el-form-item>
          <el-form-item label="场景描述" prop="data_source_desc">
            <el-input placeholder="" type="textarea" :rows="4" v-model="form.data_source_desc"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据方向" prop="data_direction">
                <el-select v-model="form.data_direction" style="width: 100%" placeholder="请选择" clearable>
                  <el-option v-for="item in data_directions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作类型" prop="data_source_type">
                <el-select v-model="form.data_source_type" style="width: 100%" placeholder="请选择" clearable>
                  <el-option v-for="item in data_source_types" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租户ID">
                <el-select v-model="form.org_id" style="width: 100%" clearable>
                  <el-option v-for="item in orgs" :key="item.pk" :label="`${item.org_id}: ${item.name}`" :value="item.org_id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务子系统">
                <el-select v-model="form.biz_id" style="width: 100%" clearable>
                  <el-option v-for="item in biz_ids" :key="item.biz_id" :label="`${item.biz_id}: ${item.name}`" :value="item.biz_id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="src_id">
                <el-input clearable v-model="form.src_id" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.data_source_type === 'api' && form.data_direction === 'out'">
              <el-form-item label="目标API地址" prop="push_url" v-if="form.data_source_type === 'api' && form.data_direction === 'out'">
                <el-input placeholder="目标API地址" style="width: 100%" :maxLength="512" v-model="form.push_url"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物联网数据" prop="is_things_data">
                <el-switch v-model="form.is_things_data" active-text="是" inactive-text="否"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.data_source_type === 'api' && form.data_direction === 'in'">
              <el-form-item label="使用RSA加密">
                <el-switch v-model="form.use_rsa" active-text="是" inactive-text="否"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="!form.is_things_data">
              <el-form-item label="表单模板" prop="formtemplates" v-if="!form.is_things_data">
                <el-select v-model="form.formtemplate" placeholder="请选择" clearable style="width: 100%">
                  <el-option v-for="item in formtemplates" :key="item.pk" :label="item.title" :value="item.pk"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.is_things_data">
              <el-form-item label="设备SN" prop="things_id" v-if="form.is_things_data">
                <el-input placeholder="设备SN" style="width: 100%" :maxLength="255" v-model="form.things_id"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="success" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div style="margin-bottom: 10px">ETL规则链</div>
        <el-form inline>
          <el-form-item>
            <el-button type="primary" plain @click="addEtl">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="rule_chains" row-key="pk" class="field-table" height="500" border stripe :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" element-loading-text="加载中...">
          <el-table-column align="center" width="50" class-name="drag-column">
            <template>
              <div class="drag-box">
                <i class="el-icon-d-caret"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="node_type" label="节点类型" width="120">
            <template slot-scope="{ row }">
              {{ displayOption(row.node_type) }}
            </template>
          </el-table-column>
          <el-table-column prop="node_name" label="节点名称"></el-table-column>
          <el-table-column prop="node_desc" label="节点描述"></el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template slot-scope="{ row, $index }">
              <div style="display: flex; justify-content: flex-start">
                <el-tooltip class="item" effect="light" content="测试" placement="top-start">
                  <el-button type="warning" @click="ceshi(row)" class="el-icon-s-promotion" circle></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="编辑" placement="top-start">
                  <el-button type="primary" @click="edit(row)" class="el-icon-edit" circle></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="删除" placement="top-start">
                  <el-popconfirm style="margin-left: 10px" confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="删除后不可恢复，确定删除吗？" @confirm="del(row.pk)">
                    <el-button slot="reference" type="danger" class="el-icon-delete" circle></el-button>
                  </el-popconfirm>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog append-to-body :title="formEtl.pk ? '编辑' : '新增'" :visible.sync="addVisable" width="40%" :close-on-click-modal="false" :close-on-press-escape="false" top="10vh" center destroy-on-close>
      <el-form class="formStyle" :model="formEtl" ref="formEtl" label-width="100px" :rules="rulesEtl" status-icon>
        <el-row type="flex" style="flex-wrap: wrap">
          <el-col :span="24">
            <el-form-item label="节点类型" prop="node_type">
              <el-select v-model="formEtl.node_type" placeholder="请选择" clearable filterable>
                <el-option v-for="item in filteredNodeType" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="节点名称" prop="node_name">
              <el-input placeholder="请输入节点名称" v-model="formEtl.node_name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="节点描述" prop="node_desc">
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 20 }" show-word-limit placeholder="请输入节点描述" v-model="formEtl.node_desc" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="formEtl.node_type != 'save'">
            <el-form-item label="节点代码" prop="node_code">
              <PythonEditor v-model="formEtl.node_code" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center">
        <el-button @click="addVisable = false" icon="el-icon-close">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="saveEtl">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog append-to-body :title="currentDraw.node_name + ' -测试'" :visible.sync="drawer" fullscreen :close-on-click-modal="false" :close-on-press-escape="false" center destroy-on-close>
      <el-row>
        <el-col :span="8">
          <el-form class="formStyle" label-position="top" :model="formTest" ref="formTest" label-width="100px" :rules="formTes" status-icon>
            <el-row type="flex" style="flex-wrap: wrap">
              <el-col :span="24">
                <el-form-item label="测试数据JSON：" prop="data">
                  <JSONEditor v-model="formTest.data" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="text-align: center">
            <el-button @click="drawer = false" icon="el-icon-close">取消</el-button>
            <el-button icon="el-icon-check" type="primary" @click="saveTest">确定</el-button>
          </div>
        </el-col>
        <el-col :span="16" style="height: 600px; overflow: auto">
          <div v-if="ResultSuccess" style="padding: 10px">
            <el-steps direction="vertical">
              <el-step v-for="(item, index) in ResultSuccess.results" :key="index" :status="getStatus(item.success)" :title="displayOptionChain(item.rule_chain_id)">
                <template #description>
                  <div>
                    <p v-if="item.message"><strong>错误提示：</strong></p>
                    <pre :class="item.success ? 'green' : 'red'">
                      <code v-html="formatMessage(item.message)"></code>
                    </pre>
                    <p style="color: #333333"><strong>输出：</strong></p>
                    <pre :class="item.success ? 'green' : 'red'">
                      <code v-html="formatMessage(item.stdout)"></code>
                    </pre>
                  </div>
                </template>
              </el-step>
            </el-steps>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </el-card>
</template>

<script>
import PythonEditor from "@/components/PythonEditor.vue";
import JSONEditor from "@/components/JSONEditor.vue";
import resource from "@/resource";
import { mapState } from "vuex";
import Template from "@/Template/Template.vue";
import Sortable from "sortablejs";

const FORM = {
  pk: null,
  sys_id: null,
  org_id: 0,
  biz_id: 1,
  src_id: 1,
  data_source_name: null,
  data_source_desc: null,
  data_direction: null,
  data_source_type: null,
  data_source_api_json_path: null,
  data_source_db_sql: null,
  api_code: null,
  formtemplate: null,
  is_things_data: false,
  things_id: null,
  things_id_source_sql: null,
  push_url: null,
  create_fields_translate_json: null,
  update_fields_translate_json: null,
  fill_fields_translate_json: null,
  create_user: null,
  create_time: null,
  use_rsa: false,
};
const FORMETL = {
  pk: null,
  sys_id: null,
  org_id: 0,
  biz_id: 1,
  src_id: 1,
  create_user: null,
  create_time: null,
  node_type: null,
  node_name: null,
  node_desc: null,
  node_code: null,
  rule_define: null,
  // 'parent': null,
  sort_num: 0,
};
const FormTest = {
  data: null,
};
export default {
  name: "ETLForm",
  props: {
    pk: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState(["systemlist", "currentSystemId", "userinfo"]),
    filteredNodeType() {
      if (this.form.data_direction === "out") {
        return this.NodeType.filter((item) => item.code !== "save");
      } else if (this.form.data_direction === "in") {
        return this.NodeType.filter((item) => item.code !== "template_reader");
      } else {
        return this.NodeType;
      }
    },
  },
  components: { Template, PythonEditor, JSONEditor },
  data() {
    return {
      loading: false,
      form: JSON.parse(JSON.stringify(FORM)),
      rules: {
        data_source_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        data_source_desc: [{ required: true, message: "请输入场景描述", trigger: "blur" }],
        data_direction: [{ required: true, message: "请选择数据方向", trigger: "change" }],
        data_source_type: [{ required: true, message: "请选择操作类型", trigger: "change" }],
      },
      data_directions: [
        { label: "入（数据源到数据库）", value: "in" },
        { label: "出（数据库到数据源）", value: "out" },
      ],
      data_source_types: [
        { label: "API", value: "api" },
        { label: "数据库", value: "db" },
      ],
      formtemplates: [],
      data: [],
      NodeType: [
        { code: "template_reader", name: "模版数据读取" },
        { code: "extract", name: "数据提取" },
        { code: "table_transform", name: "表转换" },
        { code: "line_transform", name: "行转换" },
        { code: "save", name: "数据保存" },
      ],
      addVisable: false,
      formEtl: JSON.parse(JSON.stringify(FORMETL)),
      rulesEtl: {
        node_type: [{ required: true, message: "请选择节点类型", trigger: "blur" }],
        node_name: [{ required: true, message: "请输入节点名称", trigger: "blur" }],
        node_desc: [{ required: true, message: "请输入节点描述", trigger: "blur" }],
        node_code: [{ required: true, message: "请输入节点代码", trigger: "blur" }],
      },
      rule_chains: [],
      drawer: false,
      currentDraw: {},
      formTes: {
        data: [{ required: true, message: "请输入测试数据JSON", trigger: "blur" }],
      },
      formTest: JSON.parse(JSON.stringify(FormTest)),
      ResultSuccess: null,
      orgs: [],
      biz_ids: [{ name: "默认", biz_id: 1 }],
    };
  },
  mounted() {
    this.loadData();
    this.rowDrop();
    this.loadBiz();
  },
  methods: {
    async loadBiz() {
      try {
        let params = {
          sys_id: this.currentSystemId,
        };
        this.biz_ids = await resource.getList("systembiz", params);
        if (this.biz_ids.length === 0) {
          this.biz_ids = [{ name: "默认", biz_id: 1 }];
        }
        this.orgs = await resource.getList("systemorg", {
          sys_id: this.currentSystemId,
        });
      } catch (e) {}
    },
    getStatus(val) {
      let status = "success";
      if (val) {
        status = "success";
      } else {
        status = "error";
      }
      return status;
    },
    formatMessage(message) {
      if (!message) return "";
      return message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      // .replace(/\n/g, '<br>');
    },
    ceshi(row) {
      this.currentDraw = row;
      this.drawer = true;
      this.formTest = {
        data: {},
      };
      this.ResultSuccess = null;
    },
    async saveTest() {
      try {
        this.ResultSuccess = null;
        let valid = await new Promise((resolve) => this.$refs.formTest.validate((validate) => resolve(validate)));
        if (valid) {
          let resp = await resource.createObj("fetlrulechaintest", {
            node: this.currentDraw.pk,
            data: this.formTest.data,
          });
          this.ResultSuccess = resp;
        } else {
          this.$message.warning("请填写完整信息！");
        }
      } catch (e) {
        console.error(e);
      }
    },
    edit(row) {
      this.formEtl = { ...row };
      this.addVisable = true;
    },
    async del(pk) {
      try {
        await resource.deleteObj("fetlrulechain", pk, {});
        this.$message.success("删除成功!");
        await this.loadData();
      } catch (err) {
        this.$message.error("删除失败!");
      }
    },
    displayOptionChain(val) {
      if (!val) return;
      let a = this.rule_chains.find((i) => i.pk == val);
      return a.node_name;
    },
    displayOption(val) {
      if (!val) return;
      let a = this.NodeType.find((i) => i.code == val);
      return a.name;
    },
    addEtl() {
      this.formEtl = {};
      this.addVisable = true;
    },
    Back() {
      this.$router.push({ name: "fetl" });
    },
    rowDrop() {
      const tbody = document.querySelector(".field-table .el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        async onEnd({ newIndex, oldIndex }) {
          const oldRow = _this.rule_chains[oldIndex];
          const currRow = _this.rule_chains[oldIndex]; // 被移动的行
          const targetRow = _this.rule_chains[newIndex]; // 目标行
          // 更新 rule_chains
          _this.rule_chains.splice(oldIndex, 1); // 删除原行
          _this.rule_chains.splice(newIndex, 0, currRow); // 插入到新位置
        },
      });
    },
    async saveEtl() {
      try {
        let valid = await new Promise((resolve) => this.$refs.formEtl.validate((validate) => resolve(validate)));
        if (!this.form.pk) {
          this.$message.warning("未获取到ETL基本配置！");
          return;
        }
        if (!this.formEtl.pk) {
          this.formEtl.rule_define = this.form.pk;
        }
        if (valid) {
          if (this.formEtl.node_type != "save") {
            let rules = await resource.createObj("fetlsyntaxcheck", {
              code: this.formEtl.node_code,
            });
            if (rules && !rules.success) {
              this.$message.error(rules.result);
              return;
            }
          }
          if (this.formEtl.pk) {
            await resource.updateObj("fetlrulechain", this.formEtl.pk, {
              ...this.formEtl,
            });
          } else {
            let sort_num = this.rule_chains.length + 1;
            await resource.createObj("fetlrulechain", {
              ...this.formEtl,
              sort_num,
            });
          }
          await this.loadData();
          this.addVisable = false;
        } else {
          this.$message.warning("请填写完整信息");
        }
      } catch (e) {
        console.error(e);
      }
    },
    async loadData() {
      this.form.sys_id = this.currentSystemId;
      this.loading = true;
      if (this.pk) {
        let data = await resource.getObj("fetlruledefine", this.pk);
        this.form = data;
        this.rule_chains = data.rule_chains;
      }
      this.loadFormtemplate();
      this.loading = false;
    },
    async loadFormtemplate() {
      let data = await resource.getList("formtemplatemin", { sys_id: this.currentSystemId });
      this.formtemplates = data;
    },
    async submit() {
      let valid = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      this.loading = true;
      if (this.pk) {
        let arr = [];
        for (let i = 0; i < this.rule_chains.length; i++) {
          let field = this.rule_chains[i];
          arr.push(this.$http.patch(`/fetlrulechain/${field.pk}/`, { sort_num: i }));
        }
        await Promise.all(arr);
        let data = await resource.updateObj("fetlruledefine", this.pk, this.form);
        this.form = data;
        this.$message.success("保存成功");
      } else {
        // this.form.create_time = new Date();
        this.form.create_time = this.$moment().format("YYYY-MM-DD HH:mm:ss");
        let data = await resource.createObj("fetlruledefine", this.form);
        this.form = data;
        this.$message.success("创建成功");
      }
      this.loading = false;
    },
  },
  watch: {
    pk: {
      handler() {
        this.loadData();
      },
      immediate: true,
    },
  },
};
</script>

<style>
.red {
  color: red;
}
.green {
  color: #42a902;
}
</style>

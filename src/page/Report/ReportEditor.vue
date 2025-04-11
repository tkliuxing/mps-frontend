<template>
  <el-card >
    <div style="margin-bottom:10px">
      <el-button icon="el-icon-back" circle @click="$router.back()"></el-button>
      <span style="font-size: 16px; margin-left:10px;">报表编辑器</span>
    </div>
    <el-row :gutter="10">
      <el-col :span="12" style="border-right:1px solid #ccc;">
        <el-tabs v-model="editorTabActive" type="card">
          <el-tab-pane label="基本信息" name="info"></el-tab-pane>
          <el-tab-pane label="参数定义" name="arguments"></el-tab-pane>
          <el-tab-pane label="数据定义" name="headers"></el-tab-pane>
          <el-tab-pane label="图表定义" name="charts"></el-tab-pane>
          <div v-show="editorTabActive==='info'">
            <el-form label-width="100px" inline ref="ReportForm" :model="form">
              <!-- <el-form-item label="系统ID">
                <el-input-number v-model="form.sys_id" :controls="false" disabled></el-input-number>
              </el-form-item> -->
              <el-form-item label="功能模块" prop="permission" :rules="[{ required: true, message: '必填项！', trigger: 'change' }]">
                <SelectPerm :sys_id="currentSystemId" :biz_id="form.biz_id" v-model="form.permission" />
              </el-form-item>
              <el-form-item label="组织ID">
                <el-input-number v-model="form.org_id" :controls="false"></el-input-number>
              </el-form-item>
              <el-form-item label="业务ID"  :rules="{ required: true, message: '必填项！' }">
                <el-select v-model="form.biz_id">
                  <el-option
                    v-for="item in biz_ids"
                    :key="item.biz_id"
                    :label="`${item.biz_id}: ${item.name}`"
                    :value="item.biz_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="报表ID" :rules="{ required: true, message: '必填项！' }">
                <el-input v-model="form.report_id"></el-input>
              </el-form-item>
              <el-form-item label="报表名称" :rules="{ required: true, message: '必填项！' }">
                <el-input v-model="form.report_name" style="width: 550px"/>
              </el-form-item>
              <el-form-item label="报表说明">
                <el-input type="textarea" v-model="form.report_remark" style="width: 550px;"/>
              </el-form-item>
            </el-form>
          </div>
          <div v-show="editorTabActive==='arguments'">
            <el-form label-width="100px">
              <el-form-item>
                <template slot="label">
                  <span>参数定义</span>
                  <el-button type="info" @click="argumentsExampleShow=true">样例</el-button><br>
                  <el-button v-if="update" class="save-btn" type="primary" @click="save">保存</el-button><br>
                  <el-button v-if="form.pk" type="warning" @click="runReport">预览</el-button>
                </template>
                <template>
                  <div class="box_parameter">
                    <template >
<!--                   <div class="jsoneditor" id="arguments"></div>-->
                      <h3>搜索条件</h3>
                        <el-form ref="sqlform" label-width="85px" status-icon >
                          <div v-for="(item, index) in sql_params">
                            <el-row>
                              <el-col :span="8">
                                <el-form-item label="数据库字段">
                                  <el-input v-model="item.field" autocomplete="on" clearable></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="请求参数">
                                  <el-input v-model="item.query_name" clearable autocomplete="on"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="名称">
                                  <el-input v-model="item.label" clearable autocomplete="on"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="6">
                                <el-form-item label="默认值">
                                  <el-input v-model="item.default" clearable autocomplete="on"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="7">
                                <el-form-item label="是否必填">
                                  <el-radio-group v-model="item.required">
                                    <el-radio :label="true">是</el-radio>
                                    <el-radio :label="false">否</el-radio>
                                  </el-radio-group>
                                </el-form-item>
                              </el-col>
                              <el-col :span="7">
                                <el-form-item label="搜索条件">
                                  <el-select v-model="item.exp" placeholder="请选择搜索条件" clearable>
                                    <el-option
                                      v-for="item in exp"
                                      :key="item.id"
                                      :label="item.value"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="4" style="text-align: right">
                                <el-button v-if="index == (sql_params.length - 1)"
                                           style="margin-left: 10px"
                                           type="primary"
                                           plain circle icon="el-icon-plus"
                                           @click="add_sql_params()">
                                </el-button>
                                <el-button
                                  v-if="index == (sql_params.length - 1) &&sql_params.length>1"
                                  style="margin-left: 10px"
                                  type="primary"
                                  plain circle icon="el-icon-minus"
                                  @click.prevent="del_sql_params(index)">
                                </el-button>
                              </el-col>
                            </el-row>
                          </div>
                        </el-form>
                      <el-divider></el-divider>
                    </template>
                    <template>
                      <h3>分页</h3>
                        <el-form ref="limitform" label-width="90px" status-icon >
                          <div v-for="(item, index) in limit_params">
                            <el-row>
                              <el-col :span="8">
                                <el-form-item label="数据库字段">
                                  <el-input v-model="item.field" autocomplete="on" clearable></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="请求参数">
                                  <el-input v-model="item.query_name" clearable autocomplete="on"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="名称">
                                  <el-input v-model="item.label" clearable autocomplete="on"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="8">
                                <el-form-item label="默认值">
                                  <el-input v-model="item.default" clearable autocomplete="on"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="是否必填">
                                  <el-radio-group v-model="item.required">
                                    <el-radio :label="true">是</el-radio>
                                    <el-radio :label="false">否</el-radio>
                                  </el-radio-group>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8" style="text-align: right">
                                <el-button v-if="index == (limit_params.length - 1)"
                                           style="margin-left: 10px"
                                           type="primary"
                                           plain circle icon="el-icon-plus"
                                           @click="add_limit_params()">
                                </el-button>
                                <el-button
                                  v-if="index == (limit_params.length - 1) && limit_params.length>1"
                                  style="margin-left: 10px"
                                  type="primary"
                                  plain circle icon="el-icon-minus"
                                  @click.prevent="del_limit_params(index)">
                                </el-button>
                              </el-col>
                            </el-row>
                          </div>
                        </el-form>
                    </template>
                    <el-divider></el-divider>
                    <div>
                      <h3>SQL</h3>
                        <el-form-item label="SQL">
                          <el-input :autosize="{ minRows: 3,maxRows:10}" type="textarea" v-model="sql"/>
                        </el-form-item>
                    </div>
                  </div>

                </template>
              </el-form-item>
              <el-form-item>
                <template slot="label">
                  <span>SQL编辑器</span>
                  <el-button type="warning" @click="formatSql">美化</el-button>
                  <el-button type="info" @click="mini">压缩</el-button>
                  <el-button type="danger" @click="()=>{this.testSQL(this.code);}">测试</el-button>
                </template>
                <codemirror v-model="code" :options="cmOption"
                            style="width: 100%; word-wrap: break-word; overflow: hidden"></codemirror>
              </el-form-item>
            </el-form>
          </div>
          <div v-show="editorTabActive==='headers'">
            <el-form label-width="100px">
              <el-form-item>
                <template slot="label">
                  <span>数据定义</span>
                  <el-button type="info" @click="headersExampleShow=true">样例</el-button>
                  <el-button type="warning" @click="openHeaderConf">编辑</el-button>
                  <el-button v-if="update" class="save-btn" type="primary" @click="save">保存</el-button>
                </template>
                <template>
                  <div>
<!--                    <div  class="jsoneditor" id="data_struct"></div>-->
                    <div class="box_parameter">
<!--                     <h3>数据定义</h3>-->
                        <el-form label-width="90px" status-icon >
                          <div v-for="(item, index) in header">
                            <el-row>
                              <el-col :span="6">
                                <el-form-item label="字段">
                                  <el-input v-model="item.key" autocomplete="on" clearable></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item label="字段名称">
                                  <el-input v-model="item.title" clearable autocomplete="on"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item label="类型">
                                  <el-input v-model="item.type" clearable autocomplete="on"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item label="字符长度">
                                  <el-input v-model="item.length" clearable autocomplete="on"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6" style="float: right;text-align: right">
                                <el-button v-if="index == (header.length - 1)"
                                           style="margin-left: 10px"
                                           type="primary"
                                           plain circle icon="el-icon-plus"
                                           @click="add_header(index)">
                                </el-button>
                                <el-button
                                  v-if="index == (header.length - 1) && header.length>1"
                                  style="margin-left: 10px"
                                  type="primary"
                                  plain circle icon="el-icon-minus"
                                  @click.prevent="del_header(index)">
                                </el-button>
                              </el-col>
                            </el-row>
                          </div>
                        </el-form>
                        <el-divider></el-divider>
                    </div>
                  </div>
                </template>
              </el-form-item>
            </el-form>
          </div>
          <div v-show="editorTabActive==='charts'">
            <el-form label-width="100px">
              <el-form-item label="图表定义">
                <template slot="label">
                  <span>图表定义</span>
                  <el-button type="success" @click="echartDialog = true">生成</el-button>
                  <el-button type="info" @click="chartsExampleShow = true">说明</el-button>
                  <el-button v-if="update" class="save-btn" type="primary" @click="save">保存</el-button>
                </template>
                <template>
                  <div class="jsoneditor" id="charts_struct"></div>
                </template>
              </el-form-item>
            </el-form>
          </div>
        </el-tabs>
        <el-form label-width="100px">
          <el-form-item>
            <el-button @click="$router.back()">返回</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
       <el-form inline>
        <el-form-item>
          <el-input v-model="title" style="width: 100%" placeholder="请输入表单名" clearable></el-input>
        </el-form-item>
         <el-form-item label="子系统">
           <el-select v-model="biz_id" @change="listTypeChange">
             <el-option
               v-for="item in biz_ids"
               :key="item.biz_id"
               :label="`${item.biz_id}: ${item.name}`"
               :value="item.biz_id">
             </el-option>
           </el-select>
         </el-form-item>
       </el-form>
        <el-tabs v-model="dataTabActive" tabPosition="left" @tab-click="handleDataTabClick">
          <el-tab-pane v-for="(view_obj, index) in templatess" :key="index" :label="view_obj.title" :name="view_obj.pk">
            <el-table
                :data="view_obj.field"
                border
                max-height="350"
                :cell-style="{ 'text-align': 'center' }"
                :header-cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column
                  label="字段名称"
                  prop="col_title"
              ></el-table-column>
              <el-table-column label="字段别名" prop="alias"></el-table-column>
              <el-table-column
                  label="数据库字段名"
                  prop="col_name"
              ></el-table-column>
<!--              <el-table-column label="是否是查询条件" prop="in_filter">-->
<!--                <template slot-scope="{ row }">-->
<!--                  <i v-if="row.in_filter" class="el-icon-success green"></i>-->
<!--                  <i v-else class="el-icon-error grey"></i>-->
<!--                </template>-->
<!--              </el-table-column>-->
            </el-table>
            <codemirror  class="codeinline" v-model="template_code" :options="cmOption"></codemirror>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog
      title="编辑表头定义"
      :visible.sync="headerConfVisable"
      width="50%">
      <div  class="jsoneditor" id="data_struct"></div>
      <div slot="footer">
        <el-button @click="cancelHeaderConf">取 消</el-button>
        <el-button type="primary" @click="changeHeaderConf">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="参数定义样例" :visible.sync="argumentsExampleShow">

      <div v-highlight class="example">
                <pre>
                   <code class="JSON" style="height: 488px;">{
  "sql_params": [
    {
      "field": "fd.field_01",
      "query_name": "shijuan_id",
      "label": "试卷ID",
      "default": "",
      "required": true
    }
  ],
  "limit_params": [
    {
      "field": "limit",
      "query_name": "pageSize",
      "label": "每页数量",
      "default": "10",
      "required": true
    },
    {
      "field": "offset",
      "query_name": "offset",
      "label": "页数",
      "default": "1",
      "required": true
    }
  ],
  "sql": "SELECT * FROM public.formtemplate_formdata as fd WHERE fd.sys_id=5 and fd.field_06 is not null {} ;"
}</code>
              </pre>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="argumentsExampleShow = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="图表定义样例" :visible.sync="chartsExampleShow" >
      <div v-highlight class="example">
              <pre>
                   <code class="JSON" style="height: 488px;">{
    "aggregate_name": "待审已审分布", // 聚合名称
    "chart_name": "待审已审分布", // 图表名称
    "more": true, // 用户能否切换图表类型
    "x": {
      "key": "type"
    },
    "y": [
      {
        "key": "num",
        "name": "数量",
        "type": "pie",
        "index": 0
      }
    ],
    "yAxis": [
      {
        "name": "数量",
        "axisLabel": {
          "formatter": "{value} 项"
        },
        "splitLine": {
          "show": false
        }
      }
    ]
}</code>
              </pre>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chartsExampleShow = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="数据定义样例" :visible.sync="headersExampleShow">
      <div v-highlight class="example">
                <pre>
                   <code class="JSON" style="height: 488px;">{
  "header": [
    {
      "key": "full_name",
      "title": "姓名",
      "type": "str",
      "length": 30
    },
    {
      "key": "duration",
      "title": "用时",
      "type": "int",
      "length": 15
    },
    {
      "key": "zongfen",
      "title": "总分",
      "type": "int",
      "length": 10
    }
  ]
}
                   </code>
              </pre>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="headersExampleShow = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="SQL返回结果"
        :visible.sync="testSqlShow"
        width="90%">
      <json-viewer
          v-if="!(testSqlData instanceof Array)"
          class="drawer-json-viewer"
          :value="testSqlData"
          :expand-depth="1"
          expanded
          boxed
      />
      <el-table v-else :data="testSqlData" :header-cell-style="{textAlign:'center'}" stripe border :cell-style="{textAlign:'center'}" :height="height">
        <el-table-column v-for="i in testSqlHeaders" :key="i" :label="i" :prop="i"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="testSqlShow = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="配置图表"
      v-if="echartDialog"
      :visible.sync="echartDialog"
      :close-on-click-modal="false"
      width="70%">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="聚合名称">
              <el-input v-model="echartform.aggregate_name" style="width: 100%" placeholder="请输入聚合名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="图表名称">
              <el-input v-model="echartform.chart_name" style="width: 100%" placeholder="请输入图表名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户能否切换图表类型">
              <el-radio-group v-model="echartform.more">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!--            选择x轴,去header读数据然后用select选择-->
            <el-form-item label="x轴">
              <el-select v-model="echartform.x.key" placeholder="请选择x轴" clearable>
                <el-option
                  v-for="(item, index) in header"
                  :key="index"
                  :label="item.title"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>

            <div v-for="(item,index) in echartform.y" :key="index">
              <el-col :span="5">
                <el-form-item :label="index == 0 ? '左侧Y轴名称' : '右侧Y轴名称'">
                  <el-select v-model="item.key" placeholder="请选择名称" clearable @change="updateY(item,index)">
                    <el-option
                      v-for="(item, index) in header"
                      :key="index"
                      :label="item.title"
                      :value="item.key">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="图表类型">
                  <el-select v-model="item.type" placeholder="请选择图表类型" clearable>
                    <el-option
                      v-for="item in ['line','bar','pie']"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="层级">
                  <el-input v-model="item.index" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="计量单位">
                  <el-input v-model="item.danwei" placeholder="计量单位" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="是否显示分割线">
                  <el-radio-group v-model="item.splitLine">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="float: right;text-align: right">
                <el-button v-if="echartform.y.length < 2"
                           style="margin-left: 10px"
                           type="primary"
                           plain circle icon="el-icon-plus"
                           @click="add_echart(index)">
                </el-button>
                <el-button
                  v-if="index == (echartform.y.length - 1) && echartform.y.length>1"
                  style="margin-left: 10px"
                  type="primary"
                  plain circle icon="el-icon-minus"
                  @click.prevent="del_echart(index)">
                </el-button>
              </el-col>
            </div>

        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createEchart">生 成</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
//json编辑器
import "jsoneditor/dist/jsoneditor.min.css";
import "jsoneditor/dist/jsoneditor.min";
import Vue from "vue";
import jsoneditor from "jsoneditor";
import JsonViewer from "vue-json-viewer";

Vue.prototype.$jsoneditor = jsoneditor;

//sql编辑器
import {codemirror} from "vue-codemirror";
import "codemirror/mode/sql/sql.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/solarized.css";

import {format as sqlFormatter} from "sql-formatter";
import {mapState} from "vuex";
import resource from "@/resource";
import Template from "@/Template/Template.vue";
import SelectPerm from "@/components/SelectPerm.vue";

export default {
  name: "ReportEditor",
  props: ['sysid', 'pk'],
  components: {
    Template,
    codemirror,
    SelectPerm,
    "json-viewer": JsonViewer,
  },
  computed: {
    ...mapState(["systemlist", "currentSystemId"]),
    height() {
      return window.innerHeight - 150
    },
    templatess(){
      if(this.title){
        return  this.templates.filter((item) => item.title.indexOf(this.title) > -1);
      }else{
        return  this.templates
      }
    },
  },
  data() {
    return {
      headerConfVisable: false,
      headerJson: "",
      argumentsExampleShow: false,
      chartsExampleShow: false,
      headersExampleShow: false,
      echartDialog: false, // 配置图表弹窗
      templates: [],
      biz_ids: [{name: '默认', biz_id: 1}],
      form: {
        sys_id: null,
        org_id: null,
        biz_id: null,
        report_id: null,
        permission: null,
        report_name: "",
        report_remark: "",
        arguments: "",
        data_struct: "",
        charts_struct: "",
      },
      sql_params: [
        {
          field: null,
          query_name: null,
          label: null,
          default: null,
          required: null,
          exp: "=",
        }
      ],
      limit_params: [
        {
          field: null,
          query_name: null,
          label: null,
          default: null,
          required: null,
        }
      ],
      sql: null,
      header: [
        {
          key: null,
          title: null,
          type: null,
          length: null,
        }
      ],
      // 条件
      exp:[
        {id:1,value:'<='},
        {id:2,value:'>='},
        {id:3,value:'='},
        {id:4,value:'>'},
        {id:5,value:'<'},
        {id:6,value:'!='},
        {id:7,value:'LIKE'},
        {id:8,value:'in'},
        {id:9,value:'~'},
        // {id:10,value:'is null'},
        // {id:11,value:'is not null'},

      ],
      update: null,
      editorTabActive: 'info',
      dataTabActive: null,
      arguments_editor: null,
      data_struct_editor: null,
      charts_struct_editor: null,
      code: "",
      template_code: "",
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: "text/x-mysql",
        theme: "solarized light",
      },
      apiname_map: {
        formdata: "formtemplate_formdata",
        customer: "customer_customer",
        services: "service_services",
        goods: "goods_goods",
        org: "org_org",
      },
      testSqlShow: false,
      testSqlData: "",
      testSqlHeaders: [],
      chartHeaders: [],
      title: null, // 表单标题
      biz_id: 1,
      biz_ids: [{name: '默认', biz_id: 1}],
      echartform:{
        aggregate_name: "",
        chart_name: "",
        more: true,
        x:{
          key: "",
        },
        y:[
          {
            key: "",
            name: "",
            type: "",
            index: 0,
            splitLine: false,
          }
        ],
        yAxis:[
          {
            name: "",
            axisLabel: {
              formatter: "{value}",
            },
            splitLine:{
              show: false,
            }
          }
        ]
      }
    }
  },
  watch:{
    // 监听echartDialog,如果为false,则清空!
    echartDialog(val){
      if(!val){
        this.echartform = {
          aggregate_name: "",
          chart_name: "",
          more: true,
          x:{
            key: "",
          },
          y:[
            {
              key: "",
              name: "",
              type: "",
              index: 0,
              splitLine: false,
            }
          ],
          yAxis:[
            {
              name: "",
              axisLabel: {
                formatter: "{value}",
              },
              splitLine:{
                show: false,
              }
            }
          ]
        }
      }
    }
  },
  methods: {
    openHeaderConf(){
      this.headerJson = JSON.stringify(this.header);
      this.headerConfVisable = true;
      this.$nextTick(() => {
        this.initDataStructJson(this.headerJson);
      });
    },
    cancelHeaderConf(){
      this.headerJson = JSON.parse(this.header);
      this.headerConfVisable = false;
    },
    changeHeaderConf(){
      let headerJson = this.data_struct_editor.getText();
      console.log(headerJson);
      let header = JSON.parse(headerJson);
      this.header = header;
      this.headerConfVisable = false;
    },
    updateY(item,index){
      // 根据选中的 key 找到对应的 header 对象
      const selectedHeader = this.header.find(headerItem => headerItem.key === item.key);
      this.echartform.y[index].name = selectedHeader.title;
    },
    createEchart(){
      // 如果是空对象,则不执行下面
      if(JSON.stringify(this.charts_struct_editor.get()) == "{}"){
        this.create_echart();
      }else{
        this.$confirm('此操作将覆盖掉已有的图表定义, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.create_echart();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    // 生成图表数据
    create_echart(){
      this.echartDialog = false;
      //先把yAxis数组的长度和y数组的长度一样,然后再把yAxis数组的对象在追加到yAxis数组中
      this.echartform.yAxis.length = this.echartform.y.length;
      for(let i=0;i<this.echartform.yAxis.length;i++){
        this.echartform.yAxis[i] = {
          name: "",
          axisLabel: {
            formatter: "{value}",
          },
          splitLine:{
            show: false,
          }
        }
      }
      for(let i=0;i<this.echartform.y.length;i++){
        this.echartform.yAxis[i].name = this.echartform.y[i].name;
        this.echartform.yAxis[i].axisLabel.formatter = "{value} " + this.echartform.y[i].danwei;
        this.echartform.yAxis[i].splitLine.show = this.echartform.y[i].splitLine;
        delete this.echartform.y[i].danwei;
        delete this.echartform.y[i].splitLine;
      }
      this.charts_struct_editor.set(this.echartform);
    },

    // 添加图表数据
    add_echart(){
      this.echartform.y.push({
        key: "",
        name: "",
        type: "",
        index: 1,
        splitLine: false
      })
    },
    del_echart(index){
      this.echartform.y.splice(index, 1);
    },
    add_sql_params() {
      this.sql_params.push({
        field: null,
        query_name: null,
        label: null,
        default: null,
        required: null,
        exp: "="
      });
    },
    del_sql_params(index) {
      this.sql_params.splice(index, 1);
    },
    add_limit_params() {
      this.limit_params.push({
        field: null,
        query_name: null,
        label: null,
        default: null,
        required: null,
      });
      this.$forceUpdate();
    },
    del_limit_params(index) {
      this.limit_params.splice(index, 1);
      this.$forceUpdate();
    },
    add_header(){
      this.header.push({
        key: null,
        title: null,
        type: null,
        length: null,
      });
    },
    del_header(index){
      this.header.splice(index, 1);
    },
    // 获取biz_id
    async loadBiz() {
      let params = {
        sys_id: this.sysid,
      };
      let res = await this.$http.get("/systembiz/", {params: params});
      this.biz_ids = res.data;
      if (this.biz_ids.length === 0) {
        this.biz_ids = [{name: '默认', biz_id: 1}];
      }
      this.form.biz_id = this.biz_ids[0].biz_id;
    },
    listTypeChange(val) {
      this.biz_id = val;
      this.load_sys_tables();
    },
    // 加载系统模版定义
    async load_sys_tables() {
      const params = {
        sys_id: this.sysid,
        biz_id: this.biz_id,
      }

      let res = await this.$http.get("/formtemplate/", {params});
      this.templates = res.data;
      if(this.templates.length > 0){
        this.dataTabActive = this.templates[0].pk;
        this.handleDataTabClick({index: 0});
      }
    },
    // 加载报表
    async load_report() {
      if (this.pk) {
        const params = {
          sys_id: this.sysid,
        }
        let res = await this.$http.get(`/reportconf/${this.pk}/`, {params});
        this.update = res.data;
        this.form = res.data;

        if (!JSON.parse(this.form.arguments).hasOwnProperty("sql_params")) {
          this.sql_params = [{field: null, query_name: null, label: null, default: null, required: null, exp: null}];
        } else {
          this.sql_params = JSON.parse(this.form.arguments).sql_params;
        }

        if (!JSON.parse(this.form.arguments).hasOwnProperty("limit_params")) {
          this.limit_params = [{field: null, query_name: null, label: null, default: null, required: null}];
        } else {
          this.limit_params = JSON.parse(this.form.arguments).limit_params;
        }

        if (Object.keys(JSON.parse(this.form.data_struct)).length > 0) {
          this.header = JSON.parse(this.form.data_struct).header;
        } else {
          this.header = [
            {key: null, title: null, type: null, length: null}
          ];
        }
        this.sql = JSON.parse(this.form.arguments).sql;


        setTimeout(() => {
          this.initJsonEditor(this.form);
        }, 500);
      } else {
        setTimeout(() => {
          this.initJsonEditor(this.form);
        }, 500);
      }
    },
    async save() {
      // this.form.arguments = this.arguments_editor.getText();
      // this.form.data_struct = this.data_struct_editor.getText();
      this.form.arguments = JSON.stringify( {
        sql_params:this.sql_params,
        limit_params:this.limit_params,
        sql:this.sql} )

      if (this.header.some(obj => Object.values(obj).some(value => value !== null && value !== ""))) {
        this.form.data_struct = JSON.stringify({ header: this.header });
      } else {
        this.form.data_struct = JSON.stringify({});
      }
      this.form.charts_struct = this.charts_struct_editor.getText();
      await this.$http.put(`/reportconf/${this.update.pk}/`, this.form);
      this.$message.success("修改成功!");
    },
    async submit() {
      let valid = await this.$refs.ReportForm.validate();
      if (!valid) {
        this.$message.error("请检查表单!");
        return;
      }
      this.form.arguments = JSON.stringify( {
        sql_params:this.sql_params,
        limit_params:this.limit_params,
        sql:this.sql} )
      if (this.header.some(obj => Object.values(obj).some(value => value !== null && value !== ""))) {
        this.form.data_struct = JSON.stringify({ header: this.header });
      } else {
        this.form.data_struct = JSON.stringify({});
      }
      this.form.charts_struct = this.charts_struct_editor.getText();
      if (this.update) {
        const resp = await this.$http.put(`/reportconf/${this.update.pk}/`, this.form);
        this.$message.success("修改成功!");
        this.update = {...resp.data};
        this.form = {...resp.data};
      } else {
        const resp = await this.$http.post("/reportconf/", this.form);
        this.$message.success("新建成功!");
        this.update = {...resp.data};
        this.form = {...resp.data};
      }
      // this.clear();
    },
    clear() {
      this.form = {
        sys_id: this.sysid,
        org_id: null,
        biz_id: null,
        report_id: null,
        permission: null,
        report_name: "",
        report_remark: "",
        arguments: "",
        data_struct: "",
        charts_struct: "",
      };
      this.update = null;
    },
    runReport() {
      const routerUrl = this.$router.resolve({
        path: `/runreport/${this.form.pk}`
      })
      window.open(routerUrl.href, '_blank')
    },
    async testSQL(sql) {
      const resp = await this.$http.post(`/testreport/`, {sql});
      if(resp.data instanceof Array && resp.data.length > 0){
        const dd = resp.data[0];
        this.testSqlHeaders = Object.keys(dd);
      } else {
        this.testSqlHeaders = [];
      }
      this.testSqlData = resp.data;
      this.testSqlShow = true;
    },
    initArgumentsJson(json = null) {
      if (!this.arguments_editor) {
        const container = document.getElementById("arguments");
        const options = {
          modes: ["code", "tree", "form", "text", "view", "preview"],
          search: true,
        };
        this.arguments_editor = new this.$jsoneditor(container, options);
      }
      // set json
      this.arguments_editor.set(json ? JSON.parse(json) : {});
    },
    initDataStructJson(json = null) {
      if (!this.data_struct_editor) {
        const container = document.getElementById("data_struct");
        const options = {
          modes: ["code", "tree", "form", "text", "view", "preview"],
          search: true,
        };
        this.data_struct_editor = new this.$jsoneditor(container, options);
      }
      // set json
      this.data_struct_editor.set(json ? JSON.parse(json) : {});
    },
    initChartsStructJson(json = null) {
      if (!this.charts_struct_editor) {
        const container = document.getElementById("charts_struct");
        const options = {
          modes: ["code", "tree", "form", "text", "view", "preview"],
          search: true,
        };
        this.charts_struct_editor = new this.$jsoneditor(container, options);
      }
      // set json
      this.charts_struct_editor.set(json ? JSON.parse(json) : {});
    },
    initJsonEditor(obj = {}) {
      this.initChartsStructJson(obj.charts_struct);
      // this.initArgumentsJson(obj.arguments);
      // this.initDataStructJson(obj.data_struct);
    },
    formatSql() {
      this.code = sqlFormatter(this.code, {language: "postgresql"});
    },
    mini() {
      this.code = this.code.replace(/\s*\n\s*/g, " ");
    },
    handleDataTabClick(data){
      let {index, name} = data;
      let view_obj = this.templates.filter(item => item.pk == name)[0];
      let select_line = [];
      if(view_obj){
        view_obj.field.forEach((val) => {
          let alias = val.alias || val.col_title;
          if(val.col_name == 'user' || val.col_name == 'department'){
            val.col_name = val.col_name + '_id'
          }
          select_line.push(`A.${val.col_name} as ${alias}`);
        });
        let table_name = this.apiname_map[view_obj.api_name];
        this.template_code = sqlFormatter(`select ${select_line.join(', \n')}\nfrom ${table_name} A\nwhere A.template_id='${view_obj.pk}'`, { language: "postgresql" });
      }
    }
  },
  mounted() {
    this.form.sys_id = this.sysid;
    this.load_report();
    this.load_sys_tables();
    this.loadBiz();
  }
}
</script>

<style>
.box_parameter{
  max-height: 600px;
  overflow: auto
}
.jsoneditor {
  height: 400px;
}

.example pre {
  height: 500px;
}
.drawer-json-viewer {
  max-height: 450px;
  /*overflow-y: scroll;*/
}

.drawer-json-viewer .jv-node {
  max-height: 380px;
  overflow-y: scroll !important;
}
/* 把滚动条变成圆角 */
::-webkit-scrollbar {
  width: 8px;  /* 设置滚动条宽度 */
  height: 8px;
  background-color: #f5f5f5; /* 设置背景颜色 */
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: #ccc; /* 设置滑块颜色（灰色） */
}

/* 鼠标悬停在滑块上的效果 */
::-webkit-scrollbar-thumb:hover {
  background-color: #aaa; /* 深灰色 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: #f5f5f5; /* 设置背景颜色 */
}

/* 鼠标悬停在轨道上的效果 */
::-webkit-scrollbar-track:hover {
  background-color: #e5e5e5; /* 深一点的灰色 */
}
</style>

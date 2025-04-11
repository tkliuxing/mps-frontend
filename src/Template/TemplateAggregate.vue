<template>
  <div>
    <h1>{{ template.title }}统计字段</h1>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card>
            <template #header>
              {{ form.pk ? '编辑': '添加' }}统计字段
            </template>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="统计字段" prop="field">
                <el-select v-model="form.field" placeholder="统计字段" clearable>
                  <el-option
                    v-for="item in fields"
                    :key="item.pk"
                    :label="item.col_title"
                    :value="item.pk"
                  ></el-option>
                </el-select>
                <span class="info">选择需要统计的字段</span>
              </el-form-item>
              <el-form-item label="统计类型" prop="aggr_type">
                <el-select v-model="form.aggr_type" placeholder="统计类型" clearable>
                  <el-option
                    v-for="item in aggr_types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span class="info">选择统计的方式，非数值字段只能使用去重计数（种类数量）</span>
              </el-form-item>
              <el-form-item label="数据别名" prop="aggr_name">
                <el-input v-model="form.aggr_name" style="width:182px;"></el-input>
                <span class="info">返回对象中的key名称，可使用中文，不能有空格等特殊字符</span>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="info" @click="cancel">取消</el-button>
                <el-button :type="form.pk ? 'primary': 'success'" @click="submit">{{ form.pk ? '提交': '添加' }}</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <p style="margin: 5px 0;">
            <span class="info">统计字段用于查询该表的统计信息，可加过滤条件（同表查询），不分页。</span>
          </p>
          <el-table :data="aggregate_field" border :height="300" size="mini">
            <el-table-column label="数据别名" prop="aggr_name"></el-table-column>
            <el-table-column label="统计字段" prop="field">
              <template v-slot="scope">
                {{ field_display(scope.row.field) }}
              </template>
            </el-table-column>
            <el-table-column label="统计类型" prop="aggr_type">
              <template v-slot="scope">
                {{ aggr_type_display(scope.row.aggr_type) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template v-slot="scope">
                <el-button type="primary" style="margin-right:5px;" size="mini" round @click="edit(scope.row)">编辑</el-button>
                <el-popconfirm
                  title="确认删除吗？"
                  icon-color="red"
                  @confirm="del(scope.row)"
                >
                  <el-button slot="reference" type="danger" size="mini" round>删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <div class="center">
            <el-button type="warning" @click="test">测试</el-button>
            <el-button type="primary" @click="back">返回</el-button>
          </div>
          <p v-if="test_result">
            <span style="margin-top: 10px;" class="info">URL: {{ '/api/v1/data-aggregate/?template_id=' + template.pk + '&sys_id=' + template.sys_id }}</span>
          </p>
          <el-input readonly v-if="test_result" type="textarea" :rows="10" :value="test_result"></el-input>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>

const AGGR_TYPES = [
  {value: 'count', label: '去重计数'},
  {value: 'sum', label: '求和'},
  {value: 'avg', label: '平均值'},
  {value: 'max', label: '最大值'},
  {value: 'min', label: '最小值'},
];
const FORM = {
  pk: null,
  sys_id: null,
  org_id: null,
  src_id: null,
  biz_id: null,
  template: null,
  field: null,
  aggr_type: null,
  aggr_name: '',
  description: '',
};
export default {
  name: 'TemplateAggregate',
  props: {
    template_id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      template: {
        pk: null,
        title: '',
      },
      aggregate_field: [],
      fields: [],
      form: JSON.parse(JSON.stringify(FORM)),
      rules: {
        field: [
          { required: true, message: '请选择统计字段', trigger: 'change' }
        ],
        aggr_type: [
          { required: true, message: '请选择统计类型', trigger: 'change' }
        ],
        aggr_name: [
          { required: true, message: '请输入数据别名', trigger: 'blur' }
        ],
      },
      aggr_types: AGGR_TYPES,
      test_result: '',
    }
  },
  methods: {
    async init(){
      const url = '/formtemplate/';
      const response = await this.$http.get(url + this.template_id + '/');
      this.template = response.data;
      this.aggregate_field = this.template.aggregate_field;
      this.fields = this.template.field;
      this.reset();
    },
    reset(){
      this.$refs.form.resetFields();
      let form = JSON.parse(JSON.stringify(FORM));
      form.sys_id = this.template.sys_id;
      form.org_id = this.template.org_id;
      form.src_id = this.template.src_id;
      form.biz_id = this.template.biz_id;
      form.template = this.template.pk;
      this.form = form;
      this.test_result = '';
    },
    field_display(pk){
      const field = this.fields.find(item => item.pk === pk);
      return field ? field.col_title : '';
    },
    aggr_type_display(value){
      const aggr_type = this.aggr_types.find(item => item.value === value);
      return aggr_type ? aggr_type.label : '';
    },
    cancel(){
      this.reset();
    },
    async submit(){
      let valid = await new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          resolve(valid);
        });
      });
      if (!valid) {
        return;
      }
      try{
        if(this.form.pk){
          await this.$http.put('/formaggrgatefields/' + this.form.pk + '/', this.form);
          this.$message.success('编辑成功');
          this.reset();
        }else{
          await this.$http.post('/formaggrgatefields/', this.form);
          this.$message.success('添加成功');
          this.reset();
        }
        this.$refs.form.resetFields();
        this.init();
      }catch(e){
        this.$message.error(e);
      }
    },
    edit(obj){
      this.form = {...obj};
    },
    async del(obj){
      try{
        await this.$http.delete('/formaggrgatefields/' + obj.pk + '/');
        this.$message.success('删除成功');
        this.init();
      }catch(e){
        this.$message.error(e);
      }
    },
    async test(){
      try{
        let resp = await this.$http.post('/data-aggregate/', {
          template_id: this.template.pk,
          sys_id: this.template.sys_id,
        });
        this.test_result = JSON.stringify(resp.data, null, 2);
      } catch(e){
        this.test_result = JSON.stringify(e, null, 2);
      }
    },
    back(){
      this.reset();
      this.$emit('close');
    },
  },
  mounted() {
    this.init();
  },
  watch:{
    template_id: {
      handler: function (val, oldVal) {
        this.init();
      },
      immediate: true
    },
  },
}
</script>

<style>
.center{
  margin: 0 auto;
  text-align: center;
  margin-top: 10px;
}
span.info{
  color: #909399;
  font-size: 12px;
  margin-left: 10px;
}
</style>

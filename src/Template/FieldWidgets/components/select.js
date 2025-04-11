const select = [
  {
    name: 'select',
    title: '下拉单选',
    desc: '单选，需要指定数据源',
    template: '<el-select :allow-create="false" filterable style="width: 100%;" :disabled="readonly" clearable v-model="$${model}">' +
      '<el-option  v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${name_field}" :value="item.$${value_field}"></el-option>' +
      '</el-select>',
    needDataSource: true,
  },
  {
    name: 'bumen_pk',
    title: '部门下拉单选',
    desc: '单选，部门下拉单选，值为部门的pk',
    template: '<el-select :allow-create="false" filterable style="width: 100%;" :disabled="readonly" clearable v-model="$${model}">' +
      '<el-option v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${name_field}" :value="item.$${value_field}"></el-option>' +
      '</el-select>',
    data_source: '{"url":"flatdepartment","params":{},"name_field":"name","value_field":"pk"}',
  },
  {
    name: 'user_pk',
    title: '用户下拉单选',
    desc: '单选，用户下拉单选，值为用户的pk',
    template: '<el-select :allow-create="false" filterable style="width: 100%;" :disabled="readonly" clearable v-model="$${model}">' +
      '<el-option v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${name_field}" :value="item.$${value_field}"></el-option>' +
      '</el-select>',
    data_source: '{"url":"usermin","params":{},"name_field":"full_name","value_field":"pk"}',
  },
  {
    name: 'search_select',
    title: '下拉单选',
    desc: '单选，需要指定数据源',
    template: '<mps-select  style="width: 100%;" :options="$${alias}_option_data"' +
      '     :disabled="readonly"  v-model="$${model}" label-field="$${name_field}" value-field="$${value_field}"></mps-select>',
    needDataSource: true,
  },
]

export default JSON.parse(JSON.stringify(select));

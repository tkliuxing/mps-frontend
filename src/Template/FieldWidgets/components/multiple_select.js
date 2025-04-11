const multipleSelect = [
  {
    name: 'multipleSelect',
    title: '单选按钮',
    desc: '单选，需要指定数据源',
    template: '<el-select filterable style="width: 100%;" :disabled="readonly" clearable v-model="$${model}" multiple>' +
      '<el-option v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${name_field}" :value="item.$${value_field}"></el-option>' +
      '</el-select>',
    needDataSource: true,
  },
]

export default JSON.parse(JSON.stringify(multipleSelect));

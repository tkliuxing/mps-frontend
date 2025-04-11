const checkbox = [
  {
    name: 'checkbox',
    title: '多选按钮',
    desc: '多选，需要指定数据源',
    template: '<el-checkbox-group style="width: 100%" :disabled="readonly" v-model="$${model}">' +
      '<el-checkbox v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${value_field}">{{ item.$${name_field} }}</el-checkbox>' +
      '</el-checkbox-group>',
    needDataSource: true,
  }
];

export default checkbox;

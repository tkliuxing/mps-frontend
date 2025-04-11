const cascader = [
  {
    name: 'cascader',
    title: '级联单选',
    desc: '单选，需要指定数据源',
    template: '<mps-cascader style="width: 100%" v-model="$${model}"  :show-all-levels="false" label="$${name_field}" value="$${value_field}" :treeData="$${alias}_option_data"  @change="$${alias}_change"/>',
    method_js:'$${alias}_change(val){this.form.$${alias} = val;}',
    search_method_js:'$${alias}_change(val){this.searchForm.$${alias} = val;}',
    needDataSource: true,
    data_source: '{"url":"flatdepartment","params":{},"name_field":"name","value_field":"pk"}',
  },
  {
    name: 'multiplecascader',
    title: '级联多选',
    desc: '多选，需要指定数据源',
    template: '<mps-multiple-cascader style="width: 100%" v-model="$${model}" :show-all-levels="false" label="$${name_field}" value="$${value_field}" :treeData="$${alias}_option_data"  @change="$${alias}_change"/>',
    method_js:'$${alias}_change(val){this.form.$${alias} = val;}',
    search_method_js:'$${alias}_change(val){this.searchForm.$${alias} = val;}',
    needDataSource: true,
    data_source: '{"url":"flatdepartment","params":{},"name_field":"name","value_field":"pk"}',
  }
];

export default JSON.parse(JSON.stringify(cascader));

const colorPicker = [
  {
    name: 'colorPicker',
    title: '颜色选择器',
    desc: '颜色选择器',
    template: '<el-color-picker :disabled="readonly" v-model="form.$${alias}" />  '
  }
]

export default JSON.parse(JSON.stringify(colorPicker));

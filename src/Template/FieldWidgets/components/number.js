const number = [
  {
    name: 'rate',
    title: '评分',
    desc: '星级评分',
    template: '<el-rate :disabled="readonly" v-model="form.$${alias}" show-text allow-half />'
  }
]

export default JSON.parse(JSON.stringify(number));

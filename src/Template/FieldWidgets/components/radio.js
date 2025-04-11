const radios = [
  {
    name: 'radio',
    title: '单选按钮',
    desc: '单选，需要指定数据源',
    template: '<el-radio-group :disabled="readonly" v-model="$${model}">' +
              '<el-radio-button v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${value_field}">{{ item.$${name_field} }}</el-radio-button>' +
              '</el-radio-group>',
    needDataSource: true,
  },
  {
    name: 'shifou',
    title: '是否',
    desc: '单选，“是否”选项',
    template: '<el-radio-group :disabled="readonly" v-model="$${model}"><el-radio-button label="是">是</el-radio-button><el-radio-button label="否">否</el-radio-button></el-radio-group>',
  },
  {
    name: 'xingbie',
    title: '性别',
    desc: '单选，“男女”选项',
    template: '<el-radio-group :disabled="readonly" v-model="$${model}"><el-radio-button label="男">男</el-radio-button><el-radio-button label="女">女</el-radio-button></el-radio-group>',
  },
  {
    name: 'youweu',
    title: '有无',
    desc: '单选，“有无”选项',
    template: '<el-radio-group :disabled="readonly" v-model="$${model}"><el-radio-button label="有">有</el-radio-button><el-radio-button label="无">无</el-radio-button></el-radio-group>',
  },
  {
    name: 'kaiguan',
    title: '开关',
    desc: '单选，“开关”选项',
    template: '<el-radio-group :disabled="readonly" v-model="$${model}"><el-radio-button label="开">开</el-radio-button><el-radio-button label="关">关</el-radio-button></el-radio-group>',
  },
  {
    name: 'hunyin',
    title: '婚姻状况',
    desc: '单选，“未婚、已婚、离婚、丧偶”',
    template: '<el-radio-group :disabled="readonly" v-model="$${model}">' +
              '<el-radio-button label="未婚">未婚</el-radio-button>' +
              '<el-radio-button label="已婚">已婚</el-radio-button>' +
              '<el-radio-button label="离婚">离婚</el-radio-button>' +
              '<el-radio-button label="丧偶">丧偶</el-radio-button>' +
              '</el-radio-group>'
  },
]

export default JSON.parse(JSON.stringify(radios));

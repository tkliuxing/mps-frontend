import {verifyMobile} from '@/utils/verify'
const inputs = [
  {
    name: 'input',
    title: '输入框',
    desc: '输入框,无校验',
    template: '<el-input :disabled="readonly" maxlength="200" v-model="$${model}" clearable name="$${model}" autocomplete="on"></el-input>',
  },
  {
    name: 'textarea',
    title: '多行输入框',
    desc: '多行输入框,无校验',
    template: '<el-input type="textarea" :autosize="{ minRows: 5,maxRows:20 }" show-word-limit  :maxlength="500"  :disabled="readonly" v-model="$${model}" clearable name="$${model}"></el-input>',
  },
  {
    name: 'phone',
    title: '电话',
    desc: '输入框,校验电话号码和手机号',
    template: '<el-input :disabled="readonly" clearable v-model="$${model}" name="$${model}" autocomplete="on"></el-input>',
    rules: [{pattern: "^((0\\d{2,3}-\\d{7,8})|(1[3456789]\\d{9}))$",message: '请输入正确的手机号码或固定电话', trigger: 'blur'}]
  },
  {
    name: 'mobile',
    title: '手机',
    desc: '输入框,校验手机号',
    template: '<el-input :disabled="readonly" clearable v-model="$${model}" name="$${model}" autocomplete="on"></el-input>',
    rules: [{pattern: '^1[3|5|7|8]\\d{9}$',message: '请输入正确的手机号码', trigger: 'blur'}]
  },
  {
    name: 'email',
    title: '邮箱',
    desc: '输入框,校验电子邮箱',
    template: '<el-input :disabled="readonly" clearable v-model="$${model}" name="$${model}" autocomplete="on"></el-input>',
    rules: [ {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'},]
  },
  {
    name: 'idcard',
    title: '身份证',
    desc: '输入框,校验身份证号',
    template: '<el-input :disabled="readonly" clearable v-model="$${model}" name="$${model}" autocomplete="on"></el-input>',
    rules:[
      {pattern: "^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[\\dXx]$", message: "请输入正确的身份证号码", trigger: "blur"}
    ]
  },
  {
    name: 'ipaddress',
    title: 'IP地址',
    desc: 'IP地址输入框',
    template: '<mps-ip-input v-model="$${model}" />'
  },
]

export default JSON.parse(JSON.stringify(inputs));

const date = [
  {
    name: 'date',
    title: '日期',
    desc: '日期',
    template: '<el-date-picker style="width: 100%"  v-model="form.$${alias}" clearable value-format="yyyy-MM-dd" />',
    search_template: '<el-date-picker style="width: 47%"  v-model="searchForm.$${alias}.after" placeholder="开始日期" clearable value-format="yyyy-MM-dd{@if is_datetime === true} 00:00:00{@/if}" /> - ' +
      '<el-date-picker style="width: 47%"  v-model="searchForm.$${alias}.before" placeholder="结束日期" clearable value-format="yyyy-MM-dd{@if is_datetime === true} 23:59:59{@/if}" />'
  },
  {
    name: 'year',
    title: '年份',
    desc: '年份选择',
    template: '<el-date-picker style="width: 100%" type="year"  v-model="form.$${alias}" clearable value-format="yyyy" />'
  },
  {
    name: 'yearmonth',
    title: '年份月份',
    desc: '年份月份选择',
    template: '<el-date-picker style="width: 100%" type="month"  v-model="form.$${alias}" clearable value-format="yyyy-MM" />'
  },
  {
    name: 'time',
    title: '时分秒',
    desc: '时间选择(时分秒)',
    template: '<el-time-picker style="width: 100%" v-model="form.$${alias}" clearable value-format="HH:mm:ss" />'
  },
  {
    name: 'minute',
    title: '时分',
    desc: '时间选择(时分)',
    template: '<el-time-picker style="width: 100%" v-model="form.$${alias}" clearable value-format="HH:mm" />'
  },
  {
    name: 'datetime',
    title: '年月日时分秒',
    desc: '日期时间选择',
    template: '<el-date-picker style="width: 100%" type="datetime" v-model="form.$${alias}" clearable   value-format="yyyy-MM-dd HH:mm:ss"/>'
  },
  {
    name: 'daterange',
    title: '日期范围',
    desc: '日期范围联动选择控件',
    template: '<el-date-picker style="width: 100%" type="daterange" unlink-panels v-model="$${alias}_to_$${related_alias}" @change="$${alias}_change" clearable value-format="yyyy-MM-dd" />',
    // 用来响应日期范围控件的change事件，将值赋值给对应的form字段
    method_js: '$${alias}_change(val){if(val){this.form.$${alias} = val[0];this.form.$${related_alias} = val[1];}else{this.form.$${alias} = "";this.form.$${related_alias} = "";}}',
    // 用来进行附加字段的初始化
    mounted_js: 'this.$${alias}_to_$${related_alias} =this.form.$${alias} && this.form.$${related_alias} ? [this.form.$${alias}, this.form.$${related_alias}] : [];',
    // 向 data 中 form 添加的附加字段
    additional_field: '$${alias}_to_$${related_alias}: [],',
    needRelated: true,
  },
];

export default JSON.parse(JSON.stringify(date));

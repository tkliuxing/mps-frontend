
function TemplateInit(){
  let TemInit = [
    {
      "alias": 'create_time',
      "col_name": 'create_time',
      'col_title': "创建时间",
      "local_data_source": null,
      "data": null,
      'in_filter': true,
      'is_related': false,
      'is_required': false,
      'is_vant_show': false,
      'unique': false,
      'verify_exp': "[]",
      'widget': 'date',
      'widget_attr': '[]'
    },
    {
      "alias": 'dep_id',
      "col_name": 'department',
      'col_title': "创建部门",
      "local_data_source": null,
      "data": null,
      'in_filter': true,
      'is_related': false,
      'is_required': false,
      'is_vant_show': false,
      'unique': false,
      'verify_exp': "[]",
      'widget': 'date',
      'widget_attr': '[]'
    },
    {
      "alias": 'user_id',
      "col_name": 'user',
      'col_title': "创建人",
      "local_data_source": null,
      "data": null,
      'in_filter': true,
      'is_related': false,
      'is_required': false,
      'is_vant_show': false,
      'unique': false,
      'verify_exp': "[]",
      'widget': 'input',
      'widget_attr': '[]'
    },
    {
      "alias": 'type',
      "col_name": 'field_01',
      'col_title': "类型",
      "local_data_source": null,
      "data": null,
      'in_filter': true,
      'is_related': false,
      'is_required': true,
      'is_vant_show': false,
      'unique': false,
      'verify_exp': "[]",
      'widget': 'input',
      'widget_attr': "[]"
    },
    {
      "alias": 'content',
      "col_name": 'text_01',
      'col_title': "内容",
      "local_data_source": null,
      "data": "{\"name\":\"ueditor\",\"title\":\"UEditor\",\"desc\":\"富文本(UEditor)\",\"template\":\"<vue-ueditor-wrap :disabled=\\\"readonly\\\" v-model=\\\"$${model}\\\" :config=\\\"editorConfig\\\" @ready=\\\"on_$${alias}_ready\\\" height=\\\"400\\\" editor-id=\\\"ueditor-$${alias}\\\"/>\",\"method_js\":\"on_$${alias}_ready(ue){ue.execCommand(\\\"serverparam\\\", {\\\"sys_id\\\": this.userinfo.sys_id, \\\"org_id\\\": this.userinfo.org_id})}\"}",
      'in_filter': false,
      'is_related': false,
      'is_required': true,
      'is_vant_show': false,
      'unique': false,
      'verify_exp': "[]",
      'widget': 'ueditor',
      'widget_attr': "[]"
    }
  ]
  return TemInit
}
export default TemplateInit;

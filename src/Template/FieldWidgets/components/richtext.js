const richtext = [
  // {
  //   name: 'richtext',
  //   title: '富文本',
  //   desc: '富文本',
  //   template: '<mps-richtext :disabled="readonly" v-model="$${model}" />'
  // },
  {
    name: 'ueditor',
    title: 'UEditor',
    desc: '富文本(UEditor)',
    template: '<vue-ueditor-wrap :disabled="readonly" v-model="$${model}" :config="editorConfig" @ready="on_$${alias}_ready" height="400" editor-id="ueditor-$${alias}"/>',
    method_js:'on_$${alias}_ready(ue){ue.execCommand("serverparam", {"sys_id": this.userinfo.sys_id, "org_id": this.userinfo.org_id})}',
  },
]

export default JSON.parse(JSON.stringify(richtext));

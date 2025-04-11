const upload = [
  {
    name: 'file',
    title: '文件上传',
    desc: '文件上传',
    template:
      '<mps-upload-file ' +
      'v-model="$${model}" ' +
      'categoryName="$${title}" ' +
      'ref="child$${alias}"'+
      '></mps-upload-file>'
  },
  {
    name: 'image',
    title: '图片上传',
    desc: '图片上传',
    template:
      '<mps-upload-img ' +
      'v-model="$${model}" ' +
      'categoryName="$${title}" ' +
      'ref="child$${alias}"'+
      '></mps-upload-img>',

  },
]

export default JSON.parse(JSON.stringify(upload));

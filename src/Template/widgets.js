export const WIDGETS = {
  "输入框": { id: 1, value: "input" },
  "多行输入框": { id: 0, value: "textarea" },
  "选项框(单选)": { id: 2, value: "select" },
  "选项框(多选)": { id: 3, value: "multipleSelect" },
  "单选按钮": { id: 4, value: "radio" },
  "复选框": { id: 5, value: "checkbox" },
  "日期控件": { id: 6, value: "date" },
  "附件": { id: 7, value: "file" },
}

export const CONTROLS = Object.keys(WIDGETS).map((key)=>{
  return {label: key, ...WIDGETS[key]}
})

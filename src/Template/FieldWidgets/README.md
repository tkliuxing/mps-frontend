# 控件配置说明

------

## 自定义控件说明

所有的自定义控件必须添加到 `mps-pc-components` 仓库中，并提交到npm中！

### 自定义控件配置文件

配置文件位于 `./components/` 目录下，导出文件的文件名为 `index.js` ，各个类别的组件分开定义。

组件由如下属性组成：

| 字段名称             | 含义         | 是否必填 | 说明                                                                                 |
|------------------|------------|------|------------------------------------------------------------------------------------|
| name             | 控件名称       | 是    | 一般为英文，下划线分割单词                                                                      |
| desc             | 控件描述       | 是    | 一般为中文，用于显示详细说明                                                                     |
| template         | 控件模板       | 是    | 使用 juicer 模板语法，具体参考 juicer 文档                                                      |
| needDataSource   | 是否需要配置数据源  | 否    | 如果需要数据源，needDataSource 必须为 true                                                    |
| data_source      | 数据源配置      | 否    | JSON格式，具体参考下方数据源配置说明                                                               |
| method_js        | js 代码模板    | 否    | 插入到 `method` 中的js函数，使用 juicer 模板语法，可参考 `./components/date.js` 中的 `daterange` 控件    |
| mounted_js       | js 代码模板    | 否    | 插入到 `mounted` 中的js代码片段，使用 juicer 模板语法，可参考 `./components/date.js` 中的 `daterange` 控件 |
| needRelated      | 需要关联一个其他字段 | 否    | 为 true 时需要指定一个关联的表单字段                                                              |
| additional_field | 额外字段       | 否    | 在多字段关联控件中需要向表单中添加的额外字段                                                             |


例：

```javascript
const select = {
  name: 'bumen_pk',
  title: '部门下拉单选',
  desc: '单选，部门下拉单选，值为部门的pk',
  template: '<el-select :disabled="readonly" v-model="$${model}">' +
            '<el-option v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${name_field}" :value="item.$${value_field}"></el-option>' +
            '</el-select>',
  data_source: '{"url":"flatdepartment","params":{},"name_field":"name","value_field":"pk"}',
}
```

#### 数据源配置说明

数据源配置为一个 JSON 对象，包含如下属性：

* url: 数据源请求地址，必填
* params: 数据源请求参数，JSON格式，可选
* name_field: 数据源中的名称字段，必填
* value_field: 数据源中的值字段，必填

例：

```json
{
  "url": "data",
  "params": {
    "template_id": "xxx"
  },
  "name_field": "title",
  "value_field": "pk"
}
```

------

## 控件模板说明

控件模板使用 juicer 模板语法，具体参考 juicer 文档 https://github.com/PaulGuo/Juicer/

### 控件模板常量

#### model

字段绑定名， 用来在v-model中占位， 如 
```html
<input type="text" v-model="$${model}">
```

#### alias

字段别名，用来生成特殊标记，如

```html
<el-radio-group :disabled="readonly" v-model="$${model}">
  <el-radio v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${value_field}">{{ item.$${name_field} }}</el-radio>
</el-radio-group>
```

#### value_field

配置数据源后的 value 字段，如

```html
<el-select :disabled="readonly" v-model="$${model}">
  <el-option v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${name_field}" :value="item.$${value_field}"></el-option>
</el-select>
```

#### name_field

配置数据源后的 name 字段，如

```html
<el-select :disabled="readonly" v-model="$${model}">
  <el-option v-for="item in $${alias}_option_data" :key="item.pk" :label="item.$${name_field}" :value="item.$${value_field}"></el-option>
</el-select>
```


#### related_alias

关联字段别名，用来在有管理字段的控件上生成特殊标记，如

```html
<el-date-picker
  type="daterange"
  unlink-panels
  :disabled="readonly"
  v-model="form.$${alias}_to_$${related_alias}"
  @change="$${alias}_change"
  format="yyyy-MM-dd"
  value-format="yyyy-MM-dd"
/>
```

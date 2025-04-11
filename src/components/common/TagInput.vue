<template>
  <div class="tag-input">
    <div v-for="(tag, index) in taglist" :key="index">
      <el-autocomplete
        class="input-new-tag"
        v-if="!readonly && editable[index]"
        v-model="taglist[index]"
        :trigger-on-focus="false"
        :fetch-suggestions="querySearch"
        :ref="'editableInput' + index"
        size="small"
        placeholder="请输入"
        @keyup.enter.native="handleEditableInputConfirm(tag, index)"
        @change="handleEditableInputConfirm(tag, index)"
        @blur="handleEditableInputBlur(tag, index)"
      ></el-autocomplete>
      <el-tag
        v-else
        @click="showEditTagInput(index)"
        :closable="!readonly"
        :disable-transitions="false"
        @close="handleClose(tag, index)"
        >{{ tag }}</el-tag
      >
    </div>
    <div v-if="!readonly">
      <el-autocomplete
        class="input-new-tag"
        v-if="inputVisible"
        :trigger-on-focus="false"
        :fetch-suggestions="querySearch"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      ></el-autocomplete>
      <el-button
        v-else
        class="button-new-tag"
        size="mini"
        @click="showInput"
        >+ 新增</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "TagInput",
  props: {
    value: {
      type: Array,
      required: true
    },
    readonly:{
      type: Boolean,
      default: false
    },
    tags: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      tagInput: "",
      taglist: [],
      editable: [],
      inputVisible: false,
      inputValue: '',
      existTags: []
    };
  },
  mounted(){
    this.taglist = [...this.value];
    this.existTags = [...this.tags];
  },
  methods: {
    addTag() {
      if (this.tagInput) {
        this.tags.push(this.tagInput);
        this.tagInput = "";
      }
    },
    removeTag(index) {
      this.tags.splice(index, 1);
    },
    //添加 Tag  input显示
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //添加 Tag input失去焦点
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.taglist.push(inputValue);
        this.$emit("input", this.taglist);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //编辑 Tag input显示
    showEditTagInput(index) {
      if(this.readonly) return;
      this.$set(this.editable, index, true);
      this.$nextTick((_) => {
        var editableInput = "editableInput" + index;
        this.$refs[editableInput][0].$refs.input.focus();
      });
    },
    //编辑 Tag input发生改变
    handleEditableInputConfirm(item, index) {
      if (item.label) {
        this.$set(this.editable, index, false);
      } else {
        this.$message({ message: "请输入", type: "info" });
      }
    },
    //编辑 Tag input失去焦点
    handleEditableInputBlur(item, index) {
      this.$set(this.editable, index, false);
    },
    //删除部门职位
    handleClose(tag, index) {
      this.taglist.splice(index, 1);
      this.$emit("input", this.taglist);
    },
    querySearch(queryString, cb) {
      var results = queryString
        ? this.existTags.filter(this.createFilter(queryString))
        : this.existTags;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (tag) => {
        return tag.label.indexOf(queryString) > -1;
      };
    },
  },
  watch:{
    value: function(){
      this.taglist = [...this.value]
    },
    tags: function(){
      this.existTags = [...this.tags]
    }
  }
};
</script>

<style scoped>
.tag-input {
  display: flex;
}
.tag-input > div {
  margin-right: 5px;
}
</style>

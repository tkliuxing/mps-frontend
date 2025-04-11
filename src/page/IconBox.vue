<template>
  <el-col :span="span" class="col-box">
    <div class="icon-box" @click="doCopy" :style="{color}">
      <i :class="icon"></i><span>{{ icon_name() }}</span>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "IconBox",
  props: ["icon", "span", "color"],
  methods: {
    icon_name(){
      if(this.icon.startsWith('fa ') || this.icon.startsWith('el-')){
        return this.icon;
      } else {
        return'fa ' + this.icon;
      }
    },
    doCopy(){
      if(this.icon.startsWith('fa ') || this.icon.startsWith('el-')){
        this.$copyText(this.icon);
      } else {
        this.$copyText('fa ' + this.icon);
      }
      this.$message.success(`已复制 ${this.icon}`);
    }
  },
}
</script>

<style scoped>
.icon-box {
  padding: 10px;
  color: #606266;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  cursor: pointer;
  transition: color .15s linear;
}

.icon-box:hover {
  color: #5cb6ff;
}

.icon-box i {
  font-size: 80px;
}

.icon-box span {
  display: block;
  height: 30px;
  font-size: 14px;
  margin-top: 10px;
  white-space: break-spaces;
  text-align: center;
}
</style>

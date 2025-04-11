<template>
  <el-row :gutter="10">
    <el-col :span="24" style="margin-top:20px;">
      <GenerateVue/>
    </el-col>
    <el-col :span="24" style="margin-top:20px;">
      <GenerateUni/>
    </el-col>
  </el-row>
</template>

<script>
import GenerateUni from "@/Template/GenerateUni/index.vue";
import GenerateVue from "@/Template/GenerateVue/Index.vue";
export default {
  name: "GenericIndex",
  components: {
    GenerateUni,
    GenerateVue,
  },
}
</script>

<style scoped>

</style>

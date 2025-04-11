<template>
  <div v-loading="loading">
    <template v-if="data">
      <el-form inline>
        <el-form-item label="读取起始行">
          <el-input v-model="data.start"></el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="data.data"
        max-height="450"
        border
        stripe
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center' }"
      >
        <el-table-column label="字段名称" prop="col_title"></el-table-column>
        <el-table-column label="字段别名" prop="alias"></el-table-column>
        <el-table-column label="数据库字段名" prop="col_name"></el-table-column>
        <el-table-column label="读取列号" sortable :sort-method="sortMethods">
          <template v-slot="{ row }">
            <el-input-number
              v-model="row.sort_num"
              style="width:100%"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:center;margin-top:20px">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { getObj, updateObj } from "@/resource.js";
export default {
  name: "ExcelRules",
  props: {
    templatePk: String,
  },
  data() {
    return {
      template: null,
      data: null,
      loading: false,
    };
  },
  methods: {
    async loadRules() {
      this.loading = true;
      let res = await getObj("formtemplate", this.templatePk);
      this.template = res;
      if (res.header_conf) {
        this.data = JSON.parse(res.header_conf);
      } else {
        res.field.forEach((i, index) => {
          i.sort_num = index + 1;
        });
        this.data = {
          start: 2,
          data: res.field,
        };
      }
      this.loading = false;
    },
    async submit() {
      try {
        this.template.header_conf = JSON.stringify(this.data);
        await updateObj("formtemplate", this.template.pk, this.template);
        this.$message.success("保存成功!");
        this.$emit("close");
      } catch (error) {}
    },
    sortMethods(a, b) {
      return a.sort_num - b.sort_num;
    },
  },
  watch: {
    templatePk: {
      handler() {
        this.loadRules();
      },
      immediate: true,
    },
  },
};
</script>

<style></style>

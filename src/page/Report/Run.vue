<template>
  <el-card>
    <el-form inline v-if="params">
      <template v-for="i in params">
        <el-form-item :label="i.label" :key="i.pk">
          <el-input v-model="search[i.query_name]" clearable></el-input>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button @click="searchFn" type="primary">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="data" :header-cell-style="{textAlign:'center'}" stripe border :cell-style="{textAlign:'center'}" :height="height">
      <el-table-column v-for="i in headers" :key="i.pk" :label="i.title" :prop="i.key"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import resource from "@/resource";
export default {
  name: "ReportRun",
  data() {
    return {
      data: [],
      headers: [],
      params: null,
      report: null,
      search: {
        params: ""
      }
    }
  },
  methods: {
    async loadReport() {
      try {
        let res = await resource.getObj('reportconf', this.$route.params.id)
        this.report = res;
        let params = JSON.parse(res.arguments)?.sql_params;
        if (Array.isArray(params) && params.length > 0) {
          this.params = params
        } else {
          let result = await resource.getObj('formdatareport', res.report_id)
          this.data = result.data;
          this.headers = result.header
        }
      } catch (error) {
        return this.$message.error(Array.isArray(error.response.data) && error.response.data.join(','))
      }
    },
    async searchFn() {
      try {
        let result = await this.$http.get(`/formdatareport/${this.report.report_id}/`, { params: this.search })
        this.headers = result.data.header;
        this.data = result.data.data;
      } catch (error) {
        return this.$message.error(Array.isArray(error.response.data) && error.response.data.join(','))
      }
    }
  },
  created() {
    this.loadReport()
  },
  computed: {
    height() {
      return window.innerHeight - 150
    }
  }
}
</script>

<style>
</style>
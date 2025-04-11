<template>
  <div class="bpmnlist">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form inline label-width="120px">
          <el-form-item label="业务子系统">
            <el-select v-model="biz_id">
              <el-option
                  v-for="item in biz_ids"
                  :key="item.biz_id"
                  :label="`${item.biz_id}: ${item.name}`"
                  :value="item.biz_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <workflow :biz_id="biz_id" />
      </el-col>
      <el-col :span="12">
        <workflowrole :biz_id="biz_id" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import workflowrole from "./workflowrole.vue";
import workflow from "./workflow.vue";
import {mapState} from "vuex";

export default {
  name: "BpmnList",
  data(){
    return {
      biz_id: 1,
      biz_ids: [{name:'默认', biz_id:1}],
    }
  },
  components: {workflowrole, workflow},
  computed:{
    ...mapState(['currentSystemId']),
  },
  methods:{
    async loadBiz(){
      let params = {
        sys_id: this.currentSystemId,
      };
      let res = await this.$http.get("/systembiz/", { params });
      this.biz_ids = res.data;
      if(this.biz_ids.length === 0){
        this.biz_ids = [{name:'默认', biz_id:1}];
      }
      this.biz_id = 1;
    },
  },
  mounted(){
    this.loadBiz();
  },
  watch:{
    currentSystemId(){
      this.loadBiz();
    }
  },
}
</script>

<style>
.bpmnlist{
  padding:8px;
}
</style>


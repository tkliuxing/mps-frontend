<template>
  <el-cascader :options="permissions" filterable :props="perm_props" :show-all-levels="false" clearable :value="value" @change="change"></el-cascader>
</template>

<script>
import lodash from 'lodash';
import deepdash from 'deepdash';
const _ = deepdash(lodash);
export default {
  name: 'SelectPerm',
  props: {
    sys_id: [String, Number],
    biz_id: {
      type: [String, Number],
      default: null,
    },
    value: String,
    returnObj: {
      type: Boolean,
      default: false,
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      permissions: [],
      perm_props: {
        label: 'name',
        value: 'pk',
        children: 'items',
        leaf: "is_leaf_node",
        checkStrictly: true,
        emitPath: false,
      },
    }
  },
  methods: {
    async loadData(){
      if(this.sys_id === null){
        this.permissions = [];
        return;
      }
      let params = { sys_id: this.sys_id, level: 0 };
      if(this.biz_id !== null){
        params.biz_id = this.biz_id;
      }
      let resp = await this.$http.get(`/permissionstree/`, { params });
      this.permissions = resp.data;
    },
    async init(){
      await this.loadData();
    },
    change(value) {
      if(this.returnObj){
        let obj = _.findDeep(this.permissions, (val, key) => {
          return val === value;
        });
        if(!!obj){
          this.$emit('change', obj.parent);
        } else {
          this.$emit('change', null);
        }
      } else {
        this.$emit('change', value);
      }
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    sys_id: 'init',
    biz_id: 'init',
  }
}
</script>

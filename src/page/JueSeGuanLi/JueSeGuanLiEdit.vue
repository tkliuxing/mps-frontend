<template>
  <div class="jueseguanliedit">
    <el-dialog
        title="提示"
        :visible="showDialog"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="业务子系统" prop="biz_id">
          <el-input :value="biz_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="ORG ID" prop="org_id">
                    <el-select v-model="form.org_id"  placeholder="ORG ID" clearable>
                      <el-option
                          v-for="item in orgs"
                          :key="item.pk"
                          :label="`${item.org_id}: ${item.name}`"
                          :value="item.org_id">
                      </el-option>
                    </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-cascader
            style="width: 100%"
            @change="getOptions"
            v-model="form.permissions"
            :options="funcPermissions"
            :props="{ multiple: true, checkStrictly: true ,emitPath: false,children: 'children',label: 'name',value: 'pk'}"
            :show-all-levels="false"
            clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="() => {this.clearForm(); this.$emit('close', '')}">取 消</el-button>
        <el-button type="primary" @click="validForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import resource from "@/resource";

  export default {
    name: 'JueSeGuanLiEdit',
    props: ['showDialog', 'pk', 'sys_id', 'biz_id'],
    data() {
      return {
        form: {
          pk: null,
          sys_id: null,
          name: '',
          permissions: []
        },
        selectedOptions: [],
        rules: {
          name: [{ required: true, message: '请填写角色名称', trigger: 'blur' }],
          org_id: [{ required: true, message: '请填写ORG ID', trigger: 'blur' }],
        },
        orgs: [], // org_id
        funcPermissions: [],
        funcflatPermissions: [],
      };
    },
    mounted() {
      this.loadFuncPermission();
      this.getOrg();
      if (this.pk) {
        this.loadFuncGroup(this.pk);
      }
      this.form.sys_id = this.sys_id;
    },
    methods: {
      getOptions(value){
        this.funcflatPermissions.forEach((item) => {
          if (value.indexOf(item.pk) > -1) {
            // 可能会有多层父节点，所以需要递归查找
            this.findParent(item.pk, this.form.permissions, this.funcflatPermissions);
          }
        });
        this.form.permissions = [...new Set(this.form.permissions)];
      },
      findParent(pk, permissionsArray, funcflatPermissions) {
        const item = funcflatPermissions.find(item => item.pk === pk);
        if (item) {
          permissionsArray.push(item.pk);
          if (item.parent) {
            this.findParent(item.parent, permissionsArray, funcflatPermissions);
          }
        }
      },
      // 获取org_id
      async getOrg(){
        this.orgs = await resource.getList('systemorg', {
          sys_id: this.sys_id
        });
      },
      async loadFuncGroup(pk) {
        try {
          let resp = await this.$http.get(`/group/${pk}/`);
          this.form = resp.data;
        } catch (e) {
          this.$message.error('数据获取失败');
          this.$emit('close');
        }
      },
      async loadFuncPermission() {
        let params = {
          sys_id: this.sys_id,
          biz_id: this.biz_id,
        };
        try {
          let resp = await this.$http.get('/permissions/', {params});
          this.funcflatPermissions = [...resp.data];
          this.funcPermissions = this.buildPermissionTree(resp.data);

        } catch (e) {
          this.$message.error('数据获取失败');
          this.$emit('close');
        }
      },
      buildPermissionTree(flatPermissions, parent = null) {
        const tree = [];
        for (let i = 0; i < flatPermissions.length; i++) {
          const permission = flatPermissions[i];
          if (permission.parent === parent) {
            const children = this.buildPermissionTree(flatPermissions, permission.pk);
            if (children.length > 0) {
              permission.children = children;
            }
            tree.push(permission);
            // 删除已经添加到树中的子节点
            flatPermissions.splice(i, 1);
            i--; // 调整循环索引
          }
        }
        return tree;
      },
      validForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submit();
          } else {
            return false;
          }
        });
      },
      async submit() {
        this.form.biz_id = this.biz_id;
        if (this.form.pk) {
          try {
            await this.$http.put(`/group/${this.form.pk}/`, this.form);
            this.$message.success('提交成功');
            this.clearForm();
            this.$emit('close', 'success');
          } catch (e) {
            this.$message.error('提交失败');
          }
        } else {
          try {
            await this.$http.post(`/group/`, this.form);
            this.$message.success('提交成功');
            this.clearForm();
            this.$emit('close', 'success');
          } catch (e) {
            this.$message.error('提交失败');
          }
        }
      },
      clearForm() {
        this.form = {
          pk: null,
          name: '',
          permissions: []
        };
        this.$refs.form.resetFields();
      }
    }
  };
</script>

<style scoped>

</style>

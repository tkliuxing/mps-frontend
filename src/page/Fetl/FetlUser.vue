<template>
  <div class="fetl-user">
    <el-card>
      <div slot="header" class="clearfix">
        <span>《 {{ currentSystemName }} 》 Fetl RSA 加密用户</span>
      </div>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-table :data="data" border height="335" :cell-style="{padding: 0, textAlign: 'center'}" :header-cell-style="{textAlign:'center'}" size="mini">
            <el-table-column label="用户ID" prop="user_id" width="120"></el-table-column>
            <el-table-column label="用户名称" prop="user_name" width="200"></el-table-column>
            <el-table-column label="失效时间" prop="expire_time" width="150">
              <template slot-scope="{ row }">
                {{ datetime_display(row.expire_time) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110" fixed="left">
              <template slot-scope="{ row }">
                <el-button-group>
                  <el-button type="success" @click="editRow(row)" size="mini" icon="el-icon-edit"></el-button>
                  <el-button type="danger" @click="deleteRow(row)" size="mini" icon="el-icon-delete"></el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
            <el-form-item label="所属租户" prop="org_id">
              <el-select v-model="form.org_id" placeholder="请选择所属租户">
                <el-option v-for="item in orgOptions" :key="item.id" :label="item.name" :value="item.org_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户ID" prop="user_id">
              <el-input v-model="form.user_id" placeholder="请输入用户ID"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="user_name">
              <el-input v-model="form.user_name" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="失效时间" prop="expire_time">
              <el-date-picker v-model="form.expire_time" type="datetime" placeholder="请选择失效时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="RSA私钥">
              <el-input v-model="form.rsa_private_key" readonly>
                <template slot="append">
                  <el-button @click="copy(form.rsa_private_key)" icon="el-icon-document-copy"></el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="RSA公钥">
              <el-input v-model="form.rsa_public_key" readonly>
                <template slot="append">
                  <el-button @click="copy(form.rsa_public_key)" icon="el-icon-document-copy"></el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">保存</el-button>
              <el-button type="default" @click="reset">清空</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import resource from "@/resource";

const FORM = {
  pk: null,
  sys_id: null,
  org_id: null,
  user_id: null,
  user_name: null,
  rsa_private_key: null,
  rsa_public_key: null,
  expire_time: null,
}

FORM.new = () => JSON.parse(JSON.stringify(FORM));

export default {
  name: 'FetlUser',
  data() {
    return {
      data: [],
      orgOptions: [],
      loading: false,
      form: FORM.new(),
      rules: {
        org_id: [{ required: true, message: '请选择所属租户', trigger: 'change' }],
        user_id: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        user_name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        expire_time: [{ required: true, message: '请选择失效时间', trigger: 'change' }],
      }
    }
  },
  computed: {
    ...mapState(['currentSystemId', 'currentSystemName'])
  },
  mounted() {
    this.loadOrgs();
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      let params = {
        sys_id: this.currentSystemId,
      };
      let resp = await resource.getList('fetlrsauser', params);
      this.data = resp;
      this.loading = false;
    },
    async loadOrgs() {
      try {
        const resp = await resource.getList("systemorg", {
          sys_id: this.currentSystemId,
        });
        this.orgOptions = resp;
      } catch (error) {
        this.$message.error("加载机构数据失败");
        console.error(error);
      }
    },
    datetime_display(time_str) {
      // 时间是UTC时间，需要转为东8区
      return moment(time_str).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
    },
    editRow(row) {
      this.form = JSON.parse(JSON.stringify(row));
    },
    deleteRow(row) {
      this.$confirm('确定删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try{
          await resource.deleteObj('fetlrsauser', row.pk);
          this.$message.success('删除成功');
          this.getData();
        } catch(e) {
          this.$message.error('删除失败');
          console.error(e);
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    async save(){
      let is_valid = await new Promise((resolve, reject) => {
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
      if (!is_valid) return;
      this.form.sys_id = this.currentSystemId;
      if(typeof this.form.expire_time === typeof new Date()) {
        this.form.expire_time = moment(this.form.expire_time).format('YYYY-MM-DDTHH:mm:ss+00:00:00');
      }
      try{
        if (this.form.pk) {
          await resource.updateObj('fetlrsauser', this.form.pk, this.form);
        } else {
          await resource.createObj('fetlrsauser', this.form);
        }
        this.$message.success('保存成功');
        this.reset();
        this.getData();
      } catch(e) {
        this.$message.error('保存失败');
        console.error(e);
      }
    },
    reset(){
      this.form = FORM.new();
      this.$refs.formRef.resetFields();
    },
    copy(text) {
      navigator.clipboard.writeText(text);
      this.$message.success('复制成功');
    }
  }
}
</script>

<style>

</style>
<template>
  <div class="contract">
    <el-card>
      <el-row :gutter="10" style="margin-top:8px; height:40px; line-height:40px">
        <el-col :span="24">
          <div class="el-icon-s-grid ln-daiban">{{department.name}}<i
            class="el-icon-d-arrow-right"></i><span>人员列表</span>
          </div>
          <div style="float: right">
            <el-button type="info" round size="medium" @click="$router.go(-1)"><i
              class="el-icon-arrow-left"></i><span>返回上一步</span></el-button>
            <el-button type="primary" round size="medium" @click="xinzengrenyuan=true"><i
              class="el-icon-plus"></i><span>新增人员</span></el-button>
          </div>
        </el-col>

      </el-row>

      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <el-card shadow="never">
            <el-table :data="tableData" style="width: 100%;" stripe border>
              <el-table-column prop="full_name" label="姓名" width="180" align="center"></el-table-column>
              <el-table-column prop="username" label="用户名" width="200" align="center"></el-table-column>
              <el-table-column prop="mobile" label="手机号" width="200" align="center"></el-table-column>
              <el-table-column prop="sex" label="性别" width="200" align="center"></el-table-column>
              <el-table-column label="角色" width="200" align="center">
                <template slot-scope="scope">
                <span v-for="(name,num) in scope.row.func_group_names" :key="num">{{name}}<span
                  v-if="num+1!==scope.row.func_group_names.length">、</span></span>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="备注" align="center"></el-table-column>
              <el-table-column prop="operation" label="操 作" width="200" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" round class="ln-xiangqing" @click="bianji_xinzengrenyuan(scope.row)">编辑
                  </el-button>
                  <el-button size="mini" type="danger" round @click="delete_xinzengrenyuan(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              layout="prev, pager, next, sizes"
              :page-size="config.params.pageSize"
              :current-page="config.params.page"
              :total="zongshu"
              :hide-on-single-page="true"
              @current-change="pageChange"
            >
            </el-pagination>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <!--新增人员-->
    <el-dialog title="新增人员" :visible.sync="xinzengrenyuan" width="30%" :close-on-click-modal="false">
      <el-form :model="xinzeng_form" :rules="rules" ref="createForm" label-width="80px">
        <el-form-item label="部门">
          {{department.name}}
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="xinzeng_form.username" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="xinzeng_form.password" show-password autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpassword">
          <el-input v-model="xinzeng_form.checkpassword" show-password autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="full_name">
          <el-input v-model="xinzeng_form.full_name" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="xinzeng_form.mobile" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="xinzeng_form.sex" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="xinzeng_form.func_groups" multiple placeholder="请选择当前角色">
            <el-option v-for="item in group" :key="item.pk" :label="item.name"
                       :value="item.pk"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="xinzeng_form.description" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="xinzengrenyuan = false" class="ln-button" round>取 消</el-button>
        <el-button type="primary" @click="add_xinzengrenyuan" class="ln-button" round>确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑人员-->
    <el-dialog title="编辑人员" :visible.sync="bianji_renyuan" width="30%" :close-on-click-modal="false">
      <el-form :model="bianji_form" :rules="rules" ref="edtForm" label-width="80px">
        <el-form-item label="部门名称">
          {{department.name}}
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="bianji_form.username" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="bianji_form.password" show-password style="width:60%" placeholder="非修改密码可不填写"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="full_name">
          <el-input v-model="bianji_form.full_name" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="bianji_form.mobile" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="bianji_form.sex" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色：">
          <el-select v-model="bianji_form.func_groups" multiple placeholder="请选择当前角色">
            <el-option v-for="item in group" :key="item.pk" :label="item.name"
                       :value="item.pk"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="bianji_form.description" autocomplete="off" style="width:60%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="bianji_renyuan = false" class="ln-button" round>取 消</el-button>
        <el-button type="primary" @click="edt_xinzengrenyuan" class="ln-button" round>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "contract",
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.xinzeng_form.password !== '') {
            this.$refs.createForm.validateField('checkpassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.xinzeng_form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        options: [{
          value: "男",
          label: "男",
        }, {
          value: "女",
          label: "女",
        }],
        bianji_renyuan: false,
        bianji_form: {
          username: '',
          password: '',
          full_name: '',
          department: '',
          mobile: '',
          sex: '',
          is_active: true,
          func_groups: [],
          description: '',
        },
        xinzengrenyuan: false,
        xinzeng_form: {
          username: '',
          password: '',
          checkpassword: '',
          full_name: '',
          department: '',
          mobile: '',
          sex: '',
          is_active: true,
          func_groups: [],
          description: '',
        },
        rules: {
          username: [{required: true, message: "请输入用户名", trigger: 'change'}],
          full_name: [{required: true, message: "请输入姓名", trigger: 'change'}],
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkpassword: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        },
        tableData: [],
        department: {},
        zongshu: 0,
        next: false,
        previous: false,
        config: {
          params: {
            department: '',
            is_active: true,
            page: 1,   //当前页码
            pageSize: 15   //当前页显示条数
          }
        },
        group: [],
      };
    },
    methods: {
      groupData() {
        this.loading = true;
        const params = {
          sys_id: this.department.sys_id,
        }
        this.$http.get('/group/', {params}).then((resp) => {
          this.group = resp.data;
          console.log(resp.data);
        })
      },
      //清空当前新增表单（初始化表单）
      xinzeng_clean() {
        this.xinzeng_form = {
          username: '',
          password: '',
          full_name: '',
          department: '',
          mobile: '',
          sex: '',
          is_active: true,
          groups: [],
          description: '',
        };
      },
      loadData() {
        // 加载数据列表及刷新
        this.$http.get("/user/", this.config).then((resp) => {
          console.log(resp.data.data);
          this.tableData = resp.data.data;
          this.zongshu = resp.data.count;
          this.next = resp.data.next;
          this.previous = resp.data.previous;
        }).catch((err) => {
          this.$message.error({message: "数据获取失败！！", center: true})
        })
      },
      //当前页码发生变化时触发的事件
      pageChange(page) {
        this.config.params.page = page;
        this.loadData();
      },
      //新增单条数据的方法
      add_xinzengrenyuan() {
        this.$refs.createForm.validate((valid) => {
          if (valid) {
            this.xinzeng_form.department = this.department.pk;
            this.xinzeng_form.sys_id = this.department.sys_id;
            this.xinzeng_form.org_id = this.department.org_id;
            this.$http.post("/user/", this.xinzeng_form).then((resp) => {
              this.xinzengrenyuan = false;
              this.$message.success({message: "添加成功！！", center: true});
              this.loadData();
              this.xinzeng_clean();
            }).catch((err) => {
              this.$message.error({message: "数据获取失败！！", center: true})
            })
          } else {
            this.$message.error('请填写完整信息后提交');
            return false
          }
        })
      },
      //点击编辑按钮事件的方法↓
      bianji_xinzengrenyuan(data) {
        data.password = '';
        this.bianji_form = {...data};
        this.bianji_renyuan = true;
      },
      //编辑弹窗内容的方法↓
      edt_xinzengrenyuan() {
        this.$refs.edtForm.validate((valid) => {
          if (valid) {
            this.$http.patch("/user/" + this.bianji_form.pk + "/", this.bianji_form).then((resp) => {
              this.bianji_renyuan = false;
              this.$message.success({message: "编辑成功！！", center: true});
              this.loadData();
            }).catch((err) => {
              this.$message.error({message: "编辑失败，轻重试！！", center: true})
            })
          } else {
            this.$message.error('请填写完整信息后提交');
            return false
          }
        })
      },
      //删除当前单条数据内容的方法↓
      delete_xinzengrenyuan(data) {
        this.$confirm('此操作将永久删除该用户 , 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete("/user/" + data.pk + "/").then((resp) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadData();
          }).catch((err) => {
            this.$message.error({message: "删除失败！！", center: true})
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    mounted() {
      // 先获取上一级页面传过来的部门信息
      this.department = this.$route.params.department;
      this.config.params.department = this.$route.params.department.pk;
      this.loadData();
      this.groupData();
    }
  }
</script>

<style scoped>
  .hover-rotate {
    transition: all 500ms;
  }

  .hover-rotate:hover {
    transform: rotate(360deg);
  }


  .el-icon-folder-add span {
    display: block;
    margin-left: 3px;
  }

  .ln-yellow {
    background: #FF9900;
    border-color: #FF9900;
  }
</style>

<template>
  <div style="margin-top: 16px">
    <el-form-item label="特殊动作">
      <el-checkbox v-model="userTaskForm.chaosong" label="抄送" :disabled="userTaskForm.huiqian" clearable @change="updateElementTask('chaosong')" />
      <el-checkbox v-model="userTaskForm.huiqian" label="会签" :disabled="userTaskForm.chaosong" clearable @change="updateElementTask('huiqian')" />
    </el-form-item>
    <el-form-item label="处理用户" v-if="!userTaskForm.huiqian">
      <el-select v-model="userTaskForm.assignee" clearable @change="updateElementTask('assignee')">
        <el-option v-for="ak in users" :key="ak.pk" :label="ak.full_name || ak.username" :value="ak.pk" />
      </el-select>
    </el-form-item>
<!--    <el-form-item label="候选用户">-->
<!--      <el-select v-model="userTaskForm.candidateUsers" clearable multiple collapse-tags @change="updateElementTask('candidateUsers')">-->
<!--        <el-option v-for="ak in users" :key="ak.pk" :label="ak.full_name || ak.username" :value="ak.pk" />-->
<!--      </el-select>-->
<!--    </el-form-item>-->
    <el-form-item label="候选职务">
      <el-select v-model="userTaskForm.candidateGroups" clearable multiple collapse-tags @change="updateElementTask('candidateGroups')">
        <el-option v-for="gk in groups" :key="gk.pk" :label="gk.name" :value="gk.pk" />
      </el-select>
    </el-form-item>
    <el-form-item label="表单字段">
      <el-input type="textarea" placeholder="由配置的表单字段的内容指定UID，多个字段名用逗号分隔" v-model="userTaskForm.candidateField" clearable @change="updateElementTask('candidateField')" />
    </el-form-item>
<!--    <el-form-item label="到期时间">-->
<!--      <el-input v-model="userTaskForm.dueDate" clearable @change="updateElementTask('dueDate')" />-->
<!--    </el-form-item>-->
<!--    <el-form-item label="跟踪时间">-->
<!--      <el-input v-model="userTaskForm.followUpDate" clearable @change="updateElementTask('followUpDate')" />-->
<!--    </el-form-item>-->
<!--    <el-form-item label="优先级">-->
<!--      <el-input v-model="userTaskForm.priority" clearable @change="updateElementTask('priority')" />-->
<!--    </el-form-item>-->
  </div>
</template>

<script>
import {mapState} from "vuex";
import resource from "@/resource";

export default {
  name: "UserTask",
  props: {
    id: String,
    type: String
  },
  computed: {
    ...mapState(["currentSystemId"]),
  },
  data() {
    return {
      defaultTaskForm: {
        assignee: "",
        candidateUsers: [],
        candidateGroups: [],
        candidateField: "",
        dueDate: "",
        followUpDate: "",
        priority: "",
        chaosong: false,
        huiqian: false,
      },
      userTaskForm: {},
      mockData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      users: [],
      groups: [],
    };
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.bpmnElement = window.bpmnInstances.bpmnElement;
        this.$nextTick(() => this.resetTaskForm());
      }
    }
  },
  mounted(){
    this.loadUsers();
    this.loadGroups();
  },
  methods: {
    async loadUsers(){
      let data = await resource.getList('usermin', {sys_id: this.currentSystemId});
      data.unshift({'pk': '部门分管领导', 'name': '部门分管领导'});
      data.unshift({'pk': '发起人部门主管', 'name': '发起人部门负责人'});
      data.unshift({'pk': '发起人', 'name': '发起人'});
      this.users = data;
    },
    async loadGroups(){
      this.groups = await resource.getList('workflowrole', {sys_id: this.currentSystemId});
    },
    resetTaskForm() {
      for (let key in this.defaultTaskForm) {
        let value;
        if (key === "candidateUsers" || key === "candidateGroups") {
          value = this.bpmnElement?.businessObject[key] ? this.bpmnElement.businessObject[key].split(",") : [];
        } else {
          value = this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key];
        }
        this.$set(this.userTaskForm, key, value);
      }
    },
    updateElementTask(key) {
      const taskAttr = Object.create(null);
      if (key === "candidateUsers" || key === "candidateGroups") {
        taskAttr[key] = this.userTaskForm[key] && this.userTaskForm[key].length ? this.userTaskForm[key].join() : null;
      } else {
        taskAttr[key] = this.userTaskForm[key] || null;
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr);
    }
  },
  beforeDestroy() {
    this.bpmnElement = null;
  }
};
</script>

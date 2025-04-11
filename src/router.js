import Vue from "vue";
import Router from "vue-router";
import pageReg from "./pageReg";

Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "home",
      component: pageReg.home,
      meta: { title: "首页" },
      redirect: "/systems",
      children: [
        {
          path: "/systems",
          name: "systems",
          redirect: "/systems/SystemGuanLi",
          component: pageReg.systems,
          meta: { title: "系统" },
          children: [
            {
              path: "SystemGuanLi",
              name: "SystemGuanLi",
              component: pageReg.SystemGuanLi,
              meta: { title: "系统管理" },
            },
            {
              path: "permissions/:sys_id/",
              name: "systempermissions",
              component: pageReg.systempermissions,
              meta: { title: "系统权限" },
              props: true,
            },
            {
              path: "groups/:sys_id/",
              name: "systemgroups",
              component: pageReg.systemgroups,
              meta: { title: "角色管理" },
              props: true,
            },
            {
              path: "smsconfig/:sys_id/",
              name: "smsconfig",
              component: pageReg.smsconfig,
              meta: { title: "短信配置" },
              props: true,
            },
            {
              path: "emailconfig/:sys_id/",
              name: "emailconfig",
              component: pageReg.emailconfig,
              meta: { title: "邮件配置" },
              props: true,
            },
            {
              path: "weixinconfig/:system_id/",
              name: "weixinconfig",
              component: pageReg.weixinconfig,
              meta: { title: "微信配置" },
              props: true,
            },
            {
              path: "systemmodule/:system_id/",
              name: "systemmodule",
              component: pageReg.systemmodule,
              meta: { title: "系统模块配置" },
              props: true,
            },
            {
              path: "systemproject/:system_id/",
              name: "systemproject",
              component: pageReg.systemproject,
              meta: { title: "项目工程配置" },
              props: true,
            },
            {
              path: "systemdatabackup/:sys_id/",
              name: "systemdatabackup",
              component: pageReg.systemdatabackup,
              meta: { title: "系统数据备份" },
              props: true,
            },
            {
              path: "systembiz/:system_id/",
              name: "systembiz",
              component: pageReg.systembiz,
              meta: { title: "业务子系统定义" },
              props: true,
            },
            {
              path: "org/:sys_id/",
              name: "org",
              component: pageReg.org,
              meta: { title: "机构管理" },
              props: true,
            },
            {
              path: "orgmodule/:org_pk/",
              name: "orgmodule",
              component: pageReg.orgmodule,
              meta: { title: "机构功能开通管理" },
              props: true,
            },
            {
              path: "department/:sys_id/",
              name: "department",
              component: pageReg.department,
              meta: { title: "部门人员管理" },
              props: true,
            },
            {
              path: "RenYuanGuanLi/:sys_id/",
              name: "RenYuanGuanLi",
              component: pageReg.RenYuanGuanLi,
              meta: { title: "人员管理" },
              props: true,
            },
          ],
        },
        {
          path: "/compdocument",
          name: "compdocument",
          component: pageReg.compdocument,
          meta: { title: "组件文档" },
        },
        {
          path: "/icons",
          name: "icons",
          component: pageReg.icons,
          meta: { title: "图标库" },
        },
        {
          path: "/template",
          name: "template",
          component: pageReg.template,
          meta: { title: "表单定义" },
        },
        {
          path: "/codegenerate",
          name: "codegenerate",
          component: pageReg.codegenerate,
          meta: { title: "表单代码生成" },
        },
        {
          path: "/basetree",
          name: "basetree",
          component: pageReg.basetree,
          meta: { title: "分类树配置" },
        },
        {
          path: "/parameter",
          name: "parameter",
          component: pageReg.parameter,
          meta: { title: "常参数据管理" },
        },
        {
          path: "/reportconf",
          name: "reportconf",
          component: pageReg.reportconf,
          meta: { title: "报表配置", keepAlive: true },
        },
        {
          path: "/report-editor/:sysid",
          name: "reporteditor-add",
          props: true,
          component: pageReg.reporteditor,
          meta: { title: "报表编辑器" },
        },
        {
          path: "/report-editor/:sysid/pk/:pk/",
          name: "reporteditor-edit",
          props: true,
          component: pageReg.reporteditor,
          meta: { title: "报表编辑器" },
        },
        {
          path: "/workflow",
          name: "workflow",
          component: pageReg.workflow,
          meta: { title: "流程引擎", keepAlive: true },
        },
        {
          path: "/workflow/edit/:pk",
          name: "workflowedit",
          props: true,
          component: pageReg.workflowedit,
          meta: { title: "流程引擎" },
        },
        {
          path: "/coderouter",
          name: "coderouter",
          component: pageReg.coderouter,
          meta: { title: "页面路由" },
        },
        {
          path: "/codemenu",
          name: "codemenu",
          component: pageReg.codemenu,
          meta: { title: "页面菜单" },
        },
        {
          path: "/fetl",
          name: "fetl",
          component: pageReg.fetl,
          meta: { title: "ETL" },
        },
        {
          path: "/fetl/create",
          name: "fetlcreate",
          component: pageReg.fetlform,
          meta: { title: "ETL Create" },
          props:route => ({ pk: route.query.pk })
        },
        {
          path: "/fetl/:pk",
          name: "fetledit",
          props: true,
          component: pageReg.fetlform,
          meta: { title: "ETL Edit" },
        },
      ],
    },
    {
      path: "/runreport/:id",
      name: "runreport",
      component: pageReg.runreport,
      meta: { title: "报表运行" },
    },
    {
      path: "/login",
      name: "login",
      component: pageReg.login,
      meta: { title: "登录" },
    },
    {
      path: "*",
      redirect: "/404",
    },
    {
      path: "/404",
      component: pageReg.notFound,
      meta: { title: "404" },
    },
  ],
});

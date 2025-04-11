export default {
  "login": () => import(/* webpackChunkName: "login" */ "./page/Login.vue"),
  "notFound": () => import(/* webpackChunkName: "login" */ "./page/404.vue"),
  "home": () => import(/* webpackChunkName: "login" */ "./components/common/Home.vue"),
  // 系统管理
  "systems": () => import(/* webpackChunkName: "System" */ "./page/XiTong/system.vue"),
  "SystemGuanLi": () => import(/* webpackChunkName: "System" */ "./page/XiTong/SystemConfig.vue"),
  "systempermissions": () => import(/* webpackChunkName: "System1" */ "./page/XiTong/SystemPermissions.vue"),
  "systemgroups": () => import(/* webpackChunkName: "System1" */ "./page/JueSeGuanLi/JueSeGuanLi.vue"),
  "smsconfig": () => import(/* webpackChunkName: "System1" */ "./page/smsconfig/SMSConfig.vue"),
  "emailconfig": () => import(/* webpackChunkName: "System1" */ "./page/emailconfig/EmailConfig.vue"),
  "weixinconfig": () => import(/* webpackChunkName: "System1" */ "./page/weixinconfig/WeiXinConfig.vue"),
  "systemmodule": () => import(/* webpackChunkName: "System1" */ "./page/XiTong/SystemModule.vue"),
  "systemproject": () => import(/* webpackChunkName: "System2" */ "./page/XiTong/SystemProject.vue"),
  "systemdatabackup": () => import(/* webpackChunkName: "System2" */ "./page/XiTong/SystemDataBackup.vue"),
  "systembiz": () => import(/* webpackChunkName: "System2" */ "./page/XiTong/SystemBiz.vue"),
  "org": () => import(/* webpackChunkName: "System2" */ "./page/XiTong/Org.vue"),
  "orgmodule": () => import(/* webpackChunkName: "System2" */ "./page/XiTong/OrgModule.vue"),
  "department": () => import(/* webpackChunkName: "System3" */ "./page/BuMenRenYuanGuanLi/BuMenRenYuanGuanLi.vue"),
  "RenYuanGuanLi": () => import(/* webpackChunkName: "System3" */ "./page/BuMenRenYuanGuanLi/RenYuanGuanLi/RenYuanGuanLi.vue"),
  // 文档相关
  "compdocument": () => import(/* webpackChunkName: "document" */ "./page/CompDocument.vue"),
  "icons": () => import(/* webpackChunkName: "document" */ "./page/Icons.vue"),
  // 表单定义相关
  "template": () => import(/* webpackChunkName: "Template" */ "./Template/Index.vue"),
  "codegenerate": () => import(/* webpackChunkName: "GenerateVue" */ "./Template/GenericIndex.vue"),
  // 分类树
  "basetree": () => import(/* webpackChunkName: "BaseTree" */ "./page/BaseTree.vue"),
  "parameter": () => import(/* webpackChunkName: "BaseTree" */ "./page/Parameter.vue"),
  // 报表
  "reportconf": () => import(/* webpackChunkName: "ReportConf" */ "./page/Report/ReportConf.vue"),
  "runreport": () => import(/* webpackChunkName: "ReportConf" */ "./page/Report/Run.vue"),
  "reporteditor": () => import(/* webpackChunkName: "ReportEditor" */ "./page/Report/ReportEditor.vue"),
  // 流程引擎
  "workflow": () => import(/* webpackChunkName: "bpmns" */ "./bpmnpages/bpmnlist.vue"),
  "workflowedit": () => import(/* webpackChunkName: "bpmns" */ "./bpmnpages/bpmns.vue"),
  // 页面注册
  "coderouter": () => import(/* webpackChunkName: "coderegister" */ "./page/CodeRegister/CodeRouter.vue"),
  "codemenu": () => import(/* webpackChunkName: "coderegister" */ "./page/CodeRegister/CodeMenu.vue"),
  // ETL
  "fetl": () => import(/* webpackChunkName: "fetl" */ "./page/Fetl/Index.vue"),
  "fetlform": () => import(/* webpackChunkName: "fetl" */ "./page/Fetl/Form.vue"),

}

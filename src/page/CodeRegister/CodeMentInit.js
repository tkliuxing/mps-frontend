
function MenuInit(){
  let MenuInit = [
    {
      "pk": null,
      "sys_id": null,
      "project": null,
      "parent": null,
      "children": [],
      "name": "首页",
      "icon": "el-icon-house",
      "router_name": "home",
      "permission": null,
    },
    {
      "pk": null,
      "sys_id": null,
      "project": null,
      "parent": null,
      "children": [
        {
          "pk": null,
          "sys_id": null,
          "project": null,
          "parent": null,
          "children": [],
          "name": "部门人员管理",
          "icon": null,
          "router_name": "ZhiGongGuanLi",
          "permission": null
        },
        {
          "pk": null,
          "sys_id": null,
          "project": null,
          "parent": null,
          "children": [],
          "name": "角色管理",
          "icon": "",
          "router_name": "JueSeGuanLi",
          "permission": null
        },
        {
          "pk": null,
          "sys_id": null,
          "project": null,
          "parent": null,
          "children": [],
          "name": "服务协议和隐私政策",
          "icon": "",
          "router_name": "FuWuXieYi",
          "permission": null
        },
        {
          "pk": null,
          "sys_id": null,
          "project": null,
          "parent": null,
          "children": [],
          "name": "操作日志查询",
          "icon": "",
          "router_name": "SystemLog",
          "permission": null
        },
        {
          "pk": null,
          "sys_id": null,
          "project": null,
          "parent": null,
          "children": [],
          "name": "登录日志查询",
          "icon": "",
          "router_name": "SystemLoginLog",
          "permission": null
        }
      ],
      "name": "系统管理",
      "icon": "el-icon-setting",
      "router_name": "system",
      "permission": null
    }
  ]
  return MenuInit;
}
export default MenuInit;

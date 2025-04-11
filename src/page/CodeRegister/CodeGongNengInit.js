function TreeInit() {
  let TreeInit = [
    {
      "biz_id": null,
      "codename": '管理部门、用户、角色、系统日志、公告',
      "creator": null,
      "is_leaf_node": false,
      "items": [
        {
          "biz_id": null,
          "codename": "管理该租户的部门树、用户；管理员可重置用户密码",
          "creator": "",
          "is_leaf_node": true,
          "items": [],
          "name": "部门人员管理",
          "org_id": null,
          "parent": null,
          "pk": "",
          "sys_id": null,
        },
        {
          "biz_id": null,
          "codename": "可按照功能组合成为不同的角色，角色可分配给用户",
          "creator": "",
          "is_leaf_node": true,
          "items": [],
          "name": "角色管理",
          "org_id": null,
          "parent": null,
          "pk": "",
          "sys_id": null,
        },
        {
          "biz_id": null,
          "codename": "服务协议和隐私政策内容管理，用来编辑登录页的《服务协议》和《隐私政策》",
          "creator": "",
          "is_leaf_node": true,
          "items": [],
          "name": "服务协议和隐私政策",
          "org_id": null,
          "parent": null,
          "pk": "",
          "sys_id": null,
        },
        {
          "biz_id": null,
          "codename": "用于查询查看系统内对数据的所有修改和删除记录",
          "creator": "",
          "is_leaf_node": true,
          "items": [],
          "name": "操作日志查询",
          "org_id": null,
          "parent": null,
          "pk": "",
          "sys_id": null,
        },
        {
          "biz_id": null,
          "codename": "用于查询查看系统用户的登录记录",
          "creator": "",
          "is_leaf_node": true,
          "items": [],
          "name": "登录日志查询",
          "org_id": null,
          "parent": null,
          "pk": "",
          "sys_id": null,
        }
      ],
      "name": "系统管理",
      "org_id": null,
      "parent": null,
      "pk": null,
      "sys_id": null
    },
  ]
  return TreeInit
}

export default TreeInit;

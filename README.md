# MPS 项目配置工具

## 简介

本工具基于 [后端平台](https://github.com/tkliuxing/mps-backend) 进行项目配置。

功能列表：

1. 多项目管理
    * 同一个后端可同时支持多个项目，根据 sys_id 区分；
    * 每个项目可支持多租户，通过 org_id 区分；
    * 每个项目的功能定义一致，但租户可自定义角色包含的功能；
    * 每个租户提供独立的权限管理、用户管理、机构部门管理。
1. 项目表单定义管理
    * 表单定义是系统的核心功能，提供了对数据统一 CURD 的能力；
    * 接口上通过 sys_id, org_id, template_id 进行区分。
1. 通用页面生成
    * 根据表单定义可生成VUE2+ElementUI的CURD界面代码，开箱即用。
1. 项目报表配置管理
    * 提供了复杂查询功能的支撑；
    * 可实现统计报表、多表数据关联查询等功能。
1. 流程引擎
    * 提供BPMN流程编排引擎；
    * 可视化编排；
    * 可用于实现审批流程、数据处理流程等。
1. ETL配置工具
    * 可配置数据入库、出库等数据管线；
    * 可配置RSA加密读取接口。

## 开发

1. `pnpm i`
1. `pnpm dev`

## 打包

1. `pnpm build`

## 后端项目

[项目地址](https://github.com/tkliuxing/mps-backend)

## 前端项目示例

[项目地址](https://github.com/tkliuxing/zqgjx-web-os)

## 联系我们

- 微信公众号：内蒙古软件研发共享中心
- ![公众号](https://gongju.nmhuixin.com/qrcode.jpg)
- 邮箱：tkliuxing@163.com
- QQ：418280026

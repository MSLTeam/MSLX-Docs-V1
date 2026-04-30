---
title: MSLX 插件开发规范
createTime: 2026/04/30 23:49:38
permalink: /plugin-dev/init/start/
icon: play
---

## 概要

::: important 第一次写这种文档，如果有写的不好，不明白的地方，可以提出issue / pr修正 / 进群交流。如果觉得项目中提供的方法不够用，无法实现相应的功能，也欢迎来交流～

:::

MSLX 插件目前目前由后端插件+前端UI组件组成。（桌面客户端版本尚在开发中）。

插件开发需要您对 C# 和 Vue 有一定的了解。!!当然，你可以去改模板项目随便玩玩。!!

后端采用的是 ==ASP.NET (C#)== ，前端采用 ==Vue + TDesign + UnoCSS== 。

插件的Github仓库约定规范命名方式为：`mslx-plugin-xxx`。

::: tip MSLX 的前端项目用的TailwindCSS，但是测试发现会存在样式污染，故改换使用UnoCSS。

:::

## 后端开发规范

前端UI与后端的通信均使用 ==标准HTTP接口== 通讯。

路由规范：`/api/plugin/{plugin-id}/[controller]/具体API接口`。

其中 `/api/plugin/{plugin-id}/` 这个前缀 ==不允许== 变更。

## 前端UI开发规范

前端UI目前支持在菜单上新增页面，原有页面插入组件仍在开发中。

在使用CSS务必注意一个原则：==不能污染主项目的样式== 。

Vue组件内的`style`请添加`scope`范围限制。且 ==不应当随意引入全局样式== 。（除非你想尝试通过此方法魔改样式，那么您可以尝试，但是也请确保主项目其他位置UI正常）。

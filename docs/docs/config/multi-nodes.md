---
title: 连接多个节点
createTime: 2026/07/20 23:01:33
permalink: /docs/config/multi-nodes/
icon: circle-nodes
badge:
  text: v1.5.4+
  type: tip
---

## 简介

MSLX自`v1.5.4`版本起试验性的支持在面板端连接多个子节点。主节点和子节点均需要大于等于此版本才支持连接。

::: warning 分布式子节点管理涉及较为复杂的远程通信与网络鉴权，目前**仍处于开发及测试阶段**。此功能仅供测试体验，请**切勿将其直接部署于商业化或关键性生产业务环境**，以规避可能出现的不稳定风险。

:::

![image-20260720231014477](./assets/image-20260720231014477.png)

## 前置条件

需要连接子节点需要满足如下条件：

- 主节点与子节点之间可以完全 ==互相访问==

- 操作者面板可以与主节点和子节点间直接访问

- 子节点如果配置了SSL，必须是 ==有效证书== （不然浏览器会连不上的）

- 如果您的主节点面板配置了SSL，您的全部子节点均需要配置 ==有效证书==

  

## 子节点

子节点需要配置为`子节点模式`才可以被其他节点连接。

### 方法1：启动参数法

使用参数 `--slave` 和 `--linkkey` 。其中 --slave 代表启动子节点模式，--linkkey 为指定子节点连接密钥（非必需）。

最简子节点启动方式：（此方式会随机一个子节点连接密钥）

```shell
MSLX-Daemon --slave
```

指定连接密钥方式：（请确保连接密钥足够复杂）

```shell
MSLX-Daemon --slave --linkkey my-mslx-key-xxxxx-xxxxx
```

启动成功后，软件会在日志和初始信息文件显示当前连接密钥。

### 方法2：手动修改配置文件

找到文件：`DaemonData/Configs/Config.json`。

手动添加配置项，如：

```json
  "IsSlaveMode": true,
  "SlaveLinkKey": "mslx-slave-secret-key-2026",
```


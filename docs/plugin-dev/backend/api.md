---
title: SDK完整接口方法
createTime: 2026/05/19 21:41:11
permalink: /plugin-dev/backend/api/
icon: link
---

## MSLX SDK 接口

MSLX SDK提供的全部API接口方法均存放在命名空间`MSLX.SDK.IServices`和`MSLX.SDK.Interfaces`中。

可以从IDE中直接查看接口定义，也可以前往Github中查询SDK源码中的接口定义。

[MSLX.SDK.Interfaces](https://github.com/MSLTeam/MSLX/tree/dev/MSLX.SDK/Interfaces){.readmore}

[MSLX.SDK.IServices](https://github.com/MSLTeam/MSLX/tree/dev/MSLX.SDK/IServices){.readmore}

## 示例调用

示例：获取全部服务端实例。

```c#
using MSLX.SDK;
SDK.MSLX.Config.Servers.GetServerList();
```


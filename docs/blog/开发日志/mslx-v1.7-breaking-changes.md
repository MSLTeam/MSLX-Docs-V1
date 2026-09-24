---
title: MSLX SDK v1.7 接口变更
createTime: 2026/07/13 13:23:49
permalink: /article/mslx/v1.7-breaking-changes/
tags:
  - 开发日志
---

::: tip 这是什么？
这东西与插件开发相关，如果你发现你看不懂这条信息一点，忽略就行。
:::

## 变更原因
由于原来的 `IMCServerService` DI依赖注入接口混杂了过多进程管理方法，导致代码维护难度升高，故在本版本对原有接口进行了拆分，细分到了不同的依赖注入接口中。由于宿主接口变化，`SDK` 接口方法也需要变动，对于插件开发者来说需要进行更新适配。

## 变更说明
- `IMCServerService` 在 `v1.7` 版本将仍然保留，但将标记为 `待废弃`（提供一个大版本过渡期），并会在 `v1.8` 版本中 ==完全删除== 相关接口。若您的插件调用了相关服务，请尽快完成新接口的适配。
- 在已发布的 `SDK v1.6.4` 版本中新增了 ==事件和生命周期钩子== ，插件可以通过监听生命周期钩子被动获取数据和处理事件，而不需要主动向 `IMCServerService` 依赖注入接口进行查询。

## 一些有用的文档
- `v1.7` 版本主要变动请见：[SDK 完整接口与核心服务](/plugin-dev/backend/api/)
- `v1.6.4` 新增的接口：[事件系统与生命周期钩子](/plugin-dev/backend/events/)
- 不是给人类阅读的：[llms.txt](/llms.txt) | [llms-full.txt](/llms-full.txt)
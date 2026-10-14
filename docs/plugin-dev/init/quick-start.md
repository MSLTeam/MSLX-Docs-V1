---
title: 使用模板创建插件项目
createTime: 2026/10/13 15:20:00
permalink: /plugin-dev/init/quick-start/
icon: rocket
badge:
  text: 推荐
  type: tip
---

## 概述

为了降低插件开发门槛、避免手动克隆示例项目时因漏改元数据而导致路由 404 或前端 CSS 污染，MSLX 官方提供了标准的 **.NET CLI 插件脚手架模板**：`MSLX.Plugin.Templates`。

使用该模板可以快速生成规范的前后端全栈插件工程，自动完成 C# 命名空间、程序集名称、`ApplicationPart` 特性声明、Controller 路由前缀、前端包名及组件标识的替换，并内置了用于发布时自动合并依赖的 `ILRepack` 编译逻辑。

::: tip AI 辅助开发规范 (Agent Skill)
MSLX 官方提供专用的 **插件全栈开发规范与视觉设计系统 Skill**，支持 Codex、Google Antigravity、Cursor、Workbuddy、Trae 等 AI Agent 环境。通过安装该 Skill，可实现工程开发规范注入与静态代码合规性自动审查。

[>>> 查阅接入指南与安装说明 **插件开发 AI SKILL**](/plugin-dev/init/ai-skill/){.read-more}
:::

<RepoCard repo="MSLTeam/mslx-plugin-templates" />

## 1. 安装模板

您可以通过 .NET CLI 直接从 NuGet.org 安装最新的插件模板包：

::: code-tabs
@tab 从 NuGet 安装（推荐）
```bash
dotnet new install MSLX.Plugin.Templates
```

@tab 从本地源码安装
```bash
# 克隆模板仓库后进入目录执行
dotnet new install .
```
:::

安装成功后，在终端运行 `dotnet new list` 或 `dotnet new mslx-plugin -h` 即可看到名为 `mslx-plugin` 的模板。

## 2. 创建插件项目

在终端进入您希望创建项目的父级目录，执行以下命令：

```bash
dotnet new mslx-plugin -n MSLX.Plugin.MyAwesome \
  --plugin-id mslx-plugin-awesome \
  --plugin-name "示例插件" \
  --plugin-author "开发者名称"
```

### 常用参数说明

| 参数 | 简写 | 说明 | 默认值 / 建议规范 |
| :--- | :--- | :--- | :--- |
| `-n, --name` | `-n` | 项目/程序集名称 (PascalCase) | 建议规范：`MSLX.Plugin.插件名` |
| `--plugin-id` | `-pi` | 插件唯一标识符 | 规范：`mslx-plugin-xxx`（全小写+中划线） |
| `--plugin-name` | `-pn` | 插件中文/显示名称 | 如 `我的自定义插件` |
| `--plugin-author`| `-pa` | 插件作者/开发者名称 | 您的常用开发者 ID |
| `--description` | `-de` | 插件描述信息 | 插件的功能简介 |


## 3. 插件核心开发规范

脚手架模板已为您自动配置并固化了以下规范，开发过程中请遵循：

### 插件 ID 与命名规范
- 插件的 ID 必须全局唯一，格式统一为 `mslx-plugin-xxx`。
- 模板已将该 ID 自动同步到后端入口 `MSLXPluginEntry.cs` 的 `Id` 属性、控制器路由前缀以及前端 `Frontend/package.json` 的 `name` 中。

### 后端 API 与路由规范
- **标准 HTTP 通讯**：路由必须遵循统一前缀：
  ```
  /api/plugins/{plugin-id}/[controller]/具体操作
  ```
  其中 `/api/plugins/{plugin-id}/` 前缀受宿主路由网关保护，**严禁变更**。
- **SignalR 实时通讯**：路由规范为：
  ```
  /api/hubs/plugin/{plugin-id}/具体路由
  ```
- **程序集扫描特性**：若插件包含 Controller，入口文件顶部必须声明对应的程序集名称。模板已自动为您生成：
  ```csharp
  [assembly: ApplicationPart("MSLX.Plugin.MyAwesome")]
  ```

### 前端 UI 与样式隔离规范
- 前端技术栈基于 **Vue 3 + TDesign + UnoCSS**。
- **禁止全局样式污染**：Vue 组件内的 `<style>` 请务必添加 `scoped` 范围限制，严禁在插件内随意引入未加作用域的全局 CSS。
- 模板已确保 `Frontend/package.json` 的 `name` 与插件 ID 完全一致，从而保障 UnoCSS 的样式独立隔离。


## 4. 开始开发与调试

创建项目后，进入生成的项目目录：

```bash
cd MSLX.Plugin.MyAwesome
```

### 前端开发与打包

前端项目位于 `Frontend` 目录：

```bash
cd Frontend
pnpm install

# 启动热重载开发调试（包含编译监听与静态预览服务）
pnpm dev:plugin

# 生产环境打包（产物将输出至 Frontend/dist，自动嵌入 C# 程序集）
pnpm build
```

前端插件注册入口位于 `Frontend/src/pluginEntry.ts`，支持注册新的一级菜单路由、子路由以及向宿主现有界面（如实例控制台更多功能下拉框、卡片插槽等）注入扩展组件。

### 后端编译与依赖合并

```bash
# 日常开发构建
dotnet build

# 正式发布打包 (Release)
dotnet build -c Release
```

::: tip ILRepack 自动化合并
模板已在 `.csproj` 中内置了 `ILRepack` 任务。在执行 `Release` 构建时，MSBuild 会自动将插件所引用的第三方依赖库（DLL）完整合并并打包进插件主 DLL 文件中，生成独立可分发的单文件插件。
:::


## 5. 后续参考

- **后端功能开发**：查阅 [插件入口设计](/plugin-dev/backend/entry/) 与 [MSLX.SDK 方法调用](/plugin-dev/backend/functions/)。
- **前端页面与插槽**：查阅 [路由注入](/plugin-dev/frontend/routes/) 与 [组件插槽注入](/plugin-dev/frontend/components/)。
- **插件打包与发布**：查阅 [插件的构建与发布](/plugin-dev/init/publish/)。

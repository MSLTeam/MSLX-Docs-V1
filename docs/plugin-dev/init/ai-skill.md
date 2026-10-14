---
title: 插件开发 AI SKILL
createTime: 2026/10/14 15:45:00
permalink: /plugin-dev/init/ai-skill/
icon: brain
badge:
  text: AI
  type: tip
---

## 概述

为了让智能编程助手（AI Agent）在编写、修改、重构或审计 MSLX 插件时严格遵循官方技术标准，MSLX 官方提供了专用的 **插件全栈开发规范与视觉设计系统 Skill**（npm 包：`@mslteam/mslx-plugin-dev-skill`）。

该 Skill 深度适配 **Codex、Google Antigravity、Cursor、Workbuddy、Trace** 等主流 AI Agent 环境。通过将 MSLX 的前后端架构规范、`.design-card` 视觉规则、双端自适应排版规律以及安全防线约束注入 Agent 上下文，可大幅提升 AI 生成插件代码的原生融入度与稳定性。

<RepoCard repo="MSLTeam/mslx-plugin-dev-skill" />

---

## 快速安装与接入

### 安装 Skill 至当前 Agent

在终端中执行以下命令，即可调用生态安装工具自动检测并将 Skill 部署到您的 AI Agent 工作环境：

::: code-tabs
@tab npm / npx
```bash
npx @mslteam/mslx-plugin-dev-skill install
```

@tab skills CLI
```bash
npx skills add MSLTeam/mslx-plugin-dev-skill
```
:::

安装成功后，Agent 将在涉及 MSLX 插件开发、调试、样式编写或代码审查任务时自动激活对应的指令集与设计规范。

---

## 自动化工程合规审计 (Audit)

除了向 AI 提供上下文指导外，该 Skill 命令行工具还内置了**自动化静态代码检查引擎**。

在插件工程根目录下执行以下命令：

```bash
npx @mslteam/mslx-plugin-dev-skill audit
```

命令行将递归扫描工程内的 Vue 组件与 C# 源码，基于 5 大核心维度执行合规性体检：

1. **宿主视觉契合度**
   - 检查卡片根容器是否声明 `design-card` 类（确保宿主动态注入 `--comp-op-light` 与 `--comp-op-dark` 透明度）。
   - 拦截硬编码纯白背景（`bg-white`、`#ffffff`），防止暗黑模式与毛玻璃壁纸下产生视觉断层。
2. **UnoCSS 语法合规性**
   - 严格拦截在 CSS 变量后追加斜杠透明度（如 `bg-[var(...)]/80`、`border-[var(...)]/60`）的语法错误，防止 UnoCSS 样式解析失败。
3. **样式隔离与无冲突**
   - 校验所有 `.vue` 文件的 `<style>` 标签是否包含 `scoped` 限制。
   - 检查 `uno.config.ts` 是否显式设置 `presetUno({ preflight: false })`，避免覆盖宿主全局排版基础样式。
4. **双端响应式体验**
   - 检查头部操作栏是否采用响应式断点折叠（`flex-col sm:flex-row`）。
   - 检查数据表格（`<t-table>`）外层是否包裹 `overflow-x-auto`，防止在手机屏幕上产生全页横向滚动。
   - 检查 `<t-dialog>` 是否配置 `attach="body"`（防止被父级卡片截断）以及响应式宽度 `min(580px, 92vw)`。
5. **安全防线排查**
   - 校验 C# 控制器路由前缀是否符合 `/api/plugins/{plugin-id}/...` 规范。
   - 校验文件读写是否限定在 `this.Config().GetDataPath()` 沙箱内，排查潜在的路径穿越（`../../`）风险。
   - 检查事件总线（`SDK.MSLX.Events`）监听是否异步化（`Task.Run`），防止耗时任务阻塞宿主主执行流。

---

## 核心规范体系与参考文档

Skill 内部封装了完整的 MSLX 插件全栈开发规范知识库：

| 文档模块 | 内容概述 |
| :--- | :--- |
| **Agent 核心指令 (`SKILL.md`)** | 规范触发时机、5 大开发铁律（Golden Rules）与发布前逐项自检清单。 |
| **视觉设计系统 (`frontend-design-system.md`)** | `.design-card` 底层运作机理、暗黑/亮色模式透明度渗透、PC 与移动端双端断点、TDesign 语义色彩字典。 |
| **前端接入指南 (`frontend-integration.md`)** | 单页与二级菜单路由注册、9 大官方扩展插槽规范、Pinia 宿主状态透传与 `mslxRequest` 自动解包用法。 |
| **后端架构与 SDK (`backend-architecture.md`)** | `IPlugin` 生命周期钩子、`ApplicationPart` 特性声明、异步事件总线订阅、全局任务进度条与跨插件配置联动。 |
| **全方位自我审查指南 (`self-audit-guide.md`)** | 覆盖视觉、样式隔离、双端响应式、高危安全漏洞及生命周期的 5 维度人工复核清单与打分表。 |
| **脚手架与发布流程 (`project-scaffold-publish.md`)** | 官方 .NET CLI 模板使用、`ILRepack` 单文件 DLL 依赖合并构建及官方插件市场发布流程。 |

---

## 生产级标杆示例代码

Skill 内置了 3 份经过生产验证的标杆模板，可作为开发时的参考基准：

- **标杆前端卡片组件 (`examples/DesignCardExample.vue`)**：
  完整实现 `.design-card` 继承、暗黑透明度自适应、头部响应式折叠、统计磁贴网格、搜索过滤工具栏与表格横向防爆容器。
- **标杆前端注册入口 (`examples/pluginEntry.ts`)**：
  规范展示单页菜单路由、宿主现有模块嵌套路由及实例控制台插槽组件注册。
- **标杆 C# 后端入口 (`examples/MSLXPluginEntry.cs`)**：
  展示 `ApplicationPart` 声明、DI 依赖注入服务注册、安全沙箱数据目录初始化以及事件监听异步化处理。

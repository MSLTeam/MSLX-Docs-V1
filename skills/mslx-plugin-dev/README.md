# MSLX Plugin Dev Skill (`@mslteam/mslx-plugin-dev-skill`)

> **MSLX 官方全栈插件开发规范与视觉设计系统 Skill**  
> 专为 AI Agent（Google Antigravity、Claude Code、Cursor、OpenCode 等）与开发者打造，深度沉淀 MSLX 宿主交互契合度、双端自适应响应式布局、`.design-card` 视觉体系复用及自动化工程自检。

---

## 🚀 快速接入 (Installation)

### 方式 1：通过 npm 高速安装（国内推荐，秒速完成）

完全基于 npm 国内镜像源（如 npmmirror），免除 GitHub 网络阻断困扰：

```bash
# 将 Skill 一键安装至当前插件工程（同时生成可见目录与 Agent 识别目录）
npx @mslteam/mslx-plugin-dev-skill install

# 或指定自定义安装路径
npx @mslteam/mslx-plugin-dev-skill install ./my-agent/skills
```

### 方式 2：直接在插件工程中执行自动化体检审计 (Audit)

无需安装，在任意 MSLX 插件工程根目录下直接运行：

```bash
npx @mslteam/mslx-plugin-dev-skill audit
```

### 方式 3：通过 GitHub 官方生态一键安装 (海外环境)

符合 [skills.sh](https://skills.sh/) 规范：

```bash
npx skills add MSLTeam/MSLX-Docs-V1 --skill mslx-plugin-dev
```

---

## 📖 核心知识库与规范清单

| 文档模块 | 重点说明 |
| :--- | :--- |
| **[SKILL.md](./SKILL.md)** | **Agent 核心指令与开发铁律**：触发时机、开发全流程索引、开发五大铁律与发布前自检。 |
| **[self-audit-guide.md](./references/self-audit-guide.md)** | **全方位自我审查指南**：宿主视觉契合度、无冲突样式隔离、双端响应式、高危安全漏洞防御 5 大维度检查表。 |
| **[frontend-design-system.md](./references/frontend-design-system.md)** | **前端视觉规范**：`design-card` 运作机理、暗黑模式透明度注入、PC/移动端断点、TDesign 语义色彩字典。 |
| **[frontend-integration.md](./references/frontend-integration.md)** | **前端接入指南**：单页/多页路由、9 大扩展插槽规范、Pinia 状态透传与 `mslxRequest` 自动解包。 |
| **[backend-architecture.md](./references/backend-architecture.md)** | **后端架构与 SDK**：`IPlugin` 生命周期、`SDK.MSLX.Events` 异步化、全局任务进度条、跨插件配置联动。 |
| **[project-scaffold-publish.md](./references/project-scaffold-publish.md)** | **脚手架与发布流程**：`.NET` 模板脚手架、`ILRepack` 单文件合并编译与插件市场审核流程。 |

---

## 🧩 标杆代码工程 (Production-ready Examples)

在 `examples/` 目录下提供了生产级开箱即用的代码模板：
- **`examples/DesignCardExample.vue`**：完整复用 `.design-card`、完美适配暗黑透明度、双端自适应（PC 横排 / 手机纵向折叠）、统计网格与操作工具栏。
- **`examples/pluginEntry.ts`**：标准前端插件注册入口，包含单页路由、宿主子菜单注入与扩展插槽注册。
- **`examples/MSLXPluginEntry.cs`**：规范 C# 插件后端入口，包含生命周期钩子、`ApplicationPart` 特性、事件异步订阅与安全沙箱数据目录初始化。

---

## 🤝 贡献与自动化更新

本项目托管于 [MSLX-Docs-V1](https://github.com/MSLTeam/MSLX-Docs-V1) 仓库中。当 `skills/mslx-plugin-dev/` 目录的代码更新并推送至 `main` 分支时，GitHub Actions 会自动递增 Patch 版本并发布最新版本至 npm 官方仓库。

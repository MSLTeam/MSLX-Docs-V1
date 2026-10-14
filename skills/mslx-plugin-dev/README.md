# MSLX Plugin Dev Skill (`@mslteam/mslx-plugin-dev-skill`)

> **MSLX 官方全栈插件开发规范与视觉设计系统 Skill**  
> 专为 AI Agent（Google Antigravity、Claude Code、Cursor、Windsurf 等）与开发者打造，深度沉淀 MSLX 宿主交互契合度、双端自适应响应式布局、`.design-card` 视觉体系复用及自动化工程自检。

---

## 安装与接入 (Installation)

### 方式一：默认安装（联动 skills.sh 官方工具，推荐）

运行 `install` 命令时，默认直接调用 [skills.sh](https://skills.sh/) 官方工具，支持交互式选择目标 Agent（Claude Code、Cursor、Antigravity、Windsurf 等）；若检测到网络受限或执行异常，将自动降级为本地包直接部署：

```bash
# 默认交互式安装至目标 Agent（支持透传官方参数）
npx @mslteam/mslx-plugin-dev-skill install

# 亦可直接执行 skills.sh 原生命令
npx skills add MSLTeam/MSLX-Docs-V1 --skill mslx-plugin-dev
```

### 方式二：本地离线直装模式

在无网络或 GitHub 连接受限的环境下，可通过 `--local` 选项直接将 npm 包内置的规范部署至工作区（同时同步至通用公开目录及主流 Agent 技能目录）：

```bash
# 本地免网络直接部署至各 Agent 目录
npx @mslteam/mslx-plugin-dev-skill install --local

# 或指定自定义安装路径
npx @mslteam/mslx-plugin-dev-skill install ./my-agent/skills --local
```

### 方式三：直接执行工程规范自检 (Audit)

无需在项目中部署技能目录，在任意 MSLX 插件工程根目录下直接运行：

```bash
npx @mslteam/mslx-plugin-dev-skill audit
```

---

## 核心知识库与规范清单

| 文档模块 | 重点说明 |
| :--- | :--- |
| **[SKILL.md](./SKILL.md)** | **Agent 核心指令与开发准则**：触发时机、开发全流程索引、核心开发准则与发布前自检。 |
| **[self-audit-guide.md](./references/self-audit-guide.md)** | **全方位自我审查指南**：宿主视觉契合度、无冲突样式隔离、双端响应式、高危安全漏洞防御 5 大维度检查表。 |
| **[frontend-design-system.md](./references/frontend-design-system.md)** | **前端视觉规范**：`design-card` 运作机理、暗黑模式透明度注入、PC/移动端断点、TDesign 语义色彩字典。 |
| **[frontend-integration.md](./references/frontend-integration.md)** | **前端接入指南**：单页/多页路由、9 大扩展插槽规范、Pinia 状态透传与 `mslxRequest` 自动解包。 |
| **[backend-architecture.md](./references/backend-architecture.md)** | **后端架构与 SDK**：`IPlugin` 生命周期、`SDK.MSLX.Events` 异步化、全局任务进度条、跨插件配置联动。 |
| **[project-scaffold-publish.md](./references/project-scaffold-publish.md)** | **脚手架与发布流程**：`.NET` 模板脚手架、`ILRepack` 单文件合并编译与插件市场审核流程。 |

---

## 标杆示例工程 (Production-ready Examples)

在 `examples/` 目录下提供了生产级代码模板：
- **`examples/DesignCardExample.vue`**：完整复用 `.design-card`、适配暗黑透明度、双端自适应（PC 横排 / 手机纵向折叠）、统计网格与操作工具栏。
- **`examples/pluginEntry.ts`**：标准前端插件注册入口，包含单页路由、宿主子菜单注入与扩展插槽注册。
- **`examples/MSLXPluginEntry.cs`**：规范 C# 插件后端入口，包含生命周期钩子、`ApplicationPart` 特性、事件异步订阅与安全沙箱数据目录初始化。

---

## 维护与自动化更新

本项目托管于 [MSLX-Docs-V1](https://github.com/MSLTeam/MSLX-Docs-V1) 仓库中。当 `skills/mslx-plugin-dev/` 目录的代码更新并推送至 `master` 分支时，GitHub Actions 会自动递增 Patch 版本并通过 Trusted Publishing (OIDC) 发布至 npm 官方仓库。

---
title: 新增菜单路由
createTime: 2026/05/13 12:59:21
permalink: /plugin-dev/frontend/routes/
icon: compass
---

## 概述

MSLX 的插件系统允许您在网页控制台的前端新增菜单路由，效果如下：

![image-20260513131018757](./assets/image-20260513131018757.png)

新增的菜单配置均在插件的 ==入口文件== 中导出的 `pluginConfig` 集合中的 `routes` 数组。

具体示例可参考 ==mslx-plugin-demo== 插件的插件入口示例：[mslx-plugin-demo/Frontend/src/pluginEntry.ts at main · MSLTeam/mslx-plugin-demo](https://github.com/MSLTeam/mslx-plugin-demo/blob/main/Frontend/src/pluginEntry.ts)

## 新增一级菜单

:::: field-group

::: field name="path" type="string" required
新增的路由地址
:::

::: field name="name" type="string" required
路由名字（建议带上插件名字，以防和其他插件或宿主冲突）
:::

::: field name="component" type="string" required default="HOST_LAYOUT"
新增一级菜单请填写 ==HOST_LAYOUT== 即可
:::

::: field name="meta.title" type="string" required
新增的菜单标题
:::

::: field name="meta.icon" type="string" required
新增菜单的icon （仅支持使用tdesign的icon组件哦）
:::

::: field name="meta.roleCode" type="array"
新增菜单的可见范围，默认是所有用户可见
:::

::: field name="children[0].path" type="string" required
新增的路由地址（因为是新增一级菜单，这里一般留空即可）
:::

::: field name="children[0].name" type="string" required
子路由名字（建议带上插件名字，以防和其他插件或宿主冲突）
:::

::: field name="children[0].component" type="string" required
插入的组件（需要在插件入口顶部Import相应组件）
:::

::: field name="children[0].meta.title" type="string" required
新增的菜单标题
:::

::: field name="children[0].meta.hidden" type="boolean" required
由于是只有一级菜单，这里直接填 `true`。（注：将子路由设为 hidden 是为了在侧边栏仅显示一级菜单项，而点击时渲染该子路由组件。）
:::

::: field name="children[0].meta.roleCode" type="array"
新增菜单的可见范围，默认是所有用户可见
:::

::::

```ts
        {
            path: '/plugin-single',
            name: 'PluginSingleBase',
            component: 'HOST_LAYOUT',
            meta: { title: '插件单页', icon: 'app', roleCode: ['admin', 'user'] },
            children: [
                {
                    path: '',
                    name: 'PluginSingle',
                    component: DemoPage,
                    meta: { title: '插件单页', hidden: true, roleCode: ['admin', 'user'] },
                },
            ],
        },
```

## 新增一级和二级菜单

:::: field-group

::: field name="path" type="string" required
新增的一级路由前缀地址
:::

::: field name="name" type="string" required
一级路由名字（建议带上插件名字，以防和其他插件或宿主冲突）
:::

::: field name="component" type="string" required default="HOST_LAYOUT"
新增一级菜单请填写 ==HOST_LAYOUT== 即可
:::

::: field name="meta.title" type="string" required
新增的一级菜单标题
:::

::: field name="meta.icon" type="string" required
新增一级菜单的icon （仅支持使用tdesign的icon组件哦）
:::

::: field name="meta.roleCode" type="array"
新增一级菜单的可见范围，默认是所有用户可见
:::

::: field name="children[i].path" type="string" required
新增的二级菜单路由地址
:::

::: field name="children[i].name" type="string" required
二级菜单路由名字（建议带上插件名字，以防和其他插件或宿主冲突）
:::

::: field name="children[i].component" type="string" required
插入的组件（需要在插件入口顶部Import相应组件）
:::

::: field name="children[i].meta.title" type="string" required
新增的二级菜单标题
:::

::: field name="children[i].meta.icon" type="string"
新增二级菜单的icon （仅支持使用tdesign的icon组件哦）
:::

::: field name="children[i].meta.roleCode" type="array"
新增菜单的可见范围，默认是所有用户可见
:::

::::

```ts
        {
            path: '/plugin-multi',
            name: 'PluginMultiBase',
            component: 'HOST_LAYOUT',
            meta: { title: '插件多页', icon: 'layers', roleCode: ['admin', 'user'] },
            children: [
                {
                    path: 'page-a',
                    name: 'PluginMultiA',
                    component: DemoPage,
                    meta: { title: '子页面A', roleCode: ['admin', 'user'] },
                },
                {
                    path: 'page-b',
                    name: 'PluginMultiB',
                    component: DemoPage,
                    meta: { title: '子页面B', roleCode: ['admin', 'user'] },
                },
            ],
        },
```

## 插入原有一级菜单

:::: field-group

::: field name="parentName" type="string" required
需要插入的一级菜单的名字，可以在这里查询可选值，下面也列出来常见的三个一级菜单：

[MSLX/MSLX.WebPanel/src/router/modules at dev · MSLTeam/MSLX](https://github.com/MSLTeam/MSLX/tree/dev/MSLX.WebPanel/src/router/modules)

- `instance` (服务端管理)
- `frp` (隧道管理)
- `settingsBase` (设置)

:::

::: field name="path" type="string" required
插入的二级菜单路由地址
:::

::: field name="name" type="string" required
路由名字（建议带上插件名字，以防和其他插件或宿主冲突）
:::

::: field name="component" type="string" required
导入组件（记得import哦）
:::

::: field name="meta.title" type="string" required
新增的二级路由菜单标题
:::

::: field name="meta.icon" type="string" required
新增二级菜单的icon （仅支持使用tdesign的icon组件哦）
:::

::: field name="meta.roleCode" type="array"
新增菜单的可见范围，默认是所有用户可见
:::

::::

```ts
        {
            parentName: 'instance',
            path: 'plugin-extra',
            name: 'PluginNestedSetting',
            component: DemoPage,
            meta: { title: '插件子菜单', icon: 'control-platform', roleCode: ['admin', 'user'] },
        }
```

---

## 新增免登录全屏独立页面 <Badge type="tip" text="1.7.3" />

适用于向外部普通玩家公开展示的**全屏单页**（如网页世界地图、对外服务器大屏看板、状态大屏等）。此类页面**不包含**宿主顶部 Header 导航栏与侧边 SideNav 菜单，且**允许未登录访客直接访问**。

### 1. 后端声明公开能力契约
插件 C# 入口类（`MSLXPluginEntry.cs`）中覆写 `HasPublicPages` 声明拥有公开页面：

```csharp
public class MSLXPluginEntry : IPlugin
{
    // ... 原有元数据 ...
    public bool HasPublicPages => true; // 声明包含免登录公开页面
}
```

### 2. 前端路由配置 (`pluginEntry.ts`)

为了让公开页面享受 MSLX 的背景壁纸、右上角明暗模式切换按钮以及 `.design-card` 高质感磨砂半透明卡片样式，推荐在顶层使用 ==PLUGINS_PUBLIC_LAYOUT== 专属公共布局：

```ts
import PublicWhitelistPage from './views/PublicWhitelistPage.vue';

export const pluginConfig: PluginConfig = {
    name: 'MSLX.Plugin.QqWhitelist',
    version: '1.0.0',
    routes: [
        {
            path: '/public/whitelist',
            component: 'PLUGINS_PUBLIC_LAYOUT', // 核心：使用公共页面专属布局，自动继承 design-card 与壁纸
            children: [
                {
                    path: '',
                    name: 'PublicWhitelist',
                    component: PublicWhitelistPage,
                    meta: {
                        title: '自助申请白名单',
                        anonymous: true, // 核心：声明支持免登录公开访问
                        hidden: true,    // 隐藏在后台侧边菜单之外
                    },
                },
            ],
        },
    ],
};
```

在 `PublicWhitelistPage.vue` 中，直接使用 `.design-card` 类名即可自动获得磨砂半透明背景、发光边框以及明暗色模式的自动联动：

```vue
<template>
  <div class="flex items-center justify-center p-6 min-h-screen">
    <div class="design-card max-w-md w-full p-8 rounded-3xl">
      <h2>玩家白名单自助申请</h2>
      <t-input placeholder="请输入游戏角色名" />
    </div>
  </div>
</template>
```

::: tip 纯原生全屏页面（不包任何布局）
若您的公开页面是完全自绘的独立大屏（如三维地图 WebGL Canvas 或嵌入式 Iframe），不需要 MSLX 的背景壁纸与卡片样式，也可以直接以 Vue 组件作为根 `component`（不包 `PLUGINS_PUBLIC_LAYOUT`）或使用 `HOST_BLANK_LAYOUT`。
:::

::: tip 宿主管理员可配置开关
为保障服务器安全，只有在宿主管理员于「插件管理」界面开启该插件的 **“公开页面”** 开关后，外部未登录玩家方可访问该页面。管理员可随时在后台一键切断或放行外部访问。
:::



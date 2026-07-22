---
title: 宿主 API 与状态透传
createTime: 2026/07/22 19:00:00
permalink: /plugin-dev/frontend/host-api/
icon: code
---

## 概述

MSLX 宿主项目在全局 `window` 对象上暴露了底层核心依赖库、请求实例及 Pinia 状态库。插件可以在前端代码中直接通过 `window` 对象（或导入 `mslx-request` 机制）直接调用宿主的能力。

前端 Demo 完整示例代码参见：[mslx-plugin-demo/DemoPage.vue](https://github.com/MSLTeam/mslx-plugin-demo/blob/main/Frontend/src/views/DemoPage.vue)

## 宿主暴露的全局对象

宿主在入口打包时挂载了以下全局属性：

```ts
(window as any).Vue = Vue;
(window as any).VueRouter = VueRouter;
(window as any).Pinia = Pinia;
(window as any).TDesign = TDesign;
(window as any).mslxRequest = request;
(window as any).MSLX_Stores = MSLXStores;
```

---

## 宿主 Pinia 状态库 (MSLX_Stores)

插件可以通过 `(window as any).MSLX_Stores` 读取宿主挂载的所有 Pinia Store。

### 宿主 Pinia Store 完整清单

| Store 名称 | 导出的 Hook / 函数 | 作用与内部常用状态/方法 |
| :--- | :--- | :--- |
| **user** | `useUserStore()`, `getUserStore()` | **用户与系统状态**：`userInfo`（包含用户名 `name`、头像 `avatar`、角色 `roles`、操作系统 `systemInfo`）、`token`、`baseUrl`、`isAdmin`、`getUserInfo()`、`logout()` 等。 |
| **setting** | `useSettingStore()`, `getSettingStore()` | **外观与主题**：`mode` ('dark' \| 'light' \| 'auto')、`displayMode`、`brandTheme` (主色调)、`changeMode()`、`updateConfig()` 等。 |
| **permission** | `usePermissionStore()`, `getPermissionStore()` | **路由权限管理**：`routers` (已授权路由列表)、`whiteListRouters`、`initRoutes()`、`clearRoutes()` 等。 |
| **webpanel** | `useWebpanelStore()` | **面板样式与文件上传**：`settings` (背景透明度、毛玻璃模糊度等)、`uploadImage(file)` 文件上传等。 |
| **instance** | `useInstanceListStore()` | **实例列表**：`instanceList` (全量实例数组)、`totalInstanceCount`、`onlineInstanceCount`、`refreshInstanceList()` 等。 |
| **frp** | `useTunnelsStore()` | **FRP 隧道列表**：`frpList` (隧道列表数组)、`getTunnels()` 刷新数据等。 |
| **node** | `useNodeStore()` | **子节点管理**：`slaveNodes` (节点列表)、`activeNodeId` (当前激活节点)、`setActiveNode()`、`fetchNodes()` 等。 |
| **pluginUI** | `usePluginUIStore()` | **插件 UI 扩展槽**：`extensions` 插槽注册表、`registerExtension()` 等。 |
| **update** | `useUpdateStore()` | **主程序更新**：`updateInfo` (最新版本信息)、`checkAppUpdate()` 等。 |

### 代码示例：获取当前登录用户信息

```ts
import { computed } from 'vue';

// 1. 获取宿主状态集合
const stores = (window as any).MSLX_Stores;

// 2. 调用对应的 store
const userStore = stores?.getUserStore?.() || stores?.useUserStore?.();

// 3. 结合 computed 绑定状态
const userInfo = computed(() => userStore?.userInfo || { name: '未登录', avatar: '' });
const isAdmin = computed(() => userStore?.isAdmin || false);

console.log('当前登录用户:', userInfo.value.name);
```

### 代码示例：获取并刷新服务端实例列表

```ts
const stores = (window as any).MSLX_Stores;
const instanceStore = stores?.useInstanceListStore?.();

// 刷新实例列表数据
await instanceStore?.refreshInstanceList();

console.log('总实例数:', instanceStore?.totalInstanceCount);
console.log('在线实例列表:', instanceStore?.instanceList);
```

---

## 宿主请求实例 (mslxRequest / request)

宿主将配置好的 Axios 实例挂载在 `(window as any).mslxRequest` 上（插件项目通常可以通过 `import request from 'mslx-request'` 引用）。

::: tip 自动解包说明
宿主内置了响应拦截器（`transformRequestHook`）。当后端接口返回标准的 `{ code: 200, data: ..., message: ... }` 格式时，`request.get/post` **会自动解包并直接返回 `data` 字段**。在插件调用时**直接接收 `res` 即可拿到目标数据，无需再写 `res.data`**。
:::

### 类型定义

#### 1. RequestOptions (请求配置扩展参数)

```ts
export interface RequestOptions {
  apiUrl?: string;
  isJoinPrefix?: boolean;
  urlPrefix?: string;
  joinParamsToUrl?: boolean;
  formatDate?: boolean;
  isTransformResponse?: boolean;
  isReturnNativeResponse?: boolean;
  ignoreRepeatRequest?: boolean;
  joinTime?: boolean;
  withToken?: boolean;
  /**
   * 是否发送到子节点，默认为 'auto'。
   * - 'auto': 自动通过正则匹配路径 (如 /instance/, /files/, /frp/ 等) 判定是否路由到当前激活的子节点。
   * - true: 强制路由到当前激活的子节点。
   * - false: 强制发送到主节点。
   */
  requestToSlaveNode?: boolean | 'auto';
  retry?: {
    count: number;
    delay: number;
  };
}
```

#### 2. Result\<T\> (后端原始标准响应结构)

后端接口在服务端返回的标准格式定义如下（宿主拦截器会在 `code === 200` 时自动抽取 `data` 属性）：

```ts
export interface Result<T = any> {
  code: number;
  data: T;
  message?: string;
}
```

#### 3. AxiosRequestConfigRetry (配置重试扩展)

```ts
import { AxiosRequestConfig } from 'axios';

export interface AxiosRequestConfigRetry extends AxiosRequestConfig {
  retryCount?: number;
}
```

### 代码示例：发起 GET 请求

```ts
import request from 'mslx-request'; 
// 或 const request = (window as any).mslxRequest;

const fetchDemoData = async () => {
  try {
    // 宿主拦截器已自动解包解出 data，res 直接为接口数据本体
    const res = await request.get<DemoData>({
      url: '/api/plugins/mslx-plugin-demo/demo'
    });
    
    // 直接使用 res，不需要写 res.data
    console.log('数据内容:', res);
  } catch (err: any) {
    console.error('请求失败:', err.message);
  }
};
```

### 代码示例：发起 POST 请求（配置子节点路由与重试）

```ts
import request from 'mslx-request';

const submitPluginConfig = async (data: Record<string, any>) => {
  try {
    const res = await request.post({
      url: '/api/plugins/mslx-plugin-demo/config',
      data,
    }, {
      // requestToSlaveNode 默认为 'auto'；若需强制请求主节点可设为 false
      requestToSlaveNode: false, 
      retry: {
        count: 3,  // 失败自动重试 3 次
        delay: 1000 // 重试延迟 1000ms
      }
    });
    console.log('提交成功，响应数据:', res);
  } catch (err) {
    console.error('提交失败:', err);
  }
};
```

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
(window as any).MSLX_NodeContext = { create: createPluginNodeContext, use: usePluginNodeContext }; // 节点上下文工具 (v1.7.6+)
```

---

## 宿主 Pinia 状态库 (MSLX_Stores)

插件可以通过 `(window as any).MSLX_Stores` 读取宿主挂载的所有 Pinia Store。

### 宿主 Pinia Store 完整清单

| Store 名称 | 导出的 Hook / 函数 | 作用与内部常用状态/方法 |
| :--- | :--- | :--- |
| **user** | `useUserStore()`, `getUserStore()` | **用户与系统状态**：`userInfo`（包含用户名 `name`、头像 `avatar`、角色 `roles`、操作系统 `systemInfo`）、`token`、`baseUrl`、`isAdmin`、`getUserInfo()`、`logout()`；媒体与下载降权凭据 <Badge type="tip" text="1.7.3" />：`getMediaToken()`、`getSyncMediaToken()`、`getMediaTokenParam()`、`getDownloadToken()`、`getSyncDownloadToken()`。 |
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

### 代码示例：获取媒体资源凭据 (Media Token) <Badge type="tip" text="1.7.3" />

在插件中展示实例世界地图切片、皮肤/头像等受保护媒体资源时，推荐通过 `userStore` 获取降权媒体凭据（Media Token），避免直接暴露管理员主凭据：

```ts
const stores = (window as any).MSLX_Stores;
const userStore = stores?.getUserStore?.() || stores?.useUserStore?.();

// 方式 1：一键获取查询参数字符串（优先使用 ?media_token=xxx，无则回退 ?x-user-token=yyy）
const tokenParam = userStore?.getMediaTokenParam?.() || '';
const tileUrl = `${userStore?.baseUrl}/api/plugin/mslx-plugin-map-render/map/1/0/0${tokenParam}`;

// 方式 2：异步获取最新有效的媒体凭据（支持自动过期刷新与防并发）
const mediaToken = await userStore?.getMediaToken?.();

// 方式 3：同步读取当前缓存的媒体凭据
const cachedMediaToken = userStore?.getSyncMediaToken?.();
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
      url: '/api/plugin/mslx-plugin-demo/demo'
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
      url: '/api/plugin/mslx-plugin-demo/config',
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

---

## 节点上下文工具 (MSLX_NodeContext) <Badge type="tip" text="1.7.6+" />

### 1. 为什么需要节点上下文？

从 MSLX `v1.7.6` 起，面板正式支持了分布式子节点的插件适配与运行（页面通过 `?node=<id>` 切换目标节点）。

在多节点环境下：
- **痛点 1：地址与 Token 错位**。若插件前端直接读取 `useUserStore().baseUrl` 或 `useUserStore().token`，得到的是**主节点**的基础地址与主 Token。当用户在子节点页面操作时，请求或 WebSocket 会被错误发往主节点，或因跨节点凭据无效而鉴权失败。
- **痛点 2：SignalR 复杂连接与自动重连**。旧插件如果自行创建 `new HubConnectionBuilder().withUrl(...)`，无法获取子节点的动态连接凭据（`accessTokenFactory`），更无法随节点切换正确建立连接。
- **痛点 3：生命周期悬挂与内存泄漏**。当用户在多个节点之间快速切换或离开插件页面时，自建的连接和请求如果未手动取消，会残留大量“僵尸 Hub”和在途请求。

为此，MSLX 宿主向全局暴露了 `(window as any).MSLX_NodeContext`，作为插件的**固定节点工具入口**。宿主通过 Vue 的依赖注入（Provide / Inject）机制，自动将当前组件与目标节点上下文深度绑定。

::: tip 开发者可自由选择是否适配多节点（完全可选）
多节点适配并非强制要求。如果您的插件功能属于仅在主节点运行的全局业务，或者暂时不想做多节点适配，**无需改动前端代码**。只需在后端 C# 入口声明：
```csharp
public PluginMultiNodeSupport SupportsMultiNode => PluginMultiNodeSupport.Unsupported;
```
声明为 `Unsupported`（对应元数据 `"false"`）后，宿主在用户访问子节点时会**自动跳过加载该插件的前端**，并在插件管理页面标记「仅主节点界面」，从根本上避免跨节点报错。
:::

---

### 2. 两个核心方法：`use()` 与 `create()`

```ts
const { use, create } = (window as any).MSLX_NodeContext;
```

| 方法 | 调用时机与环境 | 生命周期与清理机制 | 推荐场景 |
| :--- | :--- | :--- | :--- |
| **`use()`** | 在插件 Vue 组件的 `setup()`（或 `<script setup>`）顶层调用 | **宿主全自动清理**：组件销毁（`onBeforeUnmount`）时，宿主自动终止该上下文中正在发起的 HTTP 请求（AbortController），并自动停止所有由此创建的 SignalR Hub 连接 | **99% 的插件组件开发场景（强烈推荐）** |
| **`create(nodeId?, pluginId?)`** | 在组件之外、独立 SDK 工具函数或特定多节点交互逻辑中手动调用 | **必须自行手动调用 `dispose()` 释放**。如果不主动 `dispose()`，可能导致请求和连接持续驻留 | 跨节点批量拉取数据、后台独立轮询等高级场景 |

---

### 3. 上下文对象核心能力

通过 `const node = (window as any).MSLX_NodeContext.use()` 获取到的 `node` 实例提供以下能力：

#### 3.1 相对 API 请求客户端 (`node.request`)
提供 `request`、`get`、`post`、`put`、`patch`、`delete` 方法：
- **仅接受相对 API 地址**：例如 `/api/plugin/mslx-plugin-demo/info`，传入绝对路径（带有协议或 `//`）会直接抛出异常；
- **自动定向至目标节点**：请求会自动附加 `targetNodeId: nodeId`，指向当前激活的子节点；
- **继承自动解包特性**：接口返回 `{ code: 200, data: ... }` 时，直接返回 `data` 本地数据；
- **自动绑定取消信号**：内置 `AbortController.signal`，组件离开时自动取消在途请求；
- **参数覆写**：若在第二参数显式传入 `{ requestToSlaveNode: false }` 或特定的 `targetNodeId`，依然享有最高优先级。

```ts
const node = (window as any).MSLX_NodeContext.use();

// 发起 GET 请求
const info = await node.request.get({ url: '/api/plugin/my-plugin/status' });

// 发起 POST 请求
await node.request.post({ 
  url: '/api/plugin/my-plugin/config', 
  data: { enabled: true } 
});
```

#### 3.2 节点托管 SignalR 连接 (`node.createHub`)
创建专属于当前节点的 SignalR 连接对象：
- **自动解析节点地址与凭据**：根据当前节点，自动计算正确的 BaseUrl、`x-node-id` 参数与动态 Token 获取工厂（`accessTokenFactory`）；
- **内置自动重连**：默认配置了 `.withAutomaticReconnect()`；
- **生命周期托管**：创建的 Hub 会被加入节点的托管集合，组件销毁时宿主自动调用 `hub.stop()`，无需开发者在 `onBeforeUnmount` 中逐一清理。

::: warning 业务重连与分组订阅仍由插件负责
`node.createHub()` 负责底层的连接建立、子节点 Token 协商与自动重连底座。但 **SignalR 连接成功后的业务逻辑（例如重连后重新调用 `hub.invoke('JoinGroup', ...)` 重新加入房间或分组）仍需由插件自行处理**。
此外，宿主将工具公开给插件后，旧插件中自己拼装 SignalR 地址的代码不会自动变更，需开发者主动迁移。
:::

#### 3.3 节点专属降权资源 URL (`node.resourceUrl`)
针对当前节点，异步生成附带降权凭据的完整媒体或下载 URL：
- `scope: 'media'`（默认）：获取当前节点的 `media_token`，生成适用于 `<img>`、`<video>` 或地图切片的链接；
- `scope: 'download'`：获取当前节点的 `download_token`，生成适用于大文件、备份导出的下载链接；
- 后端仍需在对应接口上声明 `[AllowTokenScope(TokenScopes.Media)]` 或 `TokenScopes.Download`。

```ts
// 获取媒体资源 URL
const imageUrl = await node.resourceUrl('/api/plugin/my-plugin/cover.png', 'media');

// 获取下载资源 URL
const downloadUrl = await node.resourceUrl('/api/plugin/my-plugin/export.zip', 'download');
```

#### 3.4 节点基础信息与手动销毁
- `node.nodeId`：当前绑定的节点 ID（主节点为 `'local'`，子节点为对应 ID 字符串）；
- `node.pluginId`：当前插件 ID；
- `node.getTarget()`：获取当前节点的详细目标信息（包含 `baseUrl`、`name` 等）；
- `node.dispose()`：显式注销当前上下文，中断所有未完成请求并断开全部关联 Hub。

---

### 4. 实战代码示例：以 STUN 隧道插件为例

以下演示如何在插件组件内优雅接入多节点 SignalR 实时监控与 API 调用：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

// 1. 在 setup 中获取当前挂载的节点上下文
const node = (window as any).MSLX_NodeContext?.use();

const runningStatus = ref<any>(null);
let hubConnection: any = null;

// 2. 发起当前节点的 HTTP 请求
const loadPluginData = async () => {
  try {
    const data = await node.request.get({
      url: '/api/plugin/mslx-plugin-stun/status'
    });
    runningStatus.value = data;
  } catch (err: any) {
    MessagePlugin.error(`获取状态失败: ${err.message}`);
  }
};

// 3. 建立适配当前节点的 SignalR 连接
const initSignalR = async () => {
  if (!node) return;

  // 使用 node.createHub 传入相对路由，地址、凭据与子节点鉴权均由宿主自动处理
  const hub = node.createHub('/api/hubs/plugin/mslx-plugin-stun/stun');
  hubConnection = hub;

  // 监听服务端推送事件
  hub.on('TrafficUpdate', (data: any) => {
    console.log('接收到当前节点的流量推送:', data);
  });

  // 处理重连成功后的业务分组重新订阅
  hub.onreconnected(async (connectionId?: string) => {
    console.log('SignalR 重连成功，重新加入业务组...', connectionId);
    try {
      await hub.invoke('SubscribeTunnelTraffic', 'default');
    } catch (e) {
      console.error('重新订阅失败:', e);
    }
  });

  try {
    await hub.start();
    // 首次连接成功后加入业务组
    await hub.invoke('SubscribeTunnelTraffic', 'default');
    console.log('STUN SignalR 连接成功！');
  } catch (err) {
    console.error('SignalR 连接失败:', err);
  }
};

onMounted(() => {
  loadPluginData();
  initSignalR();
  // 注意：无需在 onBeforeUnmount 中手动 hub.stop() 或 abort 请求，宿主在组件销毁时会自动清理 node 上的全部连接与请求！
});
</script>

<template>
  <div class="design-card p-5">
    <h3>当前运行节点: {{ node?.nodeId }}</h3>
    <div>状态: {{ runningStatus }}</div>
  </div>
</template>
```

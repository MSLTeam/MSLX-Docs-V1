---
title: 插件入口声明
createTime: 2026/07/13 13:49:34
permalink: /plugin-dev/entry/
icon: arrow-right-to-bracket
---

## 插件入口完整示例

这是 STUN 插件的入口文件。（部分方法需要 `V1.5.2+` 版本的MSLX支持）。详细说明见后文。

入口文件主要是从 `MSLX.SDK` 导出 `IPlugin` 对象然后填写相关的信息和实现相关声明周期方法。

```c#
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using MSLX.Plugin.Stun.Hubs;
using MSLX.Plugin.Stun.Managers;
using MSLX.SDK;

[assembly: ApplicationPart("MSLX.Plugin.Stun")]

namespace MSLX.Plugin.Stun;

public class MSLXPluginEntry : IPlugin
{
    public static MSLXPluginEntry Instance { get; private set; } = null!;
    public string Id => "mslx-plugin-stun";
    public string Name => "STUN 隧道";
    public string Description => "利用 STUN 技术，在 NAT1 环境下获取公网端口，支持多开与流量监控。";
    public string Version => "1.0.2";
    public string Icon => "icon.png";
    public string MinSDKVersion => "1.5.2";
    public string Developer => "xiaoyu";
    public string AuthorUrl => "https://github.com/luluxiaoyu";
    public string PluginUrl => "https://mslx-plugins.mslmc.net/plugins/mslx-plugin-stun";

    public void OnPluginInitialize(IServiceProvider serviceProvider)
    {
        Instance = this;
        SDK.MSLX.Logger.Info("[STUN] 隧道插件开始初始化...");

        string dataDir = this.Config().GetDataPath();
        if (!Directory.Exists(dataDir)) Directory.CreateDirectory(dataDir);

        var tunnelManager = serviceProvider.GetRequiredService<StunTunnelManager>();
        tunnelManager.Initialize(dataDir);

        SDK.MSLX.Logger.Info($"[STUN] 插件载入成功，当前已加载 {tunnelManager.GetConfigs().Count} 个隧道配置。");
    }

    /*
    public void OnUnload()
    {
    } */

    public void OnRegisterEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapHub<StunHub>("/api/hubs/plugins/mslx-plugin-stun/stun");
    }

    public void OnRegisterServices(IServiceCollection services)
    {
        services.AddSingleton<StunTunnelManager>();
    }
}
```

## 插件入口元数据

:::: field-group

::: field Id
@type string
@required

插件的唯一ID，格式为`mslx-plugin-xxx`
:::

::: field Name
@type string

@required

插件名字
:::

::: field Description
@type string

@default 这个开发者很懒，什么都没写。

插件描述
:::

::: field Version
@type string

@required

插件版本号

:::

::: field Icon
@type string

@default https://www.mslmc.cn/logo.png

插件图标，支持在线地址和本地文件（本地文件把图片文件放在前端Public即可）
:::

::: field MinSDKVersion
@type string

@required

最低SDK版本要求（其实就是最低MSLX版本要求）
:::

::: field Developer
@type string

@default 不知道哇！

开发者名字
:::

::: field AuthorUrl
@type string

@default https://github.com/MSLTeam

开发者主页地址
:::

::: field PluginUrl
@type string

@default https://github.com/MSLTeam

插件地址（建议填写MSLX插件中心的地址）
:::

::::

## 插件生命周期方法

:::: field-group

::: field OnPluginInitialize(IServiceProvider serviceProvider)
@type void()

<Badge text="SDK v1.4.9+"  />

插件初始化的生命周期方法，执行时序早于 `OnLoad()`
:::

::: field OnLoad()
@type void()
插件加载完成的生命周期方法
:::

::: field OnUnload()
@type void()
插件卸载的生命周期方法（其实就是MSLX关闭）
:::

::: field OnRegisterEndpoints(IEndpointRouteBuilder endpoints)
@type void()

<Badge text="SDK v1.4.9+"  />

插件向宿主注册高级路由的生命周期

约定：如果需要注册 `SignalR` 路由，前缀请注册为：`/api/hubs/plugins/mslx-plugin-xxx/xxx`

即  `/api/hubs/plugins/{插件ID}` 前缀是不变的

:::

::: field OnRegisterServices(IServiceCollection services)
@type void()

<Badge text="SDK v1.5.2+"  />

插件向宿主注册依赖注入（DI）服务的生命周期。宿主会自动将 `IInstanceLifecycleService`、`IFrpProcessService` 等系统级服务注入全局容器，插件注册的服务或 Controller 可直接在构造函数中声明并使用这些宿主服务：

```c#
public void OnRegisterServices(IServiceCollection services)
{
    // 注册插件自己的服务
    services.AddSingleton<MyPluginManager>();
}
```
:::

::::

## API 路由与 ApplicationPart 声明

若插件内包含提供 Web API 接口的 Controller（控制器），必须在入口文件顶部（命名空间外）声明 `[assembly: ApplicationPart("程序集名称")]`：

```c#
using Microsoft.AspNetCore.Mvc.ApplicationParts;

[assembly: ApplicationPart("MSLX.Plugin.Stun")]
```

::: tip 为什么需要 ApplicationPart？
MSLX 宿主通过反射动态加载外部插件时，ASP.NET Core MVC 依赖 `ApplicationPart` 检索程序集内的 Controller 控制器。若未声明，会导致 Controller 路由无法被宿主注册。
:::

## 接口鉴权与降权 Token 支持 (`[AllowTokenScope]`)

<Badge text="SDK v1.7.1+" />

为了避免在浏览器 `<img>`、`<video>` 标签或 `window.open` 下载链接中通过 URL Query 传递高权限的主管理员凭据（`x-user-token`），MSLX 引入了降权凭据体系：
- **`media`（媒体凭据）**：与登录会话寿命一致，用于图标、地图切片、视频缩略图等静态资源，支持浏览器长期强缓存。
- **`download`（下载凭据）**：有效期 2 小时，专门用于文件导出、数据备份下载，支持断点续传。

插件开发者可以通过 **`[AllowTokenScope]` 特性** 或 **Minimal API 扩展方法**，自主声明插件接口支持的降权凭据类型。

### 1. Controller 模式（推荐）

在插件的控制器类或具体的 Action 方法上标注 `[AllowTokenScope]`：

```c#
using Microsoft.AspNetCore.Mvc;
using MSLX.SDK.Attributes;

namespace MyPlugin.Controllers;

[ApiController]
[Route("api/plugin/my-plugin")]
public class MyPluginMediaController : ControllerBase
{
    /// <summary>
    /// 媒体资源接口：允许使用 media_token 访问（如自定义地图瓦片、图表封面）
    /// 此时前端可直接拼装：/api/plugin/my-plugin/tile.png?media_token={token}
    /// </summary>
    [HttpGet("tile")]
    [AllowTokenScope(TokenScopes.Media)]
    public IActionResult GetTileImage()
    {
        return PhysicalFile("/path/to/tile.png", "image/png");
    }

    /// <summary>
    /// 文件下载接口：允许使用 download_token 访问（如导出报表或插件备份）
    /// 此时前端可直接拼装：/api/plugin/my-plugin/export?download_token={token}
    /// </summary>
    [HttpGet("export")]
    [AllowTokenScope(TokenScopes.Download)]
    public IActionResult ExportData()
    {
        return PhysicalFile("/path/to/export.zip", "application/zip", "export.zip");
    }

    /// <summary>
    /// 同时支持 media 和 download 凭据访问
    /// </summary>
    [HttpGet("preview")]
    [AllowTokenScope(TokenScopes.Media, TokenScopes.Download)]
    public IActionResult GetPreview()
    {
        return Ok(new { status = "ok" });
    }
}
```

### 2. Minimal API 模式

若通过 `OnRegisterEndpoints` 注册轻量路由，可以直接链式调用 `.AllowTokenScope(...)`：

```c#
using MSLX.SDK;
using MSLX.SDK.Attributes;

public void OnRegisterEndpoints(IEndpointRouteBuilder endpoints)
{
    endpoints.MapGet("/api/plugin/my-plugin/avatar", () => Results.File("/path/avatar.png", "image/png"))
             .AllowTokenScope(TokenScopes.Media);

    endpoints.MapGet("/api/plugin/my-plugin/download-log", () => Results.File("/path/log.txt", "text/plain"))
             .AllowTokenScope(TokenScopes.Download);
}
```

::: tip 鉴权与安全规范说明
1. **默认安全（Secure by Default）**：若插件接口**未添加** `[AllowTokenScope]` 特性，则该接口仅允许全权限主管理员 Token 访问，任何持降权 Token（`media_token` / `download_token`）的请求会被宿主直接拦截并返回 `403`。
2. **只读保护**：出于安全考虑，降权凭据接口在宿主层被严格限制为只允许 **`GET`** 和 **`HEAD`** 请求。严禁将带有破坏性或写操作的接口（如 POST / DELETE）开放给降权 Token。
3. **全权限主 Token 恒有效**：使用请求头 `x-user-token: <主Token>` 的标准后台 AJAX 请求无论是否标注该特性，均拥有完整访问权限。
:::

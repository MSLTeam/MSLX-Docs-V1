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
using MSLX.Plugin.Stun.Hubs;
using MSLX.Plugin.Stun.Managers;
using MSLX.SDK;

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

插件向宿主注册依赖注入（DI）服务的生命周期。宿主会自动将 `IMCServerService`、`IFrpProcessService` 等系统级服务注入全局容器，插件注册的服务或 Controller 可直接在构造函数中声明并使用这些宿主服务：

```c#
public void OnRegisterServices(IServiceCollection services)
{
    // 注册插件自己的服务
    services.AddSingleton<MyPluginManager>();
}
```
:::

::::

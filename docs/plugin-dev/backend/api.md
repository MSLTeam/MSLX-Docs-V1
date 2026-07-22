---
title: SDK 完整接口与核心服务
createTime: 2026/05/19 21:41:11
permalink: /plugin-dev/backend/api/
icon: link
---

## 概述

`MSLX.SDK` 为后端插件提供了操作宿主数据与底层控制的核心接口。可以通过静态对象 `SDK.MSLX`（包含 `Config`配置、`Downloader`下载器、`Http`请求工具、`Logger`日志工具）直接调用，也可以通过依赖注入（DI）在插件的服务或 Controller 中注入 `MSLX.SDK.IServices` 下的核心服务。


## 静态工具与 Bridge (`SDK.MSLX`)

静态入口 `SDK.MSLX` 整合了宿主的数据 Bridge、下载管理器、网络请求与日志模块：

```c#
SDK.MSLX.Config      // 配置 Bridge 集合
SDK.MSLX.Downloader  // 下载器服务
SDK.MSLX.Http        // 网络请求工具
SDK.MSLX.Logger      // 统一日志输出
```

### 1. 配置 Bridge 集合 (`SDK.MSLX.Config`)

`SDK.MSLX.Config` 提供了对宿主核心数据文件（`ServerList.json`, `FrpList.json`, `TaskList.json`, `UserList.json`, `Config.json`）及插件自身独立配置的安全读写能力。

#### 1.1 服务端实例 Bridge (`Config.Servers`)

用于查询、新建、更新和删除 Minecraft 服务端实例配置。

```c#
using MSLX.SDK;

// 获取所有服务端实例
List<McServerInfo.ServerInfo> servers = SDK.MSLX.Config.Servers.GetServerList();

// 获取指定 ID 的服务端实例
McServerInfo.ServerInfo? server = SDK.MSLX.Config.Servers.GetServer(1001);

// 生成一个全新的唯一下标 ID
uint newId = SDK.MSLX.Config.Servers.GenerateServerId();

// 新建服务端实例
bool created = SDK.MSLX.Config.Servers.CreateServer(newServerInfo);

// 更新服务端实例
bool updated = SDK.MSLX.Config.Servers.UpdateServer(serverInfo);

// 删除服务端实例 (可选是否同时删除本地硬盘文件)
bool deleted = SDK.MSLX.Config.Servers.DeleteServer(serverId: 1001, deleteFiles: false);
```

#### 1.2 FRP 隧道 Bridge (`Config.Frp`)

用于读取和配置宿主的 FRP 穿透隧道。

```c#
// 获取所有 FRP 配置
List<JToken> frpList = SDK.MSLX.Config.Frp.GetFrpList();

// 获取特定 FRP 配置对象
JObject? frpConfig = SDK.MSLX.Config.Frp.GetFrpConfig(1);

// 校验 FRP ID 是否有效
bool isValid = SDK.MSLX.Config.Frp.IsFrpIdValid(1);

// 生成新的 FRP 配置 ID
int newFrpId = SDK.MSLX.Config.Frp.GenerateFrpId();

// 创建 FRP 配置
bool created = SDK.MSLX.Config.Frp.CreateFrpConfig(
    name: "插件隧道", 
    server: "frp.example.com:7000", 
    configType: "ini", 
    config: "[web]\ntype = http..."
);

// 更新与删除
SDK.MSLX.Config.Frp.UpdateFrpConfig(id: 1, name: "新名称", server: "frp2.example.com", configType: "toml");
SDK.MSLX.Config.Frp.DeleteFrpConfig(id: 1);
```

#### 1.3 计划任务 Bridge (`Config.Tasks`)

控制宿主内置的定时计划任务。

```c#
// 获取全部计划任务
List<ScheduleTask> tasks = SDK.MSLX.Config.Tasks.GetTaskList();

// 获取指定实例关联的计划任务
List<ScheduleTask> instanceTasks = SDK.MSLX.Config.Tasks.GetTasksByInstanceId(1001);

// 创建 / 更新 / 删除计划任务
SDK.MSLX.Config.Tasks.CreateTask(newTask);
SDK.MSLX.Config.Tasks.UpdateTask(updatedTask);
SDK.MSLX.Config.Tasks.DeleteTask(taskId);

// 更新计划任务上次执行时间
SDK.MSLX.Config.Tasks.UpdateLastRunTime(taskId, DateTime.Now);
```

#### 1.4 用户与鉴权 Bridge (`Config.Users`)

用于访问宿主面板的用户数据、校验密码及操作 OpenID/资源权限。

```c#
// 校验用户名密码
bool isValidUser = SDK.MSLX.Config.Users.ValidateUser("admin", "rawPassword");

// 查询用户
UserInfo? userByName = SDK.MSLX.Config.Users.GetUserByUsername("admin");
UserInfo? userById = SDK.MSLX.Config.Users.GetUserById("user_id_xxx");
UserInfo? userByApiKey = SDK.MSLX.Config.Users.GetUserByApiKey("api_key_xxx");
UserInfo? userByOpenId = SDK.MSLX.Config.Users.GetUserByOpenId("openid_xxx");

// 用户 OpenID 绑定与解绑
SDK.MSLX.Config.Users.BindUserOpenId(userId: "user_id_xxx", openId: "openid_xxx");
SDK.MSLX.Config.Users.UnbindUserOpenId(userId: "user_id_xxx");

// 校验用户对特定资源（如服务端实例）的访问权限
bool hasAccess = SDK.MSLX.Config.Users.HasResourcePermission(userId, type: "instance", id: 1001);
```

#### 1.5 宿主主配置 Bridge (`Config.Main`)

操作宿主的 `Config.json` 全局主配置。

```c#
JObject mainConfig = SDK.MSLX.Config.Main.ReadConfig();
JToken? portToken = SDK.MSLX.Config.Main.ReadConfigKey("Port");
SDK.MSLX.Config.Main.WriteConfigKey("CustomField", "value");
```

#### 1.6 插件独立配置控制 (`Config.GetPluginConfig`)

```c#
// 获取指定插件 ID 的独立配置 Bridge
var pluginConfigBridge = SDK.MSLX.Config.GetPluginConfig("mslx-plugin-demo");
JObject configJson = pluginConfigBridge.ReadConfig();
pluginConfigBridge.WriteConfigKey("EnableAutoUpdate", true);
```

#### 1.7 路径与 JSON 文件助手

```c#
string appDataPath = SDK.MSLX.Config.GetAppDataPath();   // 面板 AppData 根目录
string appConfigPath = SDK.MSLX.Config.GetAppConfigPath(); // Config.json 路径

// 通用 JSON 加载与保存
JObject json = SDK.MSLX.Config.LoadJson<JObject>(filePath);
SDK.MSLX.Config.SaveJson(filePath, json);
```

---

### 2. 下载器服务 (`SDK.MSLX.Downloader`)

底层映射宿主的并行下载管理器，支持带进度回调与实时下载速度通知。

```c#
using MSLX.SDK;

string targetPath = Path.Combine(this.Config().GetDataPath(), "server.jar");

var result = await SDK.MSLX.Downloader.DownloadFileAsync(
    url: "https://example.com/server.jar", 
    savePath: targetPath,
    onProgress: (progressPercent, speedText) => 
    {
        SDK.MSLX.Logger.Debug($"下载进度: {progressPercent:0.0}% [{speedText}]"); 
    },
    progressIntervalMs: 1000 // 进度通知频率 (毫秒)
);

if (result.Success)
{
    SDK.MSLX.Logger.Info("文件下载成功!");
}
else
{
    SDK.MSLX.Logger.Error($"下载失败: {result.ErrorMessage}");
}
```

---

### 3. HTTP 请求工具 (`SDK.MSLX.Http`)

宿主内置的轻量 HTTP 客户端，支持 GET / POST 请求及多种 ContentType。

#### 方法与类型定义

```c#
public enum PluginHttpContentType { Json, FormUrlEncoded, Text, Octet }

public class PluginHttpResponse
{
    public string? Content { get; set; }
    public int StatusCode { get; set; }
    public Dictionary<string, string> Headers { get; set; }
    public Dictionary<string, string> Cookies { get; set; }
    public bool IsSuccessStatusCode { get; set; }
    public Exception? ResponseException { get; set; }
}
```

#### 调用示例

```c#
// 1. GET 请求示例
PluginHttpResponse getRes = await SDK.MSLX.Http.GetAsync(
    url: "https://api.example.com/data",
    queryParameters: new Dictionary<string, string> { { "key", "value" } },
    headers: new Dictionary<string, string> { { "User-Agent", "MSLX-Plugin" } },
    timeout: TimeSpan.FromSeconds(10)
);

if (getRes.IsSuccessStatusCode)
{
    string responseContent = getRes.Content ?? "";
}

// 2. POST 请求示例 (JSON 格式)
PluginHttpResponse postRes = await SDK.MSLX.Http.PostAsync(
    url: "https://api.example.com/action",
    contentType: PluginHttpContentType.Json,
    data: new { action = "start", serverId = 1001 },
    headers: null,
    timeout: TimeSpan.FromSeconds(15)
);
```

---

### 4. 统一日志输出 (`SDK.MSLX.Logger`)

用于向面板后台日志与文件输出统一格式的日志。

```c#
SDK.MSLX.Logger.Info("插件初始化成功");
SDK.MSLX.Logger.Warn("配置项未设置，使用默认值");
SDK.MSLX.Logger.Debug("调试追踪数据: count=5");

try
{
    // ...
}
catch (Exception ex)
{
    SDK.MSLX.Logger.Error("操作发生异常", ex);
}
```

---

## 依赖注入核心服务 (`MSLX.SDK.IServices`)

宿主会将管理进程中的底层控制服务注册到依赖注入容器中。插件可以在 Controller、Hub 或自定义服务中通过**构造函数注入**直接使用。

### 1. 服务端进程控制服务 (`IMCServerService`)

用于控制 Minecraft 实例的启动、停止、重启、发送命令及日志读取。

```c#
using MSLX.SDK.IServices;

public class MyPluginController : ControllerBase
{
    private readonly IMCServerService _mcServerService;

    public MyPluginController(IMCServerService mcServerService)
    {
        _mcServerService = mcServerService;
    }

    [HttpPost("start/{instanceId}")]
    public IActionResult StartInstance(uint instanceId)
    {
        // 检查实例是否正在运行
        if (_mcServerService.IsServerRunning(instanceId))
        {
            return Ok("实例已在运行中");
        }

        // 启动服务器 (非阻塞)
        var (success, message) = _mcServerService.StartServer(instanceId, isAutoRestart: false, skipEulaCheck: true);
        
        return Ok(new { success, message });
    }

    [HttpPost("command/{instanceId}")]
    public IActionResult SendCmd(uint instanceId, [FromBody] string cmd)
    {
        // 向服务器控制台发送指令
        bool sent = _mcServerService.SendCommand(instanceId, cmd, repeatCommandToLog: true);
        return Ok(new { success = sent });
    }

    [HttpGet("logs/{instanceId}")]
    public IActionResult GetLogs(uint instanceId)
    {
        // 获取实时日志与在线玩家
        List<string> logs = _mcServerService.GetLogs(instanceId);
        List<string> players = _mcServerService.GetOnlinePlayers(instanceId);
        TimeSpan uptime = _mcServerService.GetServerUptime(instanceId);

        return Ok(new { logs, players, uptimeSeconds = uptime.TotalSeconds });
    }
}
```

#### `IMCServerService` 常用方法速查表

| 方法签名 | 说明 |
| :--- | :--- |
| `IsServerRunning(uint instanceId)` | 检查指定实例是否在运行 |
| `GetServerStatus(uint instanceId)` | 获取详细状态 (0:未启动, 1:启动中, 2:运行中, 3:停止中, 4:重启中) |
| `StartServer(uint instanceId, bool isAutoRestart, bool skipEulaCheck)` | 启动服务端 (非阻塞) |
| `StopServer(uint instanceId)` | 安全停止服务端 |
| `ForceKillServer(uint instanceId)` | 强制杀死服务端进程 |
| `RestartServer(uint instanceId)` | 异步重启服务端 |
| `SendCommand(uint instanceId, string command, bool repeatCommandToLog)` | 发送控制台指令 |
| `GetLogs(uint instanceId)` | 读取当前服务器控制台输出日志 |
| `GetOnlinePlayers(uint instanceId)` | 获取在线玩家列表 |
| `GetServerUptime(uint instanceId)` | 获取已运行时长 `TimeSpan` |
| `AgreeEULA(uint instanceId, bool agree)` | 自动签署 EULA 协议 |

### 2. FRP 进程控制服务 (`IFrpProcessService`)

用于控制宿主内 FRP 进程的独立拉起与日志获取。

```c#
using MSLX.SDK.IServices;

public class FrpControlService
{
    private readonly IFrpProcessService _frpService;

    public FrpControlService(IFrpProcessService frpService)
    {
        _frpService = frpService;
    }

    public void ToggleFrp(int frpId)
    {
        if (_frpService.IsFrpRunning(frpId))
        {
            _frpService.StopFrp(frpId);
        }
        else
        {
            var (success, msg) = _frpService.StartFrp(frpId);
            List<string> logs = _frpService.GetLogs(frpId);
        }
    }
}
```

### 3. 环境扫描服务 (`IJavaScannerService` / `IPythonScannerService`)

获取宿主系统中安装的 Java 环境或 Python/MCDReforged 环境。

```c#
using MSLX.SDK.IServices;

public async Task CheckEnvironments(IJavaScannerService javaService, IPythonScannerService pythonService)
{
    // 扫描系统中的 Java
    List<JavaInfo> javaList = await javaService.ScanJavaAsync(forceRefresh: false);

    // 扫描系统中的 Python (及检测是否安装 MCDR)
    List<PythonInfo> pythonList = await pythonService.ScanPythonAsync(forceRefresh: false);
    
    // 校验特定 Python 路径
    PythonInfo? inspectRes = await pythonService.InspectPythonAsync("python3");
}
```

---

## 更多资源

完整源码接口定义见：
- [MSLX.SDK.Interfaces](https://github.com/MSLTeam/MSLX/tree/dev/MSLX.SDK/Interfaces){.readmore}
- [MSLX.SDK.IServices](https://github.com/MSLTeam/MSLX/tree/dev/MSLX.SDK/IServices){.readmore}

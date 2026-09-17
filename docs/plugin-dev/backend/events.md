---
title: 事件系统与生命周期钩子
createTime: 2026/09/17 11:15:00
permalink: /plugin-dev/backend/events/
icon: bolt
badge:
  text: v1.6.4+
  type: tip
---

## 概述 <Badge type="tip" text="v1.6.4+" />

从 MSLX v1.6.4 开始，SDK 引入了**全局事件总线（Event Hooks System）**。

插件可以通过静态入口 `SDK.MSLX.Events` 监听 Minecraft 服务端、备份系统、计划任务、内网穿透（FRP 隧道）以及宿主守护进程的核心生命周期。无需侵入修改宿主代码，即可实现诸如**分层灾备归档、群服聊天互通、自动崩溃告警、敏感指令拦截、隧道状态与日志流监控**等高级功能。

### 零心智负担的防泄漏机制
由于 MSLX 插件运行在独立的 `AssemblyLoadContext` 中，传统 C# 事件监听若在卸载时未注销易导致内存泄漏与无法卸载。  
**在 MSLX 中，宿主插件管理器会在插件卸载时自动剔除该插件注册的所有事件监听器**，开发者可放心在 `OnLoad()` 中订阅，无需担心生命周期悬挂问题。

```c#
using MSLX.SDK;
using MSLX.SDK.Events;

public class MyPlugin : IPlugin
{
    public void OnLoad()
    {
        // 监听备份完成
        SDK.MSLX.Events.OnBackupCompleted += (sender, e) =>
        {
            SDK.MSLX.Logger.Info($"[备份通知] 实例 {e.InstanceId} 备份完成: {e.BackupFileName}");
        };
    }
}
```

---

## 备份事件（Backup Events）

备份事件涵盖了从准备备份、打包完成、异常失败到备份删除的完整生命周期。

### 1. 事件列表与参数

| 事件名称 | 触发时机 | 参数类型 | 关键属性 |
| :--- | :--- | :--- | :--- |
| `OnBackupStarting` | 准备压缩存档前 | `BackupStartingEventArgs` | `InstanceId`, `ServerInfo`, `BackupDirectory`, `Cancel`, `CancelReason` |
| `OnBackupCompleted` | 备份 zip 写入完成 | `BackupCompletedEventArgs` | `InstanceId`, `ServerInfo`, `BackupFilePath`, `BackupFileName`, `FileSizeBytes`, `FormattedSize`, `Duration` |
| `OnBackupFailed` | 找不到世界或压缩异常 | `BackupFailedEventArgs` | `InstanceId`, `ServerInfo`, `ErrorMessage`, `Exception` |
| `OnBackupDeleted` | 备份文件被删除 | `BackupDeletedEventArgs` | `InstanceId`, `BackupFilePath`, `BackupFileName`, `IsAutoRoll` (是否滚动清理) |

::: tip 拦截备份
在 `OnBackupStarting` 中将 `e.Cancel = true;` 并附带 `e.CancelReason`，即可打断宿主原生备份流程，适合需要完全由插件接管自定义备份引擎的场景。
:::

### 2. 实战示例：编写 GFS 分层备份归档插件

很多服主希望实现 **GFS（Grandfather-Father-Son）分层保留策略**：即高频定时备份（如每小时一份）保留 24 小时，同时将每天的第一份备份提取为“日归档”保留 10 天，每月的第一份提取为“月归档”长期保存。

借助 `OnBackupCompleted` 钩子，仅需几十行代码即可实现一个功能完备的归档插件：

```c#
using System.IO.Compression;
using MSLX.SDK;
using MSLX.SDK.Events;

public class GfsArchivePlugin : IPlugin
{
    public string Id => "mslx-plugin-gfs-archive";
    public string Name => "GFS 分层归档插件";

    public void OnLoad()
    {
        SDK.MSLX.Events.OnBackupCompleted += (sender, e) =>
        {
            // 在后台任务中执行，避免阻塞事件线程
            Task.Run(async () =>
            {
                try
                {
                    await ProcessGfsArchiveAsync(e);
                }
                catch (Exception ex)
                {
                    SDK.MSLX.Logger.Error($"[GFS归档] 处理异常: {ex.Message}");
                }
            });
        };
    }

    private async Task ProcessGfsArchiveAsync(BackupCompletedEventArgs e)
    {
        if (e.ServerInfo == null) return;

        string archiveRootDir = Path.Combine(e.ServerInfo.Base, "mslx-archives");
        string dailyDir = Path.Combine(archiveRootDir, "daily");
        Directory.CreateDirectory(dailyDir);

        // 判定是否是当天的第一份归档（检查今天是否已经提取过）
        string todayTag = e.Timestamp.ToString("yyyyMMdd");
        string dailyTarget = Path.Combine(dailyDir, $"daily-{todayTag}.zip");

        if (!File.Exists(dailyTarget))
        {
            SDK.MSLX.Logger.Info($"[GFS归档] 提取实例 [{e.InstanceId}] 当日首个备份作为日归档: {e.BackupFileName}");
            File.Copy(e.BackupFilePath, dailyTarget, overwrite: false);

            // 清理超过 10 天的旧日归档
            PruneOldArchives(dailyDir, keepDays: 10);
        }
    }

    private void PruneOldArchives(string dirPath, int keepDays)
    {
        var dir = new DirectoryInfo(dirPath);
        var cutoff = DateTime.Now.AddDays(-keepDays);

        foreach (var file in dir.GetFiles("daily-*.zip"))
        {
            if (file.CreationTime < cutoff)
            {
                file.Delete();
                SDK.MSLX.Logger.Info($"[GFS归档] 清理已过期日归档: {file.Name}");
            }
        }
    }
}
```

---

## 服务器生命周期事件（Server Lifecycle Events）

涵盖服务端实例从准备启动、启动完成、准备停止到完全退出或崩溃的运行状态监控。

### 1. 事件列表与参数

| 事件名称 | 触发时机 | 参数类型 | 关键属性 |
| :--- | :--- | :--- | :--- |
| `OnServerStarting` | 点击启动或自动重启前 | `ServerStartingEventArgs` | `InstanceId`, `ServerInfo`, `IsAutoRestart`, `Cancel`, `CancelReason` |
| `OnServerStarted` | 进程成功创建并获得 PID | `ServerStartedEventArgs` | `InstanceId`, `ServerInfo`, `ProcessId`, `Timestamp` |
| `OnServerStopping` | 正在发送停止指令前 | `ServerStoppingEventArgs` | `InstanceId`, `ServerInfo`, `StopCommand`, `Timestamp` |
| `OnServerStopped` | 进程完全退出 | `ServerStoppedEventArgs` | `InstanceId`, `ServerInfo`, `ExitCode`, `Uptime` |
| `OnServerCrashed` | 进程异常非 0 退出 | `ServerCrashedEventArgs` | `InstanceId`, `ServerInfo`, `ExitCode`, `CrashMessage` |

### 2. 代码示例：启动校验与崩溃报警

```c#
public void OnLoad()
{
    // 启动前校验（例如：禁止在特定时间段启动）
    SDK.MSLX.Events.OnServerStarting += (sender, e) =>
    {
        if (DateTime.Now.Hour >= 2 && DateTime.Now.Hour < 6)
        {
            e.Cancel = true;
            e.CancelReason = "凌晨 2:00 - 6:00 为系统维护窗口，禁止启动服务器";
        }
    };

    // 监控崩溃并发送告警
    SDK.MSLX.Events.OnServerCrashed += (sender, e) =>
    {
        SDK.MSLX.Logger.Error($"⚠️ 严重警告：实例 [{e.InstanceId}] 发生异常崩溃！退出码: {e.ExitCode}");
        // 可在此处调用 Webhook 推送消息至 QQ群 / 钉钉 / 飞书 / Discord
    };
}
```

---

## 控制台日志与指令事件（Console & Command Events）

### 1. 控制台日志监听 (`OnServerLogReceived`)
每当 Minecraft 服务端输出一行日志（包括标准输出流与 PTY 伪终端输出），都会触发此事件。

```c#
SDK.MSLX.Events.OnServerLogReceived += (sender, e) =>
{
    // e.InstanceId 为产生日志的实例ID
    // e.LogLine 为原始日志行
    if (e.LogLine.Contains("Can't keep up!"))
    {
        SDK.MSLX.Logger.Warning($"实例 [{e.InstanceId}] 出现掉 tick 告警！");
    }

    // 监听聊天输出转发到机器人
    if (e.LogLine.Contains("<") && e.LogLine.Contains(">"))
    {
        // 群服互通逻辑...
    }
};
```

### 2. 控制台指令拦截 (`OnServerCommandExecuting`)
通过开服器发送命令（无论来自 WebPanel、计划任务还是 RCON）前触发，支持拦截。

```c#
SDK.MSLX.Events.OnServerCommandExecuting += (sender, e) =>
{
    // 禁止在后台执行危险指令
    if (e.Command.TrimStart().StartsWith("op ", StringComparison.OrdinalIgnoreCase))
    {
        SDK.MSLX.Logger.Warning($"已拦截对实例 [{e.InstanceId}] 执行的高危指令: {e.Command}");
        e.Cancel = true; // 拦截并取消执行
    }
};
```

---

## 计划任务事件（Task Events）

监听 MSLX 内部定时任务调度器的执行状态。

| 事件名称 | 触发时机 | 参数类型 | 关键属性 |
| :--- | :--- | :--- | :--- |
| `OnTaskExecuting` | 定时任务即将触发前 | `TaskExecutingEventArgs` | `TaskId`, `TaskName`, `TaskType`, `InstanceId`, `Cancel` |
| `OnTaskExecuted` | 定时任务触发完成 | `TaskExecutedEventArgs` | `TaskId`, `TaskName`, `TaskType`, `InstanceId`, `Success`, `ErrorMessage` |

```c#
SDK.MSLX.Events.OnTaskExecuting += (sender, e) =>
{
    SDK.MSLX.Logger.Info($"[任务追踪] 任务 [{e.TaskName}] ({e.TaskType}) 即将执行于实例: {e.InstanceId}");
};

SDK.MSLX.Events.OnTaskExecuted += (sender, e) =>
{
    if (!e.Success)
    {
        SDK.MSLX.Logger.Error($"[任务追踪] 任务 [{e.TaskName}] 执行失败: {e.ErrorMessage}");
    }
};
```

---

## 内网穿透 / FRP 隧道事件（FRP Tunnel Events）

监听 MSLX 穿透服务中 FRP 隧道的生命周期状态及控制台日志流输出。

| 事件名称 | 触发时机 | 参数类型 | 关键属性 |
| :--- | :--- | :--- | :--- |
| `OnFrpStarting` | 隧道准备启动或后台下载核心前 | `FrpStartingEventArgs` | `TunnelId`, `TunnelName`, `Service`, `ConfigType`, `Config` |
| `OnFrpStarted` | Frpc 进程成功启动并获得 PID | `FrpStartedEventArgs` | `TunnelId`, `TunnelName`, `ProcessId`, `Timestamp` |
| `OnFrpStopping` | 隧道正在停止前 | `FrpStoppingEventArgs` | `TunnelId`, `TunnelName`, `Timestamp` |
| `OnFrpStopped` | Frpc 进程完全退出 | `FrpStoppedEventArgs` | `TunnelId`, `TunnelName`, `ExitCode`, `Timestamp` |
| `OnFrpLogReceived` | Frpc 控制台输出日志时 | `FrpLogEventArgs` | `TunnelId`, `LogLine`, `Timestamp` |

```c#
public void OnLoad()
{
    // 监听隧道启动完成
    SDK.MSLX.Events.OnFrpStarted += (sender, e) =>
    {
        SDK.MSLX.Logger.Info($"[FRP 监控] 隧道 [{e.TunnelName}] (ID: {e.TunnelId}) 启动就绪，PID: {e.ProcessId}");
    };

    // 监听隧道停止/异常退出
    SDK.MSLX.Events.OnFrpStopped += (sender, e) =>
    {
        SDK.MSLX.Logger.Warning($"[FRP 监控] 隧道 [{e.TunnelName}] (ID: {e.TunnelId}) 已停止，退出码: {e.ExitCode}");
    };

    // 监听隧道控制台日志（可用于解析远程映射端口或错误排查）
    SDK.MSLX.Events.OnFrpLogReceived += (sender, e) =>
    {
        if (e.LogLine.Contains("start proxy success"))
        {
            SDK.MSLX.Logger.Info($"[FRP 日志捕获] 隧道 [{e.TunnelId}] 代理映射建立成功！");
        }
    };
}
```

---

## 最佳实践与注意事项

1. **避免阻塞事件线程**：  
   事件处理器是在宿主内部执行流中同步调用的。若需要进行耗时的网络请求（HTTP/Webhook）、磁盘 IO 拷贝或压缩，请务必使用 `Task.Run(async () => { ... })` 转移到后台线程执行。
2. **异常保护**：  
   MSLX 事件总线内部已对每个监听委托做了异常隔离保护，单个插件抛出的未捕获异常不会波及宿主或其他插件，但仍建议在插件内部做好 `try-catch` 处理，并使用 `SDK.MSLX.Logger` 记录详细错误堆栈。

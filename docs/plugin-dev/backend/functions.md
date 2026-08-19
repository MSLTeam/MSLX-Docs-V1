---
title: SDK函数方法
createTime: 2026/05/19 21:41:11
permalink: /plugin-dev/backend/functions/
icon: laptop-code
badge:
  text: v1.4.3+
  type: tip
---

## 日志方法 <Badge type="tip" text="v1.4.3" />

统一使用SDK提供的ASP.NET的Logger。

```c#
SDK.MSLX.Logger.Info("mslx-plugin-demo 载入成功~");
```

## 文件下载 <Badge type="tip" text="v1.4.4" />

MSLX SDK映射了守护进程中的下载管理器，可以按照示例进行调用。

```c#
// ===== 下载器调用示例 ===== 
        SDK.MSLX.Logger.Info("准备下载文件...");
        string targetPath = Path.Combine(this.Config().GetDataPath(), "server.jar");

        var result = await SDK.MSLX.Downloader.DownloadFileAsync(
            "https://example.com/server.jar", 
            targetPath,
            (progress, speed) => 
            {
                SDK.MSLX.Logger.Debug($"\r下载中: {progress:0.0}% [{speed}]"); 
            });

        if (result.Success)
        {
            SDK.MSLX.Logger.Info("下载完成，可以开始搞事情了！");
        }
        else
        {
            SDK.MSLX.Logger.Error($"下载失败: {result.ErrorMessage}");
        }
```

## GET/POST请求 <Badge type="tip" text="v1.4.4" />

```c#
        // get请求示例
        var response = await SDK.MSLX.Http.GetAsync("https://api.mslmc.cn/v3/query/notice?query=id");
        
        if (response.IsSuccessStatusCode)
        {
            JObject jobj = JObject.Parse(response.Content ?? "{}");
            string content = jobj["data"]?["noticeID"]?.ToString() ?? "";
            
            SDK.MSLX.Logger.Info($"获取到的MSL公告编号: {content}");
        }

        // post
        var postResponse = await SDK.MSLX.Http.PostAsync(
            "https://example.cn/post-api",
            PluginHttpContentType.Json,
            new { username = "admin", action = "start" }
        ); 
```

## 系统与路径助手 <Badge type="tip" text="v1.4.3" />

SDK 提供了访问宿主数据目录及当前插件独立存储目录的工具方法。

```c#
// 获取 MSLX 宿主全局 AppData 数据目录路径
string appDataPath = SDK.MSLX.Config.GetAppDataPath();

// 获取 MSLX 宿主主配置文件路径
string appConfigPath = SDK.MSLX.Config.GetAppConfigPath();

// 获取当前插件专属的独立数据存储目录 (插件实例扩展方法)
string pluginDataPath = this.Config().GetDataPath();
```

## 全局后台任务与进度条 <Badge type="tip" text="v1.6.0" />

MSLX 提供了全局的后台任务池，插件可以通过 `SDK.MSLX.Tasks` 接口将耗时操作扔进全局任务池，从而在 WebPanel 右上角的“后台任务”抽屉里展示带进度条的任务。

```c#
// 1. 创建任务 (用户ID可以通过上下文或保留为空，实例ID通常填0，TaskType.Plugin 代表插件任务)
var (task, token) = SDK.MSLX.Tasks.CreateTask(
    userId: "", 
    instanceId: 0, 
    type: MSLX.SDK.Models.Files.TaskType.Plugin, 
    title: "正在备份插件数据", 
    targetName: "my-plugin-backup.zip"
);

Task.Run(async () => 
{
    try 
    {
        for (int i = 0; i <= 100; i += 10)
        {
            // 响应用户在前端点击的“取消”操作
            if (token.IsCancellationRequested)
            {
                // 收到取消信号后，清理垃圾并退出
                SDK.MSLX.Tasks.SetFailed(task.Id, "用户已取消");
                return;
            }

            // 2. 更新任务进度
            SDK.MSLX.Tasks.UpdateProgress(task.Id, i, $"正在处理第 {i}% 的数据...");
            await Task.Delay(500); // 模拟耗时
        }

        // 3. 标记任务完成
        SDK.MSLX.Tasks.SetSuccess(task.Id, "备份完成！");
    }
    catch (Exception ex)
    {
        // 标记任务失败
        SDK.MSLX.Tasks.SetFailed(task.Id, ex.Message);
    }
});
```




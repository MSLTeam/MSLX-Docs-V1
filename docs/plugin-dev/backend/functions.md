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


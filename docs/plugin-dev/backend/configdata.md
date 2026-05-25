---
title: 插件配置 & 数据目录 
createTime: 2026/05/13 16:13:46
permalink: /plugin-dev/backend/configdata/
icon: file-code
badge:
  text: v1.4.3+
  type: tip
---

## 概述

MSLX SDK为插件的数据存储提供了一套方便使用的方法进行简单的配置文件读写。也提供了方法直接获取当前插件的数据存储目录。

如无其他必要，请不要随意在其他位置进行数据的存储。

示例插件有一些示例：[mslx-plugin-demo/MSLXPluginEntry.cs at main · MSLTeam/mslx-plugin-demo](https://github.com/MSLTeam/mslx-plugin-demo/blob/main/MSLXPluginEntry.cs)

调用相关功能均需要引用SDK命名空间，下文不再赘述。

```c#
using MSLX.SDK;
```

## 插件入口类暴露全局实例

在您的插件主类（实现 `IPlugin` 的类）中，新增一个公开的静态属性 `Instance`，并在插件的 `OnLoad` 生命周期中将当前实例（`this`）挂载给它。

```c#
public static MSLXPluginEntry Instance { get; private set; }
```

```c#
public void OnLoad()
{
   Instance = this;
}
```

完整实例请查看：[MSLXPluginEntry.cs](https://github.com/MSLTeam/mslx-plugin-demo/blob/main/MSLXPluginEntry.cs)

::: important 以下文档均以主类为`MSLXPluginEntry`，静态属性为`Instance`作为示例。若您挂在的位置/名字不同，请自行同步更改即可。

:::

## 获取插件的数据目录

插件的所有数据均应该存储在此目录下，并且建议使用`Path.Combine();`函数进行拼接路径。

```c#
MSLXPluginEntry.Instance.Config().GetDataPath();
```

## 简易读写插件配置文件

快速读取写入键值。

```c#
MSLXPluginEntry.Instance.Config().WriteConfigKey("author", "xiaoyu");
MSLXPluginEntry.Instance.Config().WriteConfigKey("magicNumber", 1027);
        
int count = (int?)MSLXPluginEntry.Instance.Config().ReadConfigKey("magicNumber") ?? 0;
```

## 完整读取配置文件

读取和写入配置的类型均为 [Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/) 的`JObject`类型。

```c#
var allConfig = MSLXPluginEntry.Instance.Config().ReadConfig();
MSLXPluginEntry.Instance.Config().WriteConfig(allConfig);
```


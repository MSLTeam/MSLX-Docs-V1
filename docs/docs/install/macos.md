---
title: 在 macOS 上安装
createTime: 2025/12/06 21:32:19
permalink: /docs/install/macos/
icon: b:apple
---

::: important 运行环境  
运行环境: ==.NET Core 10.0 LTS=={.important}  

(一般系统都不自带此环境，请确保您安装成功了)

<LinkCard title="下载 .NET Core 10.0 (Apple Slicon)" icon="download" href="https://dotnet.microsoft.com/zh-cn/download/dotnet/thank-you/sdk-8.0.416-macos-arm64-installer" description="如果您的设备是M系列芯片的，请下载此版本。" />

<LinkCard title="下载 .NET Core 10.0 (Intel)" icon="download" href="https://dotnet.microsoft.com/zh-cn/download/dotnet/thank-you/sdk-10.0.101-macos-x64-installer" description="如果您的设备使用的非M系列芯片，请下载此版本。" />

:::

在确定安装好 ==运行环境== 后，将`MSLX.Daemon`放在你喜欢的位置，然后赋予可执行权限，然后启动`MSLX.Daemon`软件即可。

如果出现闪退，那么就还是运行环境没有安装好或者是可执行权限没给。（可能需要在 ==隐私与安全== 中放行）

注意：MSLX.Daemon 并非标准的mac app格式，==请不要把他放进去application目录== ！

::: tip 关于标准APP

MSLX.Daemon是一个控制台应用，所以暂时没有封装成APP。

后续客户端版本会封装成标准APP，并自动管理MSLX.Daemon。（但是我们买不起苹果的签名qwq，仍需要手动放行程序）

:::

::: tip 文件存储位置

由于macOS的安全机制，通常不应该在软件的目录存储数据。

故目前默认数据目录位于：`/Users/用户名/Library/Application Support/MSLX`

:::

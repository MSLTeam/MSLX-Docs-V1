---
title: 在 macOS 上安装
createTime: 2025/12/06 21:32:19
permalink: /docs/install/macos/
icon: b:apple
---

## 一键安装

==需确保已拥有Homebrew环境。请自行查找配置Homebrew环境的教程。==

安装命令：

```bash
brew tap MSLTeam/tap && brew install mslx-daemon && brew services start mslx-daemon
```

安装完成后会自动打开登录页面，并且会自动打开初始账号密码。

更新命令：

```bash
brew update && brew upgrade mslx-daemon && brew services restart mslx-daemon
```

::: warning 完全卸载命令（完全清除用户数据）：

```bash
brew services stop mslx-daemon && brew zap mslx-daemon && brew untap MSLTeam/tap
```

:::

## 手动安装

::: important 运行环境  
运行环境: ==.NET Core 10.0 LTS=={.important}  

(一般系统都不自带此环境，请确保您安装成功了)

<LinkCard title="下载 .NET Core 10.0 (Apple Slicon)" icon="download" href="https://dotnet.microsoft.com/zh-cn/download/dotnet/thank-you/sdk-10.0.101-macos-arm64-installer" description="如果您的设备是M系列芯片的，请下载此版本。" />

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

::: warning 关于SIP (系统完整性保护)

如果您在新版本macOS系统中启动MSLX守护进程端遇到错误：`Failed to create CoreCLR, HRESULT: 0x8007000C`。

若您曾关闭过SIP功能，请尝试重新打开SIP以运行MSLX。

[相关内容请见 → **#110 · MSLTeam/MSLX**](https://github.com/MSLTeam/MSLX/issues/110#issuecomment-4231051520){.readmore}

:::

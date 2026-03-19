---
title: 在 Linux 上安装
createTime: 2025/12/06 21:32:19
permalink: /docs/install/linux/
icon: b:ubuntu
---

<LinkCard title="在 Docker 上安装使用" description="在 Linux 上，除了直接安装在本机，也可以选择使用Docker部署。" icon="b:docker" href="/docs/install/docker/" />

<LinkCard title="在 fnOS (飞牛系统) 上安装使用" description="如果您使用的是飞牛系统，可以直接在应用商店安装哦。" icon="b:debian" href="/docs/install/fnos/" />

## 一键安装

==脚本支持大部分Linux系统，如果安装不成功，请自行手动安装MSLX。==

Linux 通用版本（Ubuntu/Debian/CentOs系 等等）：

```bash
curl -sL "https://files.mslmc.cn/d/MSL/MSL%20Resources/MSLX/scripts/20260114-a/install_common.sh?sign=swyHXyZlsBV-BcXqRjQ-RqCbAuYoTmTjPKNhpMd_6Bo=:0" | sudo bash
```

Alpine Linux 版本：

```bash
apk add curl sudo bash # 安装必要软件包
curl -sL "https://files.mslmc.cn/d/MSL/MSL%20Resources/MSLX/scripts/20260114-a/install_alpine.sh?sign=CGn1Z5O1vCH8L58Z5xsGZez4oXQbJZ65o5ATVLZz5b4=:0" | sudo bash
```

::: tip 关于监听地址的选择

脚本运行会询问您监听的地址，如果不知道选什么，建议选监听全部地址。

若想直接使用ip+端口访问，那么就选2监听全部地址。

若想frp映射端口/nginx本地反向代理，那么选1监听本机即可。

:::



::: warning 一键卸载脚本

```bash
curl -sL "https://files.mslmc.cn/d/MSL/MSL%20Resources/MSLX/scripts/20260114-a/uninstall.sh?sign=0HUoU4lnL3srGxVai_IPP5I-5QhQ5XwjlJUaxifJ69Y=:0" | sudo bash
```

:::

## 手动安装

::: important 运行环境  
运行环境: ==.NET Core 10.0 LTS=={.important}  

(一般系统都不自带此环境，请确保您安装成功了)

```shell
# 安装依赖
apt-get update && apt-get install -y libicu-dev 
# 如果是CentOS等系统 请使用 yum install -y libicu

# 下载并安装.NET Core 10.0 SDK
wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
chmod +x ./dotnet-install.sh
./dotnet-install.sh --channel 10.0 --install-dir /usr/share/dotnet

# 建立全局软链接
ln -sf /usr/share/dotnet/dotnet /usr/bin/dotnet

# 设置权限
chmod -R 755 /usr/share/dotnet

# 验证安装
dotnet --info
```

```shell :collapsed-lines=3
# 正常安装成功输出如下
.NET SDK:
 Version:           10.0.101
 Commit:            fad253f51b
 Workload version:  10.0.100-manifests.c57ac48b
 MSBuild version:   18.0.6+fad253f51

Runtime Environment:
 OS Name:     ubuntu
 OS Version:  24.04
 OS Platform: Linux
 RID:         linux-x64
 Base Path:   /root/.dotnet/sdk/10.0.101/

.NET workloads installed:
There are no installed workloads to display.
Configured to use workload sets when installing new manifests.
No workload sets are installed. Run "dotnet workload restore" to install a workload set.

Host:
  Version:      10.0.1
  Architecture: x64
  Commit:       fad253f51b

.NET SDKs installed:
  8.0.416 [/root/.dotnet/sdk]
  10.0.101 [/root/.dotnet/sdk]

.NET runtimes installed:
  Microsoft.AspNetCore.App 8.0.22 [/root/.dotnet/shared/Microsoft.AspNetCore.App]
  Microsoft.AspNetCore.App 10.0.1 [/root/.dotnet/shared/Microsoft.AspNetCore.App]
  Microsoft.NETCore.App 8.0.22 [/root/.dotnet/shared/Microsoft.NETCore.App]
  Microsoft.NETCore.App 10.0.1 [/root/.dotnet/shared/Microsoft.NETCore.App]

Other architectures found:
  None

Environment variables:
  DOTNET_ROOT                              [/root/.dotnet]

global.json file:
  Not found

Learn more:
  https://aka.ms/dotnet/info

Download .NET:
  https://aka.ms/dotnet/download
```



:::

在确定安装好 ==运行环境== 后，将`MSLX.Daemon`放在你喜欢的位置，然后赋予可执行权限，然后启动`MSLX.Daemon`软件即可。

如果出现闪退，那么就还是运行环境没有安装好或者是可执行权限没给。

守护进程：目前需要自行配置`systemd`或`supervisor`进行进程守护，后续会出一键安装脚本，敬请期待~

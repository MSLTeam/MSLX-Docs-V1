---
title: 在 Linux 上安装
createTime: 2025/12/06 21:32:19
permalink: /docs/install/linux/
icon: b:ubuntu
---

::: important 运行环境  
运行环境: ==.NET Core 8.0 LTS=={.important}  

(一般系统都不自带此环境，请确保您安装成功了)

```shell
wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
chmod +x ./dotnet-install.sh
./dotnet-install.sh --channel 8.0
```

:::

在确定安装好 ==运行环境== 后，将`MSLX.Daemon`放在你喜欢的位置，然后赋予可执行权限，然后启动`MSLX.Daemon`软件即可。

如果出现闪退，那么就还是运行环境没有安装好或者是可执行权限没给。

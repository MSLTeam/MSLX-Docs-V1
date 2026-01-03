---
title: 在 Docker 中安装
createTime: 2025/12/23 22:28:09
permalink: /docs/install/docker/
icon: b:docker
---
::: warning 使用容器部署需要一定的使用经验

如果您没有使用过Docker部署服务，可能对你而言使用 ==直接安装=={.warning} 的方法会更加简单。

建议了解相关知识后再使用容器部署。

当然，本文档写的已经 ==尽量详细=={.warning} 新手也差不多能看明白并安装成功。

:::

::: tip 关于容器

当您将MSLX守护进程部署在容器运行后，您所有在MSLX上运行的 ==MC服务端/其他类型实例== 也均会运行在此容器上。

容器镜像自带了 OpenJdk 17 和 21版本环境，在创建服务端选择Java时可以直接选择 ==本地Java== 就能看见自带的Java环境了。

若这两个版本不符合您的MC版本要求，MSLX的 ==在线安装Java== 功能依旧 ==有效== 。

:::

::: important 系统架构支持

自 MSLX-Daemon ==v0.5.3.1-beta=={.important}  版本起，会自动构建 `amd64` 和 `arm64` 架构的镜像，拉取时会自动选择。

==我们不会对32位的架构做支持，其完全不适合用于开服。=={.important}

:::

## 容器镜像地址

Dockerhub: `xiaoyululu/mslx-daemon:latest`

[备用] 腾讯云TCR (香港地域): `hkccr.ccs.tencentyun.com/xiaoyululu/mslx-daemon:latest`

## 手动安装

:::: steps
1. ### 安装Docker（已安装可跳过）

   ```shell
   # 安装curl（如果没有）
   apt install curl # 如果不是apt那就自己换一下
   # 安装Docker
   curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
   # 将当前用户加入 docker 组
   sudo usermod -aG docker $USER && newgrp docker
   # 启动 Docker 并设置开机自启
   systemctl enable --now docker
   # 验证安装
   docker -v
   ```
   ![image-20251223224019596](./assets/image-20251223224019596.png)

   ::: tip 配置镜像源（可选，我们也提供了备用的容器镜像源）

   由于默认连接dockerhub可能较慢，可以配置一下镜像源加快拉取的速度。

   这里示例配置：[毫秒镜像](https://1ms.run/)， ==也可以自行寻找其他的镜像源进行配置== 。

   ```shell
   # 启动配置脚本
   sudo bash -c "$(curl -sSL https://n3.ink/helper)"
   ```

   在这里选择`4`即可，后续选择`优先使用`，然后自动重启Docker服务后就配置成功了。

   ps：选择2推荐那个的话是需要登录镜像站的账号的，看个人喜好了。

   ![image-20251224122038239](./assets/image-20251224122038239.png)

   :::

2. ### 安装并启动MSLX守护进程 - 配置文件方法

   ```shell
   # 创建数据目录（也可以换成你喜欢的目录）并定位到目录
   mkdir -p /opt/mslx && cd /opt/mslx
   ```

   在这个文件夹新建一个配置文件`docker-compose.yml`。（可以直接在ssh的文件管理，也可以使用vim/nano等编辑工具）。

   输入以下配置文件（可以根据需要修改，不会改就默认即可）。

   ```yaml
   services:
     daemon:
       image: xiaoyululu/mslx-daemon:latest
       # image: hkccr.ccs.tencentyun.com/xiaoyululu/mslx-daemon # 备用源（使用需要取消注释这行并把上一行注释掉）
       container_name: mslx-daemon
       restart: always
       
       # 端口映射
       ports:
         - "1027:1027"               # 服务面板端口
         - "25565-25585:25565-25585" # 游戏端口范围
       
       # 数据挂载
       volumes:
         - ./data:/app/DaemonData
       
       environment:
         - TZ=Asia/Shanghai
         # - host=* # 配置监听地址，默认是*，没有特殊需求不需要改
         # - port=1027 # 配置监听端口，没有特殊需求不需要改（改了的话上面的端口映射配置需要一起修改）
   ```

   ```shell
   # 启动
   docker compose up -d
   ```

   执行启动后，Docker会自动拉取镜像和启动MSLX守护进程端。

   如图即为成功：（如果`Created`后没有反应，可以按下回车，然后输入`docker ps -a` 查询状态）

   ![image-20251223231853187](./assets/image-20251223231853187.png)

3. ### 安装并启动MSLX守护进程 - 一键指令方法

   ::: tip
   如果已经根据步骤二启动过了，那么这一步请略过不看。

   ==更推荐步骤二的方法==

   :::

   ```shell
   docker run -d \
     --name mslx-daemon \
     --restart always \
     -p 1027:1027 \
     -p 25565-25585:25565-25585 \
     -v $(pwd)/mslx_data:/app/DaemonData \
     -e TZ=Asia/Shanghai \
     xiaoyululu/mslx-daemon:latest
   ```

   或者使用腾讯云镜像源: 

   ```shell
   docker run -d \
     --name mslx-daemon \
     --restart always \
     -p 1027:1027 \
     -p 25565-25585:25565-25585 \
     -v $(pwd)/mslx_data:/app/DaemonData \
     -e TZ=Asia/Shanghai \
     hkccr.ccs.tencentyun.com/xiaoyululu/mslx-daemon:latest
   ```

   

4. ### 查询默认账号信息和一些注意事项

   由于启动后可能没有日志输出，输入以下指令查询日志：

   ```shell
   docker logs -f mslx-daemon
   ```

   ![image-20251223232055613](./assets/image-20251223232055613.png)

   然后打开`http://localhost:1027`即可登入MSLX面板控制端。

   ![image-20251223232201996](./assets/image-20251223232201996.png)

   ::: tip 关于数据位置

   在您没有修改启动配置文件/指令的情况下：

   使用配置文件启动方法，默认数据保存在`/opt/mslx/data`。

   使用一键启动命令方法，默认数据保存在`当前目录/mslx_data`。

   :::

   ::: important 关于端口

   以上的默认配置会把docker的`1027`端口以及`25565-25585`端口映射到主机，开服可以优选选择25565以及后面这20个端口，就不需要额外配置。

   :::

5. ### 关闭/更新/重启MSLX

     #### # 关闭MSLX容器

     ```shell
     # 如果是配置文件的启动方式
     cd /opt/mslx && docker compose down
     ```

     ```shell
     # 如果是一键指令的方法
     docker stop mslx-daemon
     # 想再开就 docker start mslx-daemon
     ```

     #### # 重启MSLX容器

     ```shell
     docker restart mslx-daemon
     ```

     #### # 更新MSLX容器镜像

     更新不会删除数据，除非你自己删了。

     ```shell
     docker pull xiaoyululu/mslx-daemon:latest
     docker rm -f mslx-daemon
     # 然后重新运行启动命令 (up -d)
     ```




  ::::

## 使用 宝塔 的Docker管理部署

进入宝塔的容器页面。

![image-20251224122716620](./assets/image-20251224122716620.png)

选择 ==命令创建== ，然后输入一下指定，然后执行。（此命令中，默认把数据存在了`/www/wwwroot/mslx-daemon`，你也可以根据喜好编辑存储数据的位置）。

```shell
docker run -d \
  --name mslx-daemon \
  --restart always \
  -p 1027:1027 \
  -p 25565-25585:25565-25585 \
  -v /www/wwwroot/mslx-daemon:/app/DaemonData \
  -e TZ=Asia/Shanghai \
  xiaoyululu/mslx-daemon:latest
```

或者使用腾讯云镜像源:

```shell
docker run -d \
  --name mslx-daemon \
  --restart always \
  -p 1027:1027 \
  -p 25565-25585:25565-25585 \
  -v /www/wwwroot/mslx-daemon:/app/DaemonData \
  -e TZ=Asia/Shanghai \
  hkccr.ccs.tencentyun.com/xiaoyululu/mslx-daemon:latest
```



![image-20251224122932573](./assets/image-20251224122932573.png)

等待创建完成后，进入容器详情，查询日志即可获取 ==默认管理账号密码== 。

然后即可访问控制台进行登录访问（建议额外配置nginx反向代理）。

![image-20251224123717665](./assets/image-20251224123717665.png)

::: warning bug?

测试时发现命令创建成功后容器详情 ==没有正确读取到命令配置的端口映射=={.warning} ，不知道是啥问题（可能是宝塔不能识别范围端口）。

如果遇到无法使用的情况，可以参照第一步手动安装。

也可以尝试创建容器内的 ==手动创建=={.warning} 方法，按照指令填写参数（如果你会的话）。

:::

## 使用 1Panel 部署

::: tip

由于1Panel原本就是容器化的面板，确实会比较的适合。

:::

在容器页面进行新增容器，按以下配置。

镜像：`xiaoyululu/mslx-daemon:latest` 或者使用腾讯云备用源: `hkccr.ccs.tencentyun.com/xiaoyululu/mslx-daemon:latest`

端口：`1027`是 ==必须映射== 的，这是面板默认服务端口。25565-25585是预留的MC服务器端口，可以自行修改。

![image-20251224125003463](./assets/image-20251224125003463.png)

==挂载== （服务器内目录也可以更改为自己喜欢的目录，容器内目录必须是`/app/DaemonData`）。

![image-20251224125104784](./assets/image-20251224125104784.png)

==环境变量== 推荐配置：`TZ=Asia/Shanghai`。

![image-20251224125209492](./assets/image-20251224125209492.png)

==重启规则== 按照自己喜好即可。

![image-20251224125229512](./assets/image-20251224125229512.png)

然后确定，等待任务完成即可。

![image-20251224125313265](./assets/image-20251224125313265.png)

查询日志即可找到 ==默认管理账号密码== ，然后访问您的IP地址+1027端口即可访问面板（建议套一层nginx反向代理哦！）

![image-20251224125435427](./assets/image-20251224125435427.png)
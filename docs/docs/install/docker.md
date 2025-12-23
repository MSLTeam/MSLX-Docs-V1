---
title: 在 Docker 中安装
createTime: 2025/12/23 22:28:09
permalink: /docs/install/docker/
icon: b:docker
---
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

   ::: tip 配置镜像源（可选）

   由于默认连接dockerhub可能较慢，可以配置一下镜像源加快拉取的速度。

   目前我查到用的较多的是：[毫秒镜像（要登录，但是似乎好用一点）](https://1ms.run/) | [轩辕镜像（免登录，但是可能会出现限流）](https://docker.xuanyuan.me/)

   :::

2. ### 安装并启动MSLX守护进程 - 配置文件方法

   ```shell
   # 创建数据目录（也可以换成你喜欢的目录）
   mkdir -p /opt/mslx && cd /opt/mslx
   # 新建一个docker配置文件并编辑（如果你不熟悉nano，可以用vim，也可以使用ssh软件自带的文件管理器操作）
   nano docker-compose.yml
   ```

   输入以下配置文件（可以根据需要修改，不会改就默认即可）

   ```yaml
   services:
     daemon:
       image: xiaoyululu/mslx-daemon:latest
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
         # - port=1027 # 配置监听端口，没有特殊虚修不需要改（改了的话上面的端口映射配置需要一起修改）
   ```

   ```
   # 启动
   docker compose up -d
   ```

   执行启动后，Docker会自动拉取镜像和启动MSLX守护进程端。

   如图即为成功：（如果`Created`后没有反应，可以按下回车，然后查看`docker logs -f mslx-daemon` 查询状态）

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
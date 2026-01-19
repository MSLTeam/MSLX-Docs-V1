---
title: 基岩版开服教程
createTime: 2026/01/19 15:51:06
permalink: /docs/server/bedrock/
icon: server
---

::: tip 支持情况

官方基岩版服务端仅支持 ==Windows/Linux== 系统，

若您想使用macOS开基岩版服务器，请使用[容器](/docs/install/docker/)运行MSLX。

:::

## 下载基岩版官方服务端

 <LinkCard title="基岩版服务器下载 | Minecraft" icon="download" description= "注意选择合适您系统的版本哦！" href="https://www.minecraft.net/zh-hans/download/server/bedrock" />

![image-20260119160932463](./assets/image-20260119160932463.png)

## 使用MSLX添加基岩版服务端

:::: steps

1. ### 添加服务端实例

   来到MSLX的 ==新建服务端== 页面，选择 ==自定义模式== 。

   填写服务器名称，路径（可选），启动指令如果是Windows系统请填写`bedrock_server.exe`如果是Linux系统请填写`./bedrock_server`，填写完成后提交创建即可。

   ![image-20260119161427738](./assets/image-20260119161427738.png)

2. ### 上传&解压服务端文件

   前往刚才创建的服务端实例页面，进入 ==文件管理== ，将刚才下载的 ==基岩版服务端压缩包== 上传。

   ![image-20260119161711004](./assets/image-20260119161711004.png)

   上传成功后对此文件解压，注意 ==不要选择创建同名文件夹==。

   ![image-20260119162601472](./assets/image-20260119162601472.png)

   解压出来是这样的。![image-20260119162635096](./assets/image-20260119162635096.png)

   ::: tip 设置可执行权限

   如果您正在使用Linux，请对着`bederock_server`文件设置 ==权限== 为755，都则可能无法运行。

   :::

3. ### 启动服务端

   返回控制台，即可启动服务端。出现`Server started.`字样即为启动成功。

   ![image-20260119162918896](./assets/image-20260119162918896.png)

4. ### 配置内网映射

   ==基岩版使用的协议是udp==。

   ::: tip 

   如果您有公网IP或者是局域网游玩，可以略过这一步。

   但是如果需要本机进入本机的服务器，可能需要解除本地回环限制。（目前新版本基岩版似乎已经不是UWP应用了，可能已经不需要额外操作了）。

   [解除UWP应用本地回环限制](https://www.minebbs.com/threads/uwp.17877/){.readmore}

   :::

   以MSLFrp为例，配置协议为`udp`，本地端口默认为`19132`。

   ![image-20260119163437387](./assets/image-20260119163437387.png)

   创建隧道后进入MSLX的 ==隧道管理== 添加刚才的隧道，并启动即可。

5. ### 加入服务器

  	内网映射成功后，你应该会得到一个类似这样的IP地址`xxx.xxx.xxx.xxx:15566`

  	`xxx.xxx.xxx.xxx`即为IP地址，冒号后面的即为端口。

  	按照下图示例输入即可。

  	![image-20260119165354634](./assets/image-20260119165354634.png)

  	然后畅快的游戏吧~

 	 ![image-20260119165455460](./assets/image-20260119165455460.png)

  ::::

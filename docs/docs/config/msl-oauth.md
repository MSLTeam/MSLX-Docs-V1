---
title: 配置MSL账号登录面板
createTime: 2026/01/17 00:43:11
permalink: /docs/config/msl-oauth/
icon: right-to-bracket
---

::: tip

配置此内容后可以在您的MSLX中直接使用您的MSL用户中心的账号进行快捷登录，方便&安全！

![image-20260117010309307](./assets/image-20260117010309307.png)

:::

## 注册MSL OAuth 2.0 APP

进入MSL用户中心的OAuth App管理页面，点击添加应用。

[MSL OAuth App管理](https://user.mslmc.net/user/oauth){.readmore}

配置好应用名称（随便写），logo地址（可选），回调地址（需要在MSLX设置中复制），权限选择用户信息即可。

![image-20260117005754041](./assets/image-20260117005754041.png)

![image-20260117005848278](./assets/image-20260117005848278.png)

注册成功后，请保存显示的 ==ID和Secret信息== 。

注意：您需要 ==联系管理员== 对App信息进行审核方可正式启用。

![image-20260117010536027](./assets/image-20260117010536027.png)

## 在MSLX配置 MSL OAuth 2.0

进入设置页面，将获取到的ID和密钥信息进行填入即可。

![image-20260117010038253](./assets/image-20260117010038253.png)

![image-20260117010337136](./assets/image-20260117010337136.png)

==记得点击保存哦~==

## 绑定和登录

保存配置后，即可在上方用户信息处进行绑定MSL账号。

![image-20260117010430103](./assets/image-20260117010430103.png)

绑定成功后就可以使用MSL账号一键登录您的MSLX面板啦~

![image-20260117010501417](./assets/image-20260117010501417.png)

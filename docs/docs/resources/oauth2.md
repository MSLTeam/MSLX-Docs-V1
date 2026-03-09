---
icon: arrow-right-to-bracket
title: MSL OAuth 2.0
createTime: 2025/10/12 21:39:20
permalink: /docs/resources/oauth2/
---
::: tip TIPS
此处介绍的开发者将自己的服务 ==接入MSL统一身份验证==（即MSL用户中心服务） ==第三方登录== 。  
通过此服务，您可以将MSLX接入MSL账号快捷登录。

[配置MSL账号登录面板 | MSLX 开服器](https://mslx.mslmc.cn/docs/config/msl-oauth/){.readmore}

:::

## 1.申请OAuth App

进入MSL用户中心的OAuth App管理页面，点击添加应用。

[MSL OAuth App管理](https://user.mslmc.net/user/oauth){.readmore}

![image-20251111163735501](./assets/image-20251111163735501.png)

填写应用的 ==名字==，==图标==（推荐正方形，需要是可以外部访问的url地址），以及您的App的 ==回调地址== 。

注意：应用权限请保持默认的选择 ==用户信息== 。

::: tip 关于应用权限

如果你只是需要调用MSL用户中心进行登录，那么选择 ==用户信息== 是完全足够的。

==所有权限== 是提供MSL账号的完全访问权限，仅适用于对接我们的其他服务（如MSLFrp），若您有这方面的需求，可以在Q群或者邮件联系我们商讨后为您开通相关权限并提供此授权模式的两种方法的文档（App/网页）。[support@mslmc.net](mailto:support@mslmc.net)

:::

![image-20251111164801605](./assets/image-20251111164801605.png)

点击确定后，会返回您的App ==客户端ID== 以及 ==密钥== 信息。
::: important 注意
请妥善保管您的密钥，==密钥仅会显示一次=={.important} 。
后续若忘记密钥就只能重置了。
:::

![image-20251111164954920](./assets/image-20251111164954920.png)

![image-20251111165023639](./assets/image-20251111165023639.png)

::: info 审核
添加App后会进入待审核状态，请 ==联系管理员审核== 。
否则App无法正常调用哦！
:::

## 2.OAuth流程
::: tip OAuth 2.0

[什么是 OAuth2 ?](https://oauth.net/2/){.readmore} 

MSL统一身份验证基于OAuth2的授权码模式规范设计  
若有出入，请联系反馈~
:::

::::: steps

1. ### 请求获取授权码（跳转MSL用户中心授权）

   请求跳转授权地址：

   ```
   https://user.mslmc.net/oauth/authorize
   ```

   查询参数:

   <Card>

   ::: field name="client_id" type="String" required  default="NeQ5v7T72vm4Yi6ADyYAW6m4eVK"
   客户端ID（第一步申请得到的）。
   :::

   ::: field name="state" type="String" optional default="SiGEWINNEQWQ"
   随机字符串，防止CSRF，请求方应当生成并记录此字符串，用于后续验证。

   <Badge type="warning" text="非必须，但强烈建议。"  />

   :::

   ::: field name="redirect_uri" type="String" optional default="https://api.mslmc.cn/api/callback"
   登录成功后重新向的地址（一般是编码的地址），若不传此参数则读取App设置的URI地址。

   <Badge type="warning" text="非必须，但强烈建议。"  />

   :::

   </Card>

   示例拼接地址:

   ```
   https://user.mslmc.net/oauth/authorize?client_id=NeQ5v7T72vm4Yi6ADyYAW6m4eVK&state=SiGEWINNEQWQ&redirect_uri=https%3a%2f%2fapi.mslmc.cn%2fapi%2fcallback
   ```

   ::: warning 最小示例拼接地址

   ```
   https://user.mslmc.net/oauth/authorize?client_id=NeQ5v7T72vm4Yi6ADyYAW6m4eVK
   ```

   但是**不建议**这么做，缺少 ==state=={.warning} 参数可能会导致一些风险（如：==跨站攻击=={.warning}）哦~
   :::

   若地址正确，访问后应该是如下页面:

   ![image-20250518194152354](./assets/image-20250518194152354.png)

2. ### 使用授权码交换AccessToken

   登录成功后，MSL用户中心将根据填写的App回调地址重定向并添加 ==code== 和 ==state== 参数（方法是GET）
   ::: tip
   ==code== 有效期只有 ==10分钟== 。
   :::

   MSL用户中心授权成功的重定向示例:

   ```
   https://api.mslmc.cn/api/callback?code=y94vzbhskzcizEDmJMbWt775tbI&state=iGEWINNEQWQ
   ```

   您的客户端接收到回调后应该核对 ==state== 否与请求时的一致，若不一致，请 ==拒绝登录请求== 。

   然后需要用拿到的code通过api交换得到AccessToken

   <Badge type="warning" text="POST application/x-www-form-urlencoded 或者 application/json"  />

   ```
   https://user.mslmc.net/api/oauth/exchangeAccessToken
   ```

   :::: field-group

   ::: field name="code" type="String" required  default="y94vzbhskzcizEDmJMbWt775tbI"
   回调拿到的授权码
   :::

   ::: field name="client_id" type="String" required default="NeQ5v7T72vm4Yi6ADyYAW6m4eVK"
   您在第一步申请的客户端ID

   :::

   ::: field name="client_secret" type="String" required default="FAOFoGDPtTK8Yudlerv..."
   您在第一步申请的客户端密钥

   :::

   ::::

   

   返回示例:

   ```json
   {
     "code": 200,
     "msg": "授权成功",
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc0NzU1NzY3MiwiZXhwIjoxNzQ3NTYxMjcyfQ.iyX0dIXxrUkr6Dg7HCZ7YNQb2G1u5EYpzh-6wKYJShg",
     "expires_in": 3600,
     "token_type": "Bearer",
     "scope": "user_info"
   }
   ```

   获取到 ==access_token== 即可

   [完整API文档：**获取Access Token - MSL-User-System**](https://apidoc-user.mslmc.cn/297247077e0){.readmore}

3. ### 获取用户信息

   ::: warning 接口适用提醒

   本api接口仅适用于权限类型为 ==用户信息=={.warning} 的应用。

   若您使用的应用类型为所有权限，请参照我们提供的API文档获取用户信息。

   :::

   <Badge type="tip" text="GET"  />

   ```
   https://user.mslmc.net/api/oauth/user
   ```

   需要添加 ==Authorization== 请求头

   在 Header 添加参数 Authorization，其值为在 Bearer 之后拼接 Token
   示例: 

   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTc0NzU1NzY3MiwiZXhwIjoxNzQ3NTYxMjcyfQ.iyX0dIXxrUkr6Dg7HCZ7YNQb2G1u5EYpzh-6wKYJShg
   ```

   返回示例:

   ```json
   {
     "code": 200,
     "msg": "获取用户信息成功",
     "uid": 1,
     "username": "小可爱",
     "email": "user@mslmc.cn",
     "qq": null,
     "score": 1500,
     "avatar": "https://cravatar.cn/avatar/d31946d60f6051840edc9d41a1261?d=identicon&s=640",
     "regTime": 1737992780,
     "lastLoginTime": 1745988703,
     "permission": 1,
     "realName": false,
     "lastCheckInTime": null,
     "twoFactorAuth": true
   }
   ```

   请使用 ==uid== 字段作为判断用户绑定的参数，这是每位用户唯一的ID，且不会变化。

   其他的信息按需使用/更新即可。

   [完整API文档：**获取用户信息 - MSL-User-System**](https://apidoc-user.mslmc.cn/297251390e0){.readmore}

:::::

## 3.快速接入MSL登录

### # 接入到WordPress

使用此插件: 

<RepoCard repo="luluxiaoyu/MSL-OAuth2-WordPress" />

下载zip，并在您的wordpress上安装并启用插件。

![image-20250519124130518](./assets/image-20250519124130518.png)

在插件设置填写OAuth App信息:

![image-20250519124318341](./assets/image-20250519124318341.png)

回调地址要填写到OAuth App信息中

![image-20250519124415802](./assets/image-20250519124415802.png)

两边的信息配置好后，即可进入个人资料页面绑定MSL账户，绑定后即可使用MSL账户快速登录~

![image-20250519124520689](./assets/image-20250519124520689.png)
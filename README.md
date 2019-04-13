## 扫码体验

![QRCode](https://user-images.githubusercontent.com/15965696/47959988-d2864d80-e02c-11e8-8c39-dac879bad3d6.jpg)

> [源码地址](https://github.com/kezhenxu94/mini-github), 欢迎 Star

## 声明
众所周知，GitHub 自己并没有官方 App，更别说微信小程序了。**本程序完全为第三方开发者开发，仅用于学习交流，禁止用于其他用途**。若要使用正版，请使用 [GitHub 网页端](https://github.com)。

> 该小程序所有 API 均来自 GitHub 官方提供的开发者 API 第三版，详情请戳 [开发者文档](https://developer.github.com/v3/)。

## Screenshots
| Feeds | Issues | Trendings | Pulls | Profile |
| :------: | :------: | :------: | :------: | :------: |
| ![feeds](https://user-images.githubusercontent.com/15965696/47966268-a2ba6280-e08b-11e8-9f38-871b56bfa260.jpg) | ![my-issues](https://user-images.githubusercontent.com/15965696/47966271-a352f900-e08b-11e8-998e-b63e971af6f1.jpg) | ![trendings](https://user-images.githubusercontent.com/15965696/47966282-a4842600-e08b-11e8-8933-df4616059d63.jpg) | ![my-pulls](https://user-images.githubusercontent.com/15965696/47966272-a352f900-e08b-11e8-88f0-a8e8915cc07b.jpg) | ![user](https://user-images.githubusercontent.com/15965696/47966283-a51cbc80-e08b-11e8-8418-0d125736cb0e.jpg) |
| Search Repos | Search Users | Repo Detail | Repo Detail | Issue Detail |
| ![search-repos](https://user-images.githubusercontent.com/15965696/47966278-a3eb8f80-e08b-11e8-8c77-ed0e6f5f04bc.jpg) | ![search-users](https://user-images.githubusercontent.com/15965696/47966279-a4842600-e08b-11e8-9dbb-8ef5480710e9.jpg) | ![repo-readme](https://user-images.githubusercontent.com/15965696/47966277-a3eb8f80-e08b-11e8-9b4a-ad631b2c1cd2.jpg) | ![repo-issues](https://user-images.githubusercontent.com/15965696/47966276-a3eb8f80-e08b-11e8-953b-c699167ebfe7.jpg) | ![issue-detail](https://user-images.githubusercontent.com/15965696/47966270-a2ba6280-e08b-11e8-8c36-33f58f8cc1e0.jpg) |
| Followers | Following | My Repos | My Starred | Sign In |
| ![followers](https://user-images.githubusercontent.com/15965696/47966269-a2ba6280-e08b-11e8-8ada-3694a92e4ebb.jpg) | ![following](https://user-images.githubusercontent.com/15965696/47966429-37719000-e08d-11e8-90a9-d0687bf9cb67.jpg) | ![my-repos](https://user-images.githubusercontent.com/15965696/47966273-a352f900-e08b-11e8-8c78-fe70d80f1862.jpg) | ![my-starred](https://user-images.githubusercontent.com/15965696/47966274-a3eb8f80-e08b-11e8-9dbc-d65cb0537b4d.jpg) | ![sign-in](https://user-images.githubusercontent.com/15965696/47966280-a4842600-e08b-11e8-9d01-c54b07029de4.jpg) |

> 由于小程序不断优化，界面细节可能有所变化，请以实际页面为准

## Notes
由于个人小程序内无法跳转网页，因此无法通过 Oauth 方式登陆 GitHub，所以这里使用了账号密码的方式登陆，**账号密码只会通过代理服务器转发到 GitHub 服务器认证，不会被保存，不会被保存，不会被保存，请放心使用（有疑问的可检查源代码）**，~~后续会让用户填自己的 access token 等更安全的方式~~（已实现）。

## TODO
- [x] Star, Watch, Fork
- [x] 评论, 回复评论
- [x] 使用 Token 登陆
- [x] Markdown 渲染优化
- [ ] 显示 Issue, PR 的 Label
- [x] 支持使用 Token 登陆

## Contributions
欢迎任何类型的贡献, 包括但不局限于:
- :mag: 报告问题: 请在 [Issue 列表](https://github.com/kezhenxu94/mini-github/issues) 创建一个 Issue 报告你发现的问题
- :bug: 修复 Bug: 请在 [Issue 列表](https://github.com/kezhenxu94/mini-github/issues) 查看当前已发现的 Bug, 修复完成后发送 Pull Request
- :hammer: 优化: 代码优化, 性能优化, 界面优化, 文档优化等等
- :new: 新功能: 从上面 [TODO](#todo) 列表中选择未完成的功能进行实现, 然后发送 Pull Request
- :moneybag: 捐献: 如果你觉得小程序方便了你或者源码让你学习有所收获, 可以在扫描 [二维码](#donation) 请作者喝一杯茶 :tea: 

## Change Logs
- v2.2.0
  - 个人中心仓库列表支持查看私有仓库
- v2.1.0
  - 支持使用 Token 登陆
  - Markdown 渲染优化
- v2.1.0 以前
  - 查看 GitHub 榜单, 包括按语言/时间跨度筛选
  - 查看 Feed 列表, 查看最近活动
  - 查看与我相关的 Issue 列表, Pull Request 列表, 包括我创建的, 指派给我的, 等等
  - 查看 Issue, Pull Request 详情及回复, 并可回复评论
  - 查看代码仓库详情, 可 Star, Fork, Watch
  - 查看本人用户信息以及他人用户信息, 关注列表, 关注者列表, 可关注和取消关注
  - 搜索代码仓库和用户

## Donation
| 支付宝 | 微信支付 | 支付宝 | 微信支付 | 
| :------: | :------: | :------: | :------: |
| ![alipay](https://user-images.githubusercontent.com/15965696/55284497-83a9cd80-53aa-11e9-84f5-c61ba7d1190d.jpg) | ![wepay](https://user-images.githubusercontent.com/15965696/55284500-8d333580-53aa-11e9-8b3f-974cd0508f8e.png) | ![alipay](https://user-images.githubusercontent.com/15965696/55284497-83a9cd80-53aa-11e9-84f5-c61ba7d1190d.jpg) | ![wepay](https://user-images.githubusercontent.com/15965696/55284500-8d333580-53aa-11e9-8b3f-974cd0508f8e.png) |

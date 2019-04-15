## 扫码体验

![QRCode](https://user-images.githubusercontent.com/15965696/47959988-d2864d80-e02c-11e8-8c39-dac879bad3d6.jpg)

> [源码地址](https://github.com/kezhenxu94/mini-github), 欢迎 Star

## 声明
众所周知，GitHub 自己并没有官方 App，更别说微信小程序了。**本程序完全为第三方开发者开发，仅用于学习交流，禁止用于其他用途**。若要使用正版，请使用 [GitHub 网页端](https://github.com)。

> 该小程序所有 API 均来自 GitHub 官方提供的开发者 API 第三版，详情请戳 [开发者文档](https://developer.github.com/v3/)。

## Screenshots
| Feeds | Issues | Trendings | Pulls | Profile |
| :------: | :------: | :------: | :------: | :------: |
| ![feeds](https://user-images.githubusercontent.com/15965696/56143752-a7d4f380-5fd3-11e9-964e-627c21919485.jpg) | ![my-issues](https://user-images.githubusercontent.com/15965696/56143750-a73c5d00-5fd3-11e9-9191-f2915088aa54.jpg) | ![trendings](https://user-images.githubusercontent.com/15965696/56143749-a6a3c680-5fd3-11e9-95a9-2bfe6b10a31a.jpg) | ![my-pulls](https://user-images.githubusercontent.com/15965696/56143748-a60b3000-5fd3-11e9-9b40-c05705e529bd.jpg) | ![user](https://user-images.githubusercontent.com/15965696/56143747-a5729980-5fd3-11e9-9421-14f4339d56e3.jpg) |
| Search Repos | Search Users | Repo Detail | Repo Detail | Issue Detail |
| ![search-repos](https://user-images.githubusercontent.com/15965696/56143745-a4da0300-5fd3-11e9-8a61-f942745f443a.jpg) | ![search-users](https://user-images.githubusercontent.com/15965696/56143742-a3a8d600-5fd3-11e9-8f4f-d3a795db7b55.jpg) | ![repo-readme](https://user-images.githubusercontent.com/15965696/56143733-a0ade580-5fd3-11e9-9f8c-0b5e82258096.jpg) | ![repo-issues](https://user-images.githubusercontent.com/15965696/56143732-a0154f00-5fd3-11e9-951d-ce93607e1867.jpg) | ![issue-detail](https://user-images.githubusercontent.com/15965696/56143734-a1467c00-5fd3-11e9-8ac2-527dd180a304.jpg) |
| Followers | Following | My Repos | My Starred | Sign In |
| ![followers](https://user-images.githubusercontent.com/15965696/56143741-a3a8d600-5fd3-11e9-9fc9-362ac5a5f208.jpg) | ![following](https://user-images.githubusercontent.com/15965696/56143731-a0154f00-5fd3-11e9-8c71-1a86a33dc4d1.jpg) | ![my-repos](https://user-images.githubusercontent.com/15965696/56143727-9ee42200-5fd3-11e9-9266-82781992c30d.jpg) | ![my-starred](https://user-images.githubusercontent.com/15965696/56143726-9e4b8b80-5fd3-11e9-84a3-14b81599b5e1.jpg) | ![sign-in](https://user-images.githubusercontent.com/15965696/56143723-9db2f500-5fd3-11e9-8a9b-8a034f4b6c52.jpg) |

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
| 支付宝 | 微信支付 |
| :------: | :------: |
| ![alipay](https://user-images.githubusercontent.com/15965696/55284497-83a9cd80-53aa-11e9-84f5-c61ba7d1190d.jpg) | ![wepay](https://user-images.githubusercontent.com/15965696/55284500-8d333580-53aa-11e9-8b3f-974cd0508f8e.png) |

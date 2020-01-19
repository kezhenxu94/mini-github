> 由于 GitHub 已经推出官方移动端应用, 本小程序将停止开发, 仅作为开发小程序的参考例子.

[![GitHub closed issues](https://img.shields.io/github/issues-closed/kezhenxu94/mini-github.svg)](https://github.com/kezhenxu94/mini-github) [![GitHub stars](https://img.shields.io/github/stars/kezhenxu94/mini-github.svg)](https://github.com/kezhenxu94/mini-github) [![WeChat ID](https://img.shields.io/badge/WeChat-CynicalKid-%2344b549.svg)](https://github.com/kezhenxu94/mini-github) [![QQ](https://img.shields.io/badge/QQ-917423081-12b7f5.svg)](https://github.com/kezhenxu94/mini-github) [![QQ ID](https://img.shields.io/badge/QQ%20Group-948577975-12b7f5.svg)](https://github.com/kezhenxu94/mini-github)

## 扫码体验

![QRCode](https://user-images.githubusercontent.com/15965696/57529191-de015b00-7366-11e9-91c3-9bbb517c7956.png)

> 欢迎 Star 和任何形式的贡献

## 技术交流

| 微信群 | 个人微信 |
| :---: | :----: |
| ![GroupQRCode](https://user-images.githubusercontent.com/15965696/58446451-5de33f80-8133-11e9-9f06-fc9ca6ba113c.png) | ![PersonalQRCode](https://user-images.githubusercontent.com/15965696/57529474-929b7c80-7367-11e9-95a2-f1063bf22c7f.jpg) |

> 如果群二维码过期，请添加作者微信拉你入群

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

目前 mini-github 支持两种登陆方式：通过账号密码、通过 token。通过 OAuth 由于个人小程序内部无法跳转网页所以并不支持

* 账号密码登陆：**账号密码只会通过代理服务器转发到 GitHub 服务器认证，不会被保存，不会被保存，不会被保存，请放心使用（有疑问的可检查源代码）**
* Token 登陆：[参考 Wiki](https://github.com/kezhenxu94/mini-github/wiki/%E5%88%A9%E7%94%A8Token%E7%99%BB%E9%99%86)

## TODO

- [x] Star, Watch, Fork
- [x] 评论, 回复评论
- [x] 使用 Token 登陆
- [x] Markdown 渲染优化
- [x] 显示 Issue, PR 的 label
- [x] 支持使用 Token 登陆
- [x] 显示 Issue, PR 的时间线
- [x] News 页面添加通知 Tab
- [x] 通过微信服务消息接收 GitHub 通知
- [x] Issue/PR 详情页可编辑 label (如果有权限)
- [ ] Issue/PR 详情页可编辑 milestone, project (如果有权限)
- [ ] Issue/PR 详情页可 assign 成员 (如果有权限)
- [x] 支持重新编辑 Issue(Title, Comment)
- [x] 支持在项目详情页新建 Issue
- [x] 支持多主题样式: light, dark, oled(black)

## Contributions

欢迎任何类型的贡献, 包括但不局限于:
- :mag: 报告问题: 请在 [Issue 列表](https://github.com/kezhenxu94/mini-github/issues) 创建一个 Issue 报告你发现的问题
- :bug: 修复 Bug: 请在 [Issue 列表](https://github.com/kezhenxu94/mini-github/issues) 查看当前已发现的 Bug, 修复完成后发送 Pull Request
- :hammer: 优化: 代码优化, 性能优化, 界面优化, 文档优化等等
- :new: 新功能: 从上面 [TODO](#todo) 列表中选择未完成的功能进行实现, 然后发送 Pull Request
- :moneybag: 捐献: 如果你觉得小程序方便了你或者源码让你学习有所收获, 可以在扫描 [二维码](#donation) 请作者喝一杯茶 :tea: 

## Contributors

- [kezhenxu94](https://github.com/kezhenxu94)

- [ZengyiMa](https://github.com/ZengyiMa)

- [johnnychen94](https://github.com/johnnychen94)

- [maoqxxmm](https://github.com/maoqxxmm)

## Change Logs

- v2.9.0
  - :new: 支持多主题样式: light, dark, oled(black)
  - :hammer: 多种主题下, tab 栏图标均提供选中高亮样式
  - :bug: 通知页面多种通知 icon 错误问题 (thanks to @maoqxxmm)
- v2.8.2
  - :new: 支持重新编辑 Issue(Title, Comment)
  - :new: 支持在项目详情页新建 Issue
  - :hammer: Markdown 渲染支持 tasklist
  - :hammer: Markdown 渲染支持 GitHub Emoji :smile:
- v2.8.0
  - :new: Issue/PR 详情页可编辑 label (如果有权限)
- v2.6.0
  - :new: 显示 Issue/PR 时间线
  - :new: 支持通过微信服务消息接收 GitHub 未读消息通知
- v2.5.0
  - :new: News 页面添加通知 Tab, 按 Repo 分组显示
- v2.4.0
  - :new: Issue 和 Pull Request 支持查看 label
  - :new: Issue 和 Pull Request 评论作者添加与当前项目关系
  - :new: Repo 详情页支持查看 contributors 和贡献次数及排名
  - :new: Markdown(包含 README, 评论)中的超链接进行应用内跳转(如果可能), 或打开 Markdown 展示页
  - :new: Trending 榜单列表展示 Repo 主要五位贡献人
  - :bug: 我的 Issue 列表展示不全
- v2.2.0
  - :new: 个人中心仓库列表支持查看私有仓库
- v2.1.0
  - :new: 支持使用 Token 登陆
  - :hammer: Markdown 渲染优化
- v2.1.0 以前
  - :new: 查看 GitHub 榜单, 包括按语言/时间跨度筛选
  - :new: 查看 Feed 列表, 查看最近活动
  - :new: 查看与我相关的 Issue 列表, Pull Request 列表, 包括我创建的, 指派给我的, 等等
  - :new: 查看 Issue, Pull Request 详情及回复, 并可回复评论
  - :new: 查看代码仓库详情, 可 Star, Fork, Watch
  - :new: 查看本人用户信息以及他人用户信息, 关注列表, 关注者列表, 可关注和取消关注
  - :new: 搜索代码仓库和用户

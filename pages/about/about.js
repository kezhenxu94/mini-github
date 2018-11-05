Page({
  data: {
    projectAddress: 'https://github.com/kezhenxu94/mini-github',
    github: 'https://github.com/kezhenxu94',
    email: 'kezhenxu94@163.com',
    qq: '917423081',
  },
  copy(e) {
    let dataset = (e.currentTarget || {}).dataset || {}
    let title = dataset.title || ''
    let content = dataset.content || ''
    wx.setClipboardData({
      data: content,
      success() {
        wx.showToast({
          title: `${title} 已复制`,
          duration: 2000,
        })
      },
    })
  },
  toProjectPage() {
    wx.navigateTo({
      url: '/pages/repo-detail/repo-detail?url=https://api.github.com/repos/kezhenxu94/mini-github',
    })
  },
  toUserPage() {
    wx.navigateTo({
      url: '/pages/user/user?username=kezhenxu94',
    })
  }
})
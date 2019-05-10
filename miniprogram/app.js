App({
  onLaunch: function () {
    let theme = wx.getStorageSync('theme')
    if (!theme) {
      theme = 'dark'
      wx.setStorage({
        key: 'theme',
        data: theme
      })
    }
  },
  globalData: {}
})
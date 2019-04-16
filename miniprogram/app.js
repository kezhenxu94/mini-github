App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'github-production',
      traceUser: true
    })
  },
  globalData: {
    userInfo: null
  }
})
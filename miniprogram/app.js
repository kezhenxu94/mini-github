App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'github-development',
      // env: 'github-production',
      traceUser: true
    })
  },
  globalData: {
    userInfo: null
  }
})
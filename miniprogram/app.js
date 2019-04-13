const github = require('api/github.js')

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
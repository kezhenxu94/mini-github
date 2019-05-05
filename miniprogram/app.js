const userUtils = require('utils/users.js')

App({
  onLaunch: function () {
    // const env = 'github-production'
    const env = 'github-development'

    wx.cloud.init({
      env,
      traceUser: true
    })
  },
  globalData: {
    db: null,
    openId: null
  }
})
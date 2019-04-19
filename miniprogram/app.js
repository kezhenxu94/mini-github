const userUtils = require('utils/users.js')

App({
  onLaunch: function () {
    const env = 'github-production' // 'github-development'

    wx.cloud.init({
      env,
      traceUser: true
    })
    
    const db = wx.cloud.database({ env })

    this.globalData.db = db

    wx.cloud.callFunction({ name: 'login' }).then(res => {
      const openId = res.result.openid
      this.globalData.openId = openId
      db.collection('users').doc(openId).get().then(res => {
        const { data: { token } = {} } = res
        if (token) {
          userUtils.signIn(token)
        }
      })
    })

  },
  globalData: {
    db: null,
    openId: null
  }
})
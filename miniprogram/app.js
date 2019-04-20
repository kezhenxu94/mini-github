const userUtils = require('utils/users.js')

App({
  onLaunch: function () {
    // const env = 'github-production'
    const env = 'github-development'

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
      db.collection('subscriptions').where({ _openid: openId }).count().then(({ total }) => {
        if (total === 0) {
          db.collection('subscriptions').add({
            data: {
              type: 'participating',
              createdAt: db.serverDate(),
              since: db.serverDate()
            }
          })
        }
      })
    })

  },
  globalData: {
    db: null,
    openId: null
  }
})
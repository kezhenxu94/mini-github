const userUtils = require('utils/users.js')

App({
  onLaunch: function () {
    // const env = 'github-production'
    const env = 'github-development'

    let theme = wx.getStorageSync('theme')
    if (!theme) {
      theme = 'dark'
    }
    wx.setStorageSync('theme', theme)

    wx.cloud.init({
      env,
      traceUser: true
    })
    
    const db = wx.cloud.database({ env })

    this.globalData.db = db

    wx.cloud.callFunction({ name: 'login' }).then(res => {
      const openId = res.result.openid
      this.globalData.openId = openId
      db.collection('users').where({ _id: openId }).limit(1).get().then(res => {
        const { data } = res
        if (data && data.length > 0) {
          const { token } = data[0]
          if (token) {
            userUtils.signIn(token)
          }
        } else {
          const user = wx.getStorageSync('user')
          const token = wx.getStorageSync('token')
          if (token) {
            db.collection('users').add({ data: { _id: openId, token, user } })
          }
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
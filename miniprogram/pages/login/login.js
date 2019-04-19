const app = getApp()
const collection = app.globalData.db.collection('users')
const userUtils = require('../../utils/users.js')
Page({
  data: {
    mobile: '',
    password: ''
  },
  getToken (username, password) {
    const str = username + ':' + password
    return 'Basic ' + wx.arrayBufferToBase64(new Uint8Array([...str].map(char => char.charCodeAt(0))))
  },
  login (token) {
    wx.showLoading({
      title: '正在登陆',
    })

    userUtils.signIn(token).then(({ user, token }) => {
      collection.doc(app.globalData.openId).set({ data: { token, user } })
      wx.showToast({ title: '登录成功' })
      wx.navigateBack({})
    }).catch(error => {
      wx.showToast({
        title: '登陆失败: ' + error.message,
        icon: 'none',
        duration: 5000
      })
    })
  },
  commitAccount (e) {
    let values = e.detail.value
    let username = values.username || ''
    let password = values.password || ''
    if (!username.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
      })
      return
    }
    if (!password.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入登录密码',
        icon: 'none',
      })
      return
    }
    const token = this.getToken(username, password)
    this.login(token)
  },
  commitToken(e) {
    let values = e.detail.value
    let token = values.token || ''
    if (!token.replace(/\s+/g, '')) {
      wx.showToast({
        title: '请输入 Token',
        icon: 'none'
      })
      return
    }
    this.login('token ' + token)
  }
})
const config = getApp().globalData.config
const utils = require('../../utils/util.js')
Page({
  data: {
    mobile: '',
    password: ''
  },
  login (params) {
    wx.showLoading({
      title: '加载中...',
    })
    let url = 'https://api.github.com/user'
    let username = params.username
    let password = params.password
    let token = this.getToken(username, password)
    wx.request({
      url,
      header: {
        'Authorization': token
      },
      success: function (res) {
        console.log('login success res: ', res)
        let statusCode = res.statusCode
        if (statusCode !== 200) {
          wx.showToast({
            title: '未知错误',
            icon: 'none',
          })
          return
        }
        let data = res.data
        wx.showToast({
          title: '已登录',
          icon: 'none',
        })
        wx.setStorage({
          key: 'token',
          data: token,
        })
        wx.setStorage({
          key: 'user',
          data: data,
        })
        wx.navigateBack({})
      },
      fail: function () {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      },
    })
  },
  commit (e) {
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
    this.login(values)
  },
  getToken (username, password) {
    let str = username + ':' + password
    return 'Basic ' + wx.arrayBufferToBase64(new Uint8Array([...str].map(char => char.charCodeAt(0))))
  }
})
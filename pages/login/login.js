const moment = require('../../lib/moment.js')
const utils = require('../../utils/util.js')
const githubApi = require('../../api/github.js')
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
    githubApi.login({
      username, password
    }, user => {
      wx.showToast({
        title: '已登录',
        icon: 'none',
      })
      wx.setStorage({
        key: 'user',
        data: user,
      })
      wx.navigateBack({})
    }, error => {
      wx.showToast({
        title: error.message,
        icon: 'none',
        duration: 10000
      })
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
  }
})
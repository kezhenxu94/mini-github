const github = require('../../api/github.js')
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
  },
  onLoad: function() {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res)
      }
    })
  },
  getUserInfo: function(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.info(e)
  }
})
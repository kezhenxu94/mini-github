const utils = require('../../utils/util.js')

Page({
  data: {
    user: {},
    signedIn: false
  },
  
  onLoad: function (options) {
    this.init()
  },
  
  onShow: function () {
    this.init()
  },

  onPullDownRefresh: function () {
    this.init()
  },

  init: function () {
    const currentUser = utils.getCurrentUser()
    if (currentUser) {
      this.setData({
        user: currentUser,
        signedIn: true
      })
    } else {
      this.setData({
        user: currentUser,
        signedIn: false
      })
    }
    wx.stopPullDownRefresh()
  },

  onTapEmail: function () {
    this.copyToClipBoard(this.data.user.email)
  },

  onTapBlog: function () {
    this.copyToClipBoard(this.data.user.blog)
  },

  copyToClipBoard: function (content) {
    wx.setClipboardData({
      data: content,
      success (res) {
        wx.getClipboardData()
      }
    })
  }
})
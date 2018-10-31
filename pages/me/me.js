// pages/me/me.js
const utils = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {
    user: {},
    signedIn: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.init()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.init()
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    this.init()
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

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
  }
})
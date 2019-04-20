const notificationUtils = require('../../utils/notifications.js')

Page({
  data: {
    enableNotification: false
  },

  onLoad: function(options) {

  },

  onShow: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  },

  onChangeNotification: function(e) {
    this.setData({
      enableNotification: e.detail
    })
  },

  formSubmit: function(e) {
    const enableNotification = this.data.enableNotification
    const formId = e.detail.formId

    notificationUtils.report({
      formId,
      extra: {
        settings: {
          enableNotification
        }
      }
    })
  },

  logout: function (e) {
    const formId = e.detail.formId

    notificationUtils.report({ formId })

    wx.showModal({
      title: '确认退出',
      content: '确认退出登陆状态吗? 退出后无法查看自己关注的事件, Issue, Pull Request; 也无法进行交互类型的操作(Star, Watch, Fork, Follow等)',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.reLaunch({
            url: '/pages/me/me'
          })
        }
      }
    })
  },

  about: function (e) {
    const formId = e.detail.formId

    notificationUtils.report({ formId })

    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  feedback: function (e) {
    const formId = e.detail.formId

    notificationUtils.report({ formId })

    wx.previewImage({
      urls: ['cloud://github-production.6769-github-production/kezhenxu94.jpg']
    })
  }
})
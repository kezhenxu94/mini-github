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
  }
})
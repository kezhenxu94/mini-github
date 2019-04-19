const app = getApp()
const collection = app.globalData.db.collection('notifications')

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
    const enabled = this.data.enableNotification
    if (!enabled) {
      return
    }

    const openId = app.globalData.openId
    const formId = e.detail.formId

    collection.doc(openId).set({
      data: {
        formId,
        enabled
      }
    })
  }
})
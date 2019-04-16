const http = require('../../api/http.js')

Page({

  data: {
    url: null,
    md: {}
  },

  onLoad: function (options) {
    const { url } = options
    this.setData({
      url
    })
    wx.startPullDownRefresh({})
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {
    const { url } = this.data
    
    if (!url) {
      return wx.stopPullDownRefresh()
    }

    const baseUrl = url.replace(/\/[^/]+\.[mM][dD]$/, '')
    console.info({baseUrl})
    http.get(url).then(({ data, status }) => {
      if (status !== 200) {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: data,
          icon: 'none'
        })
        return
      }
      this.setData({
        md: {
          content: data,
          baseUrl: baseUrl
        }
      })
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})
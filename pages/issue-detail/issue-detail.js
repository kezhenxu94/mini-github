const github = require('../../api/github.js')

Page({
  data: {
    id: '',
    url: '',
    issue: {}
  },
  
  onLoad: function (options) {
    var url = options.url
    console.log('url=' + url)
    this.setData({
      url: url
    })
    wx.startPullDownRefresh({})
  },
  
  onPullDownRefresh: function () {
    github.getIssue(this.data.url, issue => {
      console.log(issue)
      wx.stopPullDownRefresh()
      this.setData({
        issue: issue
      })
    }, error => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    })
  }
})
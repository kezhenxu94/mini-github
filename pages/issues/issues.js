const github = require('../../api/github.js')
const moment = require('../../lib/moment.js')
const utils = require('../../utils/util.js')

Page({
  data: {
    filter: 'created',
    issues: [],
    scrollTop: 0,
    lastRefresh: moment().unix(),
    isSignedIn: utils.isSignedIn()
  },
  
  onShow: function () {
    this.setData({
      isSignedIn: utils.isSignedIn()
    })
    var lastMoment = moment(this.data.lastRefresh)
    if (this.data.scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  onPullDownRefresh: function () {
    this.reloadData()
  },

  onPageScroll (e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  reloadData: function () {
    github.getIssues(this.data.filter, data => {
      console.log(data)
      this.setData({
        issues: data,
        lastRefresh: moment()
      })
      wx.stopPullDownRefresh()
    }, error => {
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
      wx.stopPullDownRefresh()
    })
  },

  changeFilter: function (event) {
    switch (event.detail.index) {
      case 0:
        this.setData({ filter: 'created' })
        break
      case 1:
        this.setData({ filter: 'assigned' })
        break
      case 2:
        this.setData({ filter: 'mentioned' })
        break
      case 3:
        this.setData({ filter: 'subscribed' })
        break
      default:
        this.setData({ filter: 'all' })
        break
    }
    wx.startPullDownRefresh({})
  },

  toIssueDetail: function (event) {
    console.log(event)
    var issue = event.currentTarget.dataset.issue
    var url = issue.url
    wx.navigateTo({
      url: '/pages/issue-detail/issue-detail?url=' + url
    })
  }
})
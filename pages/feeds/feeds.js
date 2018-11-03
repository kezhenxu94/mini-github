const moment = require('../../lib/moment.js')
const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

Page({
  data: {
    events: [],
    scrollTop: 0,
    lastRefresh: moment().unix(),
    isSignedIn: utils.isSignedIn(),
    links: {},
    loadingMore: false
  },
  
  onShow: function () {
    var lastMoment = moment(this.data.lastRefresh)
    if (this.data.scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  onPullDownRefresh: function () {
    this.reloadData()
  },

  onReachBottom: function () {
    console.log(this.data.links)
    this.loadMore()
  },

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  reloadData: function () {
    this.setData({
      isSignedIn: utils.isSignedIn()
    })
    github.getGlobalEvents(undefined, res => {
      console.log(res)
      wx.stopPullDownRefresh()
      this.setData({
        events: res.data,
        links: res.links,
        lastRefresh: moment()
      })
    }, error => {
      wx.stopPullDownRefresh()
    })
  },

  loadMore: function () {
    this.setData({ loadingMore: true })
    github.getGlobalEvents(this.data.links['rel="next"'], res => {
      console.log(res)
      wx.stopPullDownRefresh()
      this.setData({
        events: [...this.data.events, ...res.data],
        links: res.links,
        loadingMore: false,
        lastRefresh: moment()
      })
    }, error => {
      wx.stopPullDownRefresh()
      this.setData({ loadingMore: false })
    })
  },
  
  toFeedDetail: function (event) {
    var feed = event.currentTarget.dataset.feed
    if (feed.type.startsWith('Issue')) {
      var issue = (feed.payload || {}).issue || {}
      var url = issue.url
      wx.navigateTo({
        url: '/pages/issue-detail/issue-detail?url=' + url
      })
    }
  }
})
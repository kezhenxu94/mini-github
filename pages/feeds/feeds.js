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
    loadingMore: false,
    refresing: false
  },

  onShow: function() {
    this.setData({
      isSignedIn: utils.isSignedIn()
    })
    var lastMoment = moment(this.data.lastRefresh)
    if (this.data.scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  onShareAppMessage: function (options) {
  },

  onPullDownRefresh: function() {
    this.reloadData()
  },

  onReachBottom: function() {
    this.loadMore()
  },

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  reloadData: function() {
    if (this.data.refresing) return
    this.setData({
      isSignedIn: utils.isSignedIn(),
      refresing: true
    })
    github.getGlobalEvents(undefined).then(res => {
      console.log(res)
      wx.stopPullDownRefresh()
      this.setData({
        events: res.data,
        links: res.links,
        lastRefresh: moment(),
        refresing: false
      })
    }).catch(error => {
      wx.stopPullDownRefresh()
    })
  },

  loadMore: function() {
    if (this.data.loadingMore) {
      console.log('Loading more, returning')
      return
    }

    this.setData({
      loadingMore: true
    })
    github.getGlobalEvents(this.data.links['rel="next"']).then(res => {
      console.log(res)
      wx.stopPullDownRefresh()
      this.setData({
        events: [...this.data.events, ...res.data],
        links: res.links,
        loadingMore: false,
        lastRefresh: moment()
      })
    }).catch(error => {
      wx.stopPullDownRefresh()
      this.setData({
        loadingMore: false
      })
    })
  }
})
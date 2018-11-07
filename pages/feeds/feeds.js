const moment = require('../../lib/moment.js')
const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

Page({
  data: {
    events: [],
    scrollTop: 0,
    lastRefresh: moment().unix(),
    isSignedIn: utils.isSignedIn(),
    next: null,
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
    const successHandler = ({ events, next }) => {
      wx.stopPullDownRefresh()
      this.setData({
        events,
        next,
        lastRefresh: moment(),
        refresing: false
      })
    }
    const errorHandler = (error) => {
      console.log(error)
      wx.stopPullDownRefresh()
    }
    if (utils.isSignedIn()) {
      const username = utils.getCurrentUser().login
      github.users(username).receivedEvents().then(successHandler).catch(errorHandler)
    } else {
      github.events().end().then(successHandler).catch(errorHandler)
    }
  },

  loadMore: function() {
    if (this.data.loadingMore) {
      console.log('Loading more, returning')
      return
    }
    
    if (this.data.next) {
      this.setData({
        loadingMore: true
      })
      this.data.next().then(({ events, next }) => {
        wx.stopPullDownRefresh()
        this.setData({
          events: [...this.data.events, ...events],
          next,
          lastRefresh: moment(),
          refresing: false
        })
      }).catch(error => wx.stopPullDownRefresh())
    }
  }
})
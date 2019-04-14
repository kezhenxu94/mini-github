const moment = require('../../lib/moment.js')
const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

let scrollTop = 0
let refreshing = false
let lastRefresh = moment().unix()
let nextFunc = null

Page({
  data: {
    events: [],
    isSignedIn: utils.isSignedIn(),
    loadingMore: false
  },

  onShow: function() {
    this.setData({
      isSignedIn: utils.isSignedIn()
    })
    var lastMoment = moment(lastRefresh)
    if (scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
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
    scrollTop = e.scrollTop
  },

  reloadData: function() {
    if (refreshing) return
    refreshing = true
    this.setData({
      isSignedIn: utils.isSignedIn()
    })
    const successHandler = ({ data, next }) => {
      wx.stopPullDownRefresh()
      const events = data.map(it => utils.asEvent(it))
      this.setData({ events }),
      nextFunc = next
      lastRefresh = moment()
      refreshing = false
    }
    const errorHandler = (error) => {
      console.error(error)
      wx.stopPullDownRefresh()
    }
    if (utils.isSignedIn()) {
      const username = utils.getCurrentUser().login
      github.users(username).receivedEvents().then(successHandler).catch(errorHandler)
    } else {
      github.events().get().then(successHandler).catch(errorHandler)
    }
  },

  loadMore: function() {
    if (this.data.loadingMore) {
      return
    }
    
    if (nextFunc) {
      this.setData({
        loadingMore: true
      })
      nextFunc().then(({ data, next }) => {
        wx.stopPullDownRefresh()
        const events = data.map(it => utils.asEvent(it))
        this.setData({
          events: [...this.data.events, ...events],
          loadingMore: false
        })
        nextFunc = next
        lastRefresh = moment()
        refreshing = false
      }).catch(error => {
        wx.stopPullDownRefresh()
        this.setData({
          loadingMore: false
        })
      })
    }
  }
})
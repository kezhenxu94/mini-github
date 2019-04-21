const moment = require('../../lib/moment.js')
const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

let scrollTop = 0
let refreshing = false
let lastRefresh = moment().unix()
let nextFunc = null
let tabIndex = 0

Page({
  data: {
    events: wx.getStorageSync('Cache:News:Events') || [],
    isSignedIn: utils.isSignedIn(),
    loadingMoreActivity: false
  },

  onLoad: function () {
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

  onPullDownRefresh: function () {
    if (tabIndex === 0) {
      this.reloadData()
    }
  },

  onReachBottom: function () {
    if (tabIndex === 0) {
      this.loadMoreActivities()
    }
  },

  onPageScroll(e) {
    scrollTop = e.scrollTop
  },

  reloadData: function () {
    if (refreshing) return
    refreshing = true
    this.setData({
      isSignedIn: utils.isSignedIn()
    })
    const successHandler = ({ data, next }) => {
      wx.stopPullDownRefresh()
      const events = data.map(it => utils.asEvent(it))
      this.setData({ events })
      wx.setStorage({
        key: 'Cache:News:Events',
        data: events
      })
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

  loadMoreActivities: function () {
    if (this.data.loadingMoreActivity) {
      return
    }

    if (nextFunc) {
      this.setData({
        loadingMoreActivity: true
      })
      nextFunc().then(({ data, next }) => {
        wx.stopPullDownRefresh()
        const events = data.map(it => utils.asEvent(it))
        this.setData({
          events: [...this.data.events, ...events],
          loadingMoreActivity: false
        })
        nextFunc = next
        lastRefresh = moment()
        refreshing = false
      }).catch(error => {
        wx.stopPullDownRefresh()
        this.setData({
          loadingMoreActivity: false
        })
      })
    }
  },

  changeTab: function (event) {
    tabIndex = event.detail.index
    wx.pageScrollTo({
      scrollTop: 0
    })
  }
})
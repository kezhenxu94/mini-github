const github = require('../../api/github.js')
const moment = require('../../lib/moment.js')
const utils = require('../../utils/util.js')

const filters = [
  { value: 'author', label: 'Created' },
  { value: 'assignee', label: 'Assigned' },
  { value: 'mentions', label: 'Mentioned' }
]

let nextFunc = null
let lastRefresh = moment().unix()
let scrollTop = 0

Page({
  data: {
    filters,
    filter: 'author',
    issues: [],
    isSignedIn: utils.isSignedIn(),
    loadingMore: false
  },
  
  onLoad: function () {
    this.setData({
      isSignedIn: utils.isSignedIn(),
      issues: wx.getStorageSync('Issues') || []
    })
    var lastMoment = moment(lastRefresh)
    if (scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  onShareAppMessage: function (options) {},

  onPullDownRefresh: function () {
    if (!utils.isSignedIn()) {
      return wx.stopPullDownRefresh()
    }
    this.reloadData()
  },

  onPageScroll (e) {
    scrollTop = e.scrollTop
  },

  onReachBottom: function () {
    this.loadMore()
  },

  reloadData: function () {
    const user = utils.getCurrentUser().login || ''
    const filter = this.data.filter
    const q = `is:open+is:issue+${filter}:${user}+archived:false`
    github.search().issues({ q }).then(({ data, next }) => {
      wx.stopPullDownRefresh()
      nextFunc = next
      lastRefresh = moment()
      const issues = data.items.map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        it.updated_at = utils.toReadableTime(it.updated_at)
        return it
      })
      this.setData({ issues }, () => wx.setStorage({
        key: 'Issues',
        data: issues
      }))
    }).catch(error => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    })
  },

  loadMore: function () {
    if (!nextFunc || this.data.loadingMore) {
      return
    }
    this.setData({ loadingMore: true })
    nextFunc().then(({ data, next }) => {
      const issues = data.items.map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        it.updated_at = utils.toReadableTime(it.updated_at)
        return it
      })
      nextFunc = next
      this.setData({
        issues: [...this.data.issues, ...issues],
        loadingMore: false
      })
    }).catch(error => {
      this.setData({
        loadingMore: false
      })
    })
  },

  changeFilter: function (event) {
    const filter = filters[event.detail.index].value
    this.setData({ filter, issues: [], loadingMore: false })
    wx.startPullDownRefresh()
  }
})
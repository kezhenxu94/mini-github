const github = require('../../api/github.js')
const moment = require('../../lib/moment.js')
const utils = require('../../utils/util.js')

const filters = [
  { value: 'author', label: 'Created' },
  { value: 'assignee', label: 'Assinged' },
  { value: 'mentions', label: 'Mentioned' },
  { value: 'review-requested', label: 'Review Requested' },
]

let nextFunc = null
let lastRefresh = moment().unix()
let scrollTop = 0

Page({
  data: {
    filters,
    filter: 'author',
    pulls: [],
    isSignedIn: utils.isSignedIn(),
    loadingMore: false
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
  
  onPullDownRefresh: function () {
    if (!this.data.isSignedIn) {
      return wx.stopPullDownRefresh()
    }
    this.reloadData()
  },

  onShareAppMessage: function (options) {},

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  onReachBottom: function () {
    this.loadMore()
  },

  reloadData: function () {
    const user = utils.getCurrentUser().login || ''
    const filter = this.data.filter
    const q = `is:open+is:pr+${filter}:${user}+archived:false`
    github.search().issues({ q }).then(({ data, next }) => {
      wx.stopPullDownRefresh()
      nextFunc = next
      lastRefresh = moment()
      const pulls = data.items.map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        it.updated_at = utils.toReadableTime(it.updated_at)
        return it
      })
      this.setData({
        pulls
      })
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
      const pulls = data.items.map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        it.updated_at = utils.toReadableTime(it.updated_at)
        return it
      })
      nextFunc = next
      this.setData({
        pulls: [...this.data.pulls, ...pulls],
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
    this.setData({ filter, pulls: [], loadingMore: false })
    wx.startPullDownRefresh({})
  }
})
const github = require('../../api/github.js')
const moment = require('../../lib/moment.js')
const utils = require('../../utils/util.js')

const filters = [
  { value: 'author', label: 'Created' },
  { value: 'assignee', label: 'Assinged' },
  { value: 'mentions', label: 'Mentioned' },
  { value: 'review-requested', label: 'Review Requested' },
]

Page({
  data: {
    filters,
    filter: 'author',
    pulls: [],
    scrollTop: 0,
    lastRefresh: moment().unix(),
    isSignedIn: utils.isSignedIn()
  },
  
  onLoad: function () {
    this.setData({
      isSignedIn: utils.isSignedIn()
    })
    var lastMoment = moment(this.data.lastRefresh)
    if (this.data.scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
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

  reloadData: function () {
    const user = utils.getCurrentUser().login || ''
    const filter = this.data.filter
    const q = `is:open+is:pr+${filter}:${user}+archived:false`
    github.search().issues({ q }).then(issues => {
      wx.stopPullDownRefresh()
      this.setData({
        pulls: issues,
        lastRefresh: moment()
      })
    }).catch(error => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    })
  },

  changeFilter: function (event) {
    const filter = filters[event.detail.index].value
    this.setData({ filter, pulls: [] })
    wx.startPullDownRefresh({})
  }
})
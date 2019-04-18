const github = require('../../api/github.js')
const moment = require('../../lib/moment.js')
const utils = require('../../utils/util.js')

const filters = [
  { value: 'author', label: 'Created' },
  { value: 'assignee', label: 'Assigned' },
  { value: 'mentions', label: 'Mentioned' }
]

Page({
  data: {
    filters,
    filter: 'author',
    issues: [],
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

  onShareAppMessage: function (options) {},

  onPullDownRefresh: function () {
    if (!utils.isSignedIn()) {
      return wx.stopPullDownRefresh()
    }
    this.reloadData()
  },

  onPageScroll (e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  reloadData: function () {
    const user = utils.getCurrentUser().login || ''
    const filter = this.data.filter
    const q = `is:open+is:issue+${filter}:${user}+archived:false`
    github.search().issues({ q }).then(issues => {
      wx.stopPullDownRefresh()
      this.setData({
        issues,
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
    this.setData({ filter, issues: [] })
    wx.startPullDownRefresh()
  }
})
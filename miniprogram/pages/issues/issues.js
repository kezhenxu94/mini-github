const github = require('../../api/github.js')
const moment = require('../../lib/moment.js')
const utils = require('../../utils/util.js')

const filters = [
  { value: 'created', label: 'Created' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'mentioned', label: 'Mentioned' },
  { value: 'subscribed', label: 'Participated' },
  { value: 'all', label: 'All' },
]

Page({
  data: {
    filters,
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
    const filter = this.data.filter
    github.user().issues({ filter }).then(issues => {
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
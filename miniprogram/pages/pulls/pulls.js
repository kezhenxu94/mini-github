const github = require('../../api/github.js')
const moment = require('../../lib/moment.js')
const utils = require('../../utils/util.js')

const filters = [
  { value: 'open', label: 'Created' },
  { value: 'closed', label: 'Closed' },
  { value: 'merged', label: 'Merged' },
]

Page({
  data: {
    filters,
    filter: 'open',
    pulls: [],
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
    github.getPulls(this.data.filter).then(data => {
      wx.stopPullDownRefresh()
      this.setData({
        pulls: data,
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
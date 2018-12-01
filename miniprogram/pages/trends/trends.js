const github = require('../../api/github.js')
const moment = require('../../lib/moment.js')

const timeRange = ['Daily', 'Weekly', 'Monthly']
const languages = [
  'All',
  'c', 'css',
  'Java', 'JavaScript',
  'Kotlin',
  'Python',
  'Swift'
]

let scrollTop = 0
let lastRefresh = moment().unix()

Page({
  data: {
    since: 'daily',
    trends: [],
    selectorValues: [timeRange, languages],
    selectedIndices: [0, 0]
  },

  onShow: function () {
    const lastMoment = moment(lastRefresh)
    if (scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  onShareAppMessage: function(options) {
  },

  onPullDownRefresh: function () {
    this.reloadData()
  },

  reloadData: function () {
    const [timeIndex, langIndex] = this.data.selectedIndices
    const lang = languages[langIndex] || 'all'
    const time = timeRange[timeIndex] || 'daily'
    github.trendings(time.toLowerCase(), lang.toLowerCase()).then(data => {
      wx.stopPullDownRefresh()
      this.setData({
        trends: data,
      })
      lastRefresh = moment()
    }).catch(error => wx.stopPullDownRefresh() )
  },

  changeFilter: function (event) {
    const selectedIndices = event.detail.value
    console.log(selectedIndices)
    this.setData({ selectedIndices })
    wx.pageScrollTo({
      scrollTop: 0
    })
    wx.startPullDownRefresh({})
  },

  onPageScroll (e) {
    scrollTop = e.scrollTop
  },

  onSearch: function (e) {
    const q = e.detail
    wx.navigateTo({
      url: `/pages/search/search?q=${q}`,
    })
  }
})
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

Page({
  data: {
    since: 'daily',
    trends: [],
    scrollTop: 0,
    lastRefresh: moment().unix(),
    selectorValues: [timeRange, languages],
    selectedIndices: [0, 0]
  },

  onShow: function () {
    const lastMoment = moment(this.data.lastRefresh)
    if (this.data.scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  onPullDownRefresh: function () {
    this.reloadData()
  },

  reloadData: function () {
    const [timeIndex, langIndex] = this.data.selectedIndices
    const lang = languages[langIndex] || 'all'
    const time = timeRange[timeIndex] || 'daily'
    github.getTrends(time.toLowerCase(), lang.toLowerCase(), data => {
      console.log(data)
      wx.stopPullDownRefresh()
      this.setData({
        trends: data,
        lastRefresh: moment()
      })
    }, error => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    })
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
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  toRepoDetail: function (event) {
    var repo = event.currentTarget.dataset.repo
    var url = `/pages/repo-detail/repo-detail?url=https://api.github.com/repos/${repo.author}/${repo.name}`
    wx.navigateTo({ url })
  }
})
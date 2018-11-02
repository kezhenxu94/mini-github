const github = require('../../api/github.js')
const moment = require('../../utils/moment.js')
Page({

  /**
   * Page initial data
   */
  data: {
    since: 'daily',
    lang: 'all',
    trends: [],
    scrollTop: 0,
    lastRefresh: moment().unix(),
    showSelectLanguage: false,
    languages: [
      { name: 'All' },
      { name: 'c' },
      { name: 'css' },
      { name: 'Java' },
      { name: 'JavaScript' },
      { name: 'Kotlin' },
      { name: 'Python' },
      { name: 'Swift' }
    ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    var lastMoment = moment(this.data.lastRefresh)
    if (this.data.scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    this.reloadData()
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  reloadData: function () {
    github.getTrends(this.data.since, this.data.lang, data => {
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

  changeLang: function (event) {
    const lang = event.detail.name
    this.setData({
      lang: lang.toLowerCase(),
      showSelectLanguage: false
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
    wx.startPullDownRefresh({})
  },

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  showLanguages: function () {
    this.setData({
      showSelectLanguage: true
    })
  },

  closeLanguages: function () {
    this.setData({
      showSelectLanguage: false
    })
  }
})
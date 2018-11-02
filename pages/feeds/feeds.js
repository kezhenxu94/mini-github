const github = require('../../api/github.js')
const utils = require('../../utils/util.js')
const moment = require('../../utils/moment.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    events: [],
    scrollTop: 0,
    lastRefresh: moment().unix(),
    isSignedIn: utils.isSignedIn(),
    links: {},
    loadingMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var lastMoment = moment(this.data.lastRefresh)
    if (this.data.scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.reloadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(this.data.links)
    this.loadMore()
  },

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  reloadData: function () {
    this.setData({
      isSignedIn: utils.isSignedIn()
    })
    github.getGlobalEvents(undefined, res => {
      console.log(res)
      wx.stopPullDownRefresh()
      this.setData({
        events: res.data,
        links: res.links,
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

  loadMore: function () {
    this.setData({ loadingMore: true })
    github.getGlobalEvents(this.data.links['rel="next"'], res => {
      console.log(res)
      wx.stopPullDownRefresh()
      this.setData({
        events: [...this.data.events, ...res.data],
        links: res.links,
        loadingMore: false,
        lastRefresh: moment()
      })
    }, error => {
      wx.stopPullDownRefresh()
      this.setData({ loadingMore: false })
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    })
  }
})
const github = require('../../api/github.js')
// pages/issues/issues.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: 'created',
    issues: [],
    scrollTop: 0
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
    if (this.data.scrollTop === 0) {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  reloadData: function () {
    github.getPulls(this.data.filter, data => {
      console.log(data)
      this.setData({
        issues: data
      })
      wx.stopPullDownRefresh()
    })
  },

  changeFilter: function (event) {
    switch (event.detail.index) {
      case 0:
        this.setData({ filter: 'created' })
        break
      case 1:
        this.setData({ filter: 'assigned' })
        break
      case 2:
        this.setData({ filter: 'mentioned' })
        break
      case 3:
        this.setData({ filter: 'subscribed' })
        break
      default:
        this.setData({ filter: 'all' })
        break
    }
    this.reloadData()
  }
})
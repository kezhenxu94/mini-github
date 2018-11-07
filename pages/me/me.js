const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

Page({
  data: {
    user: {},
    repos: [],
    starred: [],
    tab: 0
  },

  onLoad: function (options) {
    const user = utils.getCurrentUser()
    this.setData({
      user
    })
    if (!user) return
    wx.setNavigationBarTitle({
      title: user.login
    })
  },

  onShow: function () {
    this.onLoad({})
  },

  onShareAppMessage: function (options) {
    const username = this.data.user.login
    return {
      title: `GitHub User: ${username}`,
      path: `/pages/user/user?username=${username}`
    }
  },

  loadUserRepos: function () {
    const username = this.data.user.login
    wx.showNavigationBarLoading({})
    github.users(username).repos().then(repos => {
      this.setData({
        repos
      })
      wx.hideNavigationBarLoading({})
    }).catch(error => {
      wx.hideNavigationBarLoading({})
    })
  },

  loadUserStarredRepos: function () {
    const username = this.data.user.login
    wx.showNavigationBarLoading({})
    github.users(username).starred().then(repos => {
      this.setData({
        starred: repos
      })
      wx.hideNavigationBarLoading({})
    }).catch(error => {
      wx.hideNavigationBarLoading({})
    })
  },

  changeTab: function (event) {
    this.setData({
      tab: event.detail.index
    })
    const username = this.data.user.login

    switch (event.detail.index) {
      case 1:
        if (this.data.repos.length > 0 || !username) return
        this.loadUserRepos()
        break
      case 2:
        if (this.data.starred.length > 0 || !username) return
        this.loadUserStarredRepos()
        break
    }
  }
})
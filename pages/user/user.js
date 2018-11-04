const github = require('../../api/github.js')

Page({
  data: {
    username: undefined,
    user: {},
    repos: [],
    starred: []
  },

  onLoad: function(options) {
    const username = options.username || 'kezhenxu94'
    this.setData({
      username
    })
    wx.setNavigationBarTitle({
      title: username
    })
    this.loadUserInfo()
  },

  onShareAppMessage: function (options) {
    const username = this.data.user.login
    return {
      title: `GitHub User: ${username}`,
      path: `/pages/user/user?username=${username}`
    }
  },

  loadUserInfo: function() {
    const {
      username
    } = this.data
    wx.showNavigationBarLoading({})
    github.getUser(username).then(user => {
      this.setData({
        user
      })
      wx.hideNavigationBarLoading({})
    }, error => {
      wx.hideNavigationBarLoading({})
    })
  },

  loadUserRepos: function() {
    const {
      username
    } = this.data
    wx.showNavigationBarLoading({})
    github.getUserRepos(username).then(repos => {
      this.setData({
        repos
      })
      wx.hideNavigationBarLoading({})
    }).catch(error => {
      wx.hideNavigationBarLoading({})
    })
  },

  loadUserStarredRepos: function() {
    const {
      username
    } = this.data
    wx.showNavigationBarLoading({})
    github.getStarredRepos(username).then(repos => {
      this.setData({
        starred: repos
      })
      wx.hideNavigationBarLoading({})
    }).catch(error => {
      wx.hideNavigationBarLoading({})
    })
  },

  changeTab: function(event) {
    const {
      username
    } = this.data

    switch (event.detail.index) {
      case 0:
        if (this.data.user) return
        this.loadUserInfo()
        break
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
const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

Page({
  data: {
    user: {},
    repos: [],
    starred: [],
    tab: 0,
    reposNext: null,
    starredNext: null,
    loadingMore: false,
    refreshing: false
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

  onReachBottom: function () {
    this.loadMore()
  },

  loadUserRepos: function () {
    const username = this.data.user.login
    wx.showNavigationBarLoading({})
    github.users(username).repos().then(({ repos, next }) => {
      this.setData({ repos, reposNext: next })
      wx.hideNavigationBarLoading({})
    }).catch(error => {
      wx.hideNavigationBarLoading({})
    })
  },

  loadUserStarredRepos: function () {
    const username = this.data.user.login
    wx.showNavigationBarLoading({})
    github.users(username).starred().then(({ repos, next }) => {
      this.setData({ starred: repos, starredNext: next })
      wx.hideNavigationBarLoading({})
    }).catch(error => {
      wx.hideNavigationBarLoading({})
    })
  },

  loadMore: function () {
    if (this.data.loadingMore) {
      console.log('Loading more, returning')
      return
    }

    if (this.data.tab === 1 && this.data.reposNext) {
      this.loadMoreUserRepos()
    }
    if (this.data.tab === 2 && this.data.starredNext) {
      this.loadMoreStarredRepos()
    }
  },

  loadMoreUserRepos: function () {
    this.setData({ loadingMore: true })
    this.data.reposNext().then(({ repos, next }) => {
      wx.stopPullDownRefresh()
      this.setData({
        repos: [...this.data.repos, ...repos],
        reposNext: next,
        refreshing: false,
        loadingMore: false
      })
    }).catch(error => {
      wx.stopPullDownRefresh()
      this.setData({
        loadingMore: false
      })
    })
  },

  loadMoreStarredRepos: function () {
    this.setData({ loadingMore: true })
    this.data.starredNext().then(({ repos, next }) => {
      wx.stopPullDownRefresh()
      this.setData({
        starred: [...this.data.starred, ...repos],
        starredNext: next,
        refreshing: false,
        loadingMore: false
      })
    }).catch(error => {
      wx.stopPullDownRefresh()
      this.setData({
        loadingMore: false
      })
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
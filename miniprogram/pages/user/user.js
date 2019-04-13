const github = require('../../api/github.js')

Page({
  data: {
    username: undefined,
    user: {},
    repos: [],
    tab: 0,
    starred: [],
    starredNext: null,
    reposNext: null,
    loadingMore: false,
    refreshing: false
  },

  onLoad: function(options) {
    const username = options.username || 'kezhenxu94'
    this.setData({ username })
    wx.setNavigationBarTitle({ title: username })
    this.loadUserInfo()
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

  loadUserInfo: function() {
    const { username } = this.data
    wx.showNavigationBarLoading({})
    github.users(username).end().then(user => {
      this.setData({ user })
      wx.hideNavigationBarLoading({})
    }, error => {
      wx.hideNavigationBarLoading({})
    })
  },

  loadUserRepos: function() {
    const { username } = this.data
    wx.showNavigationBarLoading({})
    github.users(username).repos().then(({ repos, next }) => {
      this.setData({
        repos,
        reposNext: next
      })
      wx.hideNavigationBarLoading({})
    }).catch(error => {
      wx.hideNavigationBarLoading({})
    })
  },

  loadUserStarredRepos: function() {
    const { username } = this.data
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
    console.log('load more user repos')
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
    const { username } = this.data

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
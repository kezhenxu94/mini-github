const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

let refreshing = false
let reposNext = null
let starredNext = null

Page({
  data: {
    user: {},
    repos: [],
    starred: [],
    tab: 0,
    loadingMore: false
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
    github.user().repos().then(({ repos, next }) => {
      this.setData({ repos })
      console.info({ repos })
      reposNext = next
      wx.hideNavigationBarLoading({})
    }).catch(error => {
      wx.hideNavigationBarLoading({})
    })
  },

  loadUserStarredRepos: function () {
    const username = this.data.user.login
    wx.showNavigationBarLoading({})
    github.users(username).starred().then(({ repos, next }) => {
      this.setData({ starred: repos })
      starredNext = next
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

    if (this.data.tab === 1 && reposNext) {
      this.loadMoreUserRepos()
    }
    if (this.data.tab === 2 && starredNext) {
      this.loadMoreStarredRepos()
    }
  },

  loadMoreUserRepos: function () {
    this.setData({ loadingMore: true })
    reposNext().then(({ repos, next }) => {
      wx.stopPullDownRefresh()
      this.setData({
        repos: [...this.data.repos, ...repos],
        loadingMore: false
      })
      reposNext = next
      refreshing = false
    }).catch(error => {
      wx.stopPullDownRefresh()
      this.setData({
        loadingMore: false
      })
    })
  },

  loadMoreStarredRepos: function () {
    this.setData({ loadingMore: true })
    starredNext().then(({ repos, next }) => {
      wx.stopPullDownRefresh()
      this.setData({
        starred: [...this.data.starred, ...repos],
        loadingMore: false
      })
      starredNext = next
      refreshing = false
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
  },

  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确认退出登陆状态吗? 退出后无法查看自己关注的事件, Issue, Pull Request; 也无法进行交互类型的操作(Star, Watch, Fork, Follow等)',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.reLaunch({
            url: '/pages/me/me'
          })
        }
      }
    })
  }
})
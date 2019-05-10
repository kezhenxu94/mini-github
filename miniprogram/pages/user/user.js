const github = require('../../api/github.js')
const theming = require('../../behaviours/theming.js')

Component({
  behaviors: [theming],

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

  methods: {

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
      github.users(username).get().then(user => {
        this.setData({ user })
        wx.hideNavigationBarLoading({})
      }, error => {
        wx.hideNavigationBarLoading({})
      })
    },

    loadUserRepos: function() {
      const { username } = this.data
      wx.showNavigationBarLoading({})
      github.users(username).repos().then(({ data, next }) => {
        this.setData({
          repos: data,
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
      github.users(username).starred().then(({ data, next }) => {
        this.setData({ starred: data, starredNext: next })
        wx.hideNavigationBarLoading({})
      }).catch(error => {
        wx.hideNavigationBarLoading({})
      })
    },

    loadMore: function () {
      if (this.data.loadingMore) {
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
      this.data.reposNext().then(({ data, next }) => {
        wx.stopPullDownRefresh()
        this.setData({
          repos: [...this.data.repos, ...data],
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
      this.data.starredNext().then(({ data, next }) => {
        wx.stopPullDownRefresh()
        this.setData({
          starred: [...this.data.starred, ...data],
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
  }
})
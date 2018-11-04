const github = require('../../api/github.js')

Page({
  data: {
    q: '',
    repos: [],
    users: [],
    repoUrl: '',
    userUrl: '',
    activeTab: 'repos',
    hasMore: false
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: 'Search',
    })
    const {
      q
    } = options
    this.setData({
      q
    })
    this.performSearch()
  },

  onReachBottom: function() {
    const {
      activeTab,
      repoUrl,
      userUrl
    } = this.data
    if (activeTab === 'repos' && !repoUrl) {
      wx.showToast({
        title: 'No more results'
      })
      return
    }
    if (activeTab === 'users' && !userUrl) {
      wx.showToast({
        title: 'No more results'
      })
      return
    }
    this.setData({
      loadingMore: true
    })
    this.performSearch()
  },

  onShareAppMessage: function() {
    const {
      q
    } = this.data
    return {
      title: `GitHub Search: ${q}`,
      path: `/pages/search/search?q=${q}`
    }
  },

  performSearch: function() {
    wx.showNavigationBarLoading({})
    const {
      q
    } = this.data
    if (this.data.activeTab === 'repos') {
      github.searchRepos(this.data.repoUrl, q).then(res => {
        let {
          repos,
          links
        } = res
        const repoUrl = links['rel="next"'] || ''
        const hasMore = repoUrl !== ''
        repos = [...this.data.repos, ...repos]
        this.setData({
          repos,
          repoUrl,
          hasMore
        })
        wx.hideNavigationBarLoading({})
      }).catch(error => wx.hideNavigationBarLoading({}))
    } else if (this.data.activeTab === 'users') {
      github.searchUsers(this.data.userUrl, q).then(res => {
        let {
          users,
          links
        } = res
        const userUrl = links['rel="next"'] || ''
        const hasMore = userUrl !== ''
        users = [...this.data.users, ...users]
        this.setData({
          users,
          userUrl,
          hasMore
        })
        wx.hideNavigationBarLoading({})
      }).catch(error => wx.hideNavigationBarLoading({}))
    }
  },

  onSearch: function(e) {
    this.setData({
      q: e.detail,
      userUrl: '',
      repoUrl: '',
      repos: [],
      users: []
    })
    this.performSearch()
  },

  changeTab: function(e) {
    const oldTab = this.data.activeTab
    switch (e.detail.index) {
      case 0:
        this.setData({
          activeTab: 'repos'
        })
        break
      case 1:
        this.setData({
          activeTab: 'users'
        })
        break
    }
    if (oldTab !== this.data.activeTab) {
      this.performSearch()
    }
  }
})
const github = require('../../api/github.js')

Page({
  data: {
    q: undefined,
    repos: [],
    users: [],
    activeTab: 'repos'
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

  onReachBottom: function() {},

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
      github.searchRepos(q).then(repos => {
        this.setData({
          repos
        })
        wx.hideNavigationBarLoading({})
      }).catch(error => wx.hideNavigationBarLoading({}))
    } else if (this.data.activeTab === 'users') {
      github.searchUsers(q).then(users => {
        this.setData({
          users
        })
        wx.hideNavigationBarLoading({})
      }).catch(error => wx.hideNavigationBarLoading({}))
    }
  },

  onSearch: function(e) {
    this.setData({
      q: e.detail
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
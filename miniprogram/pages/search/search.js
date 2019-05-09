const github = require('../../api/github.js')
const theming = require('../../behaviours/theming.js')

Component({
  behaviors: [theming],

  data: {
    q: '',
    repos: [],
    users: [],
    activeTab: 'repos',
    hasMoreRepos: false,
    hasMoreUsers: false,
    searching: {
      repos: false,
      users: false
    },
    repoNext: null,
    userNext: null
  },

  methods: {

    onLoad: function(options) {
      wx.setNavigationBarTitle({
        title: 'Search',
      })
      const { q = '' } = options
      this.setData({ q })
      this.performSearch()
    },

    onReachBottom: function() {
      this.loadMore()
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

    repoSuccessHandler: function ({ data, next }) {
      const { searching } = this.data
      const repos = data.items
      const hasMoreRepos = next != null
      searching.repos = false
      this.setData({
        repos: [...this.data.repos, ...repos],
        hasMoreRepos,
        searching,
        repoNext: next
      })
    },

    userSuccessHandler: function ({ data, next }) {
      const { searching } = this.data
      const users = data.items
      const hasMoreUsers = next !== null
      searching.users = false
      this.setData({
        users: [...this.data.users, ...users],
        hasMoreUsers,
        searching,
        userNext: next
      })
    },

    loadMore() {
      const { activeTab, searching, q, repoNext, userNext } = this.data
      if (activeTab === 'repos') {
        if (!repoNext) {
          return wx.showToast({ title: 'No more results' })
        }
        if (searching.repos) {
          return
        }
        searching.repos = true
        this.setData({
          searching
        })
        wx.showNavigationBarLoading({})
        this.data.repoNext().then(({ data, next }) => {
          this.repoSuccessHandler({ data, next })
          wx.hideNavigationBarLoading({})
        }).catch(error => {
          searching.repos = false
          this.setData({ searching })
          wx.hideNavigationBarLoading({})
        })
      }
      if (activeTab === 'users') {
        if (!userNext) {
          return wx.showToast({ title: 'No more results' })
        }
        if (searching.users) {
          return
        }
        searching.users = true
        this.setData({
          searching
        })
        wx.showNavigationBarLoading({})
        this.data.userNext().then(({ data, next }) => {
          this.userSuccessHandler({ data, next })
          wx.hideNavigationBarLoading({})
        }).catch(error => {
          searching.users = false
          this.setData({ searching })
          wx.hideNavigationBarLoading({})
        })
      }
    },

    performSearch: function () {
      const { q, searching } = this.data
      if (this.data.activeTab === 'repos') {
        if (searching.repos) {
          return
        }
        searching.repos = true
        this.setData({ searching })
        wx.showNavigationBarLoading({})
        github.search().repos({ q }).then(({ data, next }) => {
          this.repoSuccessHandler({ data, next })
          wx.hideNavigationBarLoading({})
        }).catch(error => {
          searching.repos = false
          this.setData({ searching })
          wx.hideNavigationBarLoading({})
        })
      } else if (this.data.activeTab === 'users') {
        if (searching.users) {
          return
        }
        searching.users = true
        this.setData({ searching })
        wx.showNavigationBarLoading({})
        github.search().users({ q }).then(({ data, next}) => {
          this.userSuccessHandler({ data, next })
          wx.hideNavigationBarLoading({})
        }).catch(error => {
          searching.users = false
          this.setData({ searching })
          wx.hideNavigationBarLoading({})
        })
      }
    },

    onSearch: function(e) {
      this.setData({
        q: e.detail,
        repos: [],
        users: [],
        repoNext: null,
        userNext: null,
        hasMoreUsers: false,
        hasMoreRepos: false
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
          if (this.data.repos.length > 0) {
            return
          }
          break
        case 1:
          this.setData({
            activeTab: 'users'
          })
          if (this.data.users.length > 0) {
            return
          }
          break
      }
      if (oldTab !== this.data.activeTab) {
        this.performSearch()
      }
    }
  }
})
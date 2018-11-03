const moment = require('../../lib/moment.js')
const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

Page({
  data: {
    events: [],
    scrollTop: 0,
    lastRefresh: moment().unix(),
    isSignedIn: utils.isSignedIn(),
    links: {},
    loadingMore: false,
    refresing: false
  },
  
  onShow: function () {
    var lastMoment = moment(this.data.lastRefresh)
    if (this.data.scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  onPullDownRefresh: function () {
    this.reloadData()
  },

  onReachBottom: function () {
    this.loadMore()
  },

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  reloadData: function () {
    if (this.data.refresing) return
    this.setData({
      isSignedIn: utils.isSignedIn(),
      refresing: true
    })
    github.getGlobalEvents(undefined, res => {
      console.log(res)
      wx.stopPullDownRefresh()
      this.setData({
        events: res.data,
        links: res.links,
        lastRefresh: moment(),
        refresing: false
      })
    }, error => {
      wx.stopPullDownRefresh()
    })
  },

  loadMore: function () {
    if (this.data.loadingMore) {
      console.log('Loading more, returning')
      return
    }

    this.setData({ loadingMore: true })
    github.getGlobalEvents(this.data.links['rel="next"'], res => {
      console.log(res)
      wx.stopPullDownRefresh()
      this.setData({
        events: [...this.data.events, ...res.data],
        links: res.links,
        loadingMore: false,
        lastRefresh: moment()
      })
    }, error => {
      wx.stopPullDownRefresh()
      this.setData({ loadingMore: false })
    })
  },
  
  toFeedDetail: function (event) {
    var feed = event.currentTarget.dataset.feed
    console.log('feed %o', feed)
    if (feed.type.startsWith('Issue')) {
      var issue = (feed.payload || {}).issue || {}
      var url = issue.url
      wx.navigateTo({
        url: '/pages/issue-detail/issue-detail?url=' + url
      })
      return
    }

    let repoUrl = undefined
    switch (feed.type) {
      case 'WatchEvent':
      case 'ForkEvent':
      case 'PullRequestEvent':
      case 'PushEvent':
      case 'DeleteEvent':
        repoUrl = feed.repo.url
        break
      case 'ReleaseEvent':
        repoUrl = feed.repository.url
        break
    }
    if (repoUrl) {
      wx.navigateTo({
        url: `/pages/repo-detail/repo-detail?url=${repoUrl}`
      })
      return
    }
  }
})
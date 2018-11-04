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

  onShow: function() {
    this.setData({
      isSignedIn: utils.isSignedIn()
    })
    var lastMoment = moment(this.data.lastRefresh)
    if (this.data.scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  onPullDownRefresh: function() {
    this.reloadData()
  },

  onReachBottom: function() {
    this.loadMore()
  },

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  reloadData: function() {
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

  loadMore: function() {
    if (this.data.loadingMore) {
      console.log('Loading more, returning')
      return
    }

    this.setData({
      loadingMore: true
    })
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
      this.setData({
        loadingMore: false
      })
    })
  },

  toFeedDetail: function(event) {
    const feed = event.currentTarget.dataset.feed
    switch (feed.type) {
      case 'IssueCommentEvent':
      case 'IssuesEvent':
        var issue = (feed.payload || {}).issue || {}
        var url = issue.url
        wx.navigateTo({
          url: '/pages/issue-detail/issue-detail?url=' + url
        })
        break
      case 'PullRequestEvent':
      case 'PullRequestReviewEvent':
      case 'PullRequestReviewCommentEvent':
        var pullRequest = (feed.payload || {}).pull_request || {}
        var url = pullRequest.issue_url
        wx.navigateTo({
          url: '/pages/issue-detail/issue-detail?url=' + url
        })
        break
      case 'WatchEvent':
      case 'ForkEvent':
      case 'PushEvent':
      case 'DeleteEvent':
        var repoUrl = feed.repo.url
        wx.navigateTo({
          url: `/pages/repo-detail/repo-detail?url=${repoUrl}`
        })
        break
      case 'ReleaseEvent':
        var repoUrl = feed.repository.url
        wx.navigateTo({
          url: `/pages/repo-detail/repo-detail?url=${repoUrl}`
        })
        break
      default:
        wx.showToast({
          title: 'Coming Soon'
        })
        break
    }
  }
})
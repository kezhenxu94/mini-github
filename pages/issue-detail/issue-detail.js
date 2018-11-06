const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

Page({
  data: {
    url: '',
    issue: undefined,
    comments: [],
    links: {},
    hasMore: true,
    loadingMore: false
  },

  onLoad: function(options) {
    this.setData({
      url: decodeURIComponent(options.url)
    })
    wx.startPullDownRefresh({})
  },

  onShareAppMessage: function(options) {
    var url = this.data.url
    var title = this.data.issue.title
    var path = `/pages/issue-detail/issue-detail?url=${url}`
    return {
      title,
      path
    }
  },

  onPullDownRefresh: function() {
    github.getIssue(this.data.url).then(issue => {
      wx.stopPullDownRefresh()
      const hasMore = issue.comments > 0
      this.setData({
        issue,
        comments: [],
        links: {},
        hasMore,
        loadingMore: false
      })
      const repoName = utils.extractRepoName(issue.url)
      wx.setNavigationBarTitle({
        title: `${repoName}#${issue.number}`
      })
      if (hasMore) this.loadMore()
    }).catch(error => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    })
  },

  loadMore: function() {
    const {
      hasMore,
      loadingMore,
      issue,
      links
    } = this.data

    if (loadingMore || !hasMore) return
    this.setData({
      loadingMore: true
    })

    const comments_url = links['rel="next"'] || issue.comments_url
    github.getComments(comments_url).then(res => {
      console.log(res)
      const comments = [...this.data.comments, ...res.comments]
      const links = res.links
      let hasMore = true
      if (!links['rel="next"']) {
        hasMore = false
      }
      this.setData({
        comments,
        links,
        loadingMore,
        hasMore
      })
    }).catch(error => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
      this.setData({
        loadingMore: false
      })
    })
  },
})
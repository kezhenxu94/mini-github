const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

Page({
  data: {
    url: '',
    issue: {},
    comments: [],
    links: {},
    hasMore: true,
    loadingMore: false,
    loadMoreBtnText: 'Load More',
    pageReady: false
  },

  onLoad: function(options) {
    var url = decodeURIComponent(options.url)
    this.setData({
      url
    })
    wx.startPullDownRefresh({})
  },

  onShareAppMessage: function(options) {
    var url = this.data.url
    var title = this.data.issue.title
    return {
      title,
      path: `/pages/issue-detail/issue-detail?url=${url}`
    }
  },

  onPullDownRefresh: function() {
    github.getIssue(this.data.url).then(issue => {
      console.log(issue)
      wx.stopPullDownRefresh()
      this.setData({
        issue: issue,
        pageReady: true
      })
      const repoName = utils.extractRepoName(issue.url)
      wx.setNavigationBarTitle({
        title: `${repoName}#${issue.number}`
      })
    }).catch(error => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    })
  },

  loadMore: function() {
    if (this.data.loadingMore) return

    let loadingMore = true
    this.setData({
      loadingMore
    })
    if (!this.data.hasMore) {
      loadingMore = false
      const loadMoreBtnText = 'No More Comment'
      this.setData({
        loadMoreBtnText,
        loadingMore
      })
      return
    }
    loadingMore = false
    let comments_url = this.data.issue.comments_url
    if (this.data.links['rel="next"']) {
      comments_url = this.data.links['rel="next"']
    }
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
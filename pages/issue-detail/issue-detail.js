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
  
  onLoad: function (options) {
    var url = options.url
    this.setData({ url })
    wx.startPullDownRefresh({})
  },
  
  onPullDownRefresh: function () {
    github.getIssue(this.data.url, issue => {
      console.log(issue)
      wx.stopPullDownRefresh()
      this.setData({
        issue: issue,
        pageReady: true
      })
      const repoName = utils.extractRepoName(issue.repository_url)
      wx.setNavigationBarTitle({
        title: `${repoName}#${issue.number}`
      })
    }, error => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    })
  },

  loadMore: function () {
    if (this.data.loadingMore) return

    let loadingMore = true
    this.setData({ loadingMore })
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
    github.getComments(comments_url, res => {
      console.log(res)
      const comments = [...this.data.comments, ...res.comments]
      const links = res.links
      let hasMore = true
      if (!links['rel="next"']) {
        hasMore = false
      }
      this.setData({ comments, links, loadingMore, hasMore })
    }, error => {
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
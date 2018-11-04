const github = require('../../api/github.js')
const utils = require('../../utils/util.js')
const WxParse = require('../../lib/wxParse/wxParse.js')
const defaultUrl = 'https://api.github.com/repos/kezhenxu94/mini-github'

Page({
  data: {
    url: undefined,
    repo: {},
    issues: [],
    pulls: [],
    showTabs: false
  },

  onLoad: function(options) {
    var url = decodeURIComponent(options.url || defaultUrl)
    this.setData({
      url
    })
    this.reloadData()
  },

  onShareAppMessage: function(options) {
    var url = this.data.url
    var title = this.data.repo.full_name
    return {
      title,
      path: `/pages/repo-detail/repo-detail?url=${url}`
    }
  },

  tryGetReadMe: function(repo) {
    let readMeUrl = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/README.md`

    return new Promise((resolve, reject) => {
      github.getFile(readMeUrl).then(readMeContent => {
        WxParse.wxParse('article', 'md', readMeContent, this)
        resolve({})
      }).catch(error => {
        readMeUrl = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/readme.md`
        github.getFile(readMeUrl).then(readMeContent => {
          WxParse.wxParse('article', 'md', readMeContent, this)
          resolve({})
        }).catch(error => reject(error))
      })
    })
  },

  tryGetIssues: function() {
    wx.showNavigationBarLoading({})
    const repo = this.data.repo
    github.getRepoIssues(repo).then(issues => {
      console.log(issues)
      this.setData({
        issues
      })
      wx.hideNavigationBarLoading({})
    }).catch(error => wx.hideNavigationBarLoading({}))
  },

  tryGetPulls: function() {
    wx.showNavigationBarLoading({})
    const repo = this.data.repo
    github.getRepoPulls(repo).then(pulls => {
      console.log(pulls)
      this.setData({
        pulls
      })
      wx.hideNavigationBarLoading({})
    }).catch(error => wx.hideNavigationBarLoading({}))
  },

  reloadData: function() {
    wx.showNavigationBarLoading({})
    github.getRepo(this.data.url).then(res => {
      const {
        repo
      } = res
      const showTabs = repo != undefined
      this.setData({
        repo,
        showTabs
      })
      wx.setNavigationBarTitle({
        title: repo.full_name,
      })
      this.tryGetReadMe(repo).then(res => wx.hideNavigationBarLoading({})).catch(error => wx.hideNavigationBarLoading({}))
    }).catch(error => wx.hideNavigationBarLoading({}))
  },

  changeTab: function(event) {
    const tabIndex = event.detail.index
    switch (tabIndex) {
      case 0:
        break
      case 1:
        if (this.data.issues.length === 0) {
          this.tryGetIssues()
        }
        break
      case 2:
        if (this.data.pulls.length === 0) {
          this.tryGetPulls()
        }
        break
      default:
        break
    }
  },

  wxParseTagATap: function(event) {
    const url = event.currentTarget.dataset.src
    wx.setClipboardData({
      data: url,
    })
  },

  toUserDetail: function() {
    const username = this.data.repo.owner.login
    wx.navigateTo({
      url: `/pages/user/user?username=${username}`,
    })
  }
})
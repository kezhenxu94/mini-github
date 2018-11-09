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
    showTabs: false,
    isStarred: false,
    isWatching: false
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

  loadStarStatus: function() {
    const repo = this.data.repo
    github.checkStar(repo.full_name).then(isStarred => {
      this.setData({
        isStarred
      })
    }, error => {})
  },


  loadWatchingStatus: function() {
    const repo = this.data.repo
    github.checkWatching(repo.full_name).then(isWatching => {
      this.setData({
        isWatching
      })
    }, error => {})
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
      this.loadWatchingStatus()
      this.loadStarStatus()
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
    console.log(url)
    const repoRegExp = /^https:\/\/github.com\/(.*?\/.*?)(\/.*)?$/
    if (repoRegExp.test(url)) {
      const repoFullName = url.replace(repoRegExp, '$1')
      const repoUrl = `/pages/repo-detail/repo-detail?url=https://api.github.com/repos/${repoFullName}`
      wx.navigateTo({
        url: repoUrl,
      })
      return
    }
    wx.setClipboardData({
      data: url,
      success() {
        wx.showToast({
          title: '链接已复制',
          duration: 2000,
        })
      },
    })
  },

  toUserDetail: function() {
    const username = this.data.repo.owner.login
    wx.navigateTo({
      url: `/pages/user/user?username=${username}`,
    })
  },

  increaseRepoStar: function(num) {
    const {
      repo
    } = this.data
    repo.stargazers_count += num
    this.setData({
      repo
    })
  },

  increaseRepoWatcher: function(num) {
    const {
      repo
    } = this.data
    repo.subscribers_count += num
    this.setData({
      repo
    })
  },

  toggleStar: function() {
    const isStarred = this.data.isStarred
    const repoFullName = this.data.repo.full_name
    if (isStarred) {
      wx.showLoading({
        title: '正在取消 Star',
        mask: true
      })
      github.unstar(repoFullName).then(res => {
        wx.hideLoading()
        this.increaseRepoStar(-1)
        this.loadStarStatus()
      }).catch(res => {
        wx.hideLoading()
        this.loadStarStatus()
      })
    } else {
      wx.showLoading({
        title: '正在添加 Star',
        mask: true
      })
      github.star(repoFullName).then(res => {
        wx.hideLoading()
        this.increaseRepoStar(1)
        this.loadStarStatus()
      }).catch(res => {
        wx.hideLoading()
        this.loadStarStatus()
      })
    }
  },

  toggleWatching: function() {
    const isWatching = this.data.isWatching
    const repoFullName = this.data.repo.full_name
    if (isWatching) {
      wx.showLoading({
        title: 'Stopping Watching',
        mask: true
      })
      github.stopWatching(repoFullName).then(res => {
        wx.hideLoading()
        this.increaseRepoWatcher(-1)
        this.loadWatchingStatus()
      }).catch(res => {
        wx.hideLoading()
        this.loadWatchingStatus()
      })
    } else {
      wx.showLoading({
        title: 'Starting Watching',
        mask: true
      })
      github.startWatching(repoFullName).then(res => {
        wx.hideLoading()
        this.increaseRepoWatcher(1)
        this.loadWatchingStatus()
      }).catch(res => {
        wx.hideLoading()
        this.loadWatchingStatus()
      })
    }
  },

  forkRepo: function () {
    const repoFullName = this.data.repo.full_name
    wx.showModal({
      title: 'Mini GitHub',
      content: `是否确认 Fork ${repoFullName}`,
      success: res => {
        if (res.confirm) {
          this.doForking()
        }
      }
    })
  },

  doForking: function () {
    const repoFullName = this.data.repo.full_name
    wx.showLoading({
      title: 'Forking',
      mask: true
    })
    github.fork(repoFullName).then(success => {
      if (success) {
        wx.hideLoading()
        wx.showToast({
          title: 'Fork 成功'
        })
      } else {
        wx.showToast({
          title: 'Fork 失败',
          icon: 'none'
        })
      }
    }).catch(res => {
      wx.hideLoading()
    })
  }
})
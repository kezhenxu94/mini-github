const github = require('../../api/github.js')
const utils = require('../../utils/util.js')
const base64 = require('../../lib/base64.js')
const computedBehavior = require('../../lib/computed.js')
const defaultRepoName = 'kezhenxu94/mini-github'
const baseUrl = 'https://api.github.com/repos/'

const theming = require('../../behaviours/theming.js')

Component({
  behaviors: [computedBehavior, theming],

  data: {
    repoName: undefined,
    repo: {},
    issues: [],
    pulls: [],
    contributors: [],
    showTabs: false,
    isStarred: false,
    isWatching: false,
    readme: null,
    tab: 0
  },

  computed: {
    license () {
      const repo = this.data.repo || {}
      const license = repo.license || {}
      const spdx_id = license.spdx_id
      return spdx_id
    }
  },

  methods: {
    onLoad: function(options) {
      const repoName = decodeURIComponent(options.repo || defaultRepoName)
      this.setData({
        repoName
      })
      wx.setNavigationBarTitle({
        title: repoName
      })
      this.reloadData()
    },

    onShareAppMessage: function(options) {
      var repoName = this.data.repoName
      var title = this.data.repo.full_name
      return {
        title,
        path: `/pages/repo-detail/repo-detail?repo=${repoName}`
      }
    },

    tryGetReadMe: function(repo) {
      return new Promise((resolve, reject) => {
        github.repos(repo.full_name).readme().then(data => {
          const { content, download_url, path } = data
          const mdContent = base64.decode(content)
          const baseUrl = download_url.replace(new RegExp(`${path}$`), '')

          this.setData({
            readme: {
              content: mdContent,
              baseUrl: baseUrl
            }
          })
          resolve({})
        }).catch(reject)
      })
    },

    tryGetIssues: function() {
      wx.showNavigationBarLoading({})
      const repoFullName = this.data.repo.full_name
      github.repos(repoFullName).issues().get().then(issues => {
        this.setData({
          issues
        })
        wx.hideNavigationBarLoading({})
      }).catch(error => wx.hideNavigationBarLoading({}))
    },

    tryGetPulls: function () {
      wx.showNavigationBarLoading({})
      const repoFullName = this.data.repo.full_name
      github.repos(repoFullName).pulls().then(pulls => {
        console.info(pulls)
        this.setData({
          pulls
        })
        wx.hideNavigationBarLoading({})
      }).catch(error => wx.hideNavigationBarLoading({}))
    },

    tryGetContributors: function () {
      wx.showNavigationBarLoading({})
      const repoFullName = this.data.repo.full_name
      github.repos(repoFullName).contributors().then(contributors => {
        this.setData({
          contributors
        })
        wx.hideNavigationBarLoading({})
      }).catch(error => wx.hideNavigationBarLoading({}))
    },

    loadStarStatus: function() {
      const repo = this.data.repo
      github.user().starred(repo.full_name).get().then(isStarred => {
        this.setData({
          isStarred
        })
      }, error => {})
    },

    loadWatchingStatus: function() {
      const repo = this.data.repo
      github.repos(repo.full_name).subscription().get().then(isWatching => {
        this.setData({
          isWatching
        })
      }, error => {})
    },

    reloadData: function() {
      wx.showNavigationBarLoading({})
      github.getRepo(baseUrl + this.data.repoName).then(res => {
        const { repo } = res
        console.info({ repo })
        repo.owner.avatar_url = repo.owner.avatar_url + '&s=50'
        const showTabs = repo != undefined
        this.setData({
          repo,
          showTabs
        })
        wx.setNavigationBarTitle({
          title: repo.full_name
        })
        this.loadWatchingStatus()
        this.loadStarStatus()
        this.tryGetReadMe(repo).then(res => wx.hideNavigationBarLoading({})).catch(error => wx.hideNavigationBarLoading({}))
      }).catch(error => {
        console.error(error)
        wx.hideNavigationBarLoading({})
      })
    },

    changeTab: function(event) {
      const tab = event.detail.index
      this.setData({ tab })
      switch (tab) {
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
        case 3:
          if (this.data.contributors.length === 0) {
            this.tryGetContributors()
          }
        default:
          break
      }
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
      if (!utils.ensureSignedIn()) return
      const isStarred = this.data.isStarred
      const repoFullName = this.data.repo.full_name
      if (isStarred) {
        wx.showLoading({
          title: '正在取消 Star',
          mask: true
        })
        github.user().starred(repoFullName).delete().then(res => {
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
        github.user().starred(repoFullName).put().then(res => {
          wx.hideLoading()
          this.increaseRepoStar(1)
          this.loadStarStatus()
        }).catch(res => {
          wx.hideLoading()
          this.loadStarStatus()
        })
      }
    },

    toggleWatching: function () {
      if (!utils.ensureSignedIn()) return
      const isWatching = this.data.isWatching
      const repoFullName = this.data.repo.full_name
      if (isWatching) {
        wx.showLoading({
          title: 'Stopping Watching',
          mask: true
        })
        github.repos(repoFullName).subscription().delete().then(res => {
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
        github.repos(repoFullName).subscription().put().then(res => {
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
      if (!utils.ensureSignedIn()) return
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
      github.repos(repoFullName).forks().post().then(success => {
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
    },

    toCreateNewIssue: function () {
      const { repo } = this.data
      wx.navigateTo({
        url: `/pages/issue-edit/issue-edit?url=${repo.url}&new=true`
      })
    }
  }
})
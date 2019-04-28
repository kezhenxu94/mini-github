const github = require('../../api/github.js')
const utils = require('../../utils/util.js')
const computedBehavior = require('../../lib/computed.js')

Component({
  behaviors: [computedBehavior],
  properties: {
    url: {
      type: String,
      value: 'https://api.github.com/repos/seata/seata/issues/924'
    }
  },

  computed: {
    repoName() {
      const { url } = this.data
      return utils.extractRepoName(url)
    }
  },

  data: {
    title: ''
  },

  methods: {
    onLoad: function (options) {
      const { url, thread } = this.data

      this.init()
    },

    onPullDownRefresh: function () {
    },

    onReachBottom: function () {

    },

    submit: function (e) {
      const url = this.data.url
      const { content } = e.detail
      const { owner, repo, issueNumber } = utils.parseGitHubUrl(url)
      wx.showLoading({
        title: 'Editing'
      })
      github.repos(`${owner}/${repo}`).issues(issueNumber).patch({
        title: this.data.title || this.data.issue.title,
        body: content
      }).then(success => {
        wx.hideLoading()
        if (success) {
          wx.showToast({
            title: 'Success'
          })
          wx.navigateBack({})
        } else {
          wx.showToast({
            title: 'Failed',
            icon: 'none'
          })
        }
      }).catch(error => {
        wx.hideLoading()
        wx.showToast({
          title: error.message,
          icon: 'none'
        })
      })
    },

    init: function () {
      wx.showLoading({
        title: 'Loading'
      })
      github.getIssue(this.data.url).then(issue => {
        wx.hideLoading()
        this.setData({ issue })
        const { repoName } = this.data
        wx.setNavigationBarTitle({
          title: `${repoName}#${issue.number}`
        })
      }).catch(error => {
        wx.showToast({
          title: error.message,
          icon: 'none'
        })
        wx.navigateBack({})
      })
    },

    inputTitleChanged: function (e) {
      const title = e.detail.value
      this.setData({ title })
    }
  }
})
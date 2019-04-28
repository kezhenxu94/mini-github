const github = require('../../api/github.js')
const utils = require('../../utils/util.js')
const computedBehavior = require('../../lib/computed.js')

Component({
  behaviors: [computedBehavior],

  properties: {
    url: {
      type: String,
      value: 'https://api.github.com/repos/seata/seata/issues/924'
    },

    new: {
      type: Boolean,
      value: false
    }
  },

  computed: {
    repoName() {
      const { url } = this.data
      return utils.extractRepoName(url)
    }
  },

  data: {
    title: '',
    issue: {}
  },

  methods: {
    onLoad: function (options) {
      const { url, thread } = this.data

      this.init()
    },

    submit: function (e) {
      const { content } = e.detail
      const title = this.data.title || this.data.issue.title
      if (!title || title.length === 0) {
        return wx.showToast({
          title: 'Title Is Empty',
          icon: 'none'
        })
      }
      const url = this.data.url
      const { owner, repo, issueNumber } = utils.parseGitHubUrl(url)
      wx.showLoading({
        title: 'Editing'
      })
      let promise = null
      if (this.data.new) {
        promise = github.repos(`${owner}/${repo}`).issues().post({
          title: title,
          body: content
        })
      } else {
        promise = github.repos(`${owner}/${repo}`).issues(issueNumber).patch({
          title: title,
          body: content
        })
      }
      promise.then(success => {
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
      if (!this.data.new) {
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
      }
    },

    inputTitleChanged: function (e) {
      const title = e.detail.value
      this.setData({ title })
    }
  }
})
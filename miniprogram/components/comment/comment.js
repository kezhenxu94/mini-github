const utils = require('../../utils/util.js')
const github = require('../../api/github.js')

Component({
  properties: {
    comment: {
      type: Object,
      value: {},
      observer: function(comment) {
        if (!comment || !comment.body) return
        this.setData({
          loaded: true,
          md: {
            content: comment.body
          }
        })
      }
    }
  },

  data: {
    loaded: false,
    showInputDialog: false,
    replyContent: '',
    md: {}
  },

  methods: {
    hideInputDialog: function () {
      this.setData({
        showInputDialog: false
      })
    },

    toUserPage: function() {
      const username = this.data.comment.user.login
      wx.navigateTo({
        url: `/pages/user/user?username=${username}`
      })
    },

    updateContent: function(e) {
      this.setData({
        replyContent: e.detail.value
      })
    },

    toReply: function () {
      if (!utils.isSignedIn()) {
        return wx.showModal({
          title: 'Sign In',
          content: 'You need to sign in to comment',
          confirmText: 'Sign In',
          cancelText: 'Not Now',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
      }
      const user = this.data.comment.user
      this.setData({
        showInputDialog: true,
        replyContent: `@${user.login} `
      })
    },

    reply: function() {
      const {
        comment,
        replyContent
      } = this.data
      let issueNumber = comment.number
      const issueUrl = comment.issue_url
      if (issueUrl) { // is issue comment
       issueNumber = utils.extractIssueNumber(issueUrl)
      }
      const repoUrl = comment.repository_url || issueUrl
      const repoFullName = utils.extractRepoName(repoUrl)
      wx.showLoading({
        title: 'Posting'
      })
      const c = replyContent + '\n\n\n\n> Sent from [mini-github](https://github.com/kezhenxu94/mini-github)'
      github.repos(repoFullName).issues(issueNumber).comments().post(c).then(success => {
        wx.hideLoading()
        if (success) {
          wx.showToast({
            title: 'Posted'
          })
          this.setData({
            showInputDialog: false
          })
        } else {
          wx.showToast({
            title: 'Failed',
            icon: 'none'
          })
        }
      }).catch(error => {
        wx.hideLoading()
        wx.showToast({
          title: 'FailedP',
          icon: 'none'
        })
      })
    }
  }
})
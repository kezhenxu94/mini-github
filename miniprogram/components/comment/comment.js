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
      const comment = this.data.comment
      const user = comment.user.login
      let issueNumber = comment.number
      const issueUrl = comment.issue_url
      if (issueUrl) { // is issue comment
        issueNumber = utils.extractIssueNumber(issueUrl)
      }
      const repoUrl = comment.repository_url || issueUrl
      const repoFullName = utils.extractRepoName(repoUrl)

      wx.navigateTo({
        url: `/pages/comment-edit/comment-edit?repo=${repoFullName}&number=${issueNumber}&mention=${user}`
      })
    }
  }
})
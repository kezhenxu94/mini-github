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
    },
    customClass: String
  },

  data: {
    loaded: false,
    showInputDialog: false,
    md: {},
    showMore: false
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
    },

    toEdit: function () {
      const comment = this.data.comment
      const commentUrl = comment.url
      const url = comment.issue_url || commentUrl
      const regexp = /\/comments\/(\d+)/
      const m = commentUrl.match(regexp)
      let commentId = 0
      if (m) {
        commentId = m[1]
      }

      return wx.navigateTo({
        url: `/pages/issue-edit/issue-edit?url=${url}&commentId=${commentId}`
      })
    },

    more: function () {
      wx.showActionSheet({
        itemList: ['Reply', 'Edit'],
        success: res => {
          if (res.tapIndex === 0) {
            this.toReply()
          } else if (res.tapIndex === 1) {
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
            this.toEdit()
          }
        },
        fail: res => {
        }
      })
    }
  }
})
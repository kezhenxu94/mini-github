const WxParse = require('../../lib/wxParse/wxParse.js')
const utils = require('../../utils/util.js')
const github = require('../../api/github.js')

Component({
  properties: {
    comment: {
      type: Object,
      value: {},
      observer: function(comment) {
        if (!comment || !comment.body) return
        WxParse.wxParse('article', 'md', comment.body, this)
        this.setData({
          loaded: true
        })
      }
    }
  },

  data: {
    loaded: false,
    showInputDialog: false,
    replyContent: ''
  },

  methods: {
    hideInputDialog: function () {
      this.setData({
        showInputDialog: false
      })
    },

    wxParseTagATap: function(event) {
      const url = event.currentTarget.dataset.src
      wx.setClipboardData({
        data: url,
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
          title: '请先登录',
          content: '评论功能需要登陆, 是否先去登陆',
          confirmText: '先去登陆',
          cancelText: '暂不登陆',
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
        title: '正在发表'
      })
      github.createComment(repoFullName, issueNumber, replyContent).then(success => {
        wx.hideLoading()
        if (success) {
          wx.showToast({
            title: '评论已发表'
          })
          this.setData({
            showInputDialog: false
          })
        } else {
          wx.showToast({
            title: '评论发表失败, 稍后重试',
            icon: 'none'
          })
        }
      }).catch(error => {
        wx.hideLoading()
        wx.showToast({
          title: '评论失败',
          icon: 'none'
        })
      })
    }
  }
})
const utils = require('../../utils/util.js')
const github = require('../../api/github.js')
const app = getApp()

Component({
  properties: {
    comment: {
      type: Object,
      value: {},
      observer: function(comment) {
        if (!comment || !comment.body) return
        let parsed = app.towxml.toJson(
          comment.body,
          'markdown'
        )
        parsed = app.towxml.initData(parsed, {
          app: this
        })
        parsed.theme = 'dark'
        this.setData({
          article: parsed,
          loaded: true
        })
      }
    }
  },

  data: {
    article: {},
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
      github.repos(repoFullName).issues(issueNumber).comments().post(replyContent).then(success => {
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
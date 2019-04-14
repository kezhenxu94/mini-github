const utils = require('../../utils/util.js')

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  methods: {
    toUserPage: function(event) {
      const username = this.data.item.actor.login
      wx.navigateTo({
        url: `/pages/user/user?username=${username}`
      })
    },

    toFeedDetail: function(event) {
      const feed = this.data.item
      switch (feed.type) {
        case 'IssuesEvent':
        case 'IssueCommentEvent':
          var issue = (feed.payload || {}).issue || {}
          var url = issue.url
          wx.navigateTo({
            url: '/pages/issue-detail/issue-detail?url=' + url
          })
          break
        case 'PullRequestEvent':
        case 'PullRequestReviewEvent':
        case 'PullRequestReviewCommentEvent':
          var pullRequest = (feed.payload || {}).pull_request || {}
          var url = pullRequest.issue_url
          wx.navigateTo({
            url: '/pages/issue-detail/issue-detail?url=' + url
          })
          break
        case 'WatchEvent':
        case 'ForkEvent':
        case 'PushEvent':
        case 'DeleteEvent':
          var repo = utils.extractRepoName(feed.repo.url)
          wx.navigateTo({
            url: `/pages/repo-detail/repo-detail?repo=${repo}`
          })
          break
        case 'ReleaseEvent':
          var repo = utils.extractRepoName(feed.repository.url)
          wx.navigateTo({
            url: `/pages/repo-detail/repo-detail?repo=${repo}`
          })
          break
        default:
          wx.showToast({
            title: 'Coming Soon'
          })
          break
      }
    }
  }
})
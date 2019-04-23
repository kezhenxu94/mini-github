const github = require('../../api/github.js')
const utils = require('../../utils/util.js')
const computedBehavior = require('../../lib/computed.js')

const ignoredEvents = [
  'mentioned',
  'committed',
  'subscribed',
  'unsubscribed',
  'user_blocked',
  'head_ref_force_pushed',
  'committed',
  'moved_columns_in_project',
  'converted_note_to_issue',
  'review_request_removed',
  'base_ref_changed'
]

let links = {}

Component({
  behaviors: [computedBehavior],
  properties: {
    url: {
      type: String,
      value: 'https://api.github.com/repos/apache/SkyWalking/pull/2460'
    },
    thread: {
      type: Number,
      value: 0
    }
  },

  computed: {
    displayTimeline () {
      return this.data.timeline.filter(timeline => {
        return !ignoredEvents.includes(timeline.event)
      })
    },
    repoName () {
      const { url } = this.data
      return utils.extractRepoName(url)
    }
  },

  data: {
    issue: undefined,
    timeline: [],
    hasMore: true,
    loadingMore: false,
    next: null
  },

  methods: {
    onLoad: function() {
      const { url, thread } = this.data
      
      wx.startPullDownRefresh({})

      thread && github.notifications().threads(thread).patch()
    },

    onShareAppMessage: function(options) {
      var url = this.data.url
      var title = this.data.issue.title
      var path = `/pages/issue-detail/issue-detail?url=${url}`
      return {
        title,
        path
      }
    },

    onPullDownRefresh: function() {
      links = {}
      github.getIssue(this.data.url).then(issue => {
        wx.stopPullDownRefresh()
        this.setData({
          issue,
          comments: [],
          loadingMore: false
        })
        const { repoName } = this.data
        wx.setNavigationBarTitle({
          title: `${repoName}#${issue.number}`
        })
        this.loadMore()
      }).catch(error => {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: error.message,
          icon: 'none'
        })
      })
    },

    loadMore: function() {
      const {
        hasMore,
        loadingMore,
        issue,
        url,
        timeline,
        next
      } = this.data
      
      const { owner, repo, issueNumber } = utils.parseGitHubUrl(url)

      if (loadingMore || !hasMore) return

      this.setData({
        loadingMore: true
      })

      const successHandler = ({ data, next }) => {
        data.forEach(timeline => {
          if (timeline.created_at) {
            timeline.created_at = utils.toReadableTime(timeline.created_at)
          }
          if (timeline.submitted_at) {
            timeline.submitted_at = utils.toReadableTime(timeline.submitted_at)
          }
          return timeline
        })
        this.setData({
          timeline: [...timeline, ...data],
          hasMore: next !== null,
          loadingMore: false,
          next
        })
      }
      const failureHandler = error => {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: error.message,
          icon: 'none'
        })
        this.setData({
          loadingMore: false
        })
      }

      if (next) {
        next().then(successHandler).catch(failureHandler)
      } else {
        github.repos(`${owner}/${repo}`).issues(issueNumber).timeline().then(successHandler).catch(failureHandler)
      }
    },

    toRepoDetail () {
      const repoName = this.data.repoName
      const url = `/pages/repo-detail/repo-detail?repo=${repoName}`
      wx.navigateTo({
        url
      })
    }
  }
})
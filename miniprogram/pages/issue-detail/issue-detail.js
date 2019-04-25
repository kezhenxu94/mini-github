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

const invertHex = hex => {
  return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
}

let links = {}
let labelChanged = false

Component({
  behaviors: [computedBehavior],
  properties: {
    url: {
      type: String,
      value: 'https://api.github.com/repos/kezhenxu94/mini-github/issues/23'
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
    },
    labels () {
      return (this.data.issue || {}).labels || []
    }
  },

  data: {
    issue: undefined,
    timeline: [],
    hasMore: true,
    loadingMore: false,
    next: null,
    permission: 'none',
    editLabels: false,
    allLabels: null
  },

  methods: {
    onLoad: function() {
      const { url, thread } = this.data
      
      wx.startPullDownRefresh({})

      thread && github.notifications().threads(thread).patch()

      const username = (utils.getCurrentUser() || {}).login
      github.repos(this.data.repoName).collaborators(username).permission().then(({ permission }) => {
        this.setData({
          permission
        })
      })
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
          loadingMore: false,
          hasMore: true
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
    },

    editLabels (e) {
      labelChanged = false
      const repoName = this.data.repoName
      wx.showLoading({
        title: 'Loading Labels'
      })
      github.repos(repoName).labels().get().then(({ data, nextFunc }) => {
        const labels = {}
        data.forEach(it => {
          labels[it.name] = it
        })
        this.data.labels.forEach(it => { // no pagination yet, put the existed tags also
          it.selected = true
          labels[it.name] = it
        })
        Object.values(labels).forEach(it => {
          it.textColor = `#${invertHex(it.color)}`
        })
        wx.hideLoading()
        this.setData({
          allLabels: labels,
          editLabels: true
        })
      }).catch(error => {
        wx.hideLoading()
        wx.showToast({
          title: 'Failed',
          icon: 'none'
        })
      })
    },

    onClose (e) {
      if (!labelChanged) {
        this.setData({ editLabels: false })
        return
      }
      const url = this.data.url
      const { owner, repo, issueNumber } = utils.parseGitHubUrl(url)
      if (!this.data.allLabels || this.data.allLabels.length === 0) {
        this.setData({ editLabels: false })
        return
      }
      wx.showLoading({
        title: 'Applying'
      })
      const allLabels = Object.values(this.data.allLabels).filter(it => it.selected).map(it => it.name)
      github.repos(`${owner}/${repo}`).issues(issueNumber).labels().put(allLabels).then(success => {
        wx.hideLoading()
        if (success) {
          wx.showToast({
            title: 'Applied',
          })
          this.setData({
            editLabels: false
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
          title: error.message,
          icon: 'none'
        })
      })
    },

    onLabelChanged (e) {
      labelChanged = true
      const tag = e.target.dataset.tag
      const selected = e.detail
      tag.selected = selected
      const allLabels = this.data.allLabels
      allLabels[tag.name] = tag
      this.setData({
        allLabels
      })
    }
  }
})
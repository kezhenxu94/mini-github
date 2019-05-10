const notifUtils = require('../../utils/notifications.js')

Component({
  properties: {
    issue: {
      type: Object,
      value: {}
    },
    theme: {
      type: String,
      value: ''
    }
  },

  data: {},

  methods: {
    toIssueDetail: function (event) {
      const formId = event.detail.formId
      const issue = this.data.issue

      notifUtils.report({
        formId,
        enabled: true,
        extra: { issue }
      })

      wx.navigateTo({
        url: `/pages/issue-detail/issue-detail?url=${issue.url}`
      })
    }
  }
})